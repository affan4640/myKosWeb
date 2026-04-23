import React, { useState } from "react";

import Navbar from "../Landing/Navbar";
import Home from "../Landing/Home";
import WelcomeScreen from "../Landing/WelcomeScreen";
import About from "../Landing/About";
import Showcase from "../Landing/Showcase";
import Contact from "../Landing/Contact";
import Footer from "../Landing/Footer";

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
                    <About />
                    <Showcase />
                    <Contact />
                    <Footer />

                </>
            )}
        </div>
    );
}
