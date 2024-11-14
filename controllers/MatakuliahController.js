const Mahasiswa = require("../models/Mahasiswa");
const Matakuliah = require("../models/Matakuliah");
const MatakuliahView = require("../views/MatakuliahView");

class MatakuliahController {
  constructor(rl, menuUtama) {
    this.rl = rl;
    this.menuUtama = menuUtama;
  }

  show() {
    MatakuliahView.showMenuMatakuliah(this.rl, (choice) => {
      switch (choice) {
        case "1":
          this.listMatakuliah();
          break;
        case "2":
          this.cariMatakuliah();
          break;
        case "3":
          this.tambahMatakuliah();
          break;
        case "4":
          this.hapusMatakuliah();
          break;
        case "5":
          this.menuUtama();
          break;
        default:
          console.log("Pilihan Tidak Valid");
          this.show();
      }
    });
  }

  listMatakuliah() {
    Matakuliah.getAll((err, matakuliah) => {
      if (err) {
        console.log(err);
        return this.show();
      }
      MatakuliahView.showListMatakuliah(matakuliah);
      this.show();
    });
  }

  cariMatakuliah() {
    MatakuliahView.showSearchMatakuliah(this.rl, (kode) => {
      Matakuliah.getByKodeMK(kode, (err, matakuliah) => {
        if (err) {
          console.log(err);
          return this.show();
        }
        MatakuliahView.showDetailMatakuliah(matakuliah, kode);
        this.show();
      });
    });
  }

  tambahMatakuliah() {
    // Ambil daftar matakuliah untuk validasi
    Matakuliah.getAll((err, matakuliah) => {
      if (err) {
        console.log(err);
        return this.show();
      }

      MatakuliahView.showTambahMatakuliah(this.rl, (matakuliahData) => {
        // Cek Kode MK duplikat
        Matakuliah.checkKodeMKExists(
          matakuliahData.nim,
          (err, existingMatakuliah) => {
            if (err) {
              console.log(err);
              return this.show();
            }

            if (existingMatakuliah) {
              console.log(
                "Kode Matakuliah sudah terdaftar! Silahkan gunakan Kode Matakuliah lain."
              );
              return this.tambahMatakuliah();
            }

            Matakuliah.createMatakuliah(matakuliahData, (err) => {
              if (err) {
                console.log(err);
                return this.show();
              }
              console.log("Matakuliah telah ditambahkan ke dalam database.");
              this.listMatakuliah();
            });
          }
        );
      }, matakuliah);
    });
  }

  hapusMatakuliah() {
    MatakuliahView.showDeleteMatakuliah(this.rl, (kode) => {
      Matakuliah.deleteMatakuliah(kode, (err) => {
        if (err) {
          console.log(err);
          return this.show();
        }
        console.log(
          `Matakuliah dengan Kode Matakuliah ${kode} berhasil dihapus.`
        );
        this.show();
      });
    });
  }
}

module.exports = MatakuliahController;
