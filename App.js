const readline = require("readline");
const MainView = require("./views/MainView");
const AuthView = require("./views/AuthView");
const AuthController = require("./controllers/AuthController");
const MahasiswaController = require("./controllers/MahasiswaController"); // Mahasiswa
const JurusanController = require("./controllers/JurusanController"); // Jurusan
const DosenController = require("./controllers/DosenController"); // Dosen
const MatakuliahController = require("./controllers/MatakuliahController"); // Matakuliah
const KontrakController = require("./controllers/KontrakController"); // Kontrak
// Import controller lainnya

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class UniversityApp {
  constructor() {
    this.currentUser = null;
  }

  start() {
    this.login();
  }

  login() {
    AuthView.showLoginPrompt(rl, (username, password) => {
      AuthController.login(username, password, (err, user) => {
        if (err) {
          console.log("Terjadi kesalahan saat login");
          this.login();
          return;
        }

        if (user) {
          this.currentUser = user;
          this.showMainMenu();
        } else {
          this.login();
        }
      });
    });
  }

  showMainMenu() {
    MainView.showMenu(rl, (choice) => {
      switch (choice) {
        case "1":
          const mahasiswaController = new MahasiswaController(rl, () =>
            this.showMainMenu()
          );
          mahasiswaController.show();
          break;
        case "2":
          const jurusanController = new JurusanController(rl, () =>
            this.showMainMenu()
          );
          jurusanController.show();
          break;
        case "3":
          const dosenController = new DosenController(rl, () =>
            this.showMainMenu()
          );
          dosenController.show();
          break;
        case "4":
          const matakuliahController = new MatakuliahController(rl, () =>
            this.showMainMenu()
          );
          matakuliahController.show();
          break;
        case "5":
          const kontrakController = new KontrakController(
            rl,
            () => this.showMainMenu()
          );
          kontrakController.show();
          break;
        case "6":
          console.log("Anda Telah Keluar dari Program!");
          this.start();
          break;
        default:
          console.log("Pilihan tidak Valid");
          this.showMainMenu();
      }
    });
  }
}

const app = new UniversityApp();
app.start();
