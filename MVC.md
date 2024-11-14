Berikut implementasi lengkap untuk entitas mahasiswa dengan struktur MVC:

```javascript:models/Mahasiswa.js
const db = require('../config/database');

class Mahasiswa {
  static getAll(callback) {
    db.all(
      `SELECT m.*, j.nama_jurusan 
       FROM mahasiswa m 
       LEFT JOIN jurusan j ON m.id_jurusan = j.id_jurusan`,
      callback
    );
  }

  static getByNIM(nim, callback) {
    db.get(
      `SELECT m.*, j.nama_jurusan 
       FROM mahasiswa m 
       LEFT JOIN jurusan j ON m.id_jurusan = j.id_jurusan 
       WHERE m.nim = ?`,
      [nim],
      callback
    );
  }

  static checkNIMExists(nim, callback) {
    db.get(
      "SELECT nim FROM mahasiswa WHERE nim = ?",
      [nim],
      callback
    );
  }

  static create(mahasiswaData, callback) {
    const { nim, nama, tanggal_lahir, alamat, id_jurusan } = mahasiswaData;
    db.run(
      `INSERT INTO mahasiswa (nim, nama, tanggal_lahir, alamat, id_jurusan) 
       VALUES (?, ?, ?, ?, ?)`,
      [nim, nama, tanggal_lahir, alamat, id_jurusan],
      callback
    );
  }

  static delete(nim, callback) {
    db.run(
      "DELETE FROM mahasiswa WHERE nim = ?",
      [nim],
      callback
    );
  }
}

module.exports = Mahasiswa;
```

```javascript:controllers/MahasiswaController.js
const Mahasiswa = require('../models/Mahasiswa');
const Jurusan = require('../models/Jurusan');
const MahasiswaView = require('../views/MahasiswaView');

class MahasiswaController {
  constructor(rl) {
    this.rl = rl;
  }

  show() {
    MahasiswaView.showMenu(this.rl, (choice) => {
      switch (choice) {
        case "1":
          this.listMahasiswa();
          break;
        case "2":
          this.cariMahasiswa();
          break;
        case "3":
          this.tambahMahasiswa();
          break;
        case "4":
          this.hapusMahasiswa();
          break;
        case "5":
          // Kembali ke menu utama
          return;
        default:
          console.log("Pilihan tidak valid");
          this.show();
      }
    });
  }

  listMahasiswa() {
    Mahasiswa.getAll((err, mahasiswa) => {
      if (err) {
        console.log(err);
        return this.show();
      }
      MahasiswaView.showList(mahasiswa);
      this.show();
    });
  }

  cariMahasiswa() {
    MahasiswaView.showSearchPrompt(this.rl, (nim) => {
      Mahasiswa.getByNIM(nim, (err, mahasiswa) => {
        if (err) {
          console.log(err);
          return this.show();
        }
        MahasiswaView.showDetail(mahasiswa);
        this.show();
      });
    });
  }

  tambahMahasiswa() {
    MahasiswaView.showAddForm(this.rl, (mahasiswaData) => {
      // Cek NIM duplikat
      Mahasiswa.checkNIMExists(mahasiswaData.nim, (err, existingMahasiswa) => {
        if (err) {
          console.log(err);
          return this.show();
        }

        if (existingMahasiswa) {
          console.log("NIM sudah terdaftar! Silahkan gunakan NIM lain.");
          return this.tambahMahasiswa();
        }

        // Ambil daftar jurusan untuk validasi
        Jurusan.getAll((err, jurusan) => {
          if (err) {
            console.log(err);
            return this.show();
          }

          MahasiswaView.showJurusanList(jurusan);
          
          MahasiswaView.showJurusanPrompt(this.rl, (kodeJurusan) => {
            mahasiswaData.id_jurusan = kodeJurusan;
            
            Mahasiswa.create(mahasiswaData, (err) => {
              if (err) {
                console.log(err);
                return this.show();
              }
              console.log("Mahasiswa telah ditambahkan ke dalam database");
              this.listMahasiswa();
            });
          });
        });
      });
    });
  }

  hapusMahasiswa() {
    MahasiswaView.showDeletePrompt(this.rl, (nim) => {
      Mahasiswa.delete(nim, (err) => {
        if (err) {
          console.log(err);
          return this.show();
        }
        console.log(`Mahasiswa dengan NIM ${nim} berhasil dihapus`);
        this.show();
      });
    });
  }
}

module.exports = MahasiswaController;
```

