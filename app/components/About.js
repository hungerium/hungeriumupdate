'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

const cards = [
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#00bfff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
    title: 'Modular Ready',
    desc: 'V2 contract ready for DAO, NFT, Social, and Cross-chain modules.'
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#00bfff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v12"></path><path d="M8 10h8"></path><path d="M8 14h8"></path></svg>,
    title: 'Enhanced Staking',
    desc: '5% APY with 50K minimum stake and early unstake protection.'
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#00bfff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    title: 'Future DAO',
    desc: 'Royal Bee holders will get DAO membership for protocol governance in Q2.'
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#00bfff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10"><rect x="2" y="6" width="20" height="12" rx="2"></rect><path d="M6 12h4"></path><path d="M8 10v4"></path><path d="M15 13h.01"></path><path d="M18 11h.01"></path></svg>,
    title: 'Gaming Ecosystem',
    desc: 'Play-to-earn, eat-to-earn, and community rewards in a blue, bee-powered world.'
  }
];

const About = ({ id }) => {
  const sectionRef = useRef(null);

  // Scroll observer for animations
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.reveal-on-scroll').forEach(element => {
      observer.observe(element);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} ref={sectionRef} className="py-20 bg-gradient-to-b from-[#0a1833] via-[#0e2247] to-[#1e90ff] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#1e90ff] blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-[#00bfff] blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16 reveal-on-scroll">
          <h2 
            className="text-4xl md:text-5xl font-bold text-[#FFD700] mb-6"
          >
            About Hungerium
          </h2>
          
          <p 
            className="text-lg text-white max-w-3xl mx-auto"
          >
            Hungerium is a modular ecosystem combining gaming, DeFi, and community governance. Our advanced smart contract architecture provides sustainable rewards through play-to-earn, eat-to-earn, and enhanced staking mechanisms. Join the blue revolution powered by the bee!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Left side - Coffy mascot - Improved mask and rounded edges */}
          <div className="reveal-on-scroll flex justify-center items-center">
            <div className="relative w-full max-w-xs">
              <div className="w-full aspect-square relative">
                {/* Image path: /public/images/coffy-mascot.png */}
                <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                  {/* Soft gradient overlay for better edge blending */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#1A0F0A]/40 via-transparent to-transparent z-10 pointer-events-none"></div>
                  
                  {/* Background light effect to help with blending */}
                  <div className="absolute inset-0 rounded-full bg-[#D4A017]/5"></div>
                  
                  {/* The image with better masking */}
                  <div className="relative w-[90%] h-[90%] flex items-center justify-center">
                    <Image
                      src="/images/coffy-mascot.png"
                      alt="Coffy Mascot"
                      width={280}
                      height={280}
                      className="object-contain animate-float"
                      priority={true}
                      loading="eager"
                      style={{ 
                        objectFit: 'contain',
                        WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 85%)',
                        maskImage: 'radial-gradient(circle, black 60%, transparent 85%)'
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Bottom light effect */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-[#D4A017]/20 blur-3xl rounded-full -z-10"></div>
            </div>
          </div>

          {/* Right side - Information */}
          <div className="flex flex-col justify-center reveal-on-scroll">
            <div 
              className="space-y-6"
            >
              <h3 className="text-2xl md:text-3xl font-semibold text-[#FFD700]">Our Mission</h3>
              <p className="text-white/90">
                Our V2 modular smart contract creates a transparent, secure ecosystem that revolutionizes 
                the coffee gaming experience. With advanced sybil protection and a character-based reward 
                system, we provide sustainable value across our entire gaming ecosystem.
              </p>
              <p className="text-white/90">
                Through our enhanced staking system (5% APY) and modular-ready architecture planned for 
                DAO, NFT, Social, and Cross-chain modules in Q4, token holders will actively shape the project's future 
                while earning through engaging gameplay and community participation.
              </p>
              <div className="pt-4">
                <a
                  href="#tokenomics"
                  className="bg-gradient-to-r from-[#1e90ff] to-[#00bfff] text-white font-bold py-3 px-8 rounded-xl shadow hover:from-[#1560bd] hover:to-[#009acd] transition-colors duration-200 inline-block"
                >
                  Explore Tokenomics
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section - More minimal */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
        >
          {/* Kartlar modern mavi temada */}
          {cards.map((card, idx) => (
            <div key={idx} className="rounded-2xl bg-gradient-to-br from-[#101c3a] via-[#0e2247] to-[#1e90ff] border border-[#1e90ff]/30 shadow-lg hover:shadow-[#1e90ff]/40 transition-all duration-300 p-6 flex flex-col items-center text-center">
              <div className="mb-4 text-4xl text-[#00bfff]">{card.icon}</div>
              <h4 className="text-lg font-bold mb-2 text-[#FFD700]">{card.title}</h4>
              <p className="text-white">{card.desc}</p>
            </div>
          ))}
        </div>
        
        {/* Minimal Call to Action */}
        <div className="mt-12 text-center reveal-on-scroll">
          <a
            href="#community"
            className="bg-gradient-to-r from-[#FFD700] to-[#1e90ff] text-[#101c3a] font-bold py-3 px-8 rounded-xl shadow hover:from-[#ffe066] hover:to-[#1560bd] transition-colors duration-200 mx-auto inline-block"
          >
            Join Community
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
