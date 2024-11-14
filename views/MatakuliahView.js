const Table = require("cli-table3");

class MatakuliahView {
  static showMenuMatakuliah(rl, callback) {
    console.log("==========================================");
    console.log("Silahkan pilih opsi dibawah ini:");
    console.log("1. Daftar Matakuliah");
    console.log("2. Cari Matakuliah");
    console.log("3. Tambah Matakuliah");
    console.log("4. Hapus Matakuliah");
    console.log("5. Kembali ke Menu Utama");
    console.log("==========================================");

    rl.question("Masukkan salah satu nomor dari opsi diatas: ", callback);
  }

  static showListMatakuliah(matakuliahList) {
    const table = new Table({
      head: ["Kode MK", "Nama Matakuliah", "SKS"],
    });

    matakuliahList.forEach((row) => {
      table.push([row.kode_mk, row.nama_mk, row.sks]);
    });

    console.log(table.toString());
  }

  static showDetailMatakuliah(matakuliah) {
    if (!matakuliah) {
      console.log(
        `Matakuliah dengan kode ${matakuliah.kode_mk} tidak ditemukan`
      );
      return;
    }
    console.log("===================================");
    console.log(`Detail Matakuliah dengan Kode ${matakuliah.kode_mk}`);
    console.log(`Kode: ${matakuliah.kode_mk}`);
    console.log(`Nama: ${matakuliah.nama_mk}`);
    console.log(`SKS: ${matakuliah.sks}`);
  }

  static showSearchMatakuliah(rl, callback) {
    rl.question("Masukkan Kode Matakuliah: ", callback);
  }

  static showTambahMatakuliah(rl, callback) {
    console.log("Input Data Matakuliah:");
    rl.question("Kode Matakuliah: ", (kode_mk) => {
      rl.question("Nama Matakuliah: ", (nama_mk) => {
        rl.question("SKS: ", (sks) => {
          callback({
            kode_mk,
            nama_mk,
            sks,
          });
        });
      });
    });
  }

  static showDaftarMatakuliah(matakuliahList) {
    const table = new Table({
      head: ["Kode MK", "Nama Matakuliah", "SKS"],
    });

    matakuliahList.forEach((row) => {
      table.push([row.kode_mk, row.nama_mk, row.sks]);
    });

    console.log("Daftar Matakuliah:");
    console.log(table.toString());
  }

  static showMatakuliahPrompt(rl, callback) {
    rl.question("Kode Matakuliah: ", callback);
  }

  static showDeleteMatakuliah(rl, callback) {
    rl.question("Masukkan Kode Matakuliah: ", callback);
  }
}

module.exports = MatakuliahView;
