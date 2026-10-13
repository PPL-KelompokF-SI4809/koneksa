<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'title' => 'Selamat Datang di Koneksa',
        'description' => 'Platform terpadu untuk menghubungkan UMKM dengan Investor.',
        'laravelVersion' => app()->version(),
        'phpVersion' => PHP_VERSION,
    ]);
});
