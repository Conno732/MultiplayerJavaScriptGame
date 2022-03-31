import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  onDisconnect,
  onValue,
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
    this.playersRef = ref(this.database, `players`);
    this.players = {};

    onValue(this.playersRef, (snapshot) => {
      console.log(snapshot.val() || {});
    });

    signInAnonymously(this.auth).catch((error) => {
      console.log(error.code, error.message);
    });

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        let playerId = user.uid;
        let playerRef = ref(this.database, `players/${playerId}`);
        set(playerRef, {
          id: playerId,
          color: "blue",
          type: "survivor",
          x: "-1",
          y: "-1",
          keys: "0",
        });
        onDisconnect(playerRef).remove();
      } else {
        console.log("Logged Out");
      }
    });
  }

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
