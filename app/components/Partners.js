'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Partners() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  const partnerMotion = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        duration: 0.2,
        type: "tween",
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-[#101c3a] via-[#0e2247] to-[#1e90ff]" id="partners">
      {/* Background Effects removed for performance */}

      <motion.div style={{ opacity }} className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-6 text-[#FFD700]">Strategic Partners</h2>
          <div className="w-24 h-1 bg-[#1e90ff] mx-auto rounded-full"></div>
          <p className="text-xl text-white mt-4">Proud to collaborate with the finest blockchain and DeFi partners</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            { name: "RoastBrew", logo: "/images/partners/roastbrew-logo.png" },
            { name: "Javamingle", logo: "/images/partners/javamingle-logo.png" },
            { name: "Cafénest", logo: "/images/partners/cafenest-logo.png" },
            { name: "PerkCafé", logo: "/images/partners/perkcafe-logo.png" }
          ].map((partner, i) => (
            <div
              key={partner.name}
              className="bg-[#e6f7ff]/80 backdrop-blur-sm p-6 rounded-xl border border-[#1e90ff]/20 hover:border-[#1e90ff] shadow-lg hover:shadow-[#1e90ff]/20 transition-all duration-300"
            >
              <div className="relative group aspect-video flex items-center justify-center">
                <Image 
                  src={partner.logo} 
                  alt={partner.name} 
                  width={200} 
                  height={100} 
                  className="w-full h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

        {/* --- KAYAN WEB3 ECOSYSTEM LOGOLARI --- */}
        <div className="relative w-full mt-12 overflow-x-hidden">
          <div className="text-center mb-2">
            <span className="text-sm md:text-base font-semibold text-white tracking-wide uppercase">Web3 Ecosystem</span>
          </div>
          <div className="marquee flex items-center gap-16 py-3 bg-[#1A0F0A]/70 rounded-xl shadow-inner px-4">
            {(() => {
              const logos = [
                { name: 'Unity', logo: '/images/partners/unity.png' },
                { name: 'BNB Chain', logo: '/images/partners/bnbchain.png' },
                { name: 'Polygon', logo: '/images/partners/polygon.png' },
                { name: 'OpenSea', logo: '/images/partners/opensea.png' },
                { name: 'Animoca', logo: '/images/partners/animoca.png' },
                { name: 'Base', logo: '/images/partners/base.png' },
              ];
              // Sonsuz döngü için iki kez render
              return [...logos, ...logos].map((partner, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 flex items-center justify-center bg-[#23180F]/80 rounded-lg border border-[#D4A017]/20 shadow-md h-12 w-12 md:h-14 md:w-14 aspect-square transition-all duration-300 hover:opacity-100 opacity-80"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain', filter: 'grayscale(1) brightness(0.85)' }}
                    />
                  </div>
                </div>
              ));
            })()}
          </div>
          <style jsx>{`
            .marquee {
              animation: marquee-scroll 16s linear infinite;
            }
            @keyframes marquee-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>
      </motion.div>
    </section>
  );
}