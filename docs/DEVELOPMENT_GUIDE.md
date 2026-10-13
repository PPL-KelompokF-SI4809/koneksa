# 🚀 Panduan Pengembangan Fitur Baru (Feature Development Guide)

Panduan ini ditujukan bagi seluruh developer di tim **Koneksa** sebagai standar operasional prosedur (SOP) saat mengembangkan fitur baru, mulai dari inisiasi branch hingga pembuatan Pull Request (PR).

---

## 📑 Daftar Isi
1. [Tahap 1: Git Branching](#tahap-1-git-branching)
2. [Tahap 2: Backend - Skema Database & Model](#tahap-2-backend---skema-database--model)
3. [Tahap 3: Backend - Validasi & Controller Inertia](#tahap-3-backend---validasi--controller-inertia)
4. [Tahap 4: Backend - Routing](#tahap-4-backend---routing)
5. [Tahap 5: Frontend - Komponen Halaman React Inertia](#tahap-5-frontend---komponen-halaman-react-inertia)
6. [Tahap 6: Frontend - Pengelolaan Form & Interaksi State](#tahap-6-frontend---pengelolaan-form--interaksi-state)
7. [Tahap 7: Pengujian & Verifikasi Build](#tahap-7-pengujian--verifikasi-build)
8. [Tahap 8: Pembuatan Dokumentasi Fitur](#tahap-8-pembuatan-dokumentasi-fitur)
9. [Tahap 9: Commit & Pull Request](#tahap-9-commit--pull-request)

---

## Tahap 1: Git Branching

1. Selalu tarik kode terbaru dari branch utama (`main`):
   ```bash
   git checkout main
   git pull origin main
   ```
2. Buat branch baru dengan format penamaan standar:
   - Fitur baru: `feat/<nama-fitur>`
   - Perbaikan bug: `fix/<nama-bug>`
   - Refaktor: `refactor/<nama-bagian>`

   *Contoh:*
   ```bash
   git checkout -b feat/manajemen-produk
   ```

---

## Tahap 2: Backend - Skema Database & Model

Jika fitur membutuhkan penyimpanan data baru:

### 1. Buat Model & Migration
Gunakan artisan untuk membuat Model sekaligus berkas migrasi:
```bash
php artisan make:model Product -m
```

### 2. Definisikan Skema di Migration
Buka file migrasi di `database/migrations/xxxx_create_products_table.php`:
```php
public function up(): void
{
    Schema::create('products', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->string('name');
        $table->decimal('price', 15, 2);
        $table->integer('stock')->default(0);
        $table->string('category')->default('Umum');
        $table->timestamps();
    });
}
```

### 3. Konfigurasi Model Eloquent
Buka `app/Models/Product.php` dan tentukan `$fillable` serta relasinya:
```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'price',
        'stock',
        'category',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

### 4. Eksekusi Migrasi
```bash
php artisan migrate
```

---

## Tahap 3: Backend - Validasi & Controller Inertia

### 1. Buat Form Request (Wajib untuk Validasi)
Jangan menaruh validasi mentah di Controller. Gunakan FormRequest:
```bash
php artisan make:request StoreProductRequest
```
Isi aturan validasi di `app/Http/Requests/StoreProductRequest.php`:
```php
public function authorize(): bool
{
    return true; // Sesuaikan kebijakan akses jika diperlukan
}

public function rules(): array
{
    return [
        'name' => ['required', 'string', 'max:255'],
        'price' => ['required', 'numeric', 'min:0'],
        'stock' => ['required', 'integer', 'min:0'],
        'category' => ['nullable', 'string', 'max:100'],
    ];
}
```

### 2. Buat Controller
Gunakan artisan untuk membuat resource controller:
```bash
php artisan make:controller ProductController
```

### 3. Implementasikan Logika Controller dengan Inertia
Di dalam `app/Http/Controllers/ProductController.php`:
```php
namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ProductController extends Controller
{
    // Menampilkan daftar data (GET)
    public function index(): Response
    {
        $products = Product::where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
        ]);
    }

    // Menyimpan data baru (POST)
    public function store(StoreProductRequest $request): RedirectResponse
    {
        $request->user()->products()->create($request->validated());

        return redirect()->route('products.index')->with('success', 'Produk berhasil ditambahkan.');
    }
}
```

> [!TIP]
> **Aturan Inertia Controller:**
> - Untuk menampilkan halaman: selalu return `Inertia::render('NamaKomponen', [ 'props' => $data ])`.
> - Untuk mutasi data (POST/PUT/DELETE): selalu return `redirect()` (misal `redirect()->back()` atau `redirect()->route(...)`). Inertia akan secara otomatis memperbarui data di sisi frontend tanpa reload browser!

---

## Tahap 4: Backend - Routing

Daftarkan rute di `routes/web.php`:
```php
use App\Http\Controllers\ProductController;

Route::middleware(['auth'])->group(function () {
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
});
```

---

## Tahap 5: Frontend - Komponen Halaman React Inertia

Semua halaman view yang dipanggil oleh `Inertia::render('NamaFolder/NamaFile')` diletakkan di dalam folder `resources/js/Pages/`.

*Contoh struktur:*
```
resources/js/
├── Pages/
│   └── Products/
│       ├── Index.jsx       # Dipanggil oleh Inertia::render('Products/Index')
│       └── Create.jsx      # Dipanggil oleh Inertia::render('Products/Create')
```

### Format Dasar Komponen Halaman (`resources/js/Pages/Products/Index.jsx`):
```jsx
import { Head, Link } from '@inertiajs/react';

export default function Index({ products }) {
    return (
        <>
            <Head title="Manajemen Produk" />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Daftar Produk
                    </h1>
                    <Link
                        href="/products/create"
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium text-sm transition"
                    >
                        + Tambah Produk
                    </Link>
                </div>

                {/* Render Data Produk */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <div key={product.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-emerald-500 font-bold">Rp {new Intl.NumberFormat('id-ID').format(product.price)}</p>
                            <span className="text-xs text-gray-500">Stok: {product.stock}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
```

---

## Tahap 6: Frontend - Pengelolaan Form & Interaksi State

Untuk formulir input data, **wajib menggunakan hook `useForm` dari `@inertiajs/react`**. Hook ini mengelola data, pengiriman AJAX, status `processing`, dan error validasi secara otomatis.

*Contoh Form Tambah Produk:*
```jsx
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        price: '',
        stock: '',
        category: 'Umum',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/products', {
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
            <div>
                <label className="block text-sm font-medium mb-1">Nama Produk</label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Harga</label>
                <input
                    type="number"
                    value={data.price}
                    onChange={(e) => setData('price', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            <button
                type="submit"
                disabled={processing}
                className="w-full py-2.5 bg-emerald-500 text-white font-medium rounded-lg disabled:opacity-50"
            >
                {processing ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
        </form>
    );
}
```

---

## Tahap 7: Pengujian & Verifikasi Build

Sebelum melakukan commit, lakukan 3 langkah pengujian wajib berikut:

1. **Uji Fungsionalitas di Browser**:
   Pastikan alur create, read, update, delete (CRUD) berfungsi normal tanpa error 4xx atau 5xx.
2. **Uji Validasi Form**:
   Pastikan input kosong atau format salah menampilkan pesan error validasi dengan benar.
3. **Uji Build Frontend (Wajib)**:
   ```bash
   npm run build
   ```
   *Pastikan Vite mengompilasi seluruh file bundle tanpa ada syntax error, unresolved import, atau issue lainnya.*

---

## Tahap 8: Pembuatan Dokumentasi Fitur

Setiap developer **wajib** mendokumentasikan fitur yang dibuatnya:

1. Buka berkas template di [`docs/templates/FEATURE_DOC_TEMPLATE.md`](./templates/FEATURE_DOC_TEMPLATE.md).
2. Salin isi template tersebut ke berkas baru di folder `docs/features/<nama-fitur>.md`.
   *(Contoh: `docs/features/manajemen-produk.md`)*
3. Lengkapi setiap bagian template:
   - Nama developer & tanggal pengerjaan.
   - Ringkasan fitur dan kebutuhan bisnis.
   - Endpoint/Route baru yang dibuat.
   - Perubahan skema tabel/database.
   - Hasil pengujian manual & tangkapan layar (screenshot).

---

## Tahap 9: Commit & Pull Request

1. Periksa berkas yang diubah:
   ```bash
   git status
   ```
2. Tambahkan berkas dan gunakan konvensi pesan commit standar:
   ```bash
   git add .
   git commit -m "feat(product): add product management with inertia form handling"
   ```
3. Push branch ke repository remote:
   ```bash
   git push origin feat/manajemen-produk
   ```
4. Buka GitHub/GitLab dan buat **Pull Request (PR)**:
   - Berikan deskripsi ringkas mengenai apa yang diubah.
   - Cantumkan tautan ke berkas dokumentasi fitur: `docs/features/<nama-fitur>.md`.
   - Minta minimal 1 rekan tim (*peer review*) untuk mereview kode sebelum dilakukan merge ke `main`.
