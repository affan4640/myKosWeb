import React, { useState, useEffect, useCallback, memo } from "react";
import {
  Download,
  Mail,
  Sparkles,
  MapPin,
  Star,
  Home as HomeIcon,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import AOS from "aos";
import "aos/dist/aos.css";


const StatusBadge = memo(() => (
  <div data-aos="fade-down" data-aos-delay="200">
    <div className="relative inline-block group">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#93BFC7] to-[#ABE7B2] rounded-full blur opacity-30 group-hover:opacity-60 transition"></div>
      <div className="relative px-4 py-2 rounded-full bg-[#ECF4E8]/70 backdrop-blur border border-[#ABE7B2]/40">
        <span className="flex items-center text-sm font-medium text-[#3a5a60]">
          <Sparkles className="w-4 h-4 mr-2 text-[#93BFC7]" />
          Platform Pencarian Kos Modern
        </span>
      </div>
    </div>
  </div>
));

const MainTitle = memo(() => (
  <div data-aos="fade-up" data-aos-delay="300">
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
      <span className="bg-gradient-to-r from-[#93BFC7] to-[#ABE7B2] bg-clip-text text-transparent">
        MyKost
      </span>
    </h1>
  </div>
));

const TechStack = memo(({ tech, icon: Icon }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-[#ABE7B2]/40 text-sm text-gray-700 hover:bg-[#CBF3BB]/40 transition">
    <Icon className="w-4 h-4 text-[#93BFC7]" />
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href}>
    <div className="group relative w-[160px]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#93BFC7] to-[#ABE7B2] rounded-xl blur opacity-40 group-hover:opacity-80 transition"></div>

      <div className="relative h-11 bg-[#ECF4E8] rounded-lg border border-[#ABE7B2]/40 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition duration-500 bg-gradient-to-r from-[#93BFC7]/20 to-[#ABE7B2]/20"></div>

        <span className="flex items-center gap-2 text-sm font-medium text-gray-800 group-hover:gap-3 transition">
          {text}
          <Icon className="w-4 h-4 group-hover:translate-x-1 transition" />
        </span>
      </div>
    </div>
  </a>
));


const WORDS = [
  "Cari Kos Cepat & Mudah",
  "Temukan Kos Sesuai Budget",
  "Booking Kos Tanpa Ribet",
];

const FEATURES = [
  { text: "Lokasi Strategis", icon: MapPin },
  { text: "Harga Terjangkau", icon: Star },
  { text: "Booking Online", icon: HomeIcon },
];


const Home = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

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
    const timeout = setTimeout(handleTyping, isTyping ? 90 : 40);
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  return (
    <div className="relative min-h-screen bg-[#ECF4E8] overflow-hidden px-[8%] lg:px-[16%]" id="Home">

      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute w-[400px] h-[400px] bg-[#ABE7B2]/30 blur-3xl rounded-full top-10 left-10 animate-pulse"></div>
        <div className="absolute w-[300px] h-[300px] bg-[#93BFC7]/30 blur-3xl rounded-full bottom-10 right-10 animate-pulse"></div>
      </div>

      <div className={`transition duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="container mx-auto min-h-screen flex items-center">

          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-12">

            {/* LEFT */}
            <div className="w-full lg:w-1/2 space-y-6">
              <StatusBadge />
              <MainTitle />

              {/* TYPEWRITER */}
              <div className="flex items-center h-8" data-aos="fade-up" data-aos-delay="500">
                <span className="text-xl text-gray-700 font-light">{text}</span>
                <span className="w-[2px] h-6 bg-[#93BFC7] ml-1 animate-pulse"></span>
              </div>

              {/* DESC */}
              <p className="text-gray-600 max-w-lg" data-aos="fade-up" data-aos-delay="600">
                Temukan kos impianmu dengan mudah menggunakan MyKost. 
                Platform modern dengan pencarian cerdas, informasi lengkap, 
                dan sistem booking praktis.
              </p>

              {/* FEATURES */}
              <div className="flex flex-wrap gap-3" data-aos="fade-up" data-aos-delay="700">
                {FEATURES.map((f, i) => (
                  <TechStack key={i} tech={f.text} icon={f.icon} />
                ))}
              </div>

              {/* CTA */}
              <div className="flex gap-3" data-aos="fade-up" data-aos-delay="800">
                <CTAButton href="#" text="Download App" icon={Download} />
                <CTAButton href="#Contact" text="Contact" icon={Mail} />
              </div>
            </div>

            {/* RIGHT */}
            <div
              className="w-full lg:w-1/2 h-[400px] lg:h-[600px] flex items-center justify-center"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              data-aos="fade-left"
            >
              <div className="relative w-full">

                <div className={`absolute inset-0 bg-gradient-to-r from-[#93BFC7]/30 to-[#ABE7B2]/30 blur-3xl transition ${
                  isHovering ? "opacity-70 scale-110" : "opacity-40"
                }`} />

                <DotLottieReact
                  src="https://lottie.host/3c808f76-6521-4005-b8c4-b0d0e5593fcf/6Yfn9QsLLt.lottie"
                  loop
                  autoplay
                  className={`w-full transition duration-500 ${
                    isHovering ? "scale-110 rotate-2" : "scale-100"
                  }`}
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