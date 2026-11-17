# StudyMate — Mini Web Deployment

StudyMate adalah website statis untuk membantu siswa menemukan teman belajar berdasarkan mata pelajaran dan gaya belajar.

## Fitur
- 5 halaman: Beranda, Cari Partner, Dashboard, Tentang, dan Kontak.
- Pencarian partner berdasarkan nama, kelas, atau mata pelajaran.
- Filter mata pelajaran.
- Simpan partner favorit menggunakan `localStorage`.
- Dashboard dengan target belajar, checklist progres, dan jadwal belajar.
- Ajak partner belajar melalui pintasan ke dashboard.
- Data target, jadwal, tema, dan favorit tersimpan menggunakan `localStorage`.
- Dark mode / light mode menggunakan `localStorage`.
- Validasi formulir kontak menggunakan JavaScript.
- Desain responsif untuk HP dan laptop.

## Teknologi
HTML5, CSS3, JavaScript (DOM), GitHub, dan Vercel.

## Struktur folder
```text
studymate/
├── index.html
├── find.html
├── dashboard.html
├── about.html
├── contact.html
├── README.md
└── assets/
    ├── style.css
    └── script.js
```

## Menjalankan secara lokal
1. Ekstrak folder proyek.
2. Buka folder `studymate` di Visual Studio Code.
3. Buka `index.html` di browser (disarankan memakai ekstensi Live Server).

## Deploy
1. Buat repository publik di GitHub.
2. Upload seluruh isi folder proyek ke repository.
3. Buka Vercel dan login menggunakan GitHub.
4. Pilih **Add New → Project**, lalu import repository `studymate`.
5. Untuk website statis ini, biarkan pengaturan build default dan klik **Deploy**.

## Catatan
Profil partner dan formulir kontak pada proyek ini merupakan simulasi. Website belum memakai backend atau database cloud.
