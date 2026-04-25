# Web Story MBG vs Pendidikan

Web ScrollyTelling mengenai komparasi **Kebijakan Makan Bergizi Gratis (MBG)** dengan aspirasi masyarakat yang memilih dialihkan ke **Pendidikan Gratis**.

## Tech Stack
- D3.js  
- Scrollama.js  
- HTML/CSS  

---

## Data Source

Biaya MBG. (2026). *Ticker MBG*. Retrieved April 25, 2026, from https://biayambg.vercel.app  

Badan Kebijakan Pembangunan Kesehatan, Kementerian Kesehatan RI. (2023). *Statistik Kesehatan Indonesia (SKI) 2023 dalam angka*. Jakarta: BKPK Kemenkes.  

Badan Pusat Statistik. (2025). *Survei Sosial Ekonomi Nasional (Susenas) 2025*. Jakarta: BPS.  

Badan Gizi Nasional. (2026). *Operasional SPPG*. Retrieved April 25, 2026, from https://www.bgn.go.id/operasional-sppg  

Badan Pusat Statistik. (2025). *Rata-rata lama sekolah (RLS) 2025: Metode baru*. Retrieved April 25, 2026, from https://www.bps.go.id/id/statistics-table/2/NDE1IzI=/-metode-baru--rata-rata-lama-sekolah.html  

Badan Pusat Statistik. (2025). *Angka partisipasi sekolah (APS) 2025 menurut provinsi dan kelompok umur*. Retrieved April 25, 2026, from https://www.bps.go.id/id/statistics-table/2/MjIxMSMy/angka-partisipasi-sekolah--aps--menurut-provinsi-dan-kelompok-umur.html  

Badan Pusat Statistik. (2025, May 28). *Statistik penunjang pendidikan 2024*. Retrieved April 25, 2026, from https://www.bps.go.id/id/publication/2025/05/28/1d3b07ea55c4e8d8ce5d5859/statistik-penunjang-pendidikan-2024.htm  

Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. (2026). *Jumlah sekolah dasar dan menengah pertama*. Retrieved April 25, 2026, from https://referensi.data.kemendikdasmen.go.id/pendidikan/dikdas  

Badan Pusat Statistik. (2017). *Jumlah sekolah, guru, dan murid sekolah menengah atas (SMA) menurut provinsi, 2016–2017*. Retrieved April 25, 2026, from https://www.bps.go.id/id/statistics-table/3/YTFsRmNubEhOWE5ZTUZsdWVHOHhMMFpPWm5VMFp6MDkjMw==/jumlah-sekolah--guru--dan-murid-sekolah-menengah-atas--sma--di-bawah-kementerian-pendidikan-dan-kebudayaan-menurut-provinsi--2016-2017.html  

---

## Anggota, Peran, dan Tugas Spesifik

| Nama           | Peran          | Tugas Spesifik                                                                 |
|----------------|----------------|--------------------------------------------------------------------------------|
| Rifa Fairuz    | Data Architect | Mengubah CSV ke JSON. Menghitung korelasi asupan protein vs stunting di tiap provinsi agar siap dipanggil fungsi D3. |
| Abdul Hanif    | D3 Wizard      | Fokus di chart.js. Membuat fungsi `updateChart(stepIndex)`. Bertanggung jawab atas transisi dari Scatter Plot ke Peta. |
| Moses          | Scrolly Master | Fokus di main.js. Mengatur Scrollama.js untuk mendeteksi kapan teks di-scroll dan mengirimkan sinyal ke Orang 2. |
| Rolando        | Content & UI   | Fokus di index.html dan style.css. Menulis narasi kebijakan MBG vs Pendidikan dan mengatur tipografi agar estetik. |
| Muhlis Aditya  | GitHub Manager | Mengatur Repository, melakukan Merge Request, dan memastikan website tayang melalui GitHub Pages. |
