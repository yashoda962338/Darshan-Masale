export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price)
}

export const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
}

export const generateStars = (rating) => {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return [...Array(full)].map(() => 'full')
    .concat(half ? ['half'] : [])
    .concat([...Array(empty)].map(() => 'empty'))
}