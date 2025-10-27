import fs from "fs";

// Đọc dữ liệu từ 2 file
const arr1 = JSON.parse(fs.readFileSync("account1.json", "utf8"));
const arr2 = JSON.parse(fs.readFileSync("account2.json", "utf8"));

// Gộp và loại trùng
const merged = Array.from(new Set([...arr1, ...arr2]));

// Ghi ra file mới
fs.writeFileSync("merged.json", JSON.stringify(merged, null, 2));

console.log(`✅ Đã gộp ${arr1.length} + ${arr2.length} → ${merged.length} phần tử duy nhất.`);