```javascript:views/MahasiswaView.js
const Table = require('cli-table3');

class MahasiswaView {
  static showMenu(rl, callback) {
    console.log("======================================");
    console.log("Silahkan pilih opsi dibawah ini: ");
    console.log("1. Daftar data mahasiswa");
    console.log("2. Cari data mahasiswa");
    console.log("3. Tambah data mahasiswa");
    console.log("4. Hapus data mahasiswa");
    console.log("5. Kembali ke menu utama");
    console.log("======================================");

    rl.question("Masukkan salah satu nomor dari opsi diatas: ", callback);
  }

  static showList(mahasiswaList) {
    const table = new Table({
      head: ['NIM', 'Nama', 'Tanggal Lahir', 'Alamat', 'Kode Jurusan', 'Nama Jurusan']
    });

    mahasiswaList.forEach(row => {
      table.push([
        row.nim,
        row.nama,
        row.tanggal_lahir,
        row.alamat,
        row.id_jurusan,
        row.nama_jurusan || 'Belum ada jurusan'
      ]);
    });

    console.log(table.toString());
  }

  static showDetail(mahasiswa) {
    if (!mahasiswa) {
      console.log("Mahasiswa tidak ditemukan");
      return;
    }

    console.log("========================================");
    console.log(`Detail Mahasiswa dengan NIM ${mahasiswa.nim}`);
    console.log(`1. NIM                 = ${mahasiswa.nim}`);
    console.log(`2. Nama                = ${mahasiswa.nama}`);
    console.log(`3. Tanggal_lahir       = ${mahasiswa.tanggal_lahir}`);
    console.log(`4. Alamat              = ${mahasiswa.alamat}`);
    console.log(`5. Kode Jurusan        = ${mahasiswa.id_jurusan}`);
    console.log(`6. Nama Jurusan        = ${mahasiswa.nama_jurusan || 'Belum ada jurusan'}`);
  }

  static showSearchPrompt(rl, callback) {
    rl.question("Masukkan NIM mahasiswa: ", callback);
  }

  static showAddForm(rl, callback) {
    console.log("Input Data Mahasiswa:");
    rl.question("NIM: ", (nim) => {
      rl.question("Nama: ", (nama) => {
        rl.question("Tanggal Lahir (YYYY-MM-DD): ", (tanggal_lahir) => {
          rl.question("Alamat: ", (alamat) => {
            callback({
              nim,
              nama,
              tanggal_lahir,
              alamat
            });
          });
        });
      });
    });
  }

  static showJurusanList(jurusanList) {
    const table = new Table({
      head: ['Kode Jurusan', 'Nama Jurusan']
    });

    jurusanList.forEach(jurusan => {
      table.push([jurusan.id_jurusan, jurusan.nama_jurusan]);
    });

    console.log("\nDaftar Jurusan:");
    console.log(table.toString());
  }

  static showJurusanPrompt(rl, callback) {
    rl.question("Kode Jurusan: ", callback);
  }

  static showDeletePrompt(rl, callback) {
    rl.question("Masukkan NIM mahasiswa yang akan dihapus: ", callback);
  }
}

module.exports = MahasiswaView;
```

Dan tambahkan ini ke `app.js` untuk menggunakan MahasiswaController:

```javascript:app.js
// ... kode lainnya ...

const MahasiswaController = require('./controllers/MahasiswaController');

class UniversityApp {
  // ... kode lainnya ...

  showMainMenu() {
    MainView.showMenu(rl, (choice) => {
      switch (choice) {
        case "1":
          const mahasiswaController = new MahasiswaController(rl);
          mahasiswaController.show();
          break;
        // ... case lainnya ...
      }
    });
  }
}
```

Beberapa poin penting dari implementasi ini:

1. **Model (Mahasiswa.js)**:
   - Menangani semua operasi database terkait mahasiswa
   - Menyediakan method CRUD (Create, Read, Update, Delete)
   - Menggunakan JOIN dengan tabel jurusan untuk mendapatkan data lengkap

2. **Controller (MahasiswaController.js)**:
   - Menangani logika bisnis
   - Mengkoordinasikan interaksi antara Model dan View
   - Menangani validasi data
   - Mengelola alur program

3. **View (MahasiswaView.js)**:
   - Menampilkan menu dan form
   - Menangani input user
   - Memformat output data menggunakan cli-table3
   - Memisahkan logika tampilan dari logika bisnis

Struktur ini membuat kode lebih:
- Terorganisir
- Mudah dimaintain
- Mudah ditest
- Mudah dikembangkan

Setiap komponen memiliki tanggung jawab yang jelas dan terpisah, sesuai dengan prinsip Single Responsibility Principle (SRP).