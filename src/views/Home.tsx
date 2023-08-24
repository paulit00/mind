// Home.js
import React from "react";

const Home = () => {
  return (
    <div>
      <div className="grid h-screen w-full place-items-center">
        <div className="w-2/3 h-2/3 bg-gray-200 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-3 grid-rows-3 h-full">
            <div>Player 1 Data (Bottom)</div>
            <div>Player 3 Data (Top)</div>
            <div>Player 2 Data (Left)</div>
            <div>Player 4 Data (Right)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
