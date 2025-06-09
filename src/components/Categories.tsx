import React from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'

const categories = [
  {
    id: 1,
    name: 'Skincare',
    description: 'Premium skincare for all skin types',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    count: '45+ Products',
    color: 'from-rose-400 to-pink-500'
  },
  {
    id: 2,
    name: 'Makeup',
    description: 'Professional makeup essentials',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    count: '60+ Products',
    color: 'from-purple-400 to-pink-500'
  },
  {
    id: 3,
    name: 'Fragrances',
    description: 'Luxury perfumes and body sprays',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    count: '25+ Products',
    color: 'from-indigo-400 to-purple-500'
  },
  {
    id: 4,
    name: 'Hair Care',
    description: 'Nourishing hair care solutions',
    image: 'https://images.unsplash.com/photo-1522338140262-f46f5913618f?w=400&h=300&fit=crop&crop=center&auto=format&q=80',
    count: '30+ Products',
    color: 'from-emerald-400 to-teal-500'
  }
]

const Categories = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-rose-50 relative overflow-hidden">
    
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive range of beauty products organized by category to find exactly what you need.
          </p>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
            >
            
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
              </div>

             
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-rose-500 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                    {category.count}
                  </span>
                  <div className="flex items-center space-x-2 text-rose-500 group-hover:text-rose-600 transition-colors">
                    <span className="text-sm font-medium">Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

       
        <div className="mt-20 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="absolute top-8 right-8">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="absolute bottom-4 left-8">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="absolute bottom-8 right-4">
              <Sparkles className="w-10 h-10" />
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              New Customer Special Offer
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Get 20% off your first order with code WELCOME20. Join thousands of satisfied customers!
            </p>
            <button className="bg-white text-rose-500 px-10 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Shop Now & Save
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Categories