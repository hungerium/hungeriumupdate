'use client';

import { motion } from 'framer-motion';
import { FaGamepad, FaUsers, FaCoins } from 'react-icons/fa';
import { GiBee } from 'react-icons/gi';

export default function Features() {
  const features = [
    { 
      icon: <GiBee />, 
      title: 'Eat-to-Earn', 
      desc: 'Earn HUNGX tokens by participating in the Hungerium ecosystem!' 
    },
    { 
      icon: <FaGamepad />, 
      title: 'Play-to-Earn', 
      desc: 'Engage in exciting games to earn HUNGX rewards' 
    },
    { 
      icon: <FaUsers />, 
      title: 'SocialFi', 
      desc: 'Connect with the Hungerium community worldwide' 
    },
    { 
      icon: <FaCoins />, 
      title: 'Staking', 
      desc: 'Earn passive income through staking HUNGX' 
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 0 30px rgba(30, 144, 255, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <section className="py-24 bg-[#1A0F0A]/50">
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#D4A017] to-[#A77B06]"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Key Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {features.map((feature, idx) => (
            <div key={idx} className="rounded-2xl bg-gradient-to-br from-[#101c3a] via-[#0e2247] to-[#1e90ff] border border-[#1e90ff]/30 shadow-lg hover:shadow-[#1e90ff]/40 transition-all duration-300 p-6 flex flex-col items-center text-center">
              <div className="mb-4 text-4xl text-[#00bfff]">{feature.icon}</div>
              <h4 className="text-lg font-bold mb-2 text-[#1e90ff]">{feature.title}</h4>
              <p className="text-[#b3e0ff]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}