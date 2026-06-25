import * as XLSX from 'xlsx';

// ─── Helper: baca file sebagai ArrayBuffer ───
const readAsBuffer = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(new Uint8Array(e.target.result));
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

// ─── MAIN PARSER ───
export const parseExcel = async (file, _unused, blacklistStr) => {
  // 1. Bangun daftar blacklist — case-insensitive, toleran typo spasi
  const blacklist = blacklistStr
    ? blacklistStr.split(/[\n,]+/).map((n) => n.trim().toLowerCase()).filter(Boolean)
    : [];

  // 2. Baca file Excel utama
  const buffer = await readAsBuffer(file);
  const wb    = XLSX.read(buffer, { type: 'array' });
  const ws    = wb.Sheets[wb.SheetNames[0]];
  const raw   = XLSX.utils.sheet_to_json(ws, { header: 1 });

  if (raw.length < 5) {
    throw new Error('Format file tidak sesuai. Pastikan data dimulai dari baris ke-5.');
  }

  // 3. Parse baris data (mulai index 4, lewati 4 baris header)
  const parsed = [];
  for (const row of raw.slice(4)) {
    const nameRaw = row[1];
    if (!nameRaw || typeof nameRaw !== 'string') continue;

    const name = nameRaw.trim();
    if (!name) continue;

    // Cek blacklist — case-insensitive
    if (blacklist.includes(name.toLowerCase())) continue;

    // Jumlahkan semua kolom penalti (kolom 9–22, 0-based)
    let totalPenalty = 0;
    for (let i = 9; i <= 22; i++) {
      totalPenalty += parseFloat(row[i]) || 0;
    }

    parsed.push({
      name,
      nip       : row[2]  ? String(row[2]).trim()  : '-',
      jabatan   : row[4]  ? String(row[4]).trim()  : '-',
      unitKerja : row[5]  ? String(row[5]).trim()  : '-',
      category  : row[6]  ? String(row[6]).trim()  : 'Tanpa Kategori',
      kehadiran : parseFloat(row[8])  || 0,
      totalPenalty,
      evidence  : parseFloat(row[23]) || 0,
      skp       : parseFloat(row[24]) || 0,
    });
  }

  if (parsed.length === 0) {
    throw new Error('Tidak ada data kandidat yang valid setelah proses filter blacklist.');
  }

  // 4. Kelompokkan per kategori
  const grouped = {};
  for (const item of parsed) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }

  // 5. Sort & ambil Top 3 per kategori
  //    Urutan prioritas:
  //      1. Evidence    — DESC (tertinggi)
  //      2. TotalPenalti — ASC  (terendah)
  //      3. Kehadiran   — DESC (terbanyak)
  //      4. SKP         — DESC (tertinggi)
  const results = {};
  for (const cat in grouped) {
    grouped[cat].sort((a, b) => {
      if (b.evidence      !== a.evidence)      return b.evidence - a.evidence;
      if (a.totalPenalty  !== b.totalPenalty)  return a.totalPenalty - b.totalPenalty;
      if (b.kehadiran     !== a.kehadiran)     return b.kehadiran - a.kehadiran;
      return b.skp - a.skp;
    });
    results[cat] = grouped[cat].slice(0, 3);
  }

  return results;
};

// ─── EXPORT TO EXCEL ───
export const exportToExcel = (results) => {
  const rows = [];
  for (const category in results) {
    results[category].forEach((c, i) => {
      rows.push({
        Kategori         : category,
        Peringkat        : i + 1,
        Nama             : c.name,
        NIP              : c.nip,
        Jabatan          : c.jabatan,
        'Unit Kerja'     : c.unitKerja,
        Evidence         : c.evidence,
        'Total Penalti'  : c.totalPenalty,
        'Kehadiran (hari)': c.kehadiran,
        'Nilai SKP'      : c.skp,
      });
    });
  }

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Hasil Seleksi EOM');
  XLSX.writeFile(wb, 'Hasil_Seleksi_EOM.xlsx');
};
