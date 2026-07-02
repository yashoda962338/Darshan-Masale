import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

const Loader = () => {
  const containerRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
    })

    tl.to(textRef.current, {
      opacity: 0.4,
      duration: 1.5,
      ease: 'power1.inOut',
    }).to(textRef.current, {
      opacity: 1,
      duration: 1.5,
      ease: 'power1.inOut',
    })

    return () => tl.kill()
  }, [])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background-cream"
    >
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-primary-maroon border-t-secondary-gold flex items-center justify-center"
        >
          <span className="font-heading text-3xl md:text-4xl font-bold text-primary-maroon">DM</span>
        </motion.div>
        <div className="absolute -inset-4 rounded-full border-2 border-secondary-gold/20 animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <h2 ref={textRef} className="font-heading text-2xl md:text-3xl text-primary-maroon">
          Darshan Masale
        </h2>
        <p className="text-text-muted text-sm md:text-base mt-2 font-body tracking-wider">
          घरगुती चव... विश्वासाची परंपरा...
        </p>
      </motion.div>

      <motion.div
        className="absolute bottom-12 flex gap-2"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="w-2 h-2 rounded-full bg-primary-maroon" />
        <span className="w-2 h-2 rounded-full bg-secondary-gold" />
        <span className="w-2 h-2 rounded-full bg-accent-orange" />
      </motion.div>
    </motion.div>
  )
}

export default Loader