// About.js
import React, { useState } from "react";
import { socket } from "../socket";

const About = () => {
  const [name, setName] = useState("");

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name) {
      return;
    }
    socket.emit("message", { data: name });
    alert(`Submitting Name ${name}`);
  }

  return (
    <div class="grid h-screen w-full place-items-center">
      <div class="w-2/3 h-2/3 bg-gray-200 p-6 rounded-lg shadow-md border-black">
        <div class="place-items-center">
          <h1 class="text-3xl font-bold">Name</h1>
          <form onSubmit={handleSubmit}>
            <label>
              <input
                type="text"
                value={name.value}
                onChange={handleNameChange}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default About;
