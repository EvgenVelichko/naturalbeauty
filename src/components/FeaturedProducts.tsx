import React, { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import ProductCard from './ProductCard'
import { Product, getFeaturedProducts } from '../lib/supabase'

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
    
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project') || supabaseKey.includes('your-anon-key')) {
        throw new Error('Supabase not configured')
      }
      
      const data = await getFeaturedProducts()
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching featured products:', error)
      setError('Database not connected')
     
      setProducts([
        {
          id: '1',
          name: 'Luxury Face Serum',
          description: 'Anti-aging serum with vitamin C and hyaluronic acid',
          price: 89.99,
          category: 'Skincare',
          image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
          featured: true,
          created_at: '',
          updated_at: ''
        },
        {
          id: '2',
          name: 'Matte Lipstick Set',
          description: 'Long-lasting matte lipstick in 6 beautiful shades',
          price: 45.99,
          category: 'Makeup',
          image_url: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
          featured: true,
          created_at: '',
          updated_at: ''
        },
        {
          id: '3',
          name: 'Hydrating Face Mask',
          description: 'Deep moisturizing mask with natural ingredients',
          price: 29.99,
          category: 'Skincare',
          image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
          featured: true,
          created_at: '',
          updated_at: ''
        },
        {
          id: '4',
          name: 'Eye Shadow Palette',
          description: '12-color eyeshadow palette with shimmer and matte finishes',
          price: 52.99,
          category: 'Makeup',
          image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
          featured: true,
          created_at: '',
          updated_at: ''
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    console.log('Adding to cart:', product.name)
    
    alert(`Added ${product.name} to cart!`)
  }

  if (loading) {
    return (
      <section id="featured-products\" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-10 bg-gray-200 rounded w-80 mx-auto animate-pulse mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="featured-products" className="py-20 bg-white relative overflow-hidden">
     
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
       
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our most popular beauty essentials, carefully curated for your skincare and makeup routine.
          </p>
          {error && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 rounded-xl max-w-md mx-auto">
              <p className="font-medium">Demo Mode</p>
              <p className="text-sm">Connect to Supabase to manage real products</p>
            </div>
          )}
        </div>

      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

      
        <div className="text-center">
          <button className="group bg-gradient-to-r from-rose-500 to-pink-600 text-white px-10 py-4 rounded-full hover:from-rose-600 hover:to-pink-700 transition-all duration-300 flex items-center space-x-3 mx-auto font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <span>View All Products</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts