== 1. Pengaturan Proyek
Proyek ini dibangun menggunakan Nest CLI, yang menyediakan struktur proyek standar dan _tooling_ yang diperlukan.

=== a. Instalasi Dependensi
Semua dependensi yang dibutuhkan, baik untuk _runtime_ maupun _development_, didefinisikan dalam file `package.json`. Untuk menginstal semuanya, jalankan perintah berikut di terminal:
npm install

Menjalankan Aplikasi: Jalankan server dalam mode pengembangan dengan hot-reload menggunakan:
npm run start:dev
Setelah dijalankan, server akan aktif dan mendengarkan permintaan di http://localhost:3000

=== Modul (Module)
AppModule (src/app.module.ts): Ini adalah modul akar (root module) dari aplikasi. Modul ini bertanggung jawab untuk mengimpor dan merakit semua modul fitur lainnya, termasuk UserModule.

UserModule (src/users/users.module.ts): Modul ini secara spesifik mengelompokkan semua komponen yang terkait dengan fungsionalitas pengguna, yaitu UserController dan UserService.

=== Kontroler (Controller)

UserController (src/users/users.controller.ts): Komponen ini bertanggung jawab untuk menangani permintaan HTTP yang masuk. Ia menggunakan decorators untuk memetakan rute URL dan metode HTTP (seperti @Get(), @Post(), @Put(), @Delete()) ke metode penangan (handler methods) yang sesuai. Tugasnya adalah menerima data dari klien, memvalidasinya, dan memanggil service yang relevan untuk menjalankan logika bisnis.

=== Layanan (Service)

UserService (src/users/users.service.ts): Di sinilah semua logika bisnis inti berada. UserService bertanggung jawab untuk mengelola data pengguna, seperti membuat, membaca, memperbarui, dan menghapus data. Dalam implementasi ini, data disimpan dalam sebuah in-memory array untuk menyimulasikan database, sama seperti pada proyek sebelumnya.

=== DTO dan Entitas

Entitas (src/users/entities/user.entity.ts): Ini adalah sebuah class yang mendefinisikan struktur data dari objek User.

DTO - Data Transfer Object (src/users/dto/): DTO digunakan untuk mendefinisikan "bentuk" data yang diterima dari permintaan klien.

CreateUserDto: Menggunakan decorators dari pustaka class-validator (seperti @IsString(), @IsInt(), @MaxLength()) untuk memastikan bahwa data yang dikirim untuk membuat pengguna baru valid.

== Konfigurasi Global
Dalam file src/main.ts, beberapa konfigurasi penting diterapkan secara global ke seluruh aplikasi:

ValidationPipe: Pipa ini secara otomatis memvalidasi semua body permintaan yang masuk terhadap aturan yang didefinisikan dalam DTO. Ini menyederhanakan validasi dan memastikan hanya data yang valid yang sampai ke logika bisnis Anda.

CORS: app.enableCors() dipanggil untuk mengizinkan permintaan dari origin yang berbeda, yang penting untuk API modern.

== Pengujian Aplikasi
Untuk memastikan semua fungsionalitas berjalan sesuai harapan, proyek ini dilengkapi dengan pengujian end-to-end (E2E).
Menjalankan Tes:
npm run test:e2e

File Tes (test/app.e2e-spec.ts): Tes ini menggunakan supertest untuk mengirim permintaan HTTP sungguhan ke aplikasi yang sedang berjalan dan memverifikasi bahwa respons yang diterima sudah benar. Ini adalah cara yang andal untuk memvalidasi fungsionalitas API secara keseluruhan.

NestJS lebih baik daripada pure NodeJS
Karena NestJS lebih unggul secara kecepatan dalam pembuatan karena sudah adanya template seperti routing berbasis decorator, validasi otomatis dengan ValidationPipe dan DTO, serta dependency injection secara drastis mengurangi jumlah kode yang harus ditulis.
