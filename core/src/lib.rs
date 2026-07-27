mod cdc;
mod storage;

use napi::bindgen_prelude::*;
use napi_derive::napi;
use std::sync::Mutex;
use storage::Storage;

static STORAGE_INSTANCE: Mutex<Option<Storage>> = Mutex::new(None);

fn get_storage() -> Result<std::sync::MutexGuard<'static, Option<Storage>>> {
    let mut guard = STORAGE_INSTANCE.lock().map_err(|e| Error::from_reason(format!("Lock poison error: {}", e)))?;
    if guard.is_none() {
        let storage = Storage::init().map_err(Error::from_reason)?;
        *guard = Some(storage);
    }
    Ok(guard)
}

#[napi]
pub fn commit_file(file_path: String) -> Result<String> {
    let guard = get_storage()?;
    let storage = guard.as_ref().unwrap();

    let res = cdc::commit_file(storage, &file_path).map_err(Error::from_reason)?;
    serde_json::to_string(&serde_json::json!({
        "commitId": res.commit_id,
        "fileHash": res.file_hash,
        "chunkCount": res.chunk_count,
        "fileSize": res.file_size,
        "deduplicatedBytes": res.deduplicated_bytes
    })).map_err(|e| Error::from_reason(e.to_string()))
}

#[napi]
pub fn add_watched_folder(folder_path: String) -> Result<bool> {
    let guard = get_storage()?;
    let storage = guard.as_ref().unwrap();

    storage.add_watched_folder(&folder_path).map_err(Error::from_reason)
}

#[napi]
pub fn remove_watched_folder(folder_path: String) -> Result<bool> {
    let guard = get_storage()?;
    let storage = guard.as_ref().unwrap();

    storage.remove_watched_folder(&folder_path).map_err(Error::from_reason)
}

#[napi]
pub fn get_watched_folders() -> Result<String> {
    let guard = get_storage()?;
    let storage = guard.as_ref().unwrap();

    let folders = storage.get_watched_folders().map_err(Error::from_reason)?;
    serde_json::to_string(&folders).map_err(|e| Error::from_reason(e.to_string()))
}

#[napi]
pub fn get_recent_commits(limit: u32) -> Result<String> {
    let guard = get_storage()?;
    let storage = guard.as_ref().unwrap();

    let commits = storage.get_recent_commits(limit as usize).map_err(Error::from_reason)?;
    serde_json::to_string(&commits).map_err(|e| Error::from_reason(e.to_string()))
}

#[napi]
pub fn restore_file_version(commit_id: String, target_path: String) -> Result<bool> {
    let guard = get_storage()?;
    let storage = guard.as_ref().unwrap();

    cdc::restore_file(storage, &commit_id, &target_path).map_err(Error::from_reason)
}

#[napi]
pub fn get_storage_stats() -> Result<String> {
    let guard = get_storage()?;
    let storage = guard.as_ref().unwrap();

    let stats = storage.get_stats().map_err(Error::from_reason)?;
    serde_json::to_string(&stats).map_err(|e| Error::from_reason(e.to_string()))
}
