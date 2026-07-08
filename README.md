# EOM Candidate Selector — DKP Jawa Timur

Aplikasi web interaktif untuk otomatisasi seleksi **Employee of the Month (EOM)** Dinas Kelautan dan Perikanan Provinsi Jawa Timur.

## Cara Menjalankan

### Prasyarat
Pastikan **Node.js** (v18 ke atas) sudah terinstall. Kemudian install dependensi:

```bash
npm install
```

### Menjalankan Aplikasi (Mode Development)
```bash
npm run dev
```

Aplikasi akan terbuka di browser pada `http://localhost:5173`.

### Build Production
```bash
npm run build
```

## Cara Penggunaan

1. **Unggah file Rekap Usulan EOM** (.xlsx) — drag & drop atau klik area unggah
2. **Masukkan daftar pengecualian (Blacklist)** — bisa menggunakan nama atau NIP, pisahkan dengan koma atau baris baru
3. Klik **Mulai Analisis Kandidat**
4. Sistem menampilkan **3 kandidat terbaik per kategori** beserta tombol rekomendasi untuk melihat peringkat 4-6
5. Klik **Ekspor ke Excel** untuk mengunduh rekap hasil

### Ketentuan Blacklist
Kandidat berikut wajib dimasukkan ke daftar pengecualian:
- Pegawai dengan status **Pensiun**
- Pegawai dengan status **CPNS**
- Pegawai yang sedang **Cuti Penuh**
- Pegawai dengan catatan **Indisipliner**
- Pegawai yang **pernah terpilih menjadi EOM** di bulan-bulan sebelumnya pada tahun yang sama

## Algoritma Seleksi

Kandidat diseleksi menggunakan metode **Skor Komposit (Persentase)** menggunakan nilai asli secara langsung. Rumus perhitungannya adalah:

```text
Skor Akhir = 50% (Evidence) - 25% (Total Penalti) - 25% (DL/Ijin/Cuti)
```

Apabila terdapat kandidat dengan Skor Akhir yang sama (seri), sistem akan menentukan pemenang berdasarkan *tiebreaker* berikut (berurutan):

| Prioritas | Kriteria | Arah |
|-----------|----------|------|
| 1 | Nilai SKP | Tertinggi |
| 2 | Kehadiran (hari) | Terbanyak |
| 3 | Durasi Dihitung | Tertinggi |

## Catatan Format File Excel

File rekap usulan harus memiliki struktur dengan **4 baris header** di atas, sehingga data pegawai dimulai dari **baris ke-5**. Posisi kolom yang dibaca:

| Kolom | Isi |
|-------|-----|
| B | Nama |
| C | NIP |
| E | Jabatan |
| F | Unit Kerja |
| G | Kategori |
| I | Kehadiran (hari) |
| J | DL/Ijin/Cuti |
| K–W | Komponen Penalti (Tidak Absen Datang s/d Tidak Masuk Tanpa Keterangan) |
| X | Evidence Score |
| Y | Total Nilai Predikat SKP |
| Z | Durasi Dihitung |

Baris kosong, baris subtotal, atau kolom di luar jangkauan di atas akan diabaikan secara otomatis oleh sistem.

## Teknologi

- **React 19** + **Vite** — framework web modern
- **SheetJS (xlsx)** — pemrosesan file Excel di browser (tanpa server)
- **Plain CSS** — styling dengan variabel desain (Dark Mode)
