import streamlit as st
import pandas as pd
import os
import io
import base64

# ==================================================================
# CSS MODERN — Gradasi Indigo/Ungu, Layout Full Custom
# ==================================================================
def set_css():
    st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    /* ── GLOBAL ── */
    #MainMenu, footer, header, [data-testid="stToolbar"]     { display: none !important; }
    [data-testid="stSidebar"]                                 { display: none !important; }
    [data-testid="collapsedControl"]                          { display: none !important; }
    .block-container { padding: 0 !important; max-width: 100% !important; }

    html, body, .stApp {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: #0D0F1A;
        color: #E2E8F0;
        margin: 0; padding: 0;
    }

    /* Style kolom kiri langsung tanpa wrapper div */
    [data-testid="stHorizontalBlock"] > div:first-child {
        background: linear-gradient(180deg, #13152B 0%, #0D0F1A 100%);
        border-right: 1px solid rgba(139,92,246,0.2);
        padding: 0 !important;
        min-height: 100vh;
    }
    /* Hapus padding bawaan elemen di dalam kolom kiri */
    [data-testid="stHorizontalBlock"] > div:first-child > div[data-testid="stVerticalBlockBorderWrapper"] {
        padding: 0 !important;
        gap: 0 !important;
    }
    [data-testid="stHorizontalBlock"] > div:first-child .stElementContainer {
        padding-left: 1.2rem;
        padding-right: 1.2rem;
    }
    /* Panel header tidak perlu padding tambahan */
    [data-testid="stHorizontalBlock"] > div:first-child .stElementContainer:first-child {
        padding: 0 !important;
    }

    /* ── HEADER PANEL ── */
    .panel-header {
        background: linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%);
        padding: 1.8rem 1.5rem 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    .panel-logo-ring {
        width: 80px; height: 80px;
        border-radius: 50%;
        background: rgba(255,255,255,0.15);
        border: 2px solid rgba(255,255,255,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.8rem;
        overflow: hidden;
    }
    .panel-logo-ring img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }
    .panel-logo-ring span { font-size: 2.2rem; }
    .panel-title {
        font-size: 1.05rem;
        font-weight: 800;
        color: #fff;
        line-height: 1.3;
        margin-bottom: 2px;
    }
    .panel-subtitle {
        font-size: 0.72rem;
        color: rgba(255,255,255,0.7);
        line-height: 1.4;
    }

    /* ── PANEL BODY ── */
    .panel-body { padding: 1.5rem; flex: 1; }

    .section-label {
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        color: #7C3AED;
        margin-bottom: 0.6rem;
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }

    .info-box {
        background: rgba(139,92,246,0.1);
        border: 1px solid rgba(139,92,246,0.25);
        border-radius: 10px;
        padding: 0.8rem 1rem;
        font-size: 0.8rem;
        color: #A5B4FC;
        line-height: 1.5;
        margin-bottom: 1rem;
    }

    /* ── CRITERIA LIST ── */
    .criteria-list {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 10px;
        padding: 1rem;
        margin-top: 1.5rem;
    }
    .criteria-list .cr-title {
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: #6B7280;
        margin-bottom: 0.6rem;
    }
    .cr-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.78rem;
        color: #9CA3AF;
        padding: 0.35rem 0;
    }
    .cr-num {
        width: 18px; height: 18px;
        border-radius: 50%;
        background: rgba(139,92,246,0.3);
        color: #C4B5FD;
        font-size: 0.65rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    /* ── MAIN CONTENT ── */
    .main-content {
        margin-left: 320px;
        flex: 1;
        padding: 0;
        min-height: 100vh;
        background: #0D0F1A;
    }

    /* ── TOP BAR ── */
    .top-bar {
        background: rgba(13,15,26,0.9);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(139,92,246,0.15);
        padding: 1rem 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        top: 0;
        z-index: 90;
    }
    .top-bar-title {
        font-size: 1rem;
        font-weight: 700;
        color: #E2E8F0;
    }
    .top-badge {
        background: linear-gradient(135deg, #7C3AED, #4F46E5);
        color: white;
        font-size: 0.72rem;
        font-weight: 600;
        padding: 4px 12px;
        border-radius: 20px;
    }

    /* ── HERO / WELCOME ── */
    .hero {
        padding: 5rem 3rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .hero-icon {
        width: 96px; height: 96px;
        background: linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%);
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 0 40px rgba(124,58,237,0.4);
    }
    .hero h2 {
        font-size: 2rem;
        font-weight: 800;
        background: linear-gradient(135deg, #C4B5FD, #818CF8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.75rem;
    }
    .hero p {
        color: #6B7280;
        font-size: 1rem;
        max-width: 440px;
        line-height: 1.6;
    }

    /* ── RESULTS CONTAINER ── */
    .results-container { padding: 2rem 2rem 1.5rem; }

    .results-hero {
        background: linear-gradient(135deg, #7C3AED 0%, #4338CA 50%, #3730A3 100%);
        border-radius: 20px;
        padding: 1.2rem;
        text-align: center;
        margin-bottom: 0.8rem;
        position: relative;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(124,58,237,0.3);
    }
    .results-hero::before {
        content: '';
        position: absolute;
        top: -50%; right: -10%;
        width: 300px; height: 300px;
        background: rgba(255,255,255,0.05);
        border-radius: 50%;
    }
    .results-hero h2 {
        font-size: 1.5rem;
        font-weight: 800;
        color: #fff;
        margin: 0 0 0.4rem 0;
    }
    .results-hero p { color: rgba(255,255,255,0.75); margin: 0; font-size: 0.88rem; }
    
    /* ── CATEGORY BLOCK ── */
    .cat-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin: 1rem 0 0.5rem 0;
    }
    .cat-icon-box {
        width: 40px; height: 40px;
        background: linear-gradient(135deg, #7C3AED, #4F46E5);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        flex-shrink: 0;
    }
    .cat-name {
        font-size: 1.15rem;
        font-weight: 700;
        color: #E2E8F0;
    }
    .cat-pill {
        margin-left: auto;
        background: rgba(139,92,246,0.15);
        border: 1px solid rgba(139,92,246,0.3);
        color: #A5B4FC;
        font-size: 0.7rem;
        font-weight: 600;
        padding: 3px 10px;
        border-radius: 20px;
    }

    /* ── KANDIDAT CARD ── */
    .cand-card {
        background: #13152B;
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 16px;
        padding: 1.4rem;
        position: relative;
        transition: all 0.25s ease;
        height: 100%;
    }
    .cand-card:hover {
        transform: translateY(-4px);
        border-color: rgba(139,92,246,0.4);
        box-shadow: 0 15px 35px rgba(124,58,237,0.2);
    }
    .cand-card.r1 {
        border-color: rgba(251,191,36,0.3);
        background: linear-gradient(160deg, #1D1A0A 0%, #13152B 50%);
    }
    .cand-card.r2 {
        border-color: rgba(148,163,184,0.25);
        background: linear-gradient(160deg, #141620 0%, #13152B 50%);
    }
    .cand-card.r3 {
        border-color: rgba(180,120,60,0.25);
        background: linear-gradient(160deg, #18130E 0%, #13152B 50%);
    }

    .rank-pill {
        position: absolute;
        top: 14px; right: 14px;
        font-size: 0.72rem;
        font-weight: 700;
        padding: 3px 10px;
        border-radius: 20px;
    }
    .rank-pill.r1 { background: rgba(251,191,36,0.15); color: #FCD34D; border: 1px solid rgba(251,191,36,0.3); }
    .rank-pill.r2 { background: rgba(148,163,184,0.1); color: #CBD5E1; border: 1px solid rgba(148,163,184,0.25); }
    .rank-pill.r3 { background: rgba(180,120,60,0.1);  color: #D4845A; border: 1px solid rgba(180,120,60,0.25); }

    .cand-medal { font-size: 2rem; display: block; margin-bottom: 0.5rem; }

    .cand-name {
        font-size: 1rem;
        font-weight: 700;
        color: #F1F5F9;
        margin-right: 70px;
        line-height: 1.3;
        margin-bottom: 4px;
    }
    .cand-nip {
        font-size: 0.72rem;
        color: #4B5563;
        font-weight: 600;
        letter-spacing: 0.3px;
        margin-bottom: 6px;
    }
    .cand-unit {
        font-size: 0.75rem;
        color: #6B7280;
        line-height: 1.4;
        padding-bottom: 0.9rem;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        margin-bottom: 0.9rem;
        min-height: 55px;
    }
    .cand-jabatan-tag {
        display: inline-block;
        background: rgba(139,92,246,0.15);
        color: #A5B4FC;
        font-size: 0.68rem;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 6px;
        margin-bottom: 0.6rem;
    }

    /* STAT GRID */
    .stat-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 7px;
    }
    .stat-chip {
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 8px;
        padding: 8px 9px;
    }
    .stat-lbl {
        font-size: 0.63rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: #4B5563;
        margin-bottom: 2px;
    }
    .stat-val {
        font-size: 0.95rem;
        font-weight: 800;
        color: #E2E8F0;
    }
    .stat-unit { font-size: 0.6rem; font-weight: 500; color: #6B7280; }
    .green { color: #34D399; }
    .red   { color: #F87171; }
    .blue  { color: #60A5FA; }
    .gold  { color: #FCD34D; }

    /* EXPORT SECTION */
    .export-wrap {
        background: linear-gradient(135deg, rgba(124,58,237,0.12), rgba(79,70,229,0.12));
        border: 1px solid rgba(139,92,246,0.25);
        border-radius: 16px;
        padding: 1.8rem 2rem;
        text-align: center;
        margin-top: 1rem;
    }
    .export-wrap h4 { font-size: 1.05rem; font-weight: 700; color: #E2E8F0; margin-bottom: 4px; }
    .export-wrap p  { font-size: 0.83rem; color: #6B7280; margin-bottom: 1.2rem; }

    /* Download button override */
    .stDownloadButton > button {
        background: linear-gradient(135deg, #7C3AED, #4F46E5) !important;
        color: white !important;
        border: none !important;
        border-radius: 12px !important;
        font-weight: 700 !important;
        font-size: 0.95rem !important;
        padding: 0.7rem 2rem !important;
        box-shadow: 0 8px 25px rgba(124,58,237,0.35) !important;
        transition: all 0.2s ease !important;
    }
    .stDownloadButton > button:hover {
        opacity: 0.9 !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 12px 30px rgba(124,58,237,0.5) !important;
    }

    /* Streamlit widget overrides for dark theme */
    .stFileUploader > div {
        background: rgba(255,255,255,0.04) !important;
        border: 1.5px dashed rgba(139,92,246,0.4) !important;
        border-radius: 12px !important;
    }
    .stFileUploader label { color: #9CA3AF !important; }
    .stTextArea textarea {
        background: rgba(255,255,255,0.04) !important;
        border: 1px solid rgba(139,92,246,0.3) !important;
        color: #E2E8F0 !important;
        border-radius: 10px !important;
    }
    .stButton > button {
        background: linear-gradient(135deg, #7C3AED, #4F46E5) !important;
        color: white !important;
        border: none !important;
        border-radius: 12px !important;
        font-weight: 700 !important;
        padding: 0.65rem 1rem !important;
        box-shadow: 0 6px 20px rgba(124,58,237,0.3) !important;
    }
    .stButton > button:hover {
        opacity: 0.9 !important; transform: translateY(-1px) !important;
    }
    .stAlert { border-radius: 10px !important; }
    </style>
    """, unsafe_allow_html=True)


# ==================================================================
# PROSES DATA
# ==================================================================
def process_data(uploaded_file, blacklist_input):
    blacklist_names = []
    if blacklist_input:
        raw_names = blacklist_input.replace('\n', ',').split(',')
        blacklist_names = [n.strip().lower() for n in raw_names if n.strip()]

    df_raw = pd.read_excel(uploaded_file, header=None)
    if len(df_raw) < 5:
        return None

    data_rows = df_raw.iloc[4:].copy()
    parsed = []

    for _, row in data_rows.iterrows():
        name_val = row[1]
        if pd.isna(name_val) or str(name_val).strip() == "":
            continue
        name = str(name_val).strip()
        if name.lower() in blacklist_names:
            continue

        category = str(row[6]).strip() if not pd.isna(row[6]) else "Tanpa Kategori"
        kehadiran = float(row[8]) if not pd.isna(row[8]) else 0.0
        total_penalty = sum(float(row[i]) for i in range(9, 23) if not pd.isna(row[i]) and isinstance(row[i], (int, float)))
        evidence = float(row[23]) if not pd.isna(row[23]) else 0.0
        skp = float(row[24]) if not pd.isna(row[24]) else 0.0

        parsed.append({
            "Kategori": category, "Nama": name,
            "NIP": str(row[2]).strip() if not pd.isna(row[2]) else "-",
            "Jabatan": str(row[4]).strip() if not pd.isna(row[4]) else "-",
            "Unit Kerja": str(row[5]).strip() if not pd.isna(row[5]) else "-",
            "Kehadiran (hari)": kehadiran, "Total Penalti": total_penalty,
            "Evidence": evidence, "Nilai SKP": skp
        })

    return pd.DataFrame(parsed)


# ==================================================================
# RENDER KARTU KANDIDAT
# ==================================================================
def card_html(row, rank):
    medals = {1: "🥇", 2: "🥈", 3: "🥉"}
    rc = {1: "r1", 2: "r2", 3: "r3"}.get(rank, "r3")
    medal = medals.get(rank, "")
    jabatan_tag = row['Jabatan'][:35] + "..." if len(row['Jabatan']) > 35 else row['Jabatan']
    unit = row['Unit Kerja']

    return f"""
    <div class="cand-card {rc}">
        <div class="rank-pill {rc}">{medal} Peringkat {rank}</div>
        <div class="cand-medal">{medal}</div>
        <div class="cand-name">{row['Nama']}</div>
        <div class="cand-nip">NIP: {row['NIP']}</div>
        <div class="cand-jabatan-tag">{jabatan_tag}</div>
        <div class="cand-unit">{unit}</div>
        <div class="stat-grid">
            <div class="stat-chip">
                <div class="stat-lbl">✅ Kehadiran</div>
                <div class="stat-val green">{row['Kehadiran (hari)']:.0f} <span class="stat-unit">hari</span></div>
            </div>
            <div class="stat-chip">
                <div class="stat-lbl">⚠️ Penalti</div>
                <div class="stat-val red">{row['Total Penalti']:.0f} <span class="stat-unit">poin</span></div>
            </div>
            <div class="stat-chip">
                <div class="stat-lbl">📄 Evidence</div>
                <div class="stat-val blue">{row['Evidence']}</div>
            </div>
            <div class="stat-chip">
                <div class="stat-lbl">⭐ Nilai SKP</div>
                <div class="stat-val gold">{row['Nilai SKP']}</div>
            </div>
        </div>
    </div>
    """


# ==================================================================
# MAIN APP
# ==================================================================
def main():
    st.set_page_config(
        page_title="EOM Selector — DKP Jatim",
        page_icon="🏆",
        layout="wide",
        initial_sidebar_state="collapsed"
    )
    set_css()

    # ── KIRI: Panel kontrol tetap (bukan sidebar Streamlit) ──────────
    left_col, right_col = st.columns([0.85, 3.15])

    with left_col:
        # Logo
        logo_html_content = "<span>🏆</span>"
        for ext in ["logo.png", "logo.jpg", "logo.jpeg"]:
            if os.path.exists(ext):
                with open(ext, "rb") as f:
                    b64 = base64.b64encode(f.read()).decode()
                mime = "jpeg" if ext.endswith(".jpg") or ext.endswith(".jpeg") else "png"
                logo_html_content = f'<img src="data:image/{mime};base64,{b64}" alt="logo">'
                break

        st.markdown(f"""
        <div class="panel-header">
            <div class="panel-logo-ring">{logo_html_content}</div>
            <div class="panel-title">EOM Candidate Selector</div>
            <div class="panel-subtitle">Dinas Kelautan dan Perikanan<br>Provinsi Jawa Timur</div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown('<div class="section-label">📁 File Rekap Usulan</div>', unsafe_allow_html=True)
        st.markdown('<div class="info-box">Unggah file Excel yang berisi data usulan kandidat EOM bulan ini.</div>', unsafe_allow_html=True)
        uploaded_file = st.file_uploader("Rekap Usulan", type=["xlsx","xls"], label_visibility="collapsed")
        if uploaded_file:
            st.success(f"✅ {uploaded_file.name}")

        st.markdown("<br>", unsafe_allow_html=True)
        st.markdown('<div class="section-label">🚫 Daftar Blacklist</div>', unsafe_allow_html=True)
        st.markdown('<div class="info-box">Nama dikecualikan bulan ini. Pisahkan dengan koma/enter. Huruf besar/kecil tidak masalah.</div>', unsafe_allow_html=True)
        blacklist_input = st.text_area(
            "Blacklist",
            placeholder="Contoh:\nBudi Santoso\nSITI AMINAH",
            height=100,
            label_visibility="collapsed"
        )

        st.markdown("<br>", unsafe_allow_html=True)
        process_clicked = st.button("🚀  Mulai Analisis Kandidat", use_container_width=True)

        st.markdown("""
        <div class="criteria-list" style="margin-top:1.2rem;">
            <div class="cr-title">📊 Kriteria Seleksi</div>
            <div class="cr-item"><div class="cr-num">1</div> Evidence score tertinggi</div>
            <div class="cr-item"><div class="cr-num">2</div> Total penalti terendah</div>
            <div class="cr-item"><div class="cr-num">3</div> Kehadiran terbanyak</div>
            <div class="cr-item"><div class="cr-num">4</div> Nilai SKP tertinggi</div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown('</div>', unsafe_allow_html=True)

    # ── KANAN: Konten utama ──────────────────────────────────────────
    with right_col:
        st.markdown("""
        <div class="top-bar">
            <div class="top-bar-title">Dashboard Seleksi Employee of the Month</div>
            <div class="top-badge">DKP Jawa Timur</div>
        </div>
        """, unsafe_allow_html=True)

        if not process_clicked or uploaded_file is None:
            st.markdown("""
            <div class="hero">
                <div class="hero-icon">🏆</div>
                <h2>Selamat Datang, Panitia EOM!</h2>
                <p>Unggah file Rekap Usulan dan masukkan daftar blacklist di panel kiri, kemudian klik <strong>Mulai Analisis</strong> untuk melihat 3 kandidat terbaik per kategori secara otomatis.</p>
            </div>
            """, unsafe_allow_html=True)
            if process_clicked and uploaded_file is None:
                st.error("⚠️ Harap unggah file Excel Rekap Usulan terlebih dahulu.")
            return

        with st.spinner("🔄 Menganalisis data kandidat..."):
            try:
                df_clean = process_data(uploaded_file, blacklist_input)

                if df_clean is None or df_clean.empty:
                    st.warning("⚠️ Tidak ada kandidat valid yang ditemukan setelah proses filter.")
                    return

                categories = df_clean['Kategori'].unique()
                st.markdown(f"""
                <div class="results-container">
                    <div class="results-hero">
                        <h2>🌟 Hasil Seleksi Kandidat EOM</h2>
                        <p>{len(categories)} Kategori Terdeteksi &nbsp;·&nbsp; 3 Kandidat Terbaik per Kategori</p>
                    </div>
                </div>
                """, unsafe_allow_html=True)

                final_results_list = []

                for idx, cat in enumerate(categories):
                    cat_icons = ["🎯","🌊","🐟","⚓","🧭","🌿","🦈","🏅"]
                    icon = cat_icons[idx % len(cat_icons)]

                    df_cat = df_clean[df_clean['Kategori'] == cat].copy()
                    df_cat.sort_values(
                        by=["Evidence", "Total Penalti", "Kehadiran (hari)", "Nilai SKP"],
                        ascending=[False, True, False, False],
                        inplace=True
                    )
                    top_3 = df_cat.head(3).copy()
                    top_3.insert(0, "Peringkat", range(1, len(top_3) + 1))
                    final_results_list.append(top_3)

                    st.markdown(f"""
                    <div class="cat-header" style="padding: 0 2rem;">
                        <div class="cat-icon-box">{icon}</div>
                        <div class="cat-name">{cat}</div>
                        <div class="cat-pill">3 Kandidat</div>
                    </div>
                    """, unsafe_allow_html=True)

                    cols = st.columns(3, gap="small")
                    for i, (_, row_data) in enumerate(top_3.iterrows()):
                        with cols[i]:
                            st.markdown(card_html(row_data, int(row_data['Peringkat'])), unsafe_allow_html=True)

                # Export
                df_export = pd.concat(final_results_list, ignore_index=True)
                output = io.BytesIO()
                with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
                    df_export.to_excel(writer, index=False, sheet_name='Hasil Seleksi EOM')
                excel_data = output.getvalue()

                st.markdown("""
                <div style="padding: 0 2rem;">
                <div class="export-wrap">
                    <h4>📥 Rekap Hasil Seleksi Siap Diunduh</h4>
                    <p>Seluruh kategori dan 3 kandidat terbaik dari masing-masing kategori sudah tergabung dalam satu file Excel.</p>
                </div>
                </div>
                """, unsafe_allow_html=True)

                exp1, exp2, exp3 = st.columns([1, 2, 1])
                with exp2:
                    st.download_button(
                        label="📥  Ekspor ke Excel (.xlsx)",
                        data=excel_data,
                        file_name="Hasil_Seleksi_EOM.xlsx",
                        mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        use_container_width=True
                    )

            except Exception as e:
                st.error(f"❌ Terjadi kesalahan: {e}")


if __name__ == "__main__":
    main()
