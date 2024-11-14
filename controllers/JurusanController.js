const Jurusan = require("../models/Jurusan");
const Mahasiswa = require("../models/Mahasiswa");
const JurusanView = require("../views/JurusanView");

class JurusanController {
  constructor(rl, menuUtama) {
    this.rl = rl;
    this.menuUtama = menuUtama;
  }

  show() {
    JurusanView.showMenu(this.rl, (choice) => {
      switch (choice) {
        case "1":
          this.listJurusan();
          break;
        case "2":
          this.cariJurusan();
          break;
        case "3":
          this.tambahJurusan();
          break;
        case "4":
          this.hapusJurusan();
          break;
        case "5":
          this.menuUtama();
          break;
        default:
          console.log("Pilihan tidak Valid");
          this.show;
      }
    });
  }

  listJurusan() {
    Jurusan.getAll((err, jurusan) => {
      if (err) {
        console.log(err);
        return this.show;
      }
      JurusanView.showList(jurusan);
      this.show();
    });
  }

  cariJurusan() {
    JurusanView.showSearchJurusan(this.rl, (kode) => {
      Jurusan.getByKodeJurusan(kode, (err, jurusan) => {
        if (err) {
          console.log(err);
          return this.show();
        }
        JurusanView.showDetail(jurusan, kode);
        this.show();
      });
    });
  }

  tambahJurusan() {
    Jurusan.getAll((err, jurusanList) => {
      if (err) {
        console.log(err);
        return this.show();
      }
      JurusanView.showTambahJurusan(
        this.rl,
        (jurusanData) => {
          // Cek Kode Jurusan Duplikat
          Jurusan.checkKodeJurusanExists(
            jurusanData.kode,
            (err, existingJurusan) => {
              if (err) {
                console.log(err);
                return this.show();
              }

              if (existingJurusan) {
                console.log(
                  "Kode Jurusan sudah terdaftar! Silahkan gunakan Kode Jurusan lain."
                );
                return this.tambahJurusan();
              }
              Jurusan.createJurusan(jurusanData, (err) => {
                if (err) {
                  console.log(err);
                  return this.show();
                }
                console.log("Jurusan telah ditambahkan ke dalam database");
                this.listJurusan();
              });
            }
          );
        },
        jurusanList
      );
    });
  }

  hapusJurusan() {
    JurusanView.showHapusJurusan(this.rl, (kode) => {
      Jurusan.deleteJurusan(kode, (err) => {
        if (err) {
          console.log(err);
          return this.show();
        }
        console.log(`Jurusan dengan kode '${kode}' berhasil dihapus`);
        this.show();
      });
    });
  }
}

module.exports = JurusanController;
