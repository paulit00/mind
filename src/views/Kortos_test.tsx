// Kortos_test.js
import React, { useState } from "react";
import CardIcon from "../components/card";
import HeartCard from "../components/heartcard";
import ShurikenIcon from "../components/shurikenicon";

const COPYRIGHT_SIGN = "\u00A9"; // Copyright symbol

function Kortos_test() {
  return (
    <div className="grid h-screen w-full place-items-center ">
      {/* <div className="bg-black bg-opacity-50 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-white text-4xl mb-8">Number Cards</h1>
        <div className="flex justify-center items-center h-screen gap-3">
          {Array.from({ length: 10 }, (_, index) => (
            <div key={index}>
              <CardIcon zIndex={length - index} key={index} number={index} />
            </div>
          ))}
        </div>
        <div>
          <HeartCard />
        </div>
        <div>
          <ShurikenIcon />
        </div>
        <footer>
          <p>
            {COPYRIGHT_SIGN} 2023 Your Company Name. All rights reserved. |
            Designed by Your Name
          </p>
        </footer>
      </div> */}
    </div>
  );
}

export default Kortos_test;
