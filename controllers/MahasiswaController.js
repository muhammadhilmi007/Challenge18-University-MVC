const Mahasiswa = require("../models/Mahasiswa");
const Jurusan = require("../models/Jurusan");
const MahasiswaView = require("../views/MahasiswaView");

class MahasiswaController {
  constructor(rl, menuUtama) {
    this.rl = rl;
    this.menuUtama = menuUtama;
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
          this.menuUtama();
          break;
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
