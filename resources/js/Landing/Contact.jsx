import React, { useEffect } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ContactUs() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section
      id="Contact"
      className="px-[5%] lg:px-[10%] py-20"
      style={{ background: "#ECF4E8" }}
    >
      <div className="text-center mb-12" data-aos="fade-up">
        <h2 className="text-4xl font-bold text-[#2f3e46]">
          Contact Us
        </h2>
        <p className="text-gray-600 mt-2">
          Punya pertanyaan atau ingin melaporkan masalah aplikasi?
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* LEFT INFO */}
        <div className="space-y-6" data-aos="fade-right">
          <h3 className="text-2xl font-semibold text-[#2f3e46]">
            Hubungi kami 🚀
          </h3>
          <p className="text-gray-600">
            Kami siap membantu kamu menemukan kos terbaik atau membantu kamu mempromosikan kos milikmu.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="text-[#93BFC7]" />
              <span className="text-gray-700">mykost@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-[#93BFC7]" />
              <span className="text-gray-700">+62 812-3456-7890</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-[#93BFC7]" />
              <span className="text-gray-700">Smk mastrip</span>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form
          className="bg-white p-6 rounded-2xl shadow-lg space-y-4"
          data-aos="fade-left"
        >
          <input
            type="text"
            placeholder="Nama"
            className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ABE7B2]"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ABE7B2]"
          />
          <textarea
            placeholder="Pesan"
            rows="4"
            className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#ABE7B2]"
          ></textarea>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#ABE7B2] hover:bg-[#CBF3BB] transition px-4 py-3 rounded-lg font-medium"
          >
            <Send className="w-4 h-4" />
            Kirim Pesan
          </button>
        </form>
      </div>
    </section>
  );
}
