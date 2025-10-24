# Personal Dashboard - Praktikum JavaScript Next Gen

Proyek ini dibuat untuk memenuhi tugas Praktikum 2: JavaScript Next Gen, mata kuliah Pemrograman Web.

Aplikasi ini dirancang untuk membantu pengguna mengelola jadwal kuliah dan tugas harian dalam satu antarmuka yang bersih.

## Screenshot Aplikasi

![Tampilan Aplikasi Personal Dashboard](https://github.com/nadshafy/Pemrograman_web_itera_123140167/blob/main/Nadya%20Shafwah%20Yusuf_123140167_pertemuan2/personaldashboard.png)

## Fitur-fitur Utama

Aplikasi ini memiliki beberapa fungsionalitas utama:

* **Kalender 7 Hari:** Menampilkan agenda (jadwal kuliah) dalam tampilan 7 hari ke depan, lengkap dengan bulan dan tahun saat ini.
* **Daftar Tugas (To-Do List):** Bagian terpisah untuk mencatat tugas dan *deadline*-nya.
* **Penyimpanan Lokal:** Semua data agenda dan tugas disimpan di `localStorage` browser, sehingga data tidak akan hilang saat halaman di-*refresh*.
* **Interaktivitas Penuh (CRUD):**
    * **Tambah:** Menambah agenda atau tugas baru melalui satu tombol `+` yang membuka modal (pop-up).
    * **Edit:** Mengubah data agenda atau tugas yang sudah ada.
    * **Hapus:** Menghapus agenda atau tugas.
* **Highlight Agenda:** Pengguna dapat memilih *highlight* warna (biru, pink, atau kuning) untuk setiap agenda agar mudah diidentifikasi.
* **Tandai Tugas Selesai:** Tugas dapat dicentang dan akan otomatis dicoret saat selesai.
* **Format Jam Kustom:** Jam agenda ditampilkan dalam format `HH.MM` (misal: `08.00 - 10.30`).

## Fitur ES6+ yang Diimplementasikan

1.  **`let` dan `const`**
    * Digunakan di seluruh kode untuk deklarasi variabel, menggantikan `var` untuk *scoping* yang lebih baik.

2.  **`Arrow Functions`**
    * Digunakan secara ekstensif untuk *event listener* (`openModalBtn.addEventListener('click', openModal)`) dan fungsi utilitas (seperti `getStorageData` dan `saveStorageData`).

3.  **`Template Literals`**
    * Digunakan untuk membuat blok HTML secara dinamis saat me-*render* kalender (`renderCalendar`) dan daftar tugas (`renderTasks`), membuatnya lebih mudah dibaca daripada konkatenasi string biasa.

4.  **`Classes`** 
    * Menggunakan dua *class*, yaitu `class Schedule` dan `class Task`, untuk membuat cetak biru (blueprint) objek. Ini membantu mengelola struktur data dengan lebih rapi.

5.  **Fungsi Asinkron (`Async/Await`)**
    * Diimplementasikan dalam fungsi `runMockDataSimulation` yang menggunakan `async` dan `await new Promise(...)`. Ini memenuhi syarat penggunaan fungsi asinkron untuk menangani operasi yang (disimulasikan) tidak instan.

Selain itu, aplikasi ini juga memenuhi syarat wajib penggunaan **`localStorage`**  untuk menyimpan dan mengelola data pengguna.

## Cara Menjalankan

1.  *Clone* atau *download* *repository* ini.
2.  Buka file `index.html` di browser web modern pilihan Anda (Chrome, Firefox, dll.).
3.  (Opsional) Disarankan menggunakan *extension* **Live Server** di VSCode untuk *hot-reloading* saat melakukan pengembangan.
