import React, { useEffect, memo } from "react"
import { Home, MapPin, ShieldCheck, Users } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"

const features = [
  {
    icon: MapPin,
    title: "Lokasi Akurat",
    desc: "Temukan kos berdasarkan lokasi terdekat dari kampus."
  },
  {
    icon: Home,
    title: "Banyak Pilihan",
    desc: "puluhan pilihan kos dengan berbagai harga dan fasilitas."
  },
  {
    icon: ShieldCheck,
    title: "Terpercaya",
    desc: "Data kos diverifikasi untuk memastikan kualitas dan keamanan."
  },
  {
    icon: Users,
    title: "Untuk Semua",
    desc: "Cocok untuk mahasiswa, pekerja, maupun keluarga."
  }
]

const About = () => {

  useEffect(() => {
    AOS.init({ once: true })
  }, [])

  return (
    <section
      id="About"
      className="bg-[#ECF4E8] py-20 px-[8%] lg:px-[16%]"
    >
        
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2
          className="text-4xl md:text-5xl font-bold text-[#2d4a50]"
          data-aos="fade-up"
        >
          About MyKost
        </h2>

        <p
          className="mt-4 text-gray-600 text-lg"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Platform digital untuk membantu Anda menemukan tempat ngekos terbaik dengan mudah, cepat, dan terpercaya.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">

        <div className="space-y-6" data-aos="fade-right">

          <h3 className="text-2xl md:text-3xl font-semibold text-[#93BFC7]">
            Solusi Modern Pencarian Kos
          </h3>

          <p className="text-gray-600 leading-relaxed">
            MyKos hadir untuk mempermudah pencarian kos tanpa ribet. 
            Dengan fitur pencarian canggih, filter lengkap, dan informasi yang transparan, 
            Anda dapat menemukan hunian yang sesuai dengan kebutuhan hanya dalam beberapa klik.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Kami menghubungkan pencari kos dengan pemilik kos secara langsung, 
            sehingga proses menjadi lebih cepat, efisien, dan terpercaya.
          </p>

          <div className="pt-4">
            <a href="#Home">
              <button className="bg-[#93BFC7] text-white px-6 py-3 rounded-lg hover:scale-105 transition">
                Mulai Cari Kos
              </button>
            </a>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6" data-aos="fade-left">
          {features.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="bg-white/70 backdrop-blur rounded-xl p-6 border border-[#ABE7B2]/40 hover:shadow-lg hover:scale-105 transition"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#CBF3BB]/50 mb-4">
                  <Icon className="w-6 h-6 text-[#3b6b73]" />
                </div>

                <h4 className="font-semibold text-[#2d4a50]">
                  {item.title}
                </h4>

                <p className="text-sm text-gray-500 mt-2">
                  {item.desc}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default memo(About)