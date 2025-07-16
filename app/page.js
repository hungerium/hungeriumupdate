'use client';

import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Roadmap from './components/Roadmap';
import Staking from './components/Staking';
import Whitepaper from './components/Whitepaper';
import Community from './components/Community';
import Footer from './components/Footer';
import GamesSection from './components/GamesSection';
import Tokenomics from './components/Tokenomics';
import ContractInfo from './components/ContractInfo';
import Partners from './components/Partners';
import About from './components/About';

export default function Home() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#2A1810',
            color: '#E8D5B5',
            border: '1px solid #D4A017',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 25px rgba(212, 160, 23, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#D4A017',
              secondary: '#2A1810',
            },
          },
          error: {
            iconTheme: {
              primary: '#DC2626',
              secondary: '#2A1810',
            },
          },
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-[#1A0F0A] via-[#2A1810] to-[#1A0F0A] text-white">
        <Navbar />
        <main>
          <Hero id="hero" />
          <About id="about" />
          <GamesSection id="games" />
          <Staking id="staking" />
          <Tokenomics />
          <ContractInfo />
          <Roadmap />
          <Partners />
          <Whitepaper />
          <Community />
          <Footer />
        </main>
      </div>
    </>
  );
}