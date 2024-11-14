const Table = require("cli-table3");

class JurusanView {
  static showMenu(rl, callback) {
    console.log("=========================================");
    console.log("Silahkan pilih opsi dibawah ini:");
    console.log("1. Daftar Jurusan");
    console.log("2. Cari Jurusan");
    console.log("3. Tambah Jurusan");
    console.log("4. Hapus Jurusan");
    console.log("5. Kembali ke Menu Utama");
    console.log("=========================================");

    rl.question("Masukkan salah satu nomor dari opsi diatas: ", callback);
  }

  static showList(jurusanList) {
    const table = new Table({
      head: ["Kode Jurusan", "Nama Jurusan"],
    });

    jurusanList.forEach((row) => {
      table.push([row.id_jurusan, row.nama_jurusan]);
    });

    console.log(table.toString());
  }

  static showDetail(jurusan, kode) {
    if (!jurusan) {
      console.log(`Jurusan dengan Kode ${kode} tidak ditemukan`);
      return;
    }
    console.log("=======================================");
    console.log(`Detail Jurusan dengan Kode '${jurusan.id_jurusan}'`);
    console.log(`Kode Jurusan: ${jurusan.id_jurusan}`);
    console.log(`Nama Juruasn: ${jurusan.nama_jurusan}`);
  }

  static showSearchJurusan(rl, callback) {
    rl.question("Masukkan kode Jurusan: ", callback);
  }

  static showTambahJurusan(rl, callback, jurusanList) {
    console.log("Lengkapi data dibawah ini:");

    const table = new Table({
      head: ["Kode Jurusan", "Nama Jurusan"],
    });

    jurusanList.forEach((jurusan) => {
      table.push([jurusan.id_jurusan, jurusan.nama_jurusan]);
    });

    console.log("Daftar Jurusan yang sudah terdaftar:");
    console.log(table.toString());
    console.log("\n");

    rl.question("Kode Jurusan: ", (id_jurusan) => {
      rl.question("Nama Jurusan: ", (nama_jurusan) => {
        callback({
          id_jurusan,
          nama_jurusan,
        });
      });
    });
  }

  static ShowJurusanPrompt(rl, callback) {
    rl.question("Kode Jurusan: ", callback);
  }

  static showDaftarJurusan(jurusanList) {
    const table = new Table({
      head: ["Kode Jurusan", "Nama Jurusan"],
    });

    jurusanList.forEach((jurusan) => {
      table.push([jurusan.id_jurusan, jurusan.nama_jurusan]);
    });

    console.log(table.toString());
  }

  static showHapusJurusan(rl, callback) {
    rl.question("Masukkan Kode Jurusan: ", callback);
  }
}

module.exports = JurusanView;
