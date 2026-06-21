import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Users } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import SectionHeader from '../components/ui/SectionHeader'
import recipesData from '../data/recipes.json'

const Recipes = () => {
  const { language } = useLanguage()

  return (
    <>
      <Helmet>
        <title>Recipes with Darshan Masale - Authentic Indian Dishes</title>
        <meta name="description" content="Explore delicious Indian recipes using Darshan Masale premium spices. Step-by-step cooking guides." />
      </Helmet>

      <section className="section-padding bg-background-cream">
        <div className="container-custom">
          <SectionHeader
            title={language === 'mr' ? 'आमच्या पाककृती' : 'Our Recipes'}
            subtitle={language === 'mr' ? 'दर्शन मसाल्यांनी बनवलेले' : 'Made with Darshan Masale'}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {recipesData.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-premium group"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={recipe.image || '/images/placeholder.jpg'}
                    alt={language === 'mr' ? recipe.titleMr : recipe.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {recipe.prepTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {recipe.servings} servings
                    </span>
                    <span className={`px-2 py-0.5 rounded-full ${
                      recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-primary-maroon mt-2">
                    {language === 'mr' ? recipe.titleMr : recipe.title}
                  </h3>
                  <p className="text-sm text-text-muted mt-1">
                    {language === 'mr' ? recipe.descriptionMr : recipe.description}
                  </p>
                  <Link
                    to={`/recipes/${recipe.id}`}
                    className="inline-block mt-4 text-sm font-button font-medium text-secondary-gold hover:text-primary-maroon transition-colors"
                  >
                    View Full Recipe →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Recipes