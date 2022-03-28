import { gameManager } from "./gameManager.js";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, onDisconnect } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBKlZ7Ww3zuStNATuGclycsTY97fBSeVps",
  authDomain: "multiplayerdemo-e4663.firebaseapp.com",
  databaseURL: "https://multiplayerdemo-e4663-default-rtdb.firebaseio.com",
  projectId: "multiplayerdemo-e4663",
  storageBucket: "multiplayerdemo-e4663.appspot.com",
  messagingSenderId: "146895112531",
  appId: "1:146895112531:web:d45313e53a01192395f9a6",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

signInAnonymously(auth).catch((error) => {
  console.log(error.code, error.message);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    let playerId = user.uid;
    let playerRef = ref(database, `players/${playerId}`);
    set(playerRef, {
      name: "DREW",
      id: playerId,
    });
    onDisconnect(playerRef).remove();
  } else {
    console.log("Logged Out");
  }
});

function initGame() {
  const gameCanvas = document.querySelector("canvas");
  const context = gameCanvas.getContext("2d");
  const gameContainer = document.getElementById("game-container");
  const height = 720; //default 480
  const width = 1080; //default 720
  const cellFactor = 3;
  gameContainer.style.width = `${width}px`;
  gameContainer.style.height = `${height}px`;
  gameContainer.style.display = "block";
  const lineWidth = 3;
  gameCanvas.height = height;
  gameCanvas.width = width;
  const game = new gameManager(
    height,
    width,
    12 * cellFactor,
    cellFactor,
    lineWidth
  );
  game.start(context);
}
