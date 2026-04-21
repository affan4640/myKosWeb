import React, { useState, useEffect, useCallback, memo } from "react";
import {
  GitBranch,
  Activity,
  Download,
  Mail,
  ExternalLink,
  Camera,
  Sparkles,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import AOS from "aos";
import "aos/dist/aos.css";


import logo from "../../assets/logo.png";

/* ================= COMPONENTS ================= */

const StatusBadge = memo(() => (
  <div data-aos="zoom-in" data-aos-delay="400">
    <div className="relative group inline-block m">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30 group-hover:opacity-60 transition"></div>
      <div className="relative px-4 py-2 rounded-full bg-background/40 backdrop-blur border border-secondary/20">
        <span className="flex items-center text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          <Sparkles className="w-4 h-4 mr-2 text-primary" />
          Solusi Pencarian Kos Modern
        </span>
      </div>
    </div>
  </div>
));

const MainTitle = memo(() => (
  <div data-aos="fade-up" data-aos-delay="600">
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        MyKost
      </span>
    </h1>
  </div>
));

const TechStack = memo(({ tech }) => (
  <div className="px-4 py-2 rounded-full bg-background/40 border border-secondary/20 text-sm text-gray-700 hover:bg-light transition">
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href}>
    <div className="group relative w-[160px]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-40 group-hover:opacity-80 transition"></div>

      <div className="relative h-11 bg-background rounded-lg border border-secondary/20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-primary/20 to-secondary/20"></div>

        <span className="flex items-center gap-2 text-sm font-medium text-gray-800 group-hover:gap-3 transition">
          {text}
          <Icon className="w-4 h-4 group-hover:translate-x-1 transition" />
        </span>
      </div>
    </div>
  </a>
));

const SocialLink = memo(({ icon: Icon, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <div className="group relative p-3">
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-20 group-hover:opacity-50 transition"></div>
      <div className="relative rounded-xl bg-background/50 backdrop-blur p-2 border border-secondary/20">
        <Icon className="w-5 h-5 text-gray-600 group-hover:text-primary transition" />
      </div>
    </div>
  </a>
));

/* ================= CONSTANTS ================= */

const WORDS = ["Cari Kos Cepat & Mudah",
  "Temukan Kos Sesuai Budget",
  "Booking Kos Tanpa Ribet"];
const TECH_STACK = ["Lokasi Strategis",
  "Harga Terjangkau",
  "Booking Online",
  "Review Pengguna"];

const SOCIAL_LINKS = [
  { icon: GitBranch, link: "#" },
  { icon: Activity, link: "#" },
  { icon: Camera, link: "#" },
];

/* ================= MAIN COMPONENT ================= */

const Home = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  /* AOS */
  useEffect(() => {
    AOS.init({ once: true, offset: 20 });
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  /* TYPEWRITER */
  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText((prev) => prev + WORDS[wordIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      if (charIndex > 0) {
        setText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      } else {
        setWordIndex((prev) => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(handleTyping, isTyping ? 100 : 50);
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  return (
    <div className="min-h-screen bg-background px-[8%] lg:px-[16%]">
      <div className={`transition duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="container mx-auto min-h-screen flex items-center">

          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-12">

            {/* LEFT */}
            <div className="w-full lg:w-1/2 space-y-6">

              <StatusBadge />
              <MainTitle />

              {/* TYPEWRITER */}
              <div className="flex items-center h-8">
                <span className="text-xl text-gray-700 font-light">{text}</span>
                <span className="w-[2px] h-6 bg-primary ml-1 animate-pulse"></span>
              </div>

              {/* DESC */}
              <p className="text-gray-600 max-w-lg">
                MyKost membantu kamu menemukan tempat tinggal terbaik dengan fitur pencarian cerdas, informasi lengkap, dan pemesanan yang praktis.
              </p>

              {/* TECH */}
              <div className="flex flex-wrap gap-3">
                {TECH_STACK.map((tech, i) => (
                  <TechStack key={i} tech={tech} />
                ))}
              </div>

              {/* CTA */}
              <div className="flex gap-3">
                <CTAButton href="#project" text="Download" icon={Download} />
                <CTAButton href="#contact" text="Contact" icon={Mail} />
              </div>

              {/* SOCIAL */}
              <div className="flex gap-4">
                {SOCIAL_LINKS.map((s, i) => (
                  <SocialLink key={i} {...s} />
                ))}
              </div>
            </div>

            {/* RIGHT (LOTTIE) */}
            <div
              className="w-full lg:w-1/2 h-[400px] lg:h-[600px] flex items-center justify-center"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="relative w-full">

                {/* GLOW */}
                <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl transition ${isHovering ? "opacity-60 scale-105" : "opacity-30"}`} />

                <DotLottieReact
                  src="https://lottie.host/3c808f76-6521-4005-b8c4-b0d0e5593fcf/6Yfn9QsLLt.lottie"
                  loop
                  autoplay
                  className={`w-full transition ${isHovering ? "scale-110" : "scale-100"}`}
                />

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Home);