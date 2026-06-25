export default function Hero() {
  return (
    <div className="hero">
      <div className="hero-icon-wrap">🏆</div>
      <h2>Selamat Datang, Panitia EOM!</h2>
      <p>
        Unggah file Rekap Usulan dan masukkan daftar blacklist di panel kiri,
        kemudian klik <strong>Mulai Analisis</strong> untuk melihat
        3 kandidat terbaik per kategori secara otomatis.
      </p>
      <div className="hero-steps">
        {[
          ['1', '📁 Upload file Rekap Usulan (.xlsx)'],
          ['2', '🚫 Isi nama yang dikecualikan'],
          ['3', '🚀 Klik Mulai Analisis'],
          ['4', '📥 Ekspor hasil ke Excel'],
        ].map(([num, text]) => (
          <div key={num} className="hero-step">
            <div className="hero-step-num">{num}</div>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
