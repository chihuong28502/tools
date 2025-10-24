// merge-logs.js
// Chạy: node merge-logs.js
const fs = require('fs');
const path = require('path');

const LOGS_DIR = path.join(__dirname, 'logs'); // chỉnh nếu cần
const OUT_DIR = path.join(__dirname, 'merged');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function readText(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch (e) { return null; }
}

// Cố gắng parse nội dung: JSON.parse -> nếu fail, tìm mảng/obj trong file JS (tìm [ ... ] hoặc { ... })
function parseMaybeJson(content) {
  if (!content) return null;
  content = content.trim();

  // Try JSON.parse directly
  try {
    return JSON.parse(content);
  } catch (e) {}

  // Remove possible "module.exports =" or "export default"
  content = content.replace(/module\.exports\s*=\s*/, '');
  content = content.replace(/export\s+default\s+/, '');

  // Try to locate first JSON array [...] or object {...}
  const leftArray = content.indexOf('[');
  const leftObj = content.indexOf('{');

  // Prefer array if appears earlier
  let start = -1, end = -1;
  if (leftArray !== -1 && (leftArray < leftObj || leftObj === -1)) {
    start = leftArray;
    // find matching closing bracket (naive but works for typical files)
    end = content.lastIndexOf(']');
  } else if (leftObj !== -1) {
    start = leftObj;
    end = content.lastIndexOf('}');
  }

  if (start !== -1 && end !== -1 && end > start) {
    const snippet = content.slice(start, end + 1);
    try {
      return JSON.parse(snippet);
    } catch (e) {
      // fallthrough
    }
  }

  // As a last resort, try to extract strings inside array-like pattern via regex for account lists
  const arrMatch = content.match(/\[([^\]]+)\]/s);
  if (arrMatch) {
    // attempt to build JSON array by wrapping strings
    const items = arrMatch[1].split(/,|\n/).map(s => s.trim()).filter(Boolean).map(s => {
      // remove quotes and trailing commas
      return s.replace(/^['"]|['"]$/g, '').trim();
    });
    return items;
  }

  return null;
}

function walkDir(dir, cb) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  for (const it of items) {
    const full = path.join(dir, it);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walkDir(full, cb);
    } else {
      cb(full);
    }
  }
}

const winnersAcc = []; // will contain objects (prefer)
const accountsAcc = new Set(); // will contain strings (usernames/phones)

walkDir(LOGS_DIR, (file) => {
  const name = path.basename(file).toLowerCase();
  if (!/winn?er|account/.test(name)) return; // skip unrelated files

  const txt = readText(file);
  const parsed = parseMaybeJson(txt);
  if (parsed == null) {
    console.log(`[WARN] Không parse được ${file} — bỏ qua`);
    return;
  }

  // If winners file: parsed could be array of objects or a single object
  if (/winn?er/.test(name)) {
    if (Array.isArray(parsed)) {
      parsed.forEach(item => {
        if (item && typeof item === 'object') winnersAcc.push(item);
        else if (typeof item === 'string' || typeof item === 'number') winnersAcc.push({ username: String(item) });
      });
    } else if (typeof parsed === 'object') {
      // object => push directly
      winnersAcc.push(parsed);
    } else {
      // primitive => push as username
      winnersAcc.push({ username: String(parsed) });
    }
    console.log(`[OK] Đã đọc winners từ ${file}`);
  }

  // If account file: parsed could be array of strings or objects
  if (/account/.test(name)) {
    if (Array.isArray(parsed)) {
      parsed.forEach(x => {
        if (!x) return;
        if (typeof x === 'string' || typeof x === 'number') accountsAcc.add(String(x));
        else if (typeof x === 'object') {
          // guess field phone/username
          const val = x.phone || x.username || x.user || JSON.stringify(x);
          accountsAcc.add(String(val));
        }
      });
    } else if (typeof parsed === 'object') {
      const val = parsed.phone || parsed.username || parsed.user || JSON.stringify(parsed);
      accountsAcc.add(String(val));
    } else {
      accountsAcc.add(String(parsed));
    }
    console.log(`[OK] Đã đọc accounts từ ${file}`);
  }
});

// Dedupe winners by username (or by JSON string)
const seenWinners = new Set();
const mergedWinners = [];
for (const w of winnersAcc) {
  const key = (w.username || w.phone || JSON.stringify(w)).toString();
  if (!seenWinners.has(key)) {
    seenWinners.add(key);
    mergedWinners.push(w);
  }
}

// Write out
const winnersOut = path.join(OUT_DIR, 'winners.json');
const accountsOut = path.join(OUT_DIR, 'accounts.json');

fs.writeFileSync(winnersOut, JSON.stringify(mergedWinners, null, 2), 'utf8');
fs.writeFileSync(accountsOut, JSON.stringify(Array.from(accountsAcc), null, 2), 'utf8');

console.log('====================');
console.log(`Merged winners: ${mergedWinners.length} -> ${winnersOut}`);
console.log(`Merged accounts: ${Array.from(accountsAcc).length} -> ${accountsOut}`);
console.log('Hoan thanh.');

