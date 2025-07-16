'use client';

import { motion } from 'framer-motion';

export default function Community() {
  const socialLinks = [
    {
      platform: "Telegram",
      url: "https://t.me/hungeriumx",
      icon: "telegram-plane",
      bgColor: "bg-gradient-to-r from-[#1e90ff] to-[#00bfff]",
      hoverEffect: "hover:from-[#1560bd] hover:to-[#009acd]"
    },
    {
      platform: "X (Twitter)",
      url: "https://x.com/Hungeriumx",
      icon: "twitter",
      bgColor: "bg-gradient-to-r from-[#FFD700] to-[#1e90ff]",
      hoverEffect: "hover:from-[#ffe066] hover:to-[#1560bd]"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-[#101c3a] via-[#0e2247] to-[#1e90ff] relative overflow-hidden" id="community">
      {/* Arkaplan Efekti */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, #1e90ff 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, #00bfff 0%, transparent 50%)',
              'radial-gradient(circle at 20% 20%, #1e90ff 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-[#FFD700]">
            Join Our Community
          </h2>
          <div className="w-20 h-1 bg-[#D4A017] mx-auto mb-4"></div>
        </motion.div>

        {/* Sosyal Medya Butonları */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-2xl mx-auto">
          {socialLinks.map((social) => (
            <motion.a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`${social.bgColor} ${social.hoverEffect} px-8 py-4 rounded-xl flex items-center gap-3 w-full sm:w-auto justify-center transition-all duration-300 shadow-lg`}
            >
              <i className={`fab fa-${social.icon} text-2xl text-white`}></i>
              <span className="text-white font-bold">{social.platform}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}