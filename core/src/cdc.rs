use fastcdc::ronomon::FastCDC;
use blake3;
use std::fs;
use std::io::Read;
use std::path::Path;
use crate::storage::Storage;

pub struct ChunkResult {
    pub commit_id: String,
    pub file_hash: String,
    pub chunk_count: usize,
    pub file_size: u64,
    pub deduplicated_bytes: u64,
}

pub fn commit_file(storage: &Storage, file_path: &str) -> Result<ChunkResult, String> {
    let path = Path::new(file_path);
    if !path.exists() || !path.is_file() {
        return Err(format!("File does not exist or is not a file: {}", file_path));
    }

    let mut file = fs::File::open(path).map_err(|e| format!("Failed to open file {}: {}", file_path, e))?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer).map_err(|e| format!("Failed to read file {}: {}", file_path, e))?;

    let file_size = buffer.len() as u64;
    let full_file_hash = blake3::hash(&buffer).to_hex().to_string();

    let min_size = 16384;  // 16 KB
    let avg_size = 32768;  // 32 KB
    let max_size = 65536;  // 64 KB

    let chunker = FastCDC::new(&buffer, min_size, avg_size, max_size);
    let mut chunk_records = Vec::new();
    let mut deduplicated_bytes = 0u64;

    for chunk in chunker {
        let chunk_bytes = &buffer[chunk.offset..chunk.offset + chunk.length];
        let chunk_hash = blake3::hash(chunk_bytes).to_hex().to_string();

        let is_new = storage.save_blob(&chunk_hash, chunk_bytes)?;
        if !is_new {
            deduplicated_bytes += chunk.length as u64;
        }

        chunk_records.push((chunk_hash, chunk.offset as u64, chunk.length as u64));
    }

    let commit_id = format!("{}-{}", full_file_hash.get(0..12).unwrap_or(&full_file_hash), chrono::Utc::now().timestamp_millis());

    storage.record_commit(
        &commit_id,
        file_path,
        file_size,
        &full_file_hash,
        &chunk_records,
        deduplicated_bytes,
    )?;

    Ok(ChunkResult {
        commit_id,
        file_hash: full_file_hash,
        chunk_count: chunk_records.len(),
        file_size,
        deduplicated_bytes,
    })
}

pub fn restore_file(storage: &Storage, commit_id: &str, target_path: &str) -> Result<bool, String> {
    let chunk_hashes = storage.get_chunks_for_commit(commit_id)?;
    if chunk_hashes.is_empty() {
        return Err(format!("No chunks found for commit ID {}", commit_id));
    }

    let blobs_dir = storage.get_blobs_dir();
    let mut restored_bytes = Vec::new();

    for hash in chunk_hashes {
        let blob_path = blobs_dir.join(&hash);
        if !blob_path.exists() {
            return Err(format!("Missing blob chunk: {}", hash));
        }

        let chunk_data = fs::read(&blob_path).map_err(|e| format!("Failed to read blob {}: {}", hash, e))?;
        restored_bytes.extend_from_slice(&chunk_data);
    }

    let target = Path::new(target_path);
    if let Some(parent) = target.parent() {
        fs::create_dir_all(parent).map_err(|e| format!("Failed to create output directory: {}", e))?;
    }

    fs::write(target, restored_bytes).map_err(|e| format!("Failed to write restored file: {}", e))?;
    Ok(true)
}
