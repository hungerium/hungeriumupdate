'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary-dark" id="hero">
      {/* Removed: animated background and particles */}
      <div className="container relative z-10 mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Sol Kısım (Metin) */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-[#FFD700] leading-tight animate-fadeIn font-heading"
            >
              HUNGERIUM TOKEN
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-white mb-8 max-w-xl animate-fadeIn font-body"
            >
              Empowering the food economy with blockchain! The first{' '}
              <motion.span
                className="text-[#1e90ff] font-semibold"
                whileHover={{ scale: 1.05, color: '#00bfff' }}
                transition={{ duration: 0.2 }}
              >
                Eat-to-Earn
              </motion.span>
              ,{' '}
              <motion.span
                className="text-[#00bfff] font-semibold"
                whileHover={{ scale: 1.05, color: '#0077ff' }}
                transition={{ duration: 0.2 }}
              >
                Play-to-Earn
              </motion.span>
              , and{' '}
              <motion.span
                className="text-[#0077ff] font-semibold"
                whileHover={{ scale: 1.05, color: '#1e90ff' }}
                transition={{ duration: 0.2 }}
              >
                SocialFi
              </motion.span>{' '}
              token on Base Network. Powered by the community, inspired by the bee!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-4 sm:gap-6 w-full sm:w-auto mb-12 animate-fadeIn"
            >
              <span className="btn-primary flex items-center justify-center group w-full sm:w-auto animate-scaleIn font-body">
                <span>Trade Now</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <span className="ml-3 text-[#D4A017] text-xs font-semibold">Listing Coming Soon</span>
              <motion.a
                href="#tokenomics"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary w-full sm:w-auto text-center animate-scaleIn font-body"
              >
                Learn More
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Sağ Kısım (Logo) */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-72 h-72">
              <motion.div className="absolute inset-0 bg-accent-amber/20 rounded-full blur-2xl animate-pulseGlow" />
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Image
                  src="/images/coffy-hero.png"
                  alt="Coffy Hero"
                  width={256}
                  height={256}
                  className="relative animate-float shadow-[0_0_30px_#D4A017]"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}