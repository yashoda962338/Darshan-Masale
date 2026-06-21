import React from 'react'
import { Helmet } from 'react-helmet-async'
import SectionHeader from '../components/ui/SectionHeader'

const OurProcess = () => {
  return (
    <div className="page-wrapper bg-background-cream text-primary-maroon">
      <Helmet>
        <title>Our Process | Darshan Masale</title>
        <meta
          name="description"
          content="Discover how Darshan Masale crafts premium spices with quality sourcing, traditional blending, and careful packaging."
        />
      </Helmet>

      <SectionHeader
        title="Our Process"
        subtitle="From premium harvest to crafted masale"
        centered={false}
        className="mb-12"
      />

      <section className="container-custom space-y-16 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-primary-maroon/10 bg-white p-8 shadow-sm">
            <span className="text-xs uppercase tracking-widest text-secondary-gold font-semibold">
              Step 1
            </span>
            <h3 className="mt-4 text-2xl font-semibold">Premium Sourcing</h3>
            <p className="mt-3 text-sm leading-relaxed text-secondary-text">
              We source only the finest spices from trusted growers, focusing on freshness,
              aroma, and sustainable farming practices.
            </p>
          </div>
          <div className="rounded-[2rem] border border-primary-maroon/10 bg-white p-8 shadow-sm">
            <span className="text-xs uppercase tracking-widest text-secondary-gold font-semibold">
              Step 2
            </span>
            <h3 className="mt-4 text-2xl font-semibold">Cleaning & Sorting</h3>
            <p className="mt-3 text-sm leading-relaxed text-secondary-text">
              Every spice is carefully cleaned and sorted to ensure purity before the
              grinding process begins.
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-primary-maroon/10 bg-white p-8 shadow-sm">
            <span className="text-xs uppercase tracking-widest text-secondary-gold font-semibold">
              Step 3
            </span>
            <h3 className="mt-4 text-2xl font-semibold">Authentic Blending</h3>
            <p className="mt-3 text-sm leading-relaxed text-secondary-text">
              Our blends are crafted using traditional recipes and exact spice ratios for
              consistent flavor in every packet.
            </p>
          </div>
          <div className="rounded-[2rem] border border-primary-maroon/10 bg-white p-8 shadow-sm">
            <span className="text-xs uppercase tracking-widest text-secondary-gold font-semibold">
              Step 4
            </span>
            <h3 className="mt-4 text-2xl font-semibold">Packaging & Dispatch</h3>
            <p className="mt-3 text-sm leading-relaxed text-secondary-text">
              Packaged with care in airtight sachets, our masale are ready to reach your
              kitchen with full aroma and freshness preserved.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default OurProcess
