// Helper utility functions for line diffs, byte formatting, and file badges

export function computeLineDiff(oldText = '', newText = '') {
  const oldLines = oldText ? oldText.split('\n') : [];
  const newLines = newText ? newText.split('\n') : [];

  const matrix = Array(oldLines.length + 1)
    .fill(null)
    .map(() => Array(newLines.length + 1).fill(0));

  for (let i = 1; i <= oldLines.length; i++) {
    for (let j = 1; j <= newLines.length; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  let i = oldLines.length;
  let j = newLines.length;
  const diff = [];
  let added = 0;
  let removed = 0;
  let unchanged = 0;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      diff.unshift({ type: 'unchanged', text: oldLines[i - 1], oldLine: i, newLine: j });
      i--;
      j--;
      unchanged++;
    } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
      diff.unshift({ type: 'add', text: newLines[j - 1], newLine: j });
      j--;
      added++;
    } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
      diff.unshift({ type: 'delete', text: oldLines[i - 1], oldLine: i });
      i--;
      removed++;
    }
  }

  return { diff, added, removed, unchanged };
}

export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatTimeAgo(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function getFileTypeBadge(filename, theme = 'dark') {
  const ext = filename ? filename.split('.').pop().toLowerCase() : '';
  const isDark = theme === 'dark';
  if (['pptx', 'ppt'].includes(ext)) {
    return { label: 'PPTX', color: isDark ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-orange-100 text-orange-700 border-orange-200 font-semibold' };
  }
  if (['docx', 'doc'].includes(ext)) {
    return { label: 'DOCX', color: isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-200 font-semibold' };
  }
  if (['xlsx', 'xls', 'csv'].includes(ext)) {
    return { label: 'XLSX', color: isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200 font-semibold' };
  }
  if (['pdf'].includes(ext)) {
    return { label: 'PDF', color: isDark ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-rose-100 text-rose-700 border-rose-200 font-semibold' };
  }
  if (['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(ext)) {
    return { label: 'IMG', color: isDark ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200 font-semibold' };
  }
  return { label: ext.toUpperCase().substring(0, 4) || 'FILE', color: isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300 font-semibold' };
}

export function getRestoredInfo(commit, idx, historyArray) {
  if (!commit || !historyArray) return null;
  if (commit.restored_from) {
    const targetIdx = historyArray.findIndex(c => c.id === commit.restored_from || (c.id && c.id.startsWith(commit.restored_from)));
    if (targetIdx !== -1) {
      return {
        saveNumber: historyArray.length - targetIdx,
        commit: historyArray[targetIdx]
      };
    }
  }

  for (let j = idx + 1; j < historyArray.length; j++) {
    if (historyArray[j].commit_hash && historyArray[j].commit_hash === commit.commit_hash) {
      return {
        saveNumber: historyArray.length - j,
        commit: historyArray[j]
      };
    }
  }
  return null;
}
