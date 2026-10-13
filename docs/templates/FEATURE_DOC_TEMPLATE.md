# 📋 [Nama Fitur]

> **Petunjuk Penggunaan:**  
> Salin (*copy*) seluruh isi berkas ini, buat berkas baru di dalam folder `docs/features/<nama-fitur>.md`, lalu isi setiap bagian di bawah ini sesuai dengan fitur yang Anda kerjakan. Hapus catatan petunjuk ini setelah selesai mengisi.

---

## 📌 Metadata Fitur

| Atribut | Informasi |
| :--- | :--- |
| **Nama Fitur** | *Contoh: Manajemen Katalog Produk & Kategori* |
| **Pengembang (Developer)** | *Nama Anda / @username-github* |
| **Branch Git** | `feat/<nama-fitur>` |
| **Pull Request (PR)** | *Tautan PR atau #nomor_pr (misal: #12)* |
| **Tanggal Penyelesaian** | *YYYY-MM-DD* |
| **Status** | `In Review` / `Approved` / `Merged` |

---

## 📖 Deskripsi & Latar Belakang

### 1. Ringkasan
*Jelaskan secara singkat apa fungsi dari fitur ini, mengapa fitur ini dibuat, dan apa manfaatnya bagi pengguna sistem.*

### 2. User Story
- **Sebagai** *[Peran Pengguna, misal: Kasir / Manajer Warung]*
- **Saya ingin** *[Tindakan yang ingin dilakukan]*
- **Sehingga** *[Tujuan / Nilai tambah yang diperoleh]*

---

## 🔄 Alur Kerja Pengguna (User Flow)

*Uraikan alur langkah demi langkah yang dialami pengguna saat menggunakan fitur ini:*
1. Pengguna membuka menu *[Nama Menu]* pada navigasi sidebar.
2. Sistem menampilkan tabel daftar data lengkap dengan tombol aksi *[Tambah / Ubah / Hapus]*.
3. Pengguna menekan tombol *Tambah*, lalu mengisi formulir yang disediakan.
4. Pengguna menekan tombol *Simpan*. Sistem melakukan validasi dan menyimpan data.
5. Notifikasi sukses muncul dan pengguna diarahkan kembali ke halaman daftar data yang terbarui.

---

## 🗄️ Perubahan Database & Backend

### 1. Skema Database / Migrasi
*Sebutkan migrasi yang dibuat atau diubah:*
- **Tabel**: `products`
  - `name` (string, max: 255) — Nama produk
  - `price` (decimal, 12, 2) — Harga jual
  - `stock` (integer) — Jumlah stok tersedia
  - `category_id` (foreignId -> `categories.id`) — Relasi kategori

### 2. Model & Relasi
- `App\Models\Product`
  - Relasi `category()`: BelongsTo ke `Category`
  - Relasi `orderItems()`: HasMany ke `OrderItem`

### 3. Routing & Endpoint Controller

| HTTP Method | URL Path | Controller & Method | Middleware | Deskripsi |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/products` | `ProductController@index` | `auth` | Menampilkan katalog produk |
| `GET` | `/products/create` | `ProductController@create` | `auth` | Formulir tambah produk |
| `POST` | `/products` | `ProductController@store` | `auth` | Menyimpan data produk baru |
| `GET` | `/products/{id}/edit` | `ProductController@edit` | `auth` | Formulir edit produk |
| `PUT` | `/products/{id}` | `ProductController@update` | `auth` | Memperbarui data produk |
| `DELETE` | `/products/{id}` | `ProductController@destroy` | `auth` | Menghapus produk |

### 4. Form Request & Aturan Validasi
- **`App\Http\Requests\StoreProductRequest`**:
  - `name`: `required|string|max:255`
  - `price`: `required|numeric|min:0`
  - `stock`: `required|integer|min:0`
  - `category_id`: `required|exists:categories,id`

---

## 💻 Komponen & Tampilan Frontend (React + Inertia)

### 1. Halaman (Pages)
- `resources/js/Pages/Products/Index.jsx`: Tampilan tabel data, filter kategori, dan pagination.
- `resources/js/Pages/Products/Create.jsx`: Halaman form tambah produk.
- `resources/js/Pages/Products/Edit.jsx`: Halaman form ubah data produk.

### 2. Komponen Pendukung (Reusable Components)
- `resources/js/Components/Products/ProductCard.jsx`: Kartu ringkasan produk.
- `resources/js/Components/Form/MoneyInput.jsx`: Input harga terformat Rupiah otomatis.

### 3. Props Utama yang Diterima dari Controller
- `products`: Objek pagination dari Laravel (`data`, `links`, `current_page`, dll).
- `categories`: Array daftar kategori untuk dropdown select.

---

## 🧪 Skenario Pengujian Manual (Manual Test Cases)

| No | Skenario Pengujian | Langkah Pengujian | Hasil yang Diharapkan | Status (Pass/Fail) |
| :-: | :--- | :--- | :--- | :-: |
| 1 | Menampilkan daftar produk | Akses `/products` dengan akun terotentikasi | Data produk tampil rapi beserta pagination | `Pass` |
| 2 | Tambah produk valid | Isi form lengkap dengan input valid lalu klik Simpan | Data tersimpan, pesan sukses muncul, redirect ke daftar | `Pass` |
| 3 | Validasi input kosong | Kosongkan field wajib lalu klik Simpan | Form tidak terkirim, pesan error merah muncul di field terkait | `Pass` |
| 4 | Validasi angka negatif | Masukkan harga `-5000` | Muncul pesan error harga tidak boleh kurang dari 0 | `Pass` |
| 5 | Hapus produk | Klik tombol Hapus pada baris produk | Dialog konfirmasi muncul, setelah konfirmasi data terhapus | `Pass` |

---

## 📸 Tangkapan Layar (Screenshots) / Bukti Tampilan

*Sertakan tangkapan layar tampilan halaman atau aksi fitur di sini. Anda dapat menyimpan gambar di folder aset atau paste link gambar.*

### Tampilan Utama / Halaman Daftar
*(Tambahkan gambar screenshot di sini)*

### Tampilan Formulir / Modal
*(Tambahkan gambar screenshot di sini)*

### Tampilan Pesan Validasi / Feedback Error
*(Tambahkan gambar screenshot di sini)*

---

## ⚠️ Catatan Khusus & Penanganan Kendala (Edge Cases)

- *Apakah ada konfigurasi `.env` baru yang wajib ditambahkan tim lain? (Contoh: API key baru, queue driver)*
- *Apakah ada batasan akses atau permission role khusus?*
- *Apakah ada potensi isu performa jika data membesar (misal: butuh indeks database)?*
