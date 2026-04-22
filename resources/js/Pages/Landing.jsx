import React, { useState } from "react";

import Navbar from "../Landing/Navbar";
import Home from "../Landing/Home";
import WelcomeScreen from "../Landing/WelcomeScreen";

export default function Landing() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div>
      {showWelcome ? (
        <WelcomeScreen onFinish={() => setShowWelcome(false)} />
      ) : (
        <>
          <Navbar />
          <Home />
        </>
      )}
    </div>
  );
}