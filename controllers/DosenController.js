const Dosen = require("../models/Dosen");
const Jurusan = require("../models/Jurusan");
const DosenView = require("../views/DosenView");

class DosenController {
  constructor(rl, menuUtama) {
    this.rl = rl;
    this.menuUtama = menuUtama;
  }

  show() {
    DosenView.showMenuDosen(this.rl, (choice) => {
      switch (choice) {
        case "1":
          this.listDosen();
          break;
        case "2":
          this.cariDosen();
          break;
        case "3":
          this.tambahDosen();
          break;
        case "4":
          this.hapusDosen();
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

  listDosen() {
    Dosen.getAll((err, dosen) => {
      if (err) {
        console.log(err);
        return this.show();
      }
      DosenView.showDosenList(dosen);
      this.show();
    });
  }

  cariDosen() {
    DosenView.showSearchDosen(this.rl, (nip) => {
      Dosen.getByNIP(nip, (err, dosen) => {
        if (err) {
          console.log(err);
          return this.show();
        }
        DosenView.showDetailDosen(dosen);
        this.show();
      });
    });
  }

  tambahDosen() {
    DosenView.showTambahDosen(this.rl, (dosenData) => {
      // Cek NIP duplikat
      Dosen.checkNIPExists(dosenData.nip, (err, existingDosen) => {
        if (err) {
          console.log(err);
          return this.show();
        }

        if (existingDosen) {
          console.log("NIP sudah terdaftar! Silahkan gunakan NIP lain.");
          return this.tambahDosen();
        }

        // Ambil daftar dosen untuk validasi
        Dosen.getAll((err, dosen) => {
          if (err) {
            console.log(err);
            return this.show();
          }

          DosenView.showDosenDaftar(dosen);
          DosenView.showDosenPrompt(this.rl, (kodeDosen) => {
            dosenData.nip = kodeDosen;

            Dosen.createDosen(dosenData, (err) => {
              if (err) {
                console.log(err);
                return this.show();
              }
              console.log("Dosen telah ditambahkan ke dalam database");
              this.listDosen();
            });
          });
        });
      });
    });
  }

  hapusDosen() {
    DosenView.showDeletePrompt(this.rl, (nip) => {
      Dosen.deleteDosen(nip, (err) => {
        if (err) {
          console.log(err);
          return this.show();
        }
        console.log(`Dosen dengan NIP ${nip} berhasil dihapus`);
        this.show();
      });
    });
  }
}

module.exports = DosenController;
