// About.js
import React, { useState } from "react";
import { socket } from "../socket";
import { Player } from "../models/models";
import { io } from "socket.io-client";

const About = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [player, setPlayer] = useState(new Player());
  const [joinedRoom, setJoinedRoom] = useState("");
  function handleNameChange(e: any) {
    setName(e.target.value);
  }
  function handleRoomChange(e: any) {
    setRoom(e.target.value);
  }

  socket.on("joined", (data: any) => {
    setJoinedRoom(data.room);
  });
  function handleSubmit(e: any) {
    e.preventDefault();
    if (!name || !room) {
      return;
    }
    setPlayer({ name: name, id: socket.id, hand: [] });
    localStorage.setItem("player", JSON.stringify(player));
    socket.emit("join", { player: JSON.stringify(player), room: room });
    alert(`Submitting Name ${player.name}`);
    socket.on("joined", (data: any) => {
      alert(`Joined ${data.room} as ${data.name}`);
    });
  }

  return (
    <div className="grid h-screen w-full place-items-center ">
      <div className="w-2/3 h-2/3 bg-gray-200 p-6 rounded-lg shadow-md border-black">
        <div className="d-flex flex-column place-items-center">
          <h1 className=" ">Name</h1>
          <form onSubmit={handleSubmit}>
            <label className="text-black" htmlFor="name">
              Name
            </label>
            <input type="text" value={name} onChange={handleNameChange} />
            <label className="text-black" htmlFor="name">
              Room
            </label>
            <input type="text" value={room} onChange={handleRoomChange} />
            <input type="submit" value="Submit" />
          </form>
          <label className="text-black" htmlFor="name">
            Connected in room {joinedRoom}
            Connected users: {}
          </label>
        </div>
      </div>
    </div>
  );
};

export default About;
