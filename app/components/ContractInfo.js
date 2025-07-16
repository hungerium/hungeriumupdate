'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ContractInfo() {
  const [copyStatus, setCopyStatus] = useState('');
  const contractAddress = '0xF87A2A0ADcBE4591d8d013171E6f1552D2349004';

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for insecure context or unsupported browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setCopyStatus('Failed to copy');
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-[#0a1833] via-[#0e2247] to-[#1e90ff]" id="contract-info" style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-[#101c3a]/80 p-6 rounded-xl shadow-lg border border-[#1e90ff]/20 text-white transition-all duration-300"
        >
          <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#D4A017] to-[#A77B06] text-center">
            HUNGX Contract Info
          </h2>
          {/* New Contract */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#1e90ff] mb-2">HUNGX Contract</h3>
            <div className="flex items-center bg-[#101c3a] p-3 rounded-lg border border-[#1e90ff]/20">
              <code className="text-[#E8D5B5] flex-1 font-mono text-sm overflow-x-auto">
                {contractAddress}
              </code>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(contractAddress)}
                className="ml-2 p-2 rounded-lg bg-[#1e90ff]/20 hover:bg-[#1e90ff]/40 focus:outline-none focus:ring-2 focus:ring-[#1e90ff] relative text-[#1e90ff]"
                aria-label="Copy contract address"
              >
                {/* FontAwesome fallback: unicode icon if not loaded */}
                <i className="fas fa-copy" style={{ fontStyle: 'normal' }}>
                  <span style={{ fontFamily: 'inherit' }}>&#128203;</span>
                </i>
                {copyStatus && (
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute left-1/2 -translate-x-1/2 -top-7 px-2 py-1 rounded shadow text-xs ${copyStatus === 'Copied!' ? 'bg-[#1e90ff] text-white' : 'bg-red-600 text-white'}`}
                  >
                    {copyStatus}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a
              href={`https://basescan.org/address/${contractAddress}#code`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#1e90ff] to-[#00bfff] py-2 px-4 rounded-lg text-white text-center text-sm font-semibold shadow hover:from-[#1560bd] hover:to-[#009acd] transition-colors duration-200"
              style={{ pointerEvents: 'auto' }}
            >
              View on BaseScan
            </a>
            <a
              href="https://app.uniswap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#FFD700] to-[#1e90ff] py-2 px-4 rounded-lg text-[#101c3a] text-center text-sm font-semibold shadow hover:from-[#ffe066] hover:to-[#1e90ff] transition-colors duration-200"
              style={{ pointerEvents: 'auto' }}
            >
              Trade on Uniswap
            </a>
          </div>

          {/* Honeypot Check - moved lower for clarity */}
          <div className="mt-6 mb-4 flex items-center gap-3">
            <span className="inline-block px-3 py-1 rounded-full bg-[#1e90ff] text-xs font-semibold text-white">Honeypot Check: Passed (Confirmed)</span>
            <a
              href={`https://honeypot.is/?address=${contractAddress}&chain=bsc`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1e90ff] underline text-xs hover:text-[#FFD700] transition-colors duration-200"
              style={{ pointerEvents: 'auto' }}
            >
              View on Honeypot.is
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}