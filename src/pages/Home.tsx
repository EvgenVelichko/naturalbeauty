import React from 'react'
import Hero from '../components/Hero'
import FeaturedProducts from '../components/FeaturedProducts'
import Categories from '../components/Categories'

const Home = () => {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <Categories />
    </main>
  )
}

export default Home