import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  onDisconnect,
  onValue,
  get,
  child,
} from "firebase/database";

export class NetworkProtocols {
  constructor(host) {
    const firebaseConfig = {
      apiKey: "AIzaSyBKlZ7Ww3zuStNATuGclycsTY97fBSeVps",
      authDomain: "multiplayerdemo-e4663.firebaseapp.com",
      databaseURL: "https://multiplayerdemo-e4663-default-rtdb.firebaseio.com",
      projectId: "multiplayerdemo-e4663",
      storageBucket: "multiplayerdemo-e4663.appspot.com",
      messagingSenderId: "146895112531",
      appId: "1:146895112531:web:d45313e53a01192395f9a6",
    };
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth();
    this.database = getDatabase(this.app);
    this.gameData = {};
    this.gameRef;
    this.userId;
    this.players;
    this.playerData;
    this.keyData;
    this.exitData;
    this.mazeData;
    signInAnonymously(this.auth).catch((error) => {
      console.log(error.code, error.message);
    });
    if (!host) {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          this.userId = user.uid;
          this.gameRef = ref(this.database, `games/${user.uid}`);
          set(this.gameRef, { check: true });
          onDisconnect(this.gameRef).remove();
          onValue(
            ref(this.database, `games/${user.uid}/players`),
            (snapshot) => {
              this.players = snapshot.val() || {};
              //console.log(this.players);
            }
          );
          set(ref(this.database, `games/${this.userId}`), {
            players: {
              survivor: {
                x: `${this.playerData[0].x}`,
                y: `${this.playerData[0].y}`,
              },
              hunter: {
                x: `${this.playerData[1].x}`,
                y: `${this.playerData[1].y}`,
              },
            },
            key1: {
              x: `${this.keyData[0].x}`,
              y: `${this.keyData[0].y}`,
              enabled: true,
            },
            key2: {
              x: `${this.keyData[1].x}`,
              y: `${this.keyData[1].y}`,
              enabled: true,
            },
            exit1: {
              x: `${this.exitData[0].x}`,
              y: `${this.exitData[0].y}`,
            },
            exit2: {
              x: `${this.exitData[1].x}`,
              y: `${this.exitData[1].y}`,
            },
            maze: this.mazeData,
          });
        } else {
          console.log("Logged Out");
        }
      });
    } else {
      this.userId = host; //
      onAuthStateChanged(this.auth, (user) => {
        this.gameRef = ref(this.database, `games/${host}`);
        get(child(ref(getDatabase()), `games/${host}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              this.gameData = snapshot.val();
              //console.log(snapshot.val());
            } else {
              console.log("No data available");
            }
          })
          .catch((error) => {
            console.error(error);
          });
        onValue(ref(this.database, `games/${host}/players`), (snapshot) => {
          this.players = snapshot.val() || {};
          //console.log(this.players);
        });
      });
    }
  }

  initGame(playerData, keyData, exitData, mazeData) {
    this.playerData = playerData;
    this.keyData = keyData;
    this.exitData = exitData;
    this.mazeData = mazeData;
  }

  uploadSurvivor(x, y) {
    if (!this.userId) return;
    set(ref(this.database, `games/${this.userId}/players/survivor`), {
      x: `${x}`,
      y: `${y}`,
    });
  }

  uploadHunter(x, y) {
    if (!this.userId) return; //
    set(ref(this.database, `games/${this.userId}/players/hunter`), {
      x: `${x}`,
      y: `${y}`,
    });
  }

  // updatePlayersToCloud

  //   updatePlayer(playerId, x, y) {
  //     // Set the player values
  //     let playerRef = ref(database, `players/${playerId}`);

  //     set(playerRef, {
  //       id: playerId,
  //       color: "blue",
  //       x: `${x}`,
  //       y: `${x}`,
  //       keys: "0",
  //       type: "survivor",
  //     });
  //   }
}
