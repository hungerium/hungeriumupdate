'use client';

import { motion } from 'framer-motion';

export default function BeeAnimation() {
  return (
    <div className="relative w-24 h-24 mx-auto">
      <motion.div
        className="absolute w-16 h-16 bg-[#1e90ff] rounded-full"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-12 h-12 bg-[#b3e0ff] rounded-full top-2 left-2"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}