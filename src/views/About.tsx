// About.js
import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import { Card, Game, Player } from "../models/models";
import CardIcon from "../components/card";
import { io } from "socket.io-client";
import { start } from "repl";
import HeartCard from "../components/heartcard";
import ShurikenIcon from "../components/shurikenicon";
import StackedCardIcon from "../components/stackedCard";

const About = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [player, setPlayer] = useState(new Player());
  const [joinedRoom, setJoinedRoom] = useState("");
  const [showReadyButton, setShowReadyButton] = useState(false);
  const [showNextLevelButton, setShowNextLevelButton] = useState(false);
  const [gameState, setGameState] = useState(new Game());

  function handleNameChange(e: any) {
    setName(e.target.value);
  }
  function handleRoomChange(e: any) {
    setRoom(e.target.value);
  }

  socket.on("joined", (data: any) => {
    setJoinedRoom(data.room);
  });

  socket.on("ready_to_start", (data: any) => {
    setShowReadyButton(true);
    console.log("ready");
  });

  socket.on("level_complete", (data: any) => {
    console.log("level complete");
    setShowNextLevelButton(true);
  });

  socket.on("game_over", (data: any) => {
    const updatedGameData: Game = JSON.parse(data);
    setGameState(updatedGameData);
  });

  useEffect(() => {
    const handleGameInfo = (data: any) => {
      const updatedGameData: Game = JSON.parse(data);
      console.log("gamedata", updatedGameData);
      setShowReadyButton(!updatedGameData.game_started);
      setGameState(updatedGameData); // Set the state inside the callback
      console.log("gamestate", gameState);
    };

    socket.on("game_info", handleGameInfo);

    // Clean up the socket event listener when the component unmounts
    return () => {
      socket.off("game_info", handleGameInfo);
    };
  }, [socket]);

  const startNextLevel = () => {
    socket.emit("start_next_level", { room: room });
    setShowNextLevelButton(false);
  };

  socket.on("hide_next_level_button", (data: any) => {
    setShowNextLevelButton(false);
  });

  // Render the player's cards
  const renderPlayerCards = (cardPlayer: Player) => {
    return (
      <div>
        <div key={cardPlayer.id}>
          <h3>{cardPlayer.name}'s kortos:</h3>
          <div className="flex gap-3">
            {cardPlayer.id === player.id
              ? cardPlayer.hand.map((cardValue, index) => (
                  <CardIcon number={cardValue.value} />
                ))
              : cardPlayer.hand.map((cardValue, index) => (
                  <CardIcon number={null} />
                ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDealtCards = (deck: any[]) => {
    return (
      <>
        <h3>Padėtos kortos: </h3>

        <div className="flex relative">
          {deck.map((cardValue, index) => (
            <StackedCardIcon
              key={index}
              zIndex={0}
              number={cardValue.value}
              margin={index === 0 ? 0 : -110}
            />
          ))}
        </div>
      </>
    );
  };

  function handleShuriken() {
    socket.emit("play_shuriken", { room: room });
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    if (!name || !room) {
      return;
    }
    var hand = [] as Card[];
    const new_player: Player = { name: name, id: socket.id, hand: hand };
    setPlayer(new_player);
    localStorage.setItem("player", JSON.stringify(new_player));
    socket.emit("join", { player: JSON.stringify(new_player), room: room });
  }

  return (
    <div className="grid w-full place-items-center ">
      <div className=" w-2/3  bg-gray-200 p-6 rounded-lg shadow-md border-black place-items-center">
        <div className="flex flex-col  items-center text-center justify-center">
          {joinedRoom !== "" ? (
            <>
              <div className="flex flex-col">
                <label className="text-black" htmlFor="room-name">
                  Kambario pavadinimas: {joinedRoom}
                </label>
                <label className="text-black" htmlFor="room-name">
                  Žaidėjas: {player.name}
                </label>
              </div>
              <div className="flex justify-between w-full">
                <div className="flex flex-col">
                  <label className="text-black" htmlFor="room-name">
                    Prisijungę vartotojai: {gameState.num_players}
                  </label>
                  <label className="text-black">
                    Lygis: {gameState.round_num}
                  </label>
                </div>
                <div className="flex gap-20">
                  <div className="flex flex-col items-center">
                    <label className="text-black">Gyvybės:</label>
                    <div className="flex">
                      {Array.from({ length: gameState.num_lives }).map(
                        (_, index) => (
                          <HeartCard />
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <label className="text-black">Šiurikenai:</label>
                    <div className="flex" onClick={handleShuriken}>
                      {Array.from({ length: gameState.shuriken }).map(
                        (_, index) => (
                          <ShurikenIcon />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <form
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col"
              onSubmit={handleSubmit}
            >
              <label className="text-black" htmlFor="name">
                Vardas
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={name}
                onChange={handleNameChange}
              />
              <label className="text-black" htmlFor="name">
                Kambarys
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={room}
                onChange={handleRoomChange}
              />
              <input
                className="mt-4 bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                value="Submit"
              />
            </form>
          )}

          {showReadyButton && (
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
              onClick={() => {
                socket.emit("start_game", { room: room });
              }}
            >
              Pasiruošęs
            </button>
          )}

          {gameState.game_started ? (
            <>
              {gameState && showNextLevelButton ? (
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                  onClick={startNextLevel}
                >
                  Kitas lygmuo
                </button>
              ) : (
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                  onClick={() => {
                    socket.emit("player_play_card", {
                      player: JSON.stringify(player),
                      room: room,
                    });
                  }}
                >
                  Padėti kortą
                </button>
              )}
              {gameState && renderDealtCards(gameState.current_cards)}
              {gameState &&
                gameState.players.map((cardPlayer) =>
                  renderPlayerCards(cardPlayer)
                )}
            </>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
