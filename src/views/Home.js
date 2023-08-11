// Home.js
import React from "react";

const Home = () => {
  return (
    <div>
      <div class="grid h-screen w-full place-items-center">
        {/* {user ? <ChatRoom /> : <SignIn />} */}
        <div class="w-2/3 h-2/3 bg-gray-200 p-6 rounded-lg shadow-md">
          <div class="grid grid-cols-3 grid-rows-3 h-full">
            <div
              class="col-start-1 col-end-4 row-start-3 row-end-3 bg-gray-300"
              id="player1"
            >
              Player 1 Data (Bottom)
            </div>
            <div
              class="col-start-1 col-end-4 row-start-1 row-end-1 bg-gray-400"
              id="player2"
            >
              Player 3 Data (Top)
            </div>
            <div
              class="col-start-1 col-end-1 row-start-2 row-end-2 bg-gray-500"
              id="player3"
            >
              Player 2 Data (Left)
            </div>
            <div
              class="col-start-3 col-end-3 row-start-2 row-end-2 bg-gray-600"
              id="player4"
            >
              Player 4 Data (Right)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
