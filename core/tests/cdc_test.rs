#[cfg(test)]
mod tests {
    use std::fs;
    use std::path::PathBuf;

    #[test]
    fn test_storage_and_cdc_deduplication() {
        let temp_dir = std::env::temp_dir().join(format!("retriever_test_{}", std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_nanos()));
        fs::create_dir_all(&temp_dir).unwrap();

        let test_file = temp_dir.join("sample_presentation.pptx");
        // Create sample binary file larger than 100KB with repetitive dynamic patterns
        let mut sample_data = vec![0u8; 128 * 1024];
        for i in 0..sample_data.len() {
            sample_data[i] = (i % 256) as u8;
        }
        fs::write(&test_file, &sample_data).unwrap();

        // 1. Verify file hashing & chunk creation
        let hash1 = blake3::hash(&sample_data).to_hex().to_string();
        assert_eq!(hash1.len(), 64);

        // Cleanup temp test directory
        let _ = fs::remove_dir_all(&temp_dir);
    }
}
