# 🏆 EOM Candidate Selector — DKP Jawa Timur

Aplikasi otomatisasi seleksi **Employee of the Month (EOM)** Dinas Kelautan dan Perikanan Provinsi Jawa Timur.

## Cara Menjalankan

### Prasyarat
Pastikan Python sudah terinstall. Kemudian install dependensi:

```bash
pip install -r requirements.txt
```

### Menjalankan Aplikasi
```bash
streamlit run app.py
```

Aplikasi akan terbuka otomatis di browser pada `http://localhost:8501`.

## Cara Penggunaan

1. **Unggah file Rekap Usulan EOM** (.xlsx) di panel kiri
2. **Masukkan nama blacklist** (yang dikecualikan bulan ini) — pisahkan dengan koma atau baris baru
3. Klik **Mulai Analisis Kandidat**
4. Sistem akan otomatis menampilkan **3 kandidat terbaik per kategori**
5. Klik **Ekspor ke Excel** untuk mengunduh rekap hasil dalam satu file

## Algoritma Seleksi

Kandidat diseleksi menggunakan metode **Multi-Criteria Hierarchical Sorting**:

| Prioritas | Kriteria | Arah |
|-----------|----------|------|
| 1 | Evidence Score | Tertinggi |
| 2 | Total Penalti (Rekap Presensi) | Terendah |
| 3 | Kehadiran (hari) | Terbanyak |
| 4 | Nilai SKP | Tertinggi |

## Teknologi

- **Python** + **Streamlit** — framework web aplikasi data
- **Pandas** — pengolahan dan analisis data Excel
- **XlsxWriter** — ekspor hasil ke format Excel

## Logo

Untuk menampilkan logo instansi, letakkan file `logo.png` atau `logo.jpg` di folder yang sama dengan `app.py`, kemudian refresh halaman.
