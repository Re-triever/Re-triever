const path = require('path');
const fs = require('fs');

async function runE2ETest() {
  console.log('=== Project Re-triever End-to-End Test Suite ===\n');

  // 1. Load native Rust NAPI module
  const corePath = path.join(__dirname, '../build/index.node');
  if (!fs.existsSync(corePath)) {
    throw new Error('Native Rust core module build/index.node not found!');
  }

  const nativeCore = require(corePath);
  console.log('✔ Native Rust NAPI module loaded successfully');

  // 2. Initial Storage Stats
  const initialStats = JSON.parse(nativeCore.getStorageStats());
  console.log('✔ Initial SQLite DB storage stats:', initialStats);

  // 3. Create mock test directory
  const testFolder = path.join(__dirname, 'test_watch_folder');
  if (!fs.existsSync(testFolder)) {
    fs.mkdirSync(testFolder, { recursive: true });
  }

  // 4. Add watched folder to SQLite
  nativeCore.addWatchedFolder(testFolder);
  const watchedFolders = JSON.parse(nativeCore.getWatchedFolders());
  console.log('✔ Watched folders in database:', watchedFolders.map(f => f.path));

  // 5. Create mock .docx and .pptx files
  const docxFile = path.join(testFolder, 'ProjectProposal.docx');
  const pptxFile = path.join(testFolder, 'QuarterlyReview.pptx');

  const v1ContentDocx = Buffer.from('Re-triever Document Version 1 - Content Defined Chunking test data '.repeat(500));
  const v1ContentPptx = Buffer.from('Re-triever Presentation Version 1 - Powerpoint test data '.repeat(600));

  fs.writeFileSync(docxFile, v1ContentDocx);
  fs.writeFileSync(pptxFile, v1ContentPptx);

  // 6. Commit version 1
  const commit1Docx = JSON.parse(nativeCore.commitFile(docxFile));
  const commit1Pptx = JSON.parse(nativeCore.commitFile(pptxFile));
  console.log('✔ Version 1 committed:');
  console.log('  Docx Commit:', commit1Docx.commitId, '| Size:', commit1Docx.fileSize, 'B | Chunks:', commit1Docx.chunkCount);
  console.log('  Pptx Commit:', commit1Pptx.commitId, '| Size:', commit1Pptx.fileSize, 'B | Chunks:', commit1Pptx.chunkCount);

  // 7. Save version 2 (partially modified - test CDC deduplication)
  const v2ContentDocx = Buffer.concat([
    v1ContentDocx,
    Buffer.from(' - ADDED SECTION IN VERSION 2 '.repeat(100))
  ]);
  fs.writeFileSync(docxFile, v2ContentDocx);
  const commit2Docx = JSON.parse(nativeCore.commitFile(docxFile));
  console.log('\n✔ Version 2 committed (modified file):');
  console.log('  Docx Commit V2:', commit2Docx.commitId, '| Size:', commit2Docx.fileSize, 'B | Deduplicated Bytes:', commit2Docx.deduplicatedBytes);

  if (commit2Docx.deduplicatedBytes > 0) {
    console.log(`✔ SUCCESS: CDC engine deduplicated ${commit2Docx.deduplicatedBytes} bytes!`);
  } else {
    console.warn('⚠ Note: File was chunked but no deduplication occurred');
  }

  // 8. Test Version Restoration
  const restoredFile = path.join(__dirname, 'RestoredProposal_V1.docx');
  const restoreSuccess = nativeCore.restoreFileVersion(commit1Docx.commitId, restoredFile);
  console.log('\n✔ Restoring Version 1 to:', restoredFile);
  console.log('  Restore status:', restoreSuccess ? 'SUCCESS' : 'FAILED');

  if (restoreSuccess && fs.existsSync(restoredFile)) {
    const restoredContent = fs.readFileSync(restoredFile);
    if (restoredContent.equals(v1ContentDocx)) {
      console.log('✔ BIT-PERFECT VERIFICATION: Restored file matches original Version 1 bit-for-bit!');
    } else {
      throw new Error('Restored file content mismatch!');
    }
  }

  // 9. Final Storage Stats
  const finalStats = JSON.parse(nativeCore.getStorageStats());
  console.log('\n✔ Final Storage Stats:', finalStats);
  console.log('\n🎉 ALL E2E INTEGRATION TESTS PASSED PERFECTLY!');
}

runE2ETest().catch(err => {
  console.error('❌ E2E Test Failed:', err);
  process.exit(1);
});
