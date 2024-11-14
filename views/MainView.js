class MainView {
    static showMenu(rl, callback) {
      console.log("====================================");
      console.log("Silahkan pilih opsi dibawah ini: ");
      console.log("1. Mahasiswa");
      console.log("2. Jurusan");
      console.log("3. Dosen");
      console.log("4. Matakuliah");
      console.log("5. Kontrak");
      console.log("6. Keluar");
      console.log("====================================");
  
      rl.question("Masukkan salah satu nomor dari opsi diatas: ", callback);
    }
  }
  
  module.exports = MainView;