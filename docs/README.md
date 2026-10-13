# 📚 Dokumentasi Pengembangan Proyek Koneksa

Selamat datang di pusat dokumentasi teknis platform **Koneksa**. Direktori ini dirancang sebagai panduan terpadu bagi seluruh tim pengembang (*developers*) dalam memahami arsitektur proyek, alur kerja penambahan fitur baru, konvensi kode, serta standar dokumentasi fitur yang wajib dipatuhi.

---

## 🗺️ Peta Struktur Dokumentasi

```
docs/
├── README.md                     # [Anda di sini] Gambaran umum & indeks dokumentasi
├── DEVELOPMENT_GUIDE.md          # Panduan langkah-demi-langkah menambah fitur baru
├── CODING_STANDARDS.md           # Standar konvensi kode (Laravel, React, Tailwind)
├── templates/
│   └── FEATURE_DOC_TEMPLATE.md   # Template wajib dokumentasi fitur tiap developer
└── features/                     # Folder penyimpanan dokumentasi fitur dari tiap developer
    ├── README.md                 # Petunjuk penamaan dan penyimpanan dokumentasi fitur
    └── .gitkeep
```

---

## 🚀 Ringkasan Tumpukan Teknologi (Tech Stack)

Aplikasi dibangun menggunakan pola arsitektur **Monolith Modern (Inertia.js Monolith)**:
- **Backend Framework**: [Laravel 12.x / 13.x](https://laravel.com) (PHP 8.3+)
- **Adapter SPA**: [Inertia.js v2 / v3](https://inertiajs.com) (Server & Client Adapter)
- **Frontend Framework**: [React 19](https://react.dev)
- **Bundler & Tooling**: [Vite](https://vitejs.dev) + `@vitejs/plugin-react`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + `@tailwindcss/vite`
- **Database**: SQLite (Development) / MySQL / PostgreSQL (Production)

---

## ⚡ Panduan Cepat Menjalankan Proyek (Quick Start)

Untuk developer baru yang baru saja mengkloning repositori:

```bash
# 1. Masuk ke direktori proyek
cd koneksa

# 2. Salin environment & instal dependensi PHP
cp .env.example .env
composer install

# 3. Generate Application Key
php artisan key:generate

# 4. Instal dependensi Node.js
npm install

# 5. Jalankan migrasi database
php artisan migrate

# 6. Jalankan server lokal (gunakan 2 terminal terpisah)
# Terminal 1: Vite Frontend HMR
npm run dev

# Terminal 2: Laravel Development Server
php artisan serve
```

Aplikasi dapat diakses di browser pada: **`http://localhost:8000`**.

---

## 🛠️ Alur Singkat Penambahan Fitur

Setiap kali Anda ditugaskan mengembangkan fitur baru, ikuti tahapan utama berikut:

```
[Buat Git Branch] ──> [Migration & Model] ──> [Controller & Route] 
         │
         ▼
[React Page & UI] ──> [Test Lokal & Build] ──> [Tulis Dokumen Fitur di docs/features/]
         │
         ▼
[Commit & Push]  ──> [Buat Pull Request]
```

> 📖 **Pelajari panduan detail langkah-demi-langkah di:**  
> 👉 [Panduan Pengembangan Fitur (DEVELOPMENT_GUIDE.md)](./DEVELOPMENT_GUIDE.md)

---

## 📝 Kewajiban Setiap Developer: Dokumentasi Fitur

Setiap developer yang menyelesaikan suatu fitur **wajib** membuat satu berkas dokumentasi di dalam folder [`docs/features/`](./features/):
1. Salin template dari [`docs/templates/FEATURE_DOC_TEMPLATE.md`](./templates/FEATURE_DOC_TEMPLATE.md).
2. Simpan di folder `docs/features/` dengan format nama: `<nama-fitur>.md` (contoh: `manajemen-produk.md`, `otentikasi-pengguna.md`).
3. Isi rincian fitur, perubahan database, endpoint/route, screenshot tampilan, dan skenario pengujian yang sudah dilakukan.
4. Sertakan berkas dokumentasi tersebut di dalam Pull Request Anda.

---

## 📋 Checklist Sebelum Mengajukan Pull Request (PR)

Pastikan semua poin di bawah ini terpenuhi sebelum meminta review PR:
- [ ] Kode mengikuti standar konvensi di [CODING_STANDARDS.md](./CODING_STANDARDS.md).
- [ ] Validasi form dibuat di sisi backend menggunakan `FormRequest`.
- [ ] `npm run build` berhasil tanpa warning atau error kompilasi.
- [ ] Tidak ada berkas sampah atau console.log debugging yang tertinggal.
- [ ] Berkas dokumentasi fitur telah dibuat di `docs/features/<fitur-anda>.md` menggunakan template resmi.
- [ ] Pull Request memiliki deskripsi yang jelas dan mengacu pada issue/task terkait.
