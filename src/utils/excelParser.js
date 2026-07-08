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
  // 1. Bangun daftar blacklist — bisa berupa nama ATAU NIP, case-insensitive
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
  //    Peta kolom (0-based):
  //      1  = Nama
  //      2  = NIP
  //      4  = Jabatan
  //      5  = Unit Kerja
  //      6  = Kategori
  //      8  = Kehadiran (hari)
  //      9  = DL/Ijin/Cuti
  //      10 = Tidak Absen Datang
  //      ...
  //      22 = Tidak Masuk Tanpa Keterangan
  //      23 = Evidence
  //      24 = Total Nilai Predikat SKP
  //      25 = Durasi Dihitung
  const parsed = [];
  for (const row of raw.slice(4)) {
    const nameRaw = row[1];
    if (!nameRaw || typeof nameRaw !== 'string') continue;

    const name = nameRaw.trim();
    if (!name) continue;

    // Cek blacklist — cocokkan berdasarkan nama ATAU NIP (case-insensitive)
    const nipStr = row[2] ? String(row[2]).trim().toLowerCase() : '';
    if (blacklist.includes(name.toLowerCase()) || (nipStr && blacklist.includes(nipStr))) continue;

    // DL/Ijin/Cuti (kolom 9)
    const dlIjinCuti = parseFloat(row[9]) || 0;

    // Pinalti: jumlah kolom 10 ("Tidak Absen Datang") sampai 22 ("Tidak Masuk Tanpa Keterangan")
    let totalPenalty = 0;
    for (let i = 10; i <= 22; i++) {
      totalPenalty += parseFloat(row[i]) || 0;
    }

    parsed.push({
      name,
      nip           : row[2]  ? String(row[2]).trim()  : '-',
      jabatan       : row[4]  ? String(row[4]).trim()  : '-',
      unitKerja     : row[5]  ? String(row[5]).trim()  : '-',
      category      : row[6]  ? String(row[6]).trim()  : 'Tanpa Kategori',
      kehadiran     : parseFloat(row[8])  || 0,
      dlIjinCuti,
      totalPenalty,
      evidence      : parseFloat(row[23]) || 0,
      skp           : parseFloat(row[24]) || 0,
      durasiDihitung: parseFloat(row[25]) || 0,
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

  // 5. Sort & ambil Top 6 per kategori
  //    Perhitungan Skor = 50% (Evidence) - 25% (Penalti) - 25% (DL/Cuti/Ijin)
  //    Nilai dinormalisasi (0-1) agar bobot persentase seimbang.
  //    Tiebreaker: SKP -> Kehadiran -> Durasi Dihitung
  const results = {};
  for (const cat in grouped) {
    const arr = grouped[cat];

    // Cari min/max untuk normalisasi
    let minP = Infinity, maxP = -Infinity;
    let minE = Infinity, maxE = -Infinity;
    let minD = Infinity, maxD = -Infinity;
    
    for (const c of arr) {
      if (c.totalPenalty < minP) minP = c.totalPenalty;
      if (c.totalPenalty > maxP) maxP = c.totalPenalty;
      if (c.evidence < minE) minE = c.evidence;
      if (c.evidence > maxE) maxE = c.evidence;
      if (c.dlIjinCuti < minD) minD = c.dlIjinCuti;
      if (c.dlIjinCuti > maxD) maxD = c.dlIjinCuti;
    }
    
    const rangeP = maxP - minP || 1;
    const rangeE = maxE - minE || 1;
    const rangeD = maxD - minD || 1;

    for (const c of arr) {
      const normE = (c.evidence - minE) / rangeE;
      const normP = (c.totalPenalty - minP) / rangeP;
      const normD = (c.dlIjinCuti - minD) / rangeD;

      // Skor = 50% Evidence - 25% Penalti - 25% DL/Ijin/Cuti
      c.compositeScore = (0.5 * normE) - (0.25 * normP) - (0.25 * normD);
    }

    arr.sort((a, b) => {
      // 1. Skor komposit (tertinggi menang)
      if (b.compositeScore !== a.compositeScore) return b.compositeScore - a.compositeScore;
      // 2. Tiebreaker: SKP (tertinggi menang)
      if (b.skp !== a.skp) return b.skp - a.skp;
      // 3. Tiebreaker: Kehadiran (terbanyak menang)
      if (b.kehadiran !== a.kehadiran) return b.kehadiran - a.kehadiran;
      // 4. Tiebreaker: Durasi Dihitung (terbesar menang)
      return b.durasiDihitung - a.durasiDihitung;
    });

    results[cat] = arr.slice(0, 6); // Ambil Top 6
  }

  return results;
};

// ─── EXPORT TO EXCEL ───
export const exportToExcel = (results) => {
  const rows = [];
  for (const category in results) {
    results[category].forEach((c, i) => {
      rows.push({
        Kategori           : category,
        Peringkat          : i + 1,
        Nama               : c.name,
        NIP                : c.nip,
        Jabatan            : c.jabatan,
        'Unit Kerja'       : c.unitKerja,
        'Total Penalti'    : c.totalPenalty,
        Evidence           : c.evidence,
        'DL/Ijin/Cuti'     : c.dlIjinCuti,
        'Nilai SKP'        : c.skp,
        'Kehadiran (hari)' : c.kehadiran,
        'Durasi Dihitung'  : c.durasiDihitung,
      });
    });
  }

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Hasil Seleksi EOM');
  XLSX.writeFile(wb, 'Hasil_Seleksi_EOM.xlsx');
};
