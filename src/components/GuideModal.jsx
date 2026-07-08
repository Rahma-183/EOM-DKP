export default function GuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Panduan Penggunaan</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="guide-section">
            <h3>Langkah-Langkah:</h3>
            <ol>
              <li>Siapkan file <strong>Rekap Usulan EOM</strong> (.xlsx) bulan ini.</li>
              <li>Unggah file tersebut ke dalam kotak yang disediakan di halaman utama.</li>
              <li>Masukkan daftar <strong>Nama atau NIP</strong> yang masuk dalam kriteria <strong>Blacklist</strong> (lihat ketentuan di bawah). Pisahkan dengan baris baru atau koma. Menggunakan NIP lebih disarankan untuk menghindari kesalahan pada nama yang sama atau salah ejaan.</li>
              <li>Klik tombol <strong>Mulai Analisis Kandidat</strong>.</li>
              <li>Sistem akan menampilkan 3 kandidat terbaik per kategori, dengan opsi untuk melihat rekomendasi peringkat 4-6.</li>
              <li>Klik <strong>Ekspor ke Excel</strong> untuk mengunduh rekap akhir.</li>
            </ol>
          </div>

          <div className="guide-section">
            <h3>Logika Seleksi & Eliminasi (Otomatis):</h3>
            <p className="guide-desc">
              Sistem memproses kandidat Top 6 dengan sistem perhitungan Skor Komposit yang menggunakan nilai mentah (asli). Rumusnya adalah:
            </p>
            <ul className="blacklist-rules">
              <li><strong>Skor Akhir</strong> = <code>50% (Evidence) - 40% (Total Penalti) - 10% (DL/Ijin/Cuti)</code></li>
            </ul>
            <p className="guide-desc">
              Jika ada beberapa kandidat yang memiliki Skor Akhir sama (seri mutlak), sistem akan otomatis mengurutkannya melalui tahap <em>Tiebreaker</em> berikut secara berurutan:
            </p>
            <ol className="blacklist-rules">
              <li><strong>Nilai SKP</strong> (tertinggi menang)</li>
              <li><strong>Jumlah Kehadiran Hari</strong> (terbanyak menang)</li>
              <li><strong>Durasi Dihitung</strong> (terlama menang)</li>
            </ol>
          </div>

          <div className="guide-section">
            <h3>Ketentuan Daftar Blacklist:</h3>
            <p className="guide-desc">
              Kandidat yang masuk dalam salah satu kriteria berikut <strong>wajib</strong> dimasukkan ke dalam kotak Blacklist agar tidak terpilih menjadi EOM:
            </p>
            <ul className="blacklist-rules">
              <li>Status kepegawaian <strong>Pensiun</strong></li>
              <li>Status kepegawaian <strong>CPNS</strong></li>
              <li>Sedang mengambil <strong>Cuti Penuh</strong></li>
              <li>Memiliki catatan <strong>Indisipliner</strong></li>
              <li><strong>Pernah terpilih</strong> menjadi EOM di bulan-bulan sebelumnya pada tahun yang sama</li>
            </ul>
            <p className="guide-note">
              <em>Catatan: Penulisan nama pada daftar Blacklist tidak harus sama persis kapitalisasinya (sistem membaca huruf besar/kecil sebagai sama). Sebagai alternatif yang lebih akurat, Anda dapat menggunakan NIP untuk mengantisipasi nama yang sama atau salah ejaan.</em>
            </p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>Saya Mengerti</button>
        </div>
      </div>
    </div>
  );
}
