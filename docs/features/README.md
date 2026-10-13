# 📂 Dokumentasi Fitur Developer

Folder ini digunakan oleh seluruh tim pengembang (*developers*) untuk menyimpan berkas dokumentasi resmi dari setiap fitur yang selesai dikembangkan pada platform **Koneksa**.

---

## 📌 Aturan & Tata Cara Bagi Developer

Setiap kali Anda menyelesaikan pengerjaan fitur baru atau modifikasi fitur yang signifikan, ikuti 4 langkah wajib berikut:

### 1. Salin Berkas Template
Salin template dokumentasi yang telah disediakan:
```bash
# Contoh jika posisi terminal Anda ada di root direktori proyek koneksa:
cp docs/templates/FEATURE_DOC_TEMPLATE.md docs/features/nama-fitur-anda.md
```

### 2. Standar Format Penamaan Berkas
- Gunakan huruf kecil (*kebab-case*) yang deskriptif dan dipisahkan tanda strip (`-`).
- Jangan gunakan spasi atau karakter spesial.
- **Contoh Penamaan yang Benar:**
  - `manajemen-produk.md`
  - `kasir-point-of-sale.md`
  - `laporan-penjualan.md`
  - `otentikasi-role-permission.md`
- **Contoh Penamaan yang Salah:**
  - `Fitur Baru.md`
  - `dokumentasi.md`
  - `feat_andi_1.md`

### 3. Isi Seluruh Bagian Template
Buka berkas baru Anda dan isi selengkap mungkin:
- **Metadata**: Nama Anda, nama branch Git, status, dan link PR.
- **User Story & Alur Kerja**: Jelaskan apa yang dilakukan fitur ini dan bagaimana pengguna berinteraksi dengannya.
- **Perubahan Backend**: Tabel/migrasi baru, model, relasi, route HTTP, dan validasi form request.
- **Perubahan Frontend**: Halaman (`Pages/`), komponen (`Components/`), dan props yang diterima dari controller.
- **Pengujian Manual**: Tabel skenario pengujian yang sudah Anda coba di lokal.
- **Tangkapan Layar (Screenshots)**: Bukti tampilan UI yang sudah berfungsi baik.

### 4. Masukkan ke Commit & Pull Request
Pastikan berkas dokumentasi Anda ikut di-commit ke dalam Git branch fitur Anda:
```bash
git add docs/features/nama-fitur-anda.md
git commit -m "docs: tambah dokumentasi fitur nama-fitur"
git push origin feat/nama-fitur
```

Reviewer dan Tech Lead akan memeriksa berkas dokumentasi ini sebagai bagian dari kriteria penerimaan (*acceptance criteria*) sebelum Pull Request Anda di-merge ke branch `main`/`develop`.

---

## 🗂️ Indeks Fitur yang Telah Terdaftar

*(Pengembang dipersilakan menambahkan tautan dokumentasi fitur masing-masing ke daftar di bawah ini setelah PR di-merge)*

| Tanggal | Nama Fitur | Berkas Dokumentasi | Penanggung Jawab | Status |
| :---: | :--- | :--- | :--- | :---: |
| *Contoh* | *Katalog & Kategori Produk* | [katalog-produk.md](./katalog-produk.md) | *@developer* | `Merged` |
