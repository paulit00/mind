import React, { useState, useEffect, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import { socket } from "./socket";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Switch } from "react-router";
import Home from "./views/Home";
import About from "./views/About";

// import firebase from "firebase/compat/app";
// import "firebase/compat/firestore";
// import "firebase/compat/auth";

// import { useAuthState } from "react-firebase-hooks/auth";
// import { useCollectionData } from "react-firebase-hooks/firestore";

// firebase.initializeApp({
//   apiKey: "AIzaSyAqrr3ISNOh7qgleQ6mjaLTMAc1TigOFuA",
//   authDomain: "the-minde.firebaseapp.com",
//   projectId: "the-minde",
//   storageBucket: "the-minde.appspot.com",
//   messagingSenderId: "93579601357",
//   appId: "1:93579601357:web:c5a4b5dd8425a9603fd084",
//   measurementId: "G-4JTL7SL2E2",
// });

// const auth = firebase.auth();
// const firestore = firebase.firestore();

// function SignIn() {
//   const signInWithGoogle = () => {
//     const provider = new firebase.auth.GoogleAuthProvider();
//     auth.signInWithPopup(provider);
//   };

//   return <button onClick={signInWithGoogle}>Sign in with Google</button>;
// }

// function SignOut() {
//   return (
//     auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
//   );
// }

socket.on("connect", () => {
  console.log("connected");
});

socket.on("disconnect", () => {
  console.log("disconnected");
});

socket.on("message", (data) => {
  console.log("suveike" + data);
});

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const numberOfPlayers = 3;
  // const [user] = useAuthState(auth);
  //// const messagesRef = firestore.collection("messages");
  //  const query = messagesRef.orderBy("createdAt").limit(25);

  // const [messages] = useCollectionData(query, { idField: "id" });
  const mockPlayers = [
    {
      id: "playerID1",
      name: "Player 1",
      hand: [2, 5, 9],
      level: 1,
    },
    {
      id: "playerID2",
      name: "Player 2",
      hand: [3, 7, 10],
      level: 1,
    },
    // Add more players as needed
  ];

  const PlayerData = ({ playerNumber, children }) => (
    <div className={`bg-gray-${300 + playerNumber * 100}`}>{children}</div>
  );

  const GameWindow = ({ numberOfPlayers }) => {
    const playerComponents = [];

    for (
      let playerNumber = 1;
      playerNumber <= numberOfPlayers;
      playerNumber++
    ) {
      playerComponents.push(
        <PlayerData key={playerNumber} playerNumber={playerNumber}>
          Player {playerNumber} Data
        </PlayerData>
      );
    }

    return (
      <div className="grid h-screen w-full place-items-center">
        <div className="w-2/3 h-2/3 bg-gray-200 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-3 grid-rows-3 h-full">
            {playerComponents}
          </div>
        </div>
      </div>
    );
  };

  const mockCurrentLevel = {
    levelNumber: 1,
    target: 3,
    cardsPlayed: 2,
  };

  const mockGameData = {
    players: mockPlayers,
    currentLevel: mockCurrentLevel,
  };
  const { players, currentLevel } = mockGameData;
  useEffect(() => {
    fetch("/time")
      .then((res) => res.json())
      .then((data) => {
        setCurrentTime(data.time);
      });
  }, []);

  return (
    <div className="App">
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/about" element={<About />}></Route>
            <Route path="/" element={<Home />}></Route>
          </Routes>
        </div>
      </Router>
    </div>
  );

  // function ChatRoom() {
  //   const dummy = useRef();
  //   const messagesRef = firestore.collection("messages");
  //   const query = messagesRef.orderBy("createdAt").limit(25);

  //   const [messages] = useCollectionData(query, { idField: "id" });

  //   const [formValue, setFormValue] = useState("");

  //   const sendMessage = async (e) => {
  //     e.preventDefault();

  //     const { uid } = auth.currentUser;

  //     await messagesRef.add({
  //       text: formValue,
  //       createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  //       uid,
  //     });

  //     setFormValue("");
  //     //  dummy.current.scrollIntoView({ behavior: "smooth" });
  //   };

  //   return (
  //     <>
  //       <main>
  //         {messages &&
  //           messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

  //         <span ref={dummy}></span>
  //       </main>

  //       <form onSubmit={sendMessage}>
  //         <input
  //           value={formValue}
  //           onChange={(e) => setFormValue(e.target.value)}
  //           placeholder="say something nice"
  //         />

  //         <button type="submit" disabled={!formValue}>
  //           🕊️
  //         </button>
  //       </form>
  //     </>
  //   );
  // }

  // function ChatMessage(props) {
  //   const { text, uid } = props.message;

  //   const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  //   return (
  //     <div className={`message ${messageClass}`}>
  //       <p>{text}</p>
  //     </div>
  //   );
  // }

  // return (
  //   <div className="App">
  //     <GameWindow numberOfPlayers={numberOfPlayers} />
  //   </div>
  // );
}

export default App;
