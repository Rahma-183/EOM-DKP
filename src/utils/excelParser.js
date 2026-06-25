import * as XLSX from 'xlsx';

export const parseExcel = (file, ePresensiFile, excludedNamesStr) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Get Excluded Names from string input
      let excludedNames = excludedNamesStr
        .split(/[\n,]+/)
        .map(n => n.trim().toLowerCase())
        .filter(n => n.length > 0);

      // 2. If E-Presensi file is provided, parse it to find blacklisted people
      if (ePresensiFile) {
        const presensiData = await readFileAsArrayBuffer(ePresensiFile);
        const presensiWorkbook = XLSX.read(presensiData, { type: 'array' });
        const presensiSheet = presensiWorkbook.Sheets[presensiWorkbook.SheetNames[0]];
        const rawPresensi = XLSX.utils.sheet_to_json(presensiSheet, { header: 1 });
        
        // E-Presensi structure: header is usually at row 2 (index 1)
        if (rawPresensi.length > 2) {
          const headers = rawPresensi[1];
          const nameIndex = headers.indexOf('Nama Pegawai');
          const kehadiranIndex = headers.indexOf('kehadiran');
          const alphaIndex = headers.indexOf('alpha');
          const tanpaKetIndex = headers.findIndex(h => typeof h === 'string' && h.includes('Tidak Masuk Tanpa Keterangan'));
          
          for (let i = 2; i < rawPresensi.length; i++) {
            const row = rawPresensi[i];
            if (!row || !row[nameIndex]) continue;
            
            const name = row[nameIndex].toString().trim().toLowerCase();
            const kehadiran = parseFloat(row[kehadiranIndex]) || 0;
            const alpha = parseFloat(row[alphaIndex]) || 0;
            const tanpaKet = parseFloat(row[tanpaKetIndex]) || 0;
            
            // Logika Blacklist: Cuti Penuh (kehadiran 0), Indisipliner (alpha > 0 atau tanpa keterangan)
            if (kehadiran === 0 || alpha > 0 || tanpaKet > 0) {
              if (!excludedNames.includes(name)) {
                excludedNames.push(name);
              }
            }
          }
        }
      }

      // 3. Parse Main EOM File
      const data = await readFileAsArrayBuffer(file);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (rawData.length < 5) {
        throw new Error("File Rekap Usulan tidak memiliki format yang benar atau data kosong.");
      }

      const dataRows = rawData.slice(4);
      const parsedData = [];

      for (const row of dataRows) {
        if (!row[1] || typeof row[1] !== 'string') continue;
        
        const name = row[1].trim();
        const nameLower = name.toLowerCase();
        
        if (excludedNames.includes(nameLower)) continue;

        const category = row[6] ? row[6].toString().trim() : "Tanpa Kategori";
        const kehadiran = parseFloat(row[8]) || 0;
        
        let totalPenalty = 0;
        for (let i = 9; i <= 22; i++) {
          totalPenalty += parseFloat(row[i]) || 0;
        }
        
        const evidence = parseFloat(row[23]) || 0;
        const skp = parseFloat(row[24]) || 0;

        parsedData.push({
          name,
          nip: row[2] ? row[2].toString().trim() : "-",
          jabatan: row[4] ? row[4].toString().trim() : "-",
          unitKerja: row[5] ? row[5].toString().trim() : "-",
          category,
          kehadiran,
          totalPenalty,
          evidence,
          skp
        });
      }

      const groupedData = {};
      parsedData.forEach(item => {
        if (!groupedData[item.category]) {
          groupedData[item.category] = [];
        }
        groupedData[item.category].push(item);
      });

      const results = {};
      for (const cat in groupedData) {
        const candidates = groupedData[cat];
        candidates.sort((a, b) => {
          if (b.kehadiran !== a.kehadiran) return b.kehadiran - a.kehadiran;
          if (a.totalPenalty !== b.totalPenalty) return a.totalPenalty - b.totalPenalty;
          if (b.evidence !== a.evidence) return b.evidence - a.evidence;
          return b.skp - a.skp;
        });
        results[cat] = candidates.slice(0, 3);
      }

      resolve(results);
    } catch (err) {
      reject(err);
    }
  });
};

const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(new Uint8Array(e.target.result));
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

export const exportToExcel = (results) => {
  const exportData = [];
  
  for (const category in results) {
    results[category].forEach((candidate, index) => {
      exportData.push({
        'Kategori': category,
        'Peringkat': index + 1,
        'Nama': candidate.name,
        'NIP': candidate.nip,
        'Jabatan': candidate.jabatan,
        'Unit Kerja': candidate.unitKerja,
        'Kehadiran (hari)': candidate.kehadiran,
        'Total Penalti': candidate.totalPenalty,
        'Evidence': candidate.evidence,
        'Nilai SKP': candidate.skp
      });
    });
  }

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil EOM");
  XLSX.writeFile(workbook, "Hasil_Seleksi_EOM.xlsx");
};
