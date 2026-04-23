import React from "react";

export default function Footer() {
  return (
    <footer
      className="px-[5%] lg:px-[10%] py-10 border-t"
      style={{ background: "#ECF4E8" }}
    >
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-bold text-[#2f3e46]">
            MyKos
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            Platform pencarian kos modern untuk membantu kamu menemukan tempat ngekos terbaik dengan mudah.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-[#2f3e46]">
            Navigation
          </h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li><a href="#Home">Home</a></li>
            <li><a href="#About">About</a></li>
            <li><a href="#Portofolio">Showcase</a></li>
            <li><a href="#Contact">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-[#2f3e46]">
            Follow Us
          </h3>
          <div className="flex gap-4">
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-10">
        Copyright © 2026 MyKosTeam All Rights Reserved.
      </div>
    </footer>
  );
}