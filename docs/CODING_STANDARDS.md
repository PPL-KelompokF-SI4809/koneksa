# 📐 Standar Konvensi Kode (Coding Standards)

Dokumen ini mendefinisikan standar penulisan kode, konvensi penamaan, dan praktik terbaik (*best practices*) yang berlaku di seluruh repositori **Koneksa**. Tujuannya adalah memastikan basis kode tetap bersih, konsisten, mudah dibaca (*readable*), dan mudah dirawat (*maintainable*) oleh seluruh tim pengembang.

---

## 🎯 Prinsip Utama

1. **Konsistensi**: Kode yang ditulis oleh pengembang A harus memiliki gaya dan struktur yang serupa dengan kode yang ditulis oleh pengembang B.
2. **Keterbacaan**: Kode dibaca jauh lebih sering daripada ditulis. Buat nama variabel, fungsi, dan kelas sejelas mungkin.
3. **Pemisahan Tanggung Jawab (*Separation of Concerns*)**:
   - Backend: Controller hanya mengatur alur data dan respon, validasi di FormRequest, dan logika bisnis kompleks di Service/Action.
   - Frontend: Page hanya menyusun tampilan dan menerima props dari Inertia, logic reusable diekstrak ke Hooks/Components.
4. **Keamanan Default**: Selalu validasi dan sanitasi input pengguna, gunakan Eloquent binding, dan gunakan otorisasi (Policy/Gate).

---

## 🐘 Standar Backend (PHP & Laravel)

### 1. Konvensi Penamaan (Naming Conventions)

| Komponen | Format | Contoh | Keterangan |
| :--- | :--- | :--- | :--- |
| **Model** | PascalCase, Singular | `Product`, `OrderItem`, `Supplier` | Mewakili entitas tunggal |
| **Tabel Database** | snake_case, Plural | `products`, `order_items`, `suppliers` | Jamak sesuai konvensi Laravel |
| **Migration** | snake_case deskriptif | `create_products_table`, `add_status_to_orders_table` | Menyatakan aksi migrasi |
| **Controller** | PascalCase + `Controller` | `ProductController`, `OrderReportController` | Singular + suffix `Controller` |
| **Form Request** | PascalCase + `Request` | `StoreProductRequest`, `UpdateProductRequest` | Menyatakan aksi validasi |
| **Policy** | PascalCase + `Policy` | `ProductPolicy`, `OrderPolicy` | Terikat pada Model terkait |
| **Resource / Seeder** | PascalCase + Suffix | `ProductSeeder`, `OrderResource` | Mengikuti nama model |
| **Fungsi / Method** | camelCase | `calculateTotal()`, `getActiveUsers()` | Gunakan kata kerja |
| **Variabel** | camelCase | `$productPrice`, `$customerList` | Deskriptif, hindari `$p`, `$x` |

### 2. Struktur Controller & Response Inertia

Controller harus tetap ramping (**Thin Controller**).

- **Gunakan Form Request untuk Validasi**: Hindari menulis `$request->validate([...])` langsung di dalam method controller untuk validasi yang memiliki lebih dari 2 atribut.
- **Render Inertia**: Gunakan `Inertia::render('Folder/NamaPage', $props)`.
- **Redirect dengan Flash Message**: Setelah aksi create/update/delete, lakukan redirect dengan pesan flash session.

```php
// ✅ BAIK: Ramping, terstruktur, validasi terisolasi
namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Requests\StoreProductRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::query()
            ->latest()
            ->paginate(15);

        return Inertia::render('Products/Index', [
            'products' => $products,
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        Product::create($request->validated());

        return redirect()
            ->route('products.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }
}
```

```php
// ❌ BURUK: Gemuk, validasi di dalam controller, logika tercampur
public function store(Request $request)
{
    $request->validate([
        'name' => 'required',
        'price' => 'required|numeric'
    ]);
    
    // Logika perhitungan panjang di controller...
    
    return redirect()->back(); // Tanpa flash message yang jelas
}
```

### 3. Form Request

Pisahkan logika validasi dan pesan kustom ke dalam kelas `FormRequest`:

```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Atau gunakan $this->user()->can('create', Product::class)
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama produk wajib diisi.',
            'price.min' => 'Harga produk tidak boleh kurang dari 0.',
        ];
    }
}
```

### 4. Database & Eloquent

- Selalu definisikan tipe relasi di Model:
  ```php
  public function category(): BelongsTo
  {
      return $this->belongsTo(Category::class);
  }

  public function orderItems(): HasMany
  {
      return $this->hasMany(OrderItem::class);
  }
  ```
- Hindari **N+1 Query Problem**: Gunakan Eager Loading saat mengambil data relasional yang akan dikirim ke view:
  ```php
  // ✅ BAIK
  $orders = Order::with(['customer', 'items'])->latest()->paginate(10);

  // ❌ BURUK (N+1 Query)
  $orders = Order::all(); // Lalu diakses $order->customer->name di frontend
  ```
- Gunakan Database Transaction (`DB::transaction`) untuk mutasi data yang melibatkan lebih dari satu tabel:
  ```php
  DB::transaction(function () use ($validatedData) {
      $order = Order::create([...]);
      $order->items()->createMany([...]);
  });
  ```

---

## ⚛️ Standar Frontend (React & Inertia.js)

