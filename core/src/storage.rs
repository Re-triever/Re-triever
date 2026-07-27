use rusqlite::{params, Connection, Result as SqlResult};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use chrono::Utc;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WatchedFolderInfo {
    pub id: i64,
    pub path: String,
    pub added_at: String,
    pub active: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CommitInfo {
    pub id: String,
    pub file_path: String,
    pub file_size: u64,
    pub commit_hash: String,
    pub timestamp: String,
    pub chunk_count: u32,
    pub deduplicated_bytes: u64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct StorageStats {
    pub total_commits: u64,
    pub total_blobs: u64,
    pub total_stored_bytes: u64,
    pub total_deduplicated_bytes: u64,
    pub total_original_bytes: u64,
    pub watched_folder_count: u64,
}

pub struct Storage {
    conn: Connection,
    blobs_dir: PathBuf,
}

impl Storage {
    pub fn init() -> Result<Self, String> {
        let home = dirs::home_dir().ok_or_else(|| "Could not locate home directory".to_string())?;
        let retriever_dir = home.join(".re-triever");
        let blobs_dir = retriever_dir.join("blobs");

        fs::create_dir_all(&blobs_dir).map_err(|e| format!("Failed to create blobs directory: {}", e))?;

        let db_path = retriever_dir.join("metadata.db");
        let conn = Connection::open(&db_path).map_err(|e| format!("Failed to open SQLite database: {}", e))?;

        let storage = Storage { conn, blobs_dir };
        storage.create_tables().map_err(|e| format!("Failed to initialize DB schema: {}", e))?;

        Ok(storage)
    }

    fn create_tables(&self) -> SqlResult<()> {
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS watched_folders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                path TEXT UNIQUE NOT NULL,
                added_at TEXT NOT NULL,
                active INTEGER DEFAULT 1
            )",
            [],
        )?;

        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS commits (
                id TEXT PRIMARY KEY,
                file_path TEXT NOT NULL,
                file_size INTEGER NOT NULL,
                commit_hash TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                chunk_count INTEGER NOT NULL,
                deduplicated_bytes INTEGER NOT NULL
            )",
            [],
        )?;

        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS blobs (
                hash TEXT PRIMARY KEY,
                size INTEGER NOT NULL,
                created_at TEXT NOT NULL
            )",
            [],
        )?;

        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS file_chunks (
                commit_id TEXT NOT NULL,
                chunk_index INTEGER NOT NULL,
                hash TEXT NOT NULL,
                offset INTEGER NOT NULL,
                length INTEGER NOT NULL,
                PRIMARY KEY (commit_id, chunk_index)
            )",
            [],
        )?;

        Ok(())
    }

    pub fn get_blobs_dir(&self) -> PathBuf {
        self.blobs_dir.clone()
    }

    pub fn blob_exists(&self, hash: &str) -> bool {
        let blob_path = self.blobs_dir.join(hash);
        blob_path.exists()
    }

    pub fn save_blob(&self, hash: &str, data: &[u8]) -> Result<bool, String> {
        if self.blob_exists(hash) {
            return Ok(false); // Already existed (deduplicated)
        }

        let blob_path = self.blobs_dir.join(hash);
        fs::write(&blob_path, data).map_err(|e| format!("Failed to write blob file {}: {}", hash, e))?;

        let now = Utc::now().to_rfc3339();
        self.conn.execute(
            "INSERT OR IGNORE INTO blobs (hash, size, created_at) VALUES (?1, ?2, ?3)",
            params![hash, data.len() as u64, now],
        ).map_err(|e| format!("Failed to record blob metadata: {}", e))?;

        Ok(true) // Newly saved
    }

    pub fn record_commit(
        &self,
        commit_id: &str,
        file_path: &str,
        file_size: u64,
        commit_hash: &str,
        chunk_hashes: &[(String, u64, u64)], // (hash, offset, length)
        deduplicated_bytes: u64,
    ) -> Result<(), String> {
        let now = Utc::now().to_rfc3339();

        self.conn.execute(
            "INSERT INTO commits (id, file_path, file_size, commit_hash, timestamp, chunk_count, deduplicated_bytes)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            params![commit_id, file_path, file_size, commit_hash, now, chunk_hashes.len() as u32, deduplicated_bytes],
        ).map_err(|e| format!("Failed to insert commit: {}", e))?;

        for (idx, (hash, offset, length)) in chunk_hashes.iter().enumerate() {
            self.conn.execute(
                "INSERT INTO file_chunks (commit_id, chunk_index, hash, offset, length) VALUES (?1, ?2, ?3, ?4, ?5)",
                params![commit_id, idx as u32, hash, offset, length],
            ).map_err(|e| format!("Failed to insert file chunk: {}", e))?;
        }

        Ok(())
    }

    pub fn add_watched_folder(&self, path: &str) -> Result<bool, String> {
        let now = Utc::now().to_rfc3339();
        let res = self.conn.execute(
            "INSERT OR REPLACE INTO watched_folders (path, added_at, active) VALUES (?1, ?2, 1)",
            params![path, now],
        );

        match res {
            Ok(_) => Ok(true),
            Err(e) => Err(format!("Failed to add watched folder: {}", e)),
        }
    }

    pub fn remove_watched_folder(&self, path: &str) -> Result<bool, String> {
        let res = self.conn.execute("DELETE FROM watched_folders WHERE path = ?1", params![path]);
        match res {
            Ok(count) => Ok(count > 0),
            Err(e) => Err(format!("Failed to remove watched folder: {}", e)),
        }
    }

    pub fn get_watched_folders(&self) -> Result<Vec<WatchedFolderInfo>, String> {
        let mut stmt = self.conn.prepare("SELECT id, path, added_at, active FROM watched_folders ORDER BY id DESC")
            .map_err(|e| e.to_string())?;

        let rows = stmt.query_map([], |row| {
            let active_int: i32 = row.get(3)?;
            Ok(WatchedFolderInfo {
                id: row.get(0)?,
                path: row.get(1)?,
                added_at: row.get(2)?,
                active: active_int == 1,
            })
        }).map_err(|e| e.to_string())?;

        let mut result = Vec::new();
        for row in rows {
            if let Ok(info) = row {
                result.push(info);
            }
        }
        Ok(result)
    }

    pub fn get_recent_commits(&self, limit: usize) -> Result<Vec<CommitInfo>, String> {
        let mut stmt = self.conn.prepare(
            "SELECT id, file_path, file_size, commit_hash, timestamp, chunk_count, deduplicated_bytes
             FROM commits ORDER BY timestamp DESC LIMIT ?1"
        ).map_err(|e| e.to_string())?;

        let rows = stmt.query_map(params![limit as i64], |row| {
            Ok(CommitInfo {
                id: row.get(0)?,
                file_path: row.get(1)?,
                file_size: row.get(2)?,
                commit_hash: row.get(3)?,
                timestamp: row.get(4)?,
                chunk_count: row.get(5)?,
                deduplicated_bytes: row.get(6)?,
            })
        }).map_err(|e| e.to_string())?;

        let mut result = Vec::new();
        for row in rows {
            if let Ok(info) = row {
                result.push(info);
            }
        }
        Ok(result)
    }

    pub fn get_chunks_for_commit(&self, commit_id: &str) -> Result<Vec<String>, String> {
        let mut stmt = self.conn.prepare(
            "SELECT hash FROM file_chunks WHERE commit_id = ?1 ORDER BY chunk_index ASC"
        ).map_err(|e| e.to_string())?;

        let rows = stmt.query_map(params![commit_id], |row| {
            let hash: String = row.get(0)?;
            Ok(hash)
        }).map_err(|e| e.to_string())?;

        let mut result = Vec::new();
        for row in rows {
            if let Ok(hash) = row {
                result.push(hash);
            }
        }
        Ok(result)
    }

    pub fn get_stats(&self) -> Result<StorageStats, String> {
        let total_commits: u64 = self.conn.query_row("SELECT COUNT(*) FROM commits", [], |r| r.get(0)).unwrap_or(0);
        let total_blobs: u64 = self.conn.query_row("SELECT COUNT(*) FROM blobs", [], |r| r.get(0)).unwrap_or(0);
        let total_stored_bytes: u64 = self.conn.query_row("SELECT COALESCE(SUM(size), 0) FROM blobs", [], |r| r.get(0)).unwrap_or(0);
        let total_deduplicated_bytes: u64 = self.conn.query_row("SELECT COALESCE(SUM(deduplicated_bytes), 0) FROM commits", [], |r| r.get(0)).unwrap_or(0);
        let total_original_bytes: u64 = self.conn.query_row("SELECT COALESCE(SUM(file_size), 0) FROM commits", [], |r| r.get(0)).unwrap_or(0);
        let watched_folder_count: u64 = self.conn.query_row("SELECT COUNT(*) FROM watched_folders", [], |r| r.get(0)).unwrap_or(0);

        Ok(StorageStats {
            total_commits,
            total_blobs,
            total_stored_bytes,
            total_deduplicated_bytes,
            total_original_bytes,
            watched_folder_count,
        })
    }
}
