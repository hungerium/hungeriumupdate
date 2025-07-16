'use client';

import { motion } from 'framer-motion';

export default function Roadmap() {
  const roadmapData = [
    {
      quarter: "Q1 2025 - V2 Core Foundation",
      status: "✅ COMPLETED",
      items: [
        "V2 Smart Contract Deployment with Modular Ready Architecture",
        "Enhanced Staking System (50K min, 5% APY, 7-day lock)",
        "5-Character System with Fixed Prices (1M-10M COFFY)",
        "Game Rewards with Sybil Protection (5K daily limit)",
        "Security Audits & BSC Mainnet Launch"
      ]
    },
    {
      quarter: "Q2 2025 - Module Ecosystem Launch",
      status: "🔄 IN PROGRESS",
      items: [
        "DAO Module - Community governance for protocol decisions",
        "Social Module - Step tracking & social rewards integration",
        "NFT Module - Character-to-NFT migration system",
        "Mobile App Backend - Native mobile game integration",
        "Cross-chain Module - Polygon & Base network support"
      ]
    },
    {
      quarter: "Q3 2025 - Gaming & DeFi Expansion",
      status: "📅 PLANNED",
      items: [
        "Advanced Character System - Legendary Dragon DAO membership",
        "Cross-chain Bridge - Multi-network token transfers",
        "Social Gaming Features - Community challenges & tournaments",
        "DeFi Integrations - Yield farming & liquidity mining",
        "Mobile App Launch - iOS & Android native gaming"
      ]
    },
    {
      quarter: "Q4 2025 - Ecosystem Maturation",
      status: "📅 FUTURE",
      items: [
        "Full DAO Governance - Community-driven protocol upgrades",
        "Metaverse Integration - Virtual coffee shops & gaming worlds",
        "Enterprise Partnerships - Real-world coffee shop integrations",
        "Advanced Analytics - On-chain gaming metrics & insights",
        "Global Expansion - Multi-language support & regional partnerships"
      ]
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-[#0a1833] via-[#0e2247] to-[#1e90ff] text-white" id="roadmap">
      {/* Arkaplan efektleri */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, #1e90ff 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, #00bfff 0%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, #1e90ff 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-6 text-[#FFD700]">Roadmap</h2>
          <div className="w-24 h-1 bg-[#1e90ff] mx-auto rounded-full"></div>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {roadmapData.map((phase, index) => (
            <motion.div
              key={phase.quarter}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center gap-8 mb-12 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Quarter Circle */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-24 h-24 rounded-lg bg-gradient-to-br from-[#1e90ff] to-[#00bfff] flex items-center justify-center shadow-lg"
              >
                <div className="text-white text-center">
                  <div className="text-xl font-bold">{phase.quarter.split(' ')[0]}</div>
                  <div className="text-2xl font-bold">{phase.quarter.split(' ')[1]}</div>
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#182848] p-4 rounded-lg border border-[#1e90ff]/20 hover:border-[#00bfff] transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-white mb-3">
                    {phase.quarter}
                  </h3>
                  <p className="text-xs text-white mb-3">{phase.status}</p>
                  <ul className="space-y-2">
                    {phase.items.map((item, itemIndex) => (
                      <motion.li
                        key={itemIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: itemIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center text-white"
                      >
                        <span className="w-2 h-2 bg-[#1e90ff] rounded-full mr-2"></span>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}