### 1. Struktur Folder `resources/js/`

```
resources/js/
├── app.jsx                  # Entry point Inertia
├── bootstrap.js             # Konfigurasi axios / global libs
├── Components/              # Komponen UI umum yang reusable
│   ├── Button.jsx
│   ├── Modal.jsx
│   ├── Input.jsx
│   └── Table.jsx
├── Layouts/                 # Layout bersama (Sidebar, Navbar, Footer)
│   ├── AppLayout.jsx
│   └── AuthLayout.jsx
├── Pages/                   # Halaman yang dipanggil oleh Inertia::render()
│   ├── Dashboard.jsx
│   ├── Products/
│   │   ├── Index.jsx
│   │   ├── Create.jsx
│   │   └── Edit.jsx
│   └── Orders/
│       └── Index.jsx
└── utils/                   # Fungsi bantuan (formatters, helpers)
    └── currency.js
```

### 2. Konvensi Penamaan Komponen & Berkas

- **Berkas & Komponen React**: Gunakan `PascalCase` (`ProductCard.jsx`, `AppLayout.jsx`).
- **Props**: Gunakan `camelCase` (`productId`, `onSuccessCallback`).
- **Fungsi / Event Handler**: Gunakan awalan `handle` atau `on` (`handleSubmit`, `handleClick`).
- **Custom Hooks**: Gunakan awalan `use` (`useCurrencyFormatter.js`).

### 3. Penggunaan Inertia `useForm`

Selalu gunakan hook `useForm` dari `@inertiajs/react` untuk mengelola input, error validasi, dan pengiriman form.

```jsx
// ✅ BAIK: Penanganan form standar Inertia
import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function CreateProduct() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        price: '',
        stock: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/products', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout>
            <Head title="Tambah Produk" />

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                >
                    {processing ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
            </form>
        </AppLayout>
    );
}
```

### 4. Navigasi SPA & Title Halaman

- **Gunakan `<Link>`**: Jangan gunakan tag `<a href="...">` biasa untuk link internal karena akan memicu *full page reload*.
  ```jsx
  import { Link } from '@inertiajs/react';

  // ✅ BAIK
  <Link href="/products" className="text-blue-600 hover:underline">
      Daftar Produk
  </Link>
  ```
- **Gunakan `<Head>`**: Setiap halaman di folder `Pages/` wajib mendefinisikan `<Head title="..." />` agar tab browser menampilkan judul yang relevan.

---

## 🎨 Standar Desain & Styling (Tailwind CSS v4)

1. **Utility-First**: Gunakan kelas bawaan Tailwind CSS. Hindari menulis selector CSS kustom di file `.css` kecuali untuk kebutuhan `@theme` atau animasi kompleks.
2. **Desain Responsif (Mobile-First)**:
   - Mulai susunan dari tampilan mobile, lalu tambahkan breakpoint bertahap (`sm:`, `md:`, `lg:`, `xl:`).
   ```jsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
   ```
3. **Status Interaktif yang Jelas**:
   - Berikan feedback visual untuk interaksi: `hover:bg-blue-700`, `focus:ring-2 focus:ring-blue-500`, `disabled:opacity-50 disabled:cursor-not-allowed`.
4. **Hindari Duplikasi Ekstrem**:
   - Jika satu pola tombol atau kartu yang memiliki 15+ class Tailwind dipakai di 5 tempat berbeda, buat komponen React terpisah (misalnya `<Button variant="primary">`) daripada melakukan copy-paste class secara manual.

---

## 🌿 Standar Git & Komitmen Kode

### 1. Format Nama Branch

Gunakan prefix kategori dengan huruf kecil dan tanda strip (`-`):

- `feat/<nama-fitur>`: Penambahan fitur baru (contoh: `feat/manajemen-stok`)
- `fix/<nama-bug>`: Perbaikan bug atau galat (contoh: `fix/perhitungan-diskon`)
- `refactor/<nama-komponen>`: Perombakan struktur kode tanpa mengubah fungsionalitas (contoh: `refactor/order-controller`)
- `docs/<topik>`: Pembaruan atau penambahan dokumentasi (contoh: `docs/api-guide`)

### 2. Format Pesan Commit (Conventional Commits)

Format: `<type>: <deskripsi singkat dalam bahasa indonesia/inggris yang jelas>`

Contoh:
- `feat: tambah halaman create dan validasi form produk`
- `fix: atasi galat perhitungan ppn pada transaksi penjualan`
- `refactor: pisahkan logika kalkulasi diskon ke OrderService`
- `docs: tambahkan dokumentasi fitur kasir pada docs/features/kasir.md`
- `chore: perbarui dependensi npm dan vite plugin`

---

## 🧹 Kebersihan Kode Sebelum Mengajukan PR

Sebelum membuat Pull Request atau meminta review rekan tim:
1. **Hapus Debugging**: Pastikan tidak ada `dd()`, `dump()`, `ray()`, `var_dump()`, atau `console.log()` yang tertinggal.
2. **Hapus Unused Code**: Hapus import atau variabel yang tidak digunakan.
3. **Uji Build Frontend**: Jalankan `npm run build` di lokal dan pastikan kompilasi selesai dengan status sukses (*0 error*).
4. **Dokumentasikan Fitur**: Buat berkas ringkasan di `docs/features/<nama-fitur>.md` sesuai panduan template.
