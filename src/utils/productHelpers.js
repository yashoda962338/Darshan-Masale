// src/utils/productHelpers.js
import productsData from '../data/products.json'

export const getProductsByCategory = (categorySlug) => {
  const categoryMap = {
    'powder-collection': 'Powder Collection',
    'premium-masala': 'Premium Masala Collection',
    'special-cooking': 'Special Cooking Collection',
    'budget-pouch': 'Budget Pouch Collection',
    'traditional-masala': 'Traditional Masala Collection',
    'kolhapuri-collection': 'Kolhapuri Collection',
    'special-products': 'Special Products'
  }
  
  const categoryName = categoryMap[categorySlug]
  if (!categoryName) return []
  
  return productsData.filter(p => p.category === categoryName)
}

export const getFeaturedProducts = () => {
  return productsData.filter(p => p.featured)
}

export const getBestSellers = () => {
  return productsData.filter(p => p.bestseller)
}

export const getProductBySlug = (slug) => {
  return productsData.find(p => p.slug === slug)
}

export const getRelatedProducts = (productId, category, limit = 4) => {
  return productsData
    .filter(p => p.id !== productId && p.category === category)
    .slice(0, limit)
}