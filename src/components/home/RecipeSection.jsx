// src/components/home/RecipeSection.jsx - Premium Version
import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Clock, Users, ArrowRight, ChefHat, Star } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import SectionHeader from '../ui/SectionHeader'
import recipesData from '../../data/recipes.json'

const RecipeSection = () => {
  const { language } = useLanguage()
  const recipes = recipesData.slice(0, 3)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section ref={sectionRef} className="section-padding bg-background-cream relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-secondary-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-primary-maroon/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <SectionHeader
          title={language === 'mr' ? 'पाककृती' : 'Delicious Recipes'}
          subtitle={language === 'mr' ? 'आमच्या मसाल्यांनी बनवलेले' : 'Made with our premium spices'}
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="card-premium overflow-hidden bg-white/80 backdrop-blur-sm border border-secondary-gold/10 hover:border-secondary-gold/30 transition-all duration-500">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={recipe.image || '/images/placeholder.jpg'}
                    alt={language === 'mr' ? recipe.titleMr : recipe.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Premium Badge */}
                  <div className="absolute top-3 right-3 bg-glass backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                    <span className="text-[10px] font-button font-bold text-white tracking-wider uppercase">
                      {recipe.difficulty}
                    </span>
                  </div>

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-maroon/60 via-primary-maroon/20 to-transparent" />
                  
                  {/* Recipe Meta - Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        {recipe.prepTime}
                      </span>
                      <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Users className="w-3 h-3" />
                        {recipe.servings} servings
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h4 className="font-heading text-lg font-semibold text-primary-maroon group-hover:text-secondary-gold transition-colors">
                    {language === 'mr' ? recipe.titleMr : recipe.title}
                  </h4>
                  <p className="text-sm text-text-muted mt-2 line-clamp-2">
                    {language === 'mr' ? recipe.descriptionMr : recipe.description}
                  </p>

                  {/* Ingredients Preview */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {recipe.ingredients.slice(0, 3).map((ing, i) => (
                      <span key={i} className="text-[10px] bg-primary-maroon/5 text-primary-maroon px-2 py-0.5 rounded-full">
                        {ing.length > 15 ? ing.slice(0, 15) + '...' : ing}
                      </span>
                    ))}
                    {recipe.ingredients.length > 3 && (
                      <span className="text-[10px] bg-secondary-gold/10 text-secondary-gold-dark px-2 py-0.5 rounded-full">
                        +{recipe.ingredients.length - 3} more
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/recipes/${recipe.id}`}
                    className="inline-flex items-center gap-2 mt-4 text-xs font-button font-medium text-secondary-gold hover:text-primary-maroon transition-colors group-hover:gap-3"
                  >
                    <ChefHat className="w-4 h-4" />
                    <span>View Full Recipe</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/recipes"
            className="inline-flex items-center gap-2 font-button font-medium text-primary-maroon hover:text-secondary-gold transition-colors group"
          >
            <span>View All Recipes</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default RecipeSection