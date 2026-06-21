import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from '@studio-freight/lenis'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import ScrollToTop from '../components/common/ScrollToTop'

const MainLayout = () => {
  const location = useLocation()

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    })
  }, [])

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.6 } },
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-cream">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1 pt-16 md:pt-20"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default MainLayout