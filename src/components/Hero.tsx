import React, { useState } from 'react'
import { ChevronRight, Sparkles, Star, Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './auth/AuthModal'

const Hero = () => {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleGetStarted = () => {
    if (user) {
     
      document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      setShowAuthModal(true)
    }
  }

  return (
    <>
      <section className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 min-h-[700px] flex items-center overflow-hidden">
       
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-20 h-20 bg-rose-200 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-pink-200 rounded-full opacity-40 animate-bounce"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-purple-200 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute bottom-40 right-10 w-24 h-24 bg-rose-100 rounded-full opacity-30 animate-bounce"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
            <div className="space-y-8">
            
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-rose-200">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-medium text-rose-600">New Collection Available</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                Discover Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 block">
                  Natural Beauty
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Experience luxury skincare and cosmetics crafted with premium ingredients. 
                Transform your beauty routine with our exclusive collection designed for every skin type.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleGetStarted}
                  className="group bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-4 rounded-full hover:from-rose-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <span>{user ? 'Shop Collection' : 'Get Started'}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium">
                  Learn More
                </button>
              </div>
              
           
              <div className="flex space-x-8 pt-8">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <div className="text-3xl font-bold text-gray-900">50K+</div>
                    <Heart className="w-5 h-5 text-rose-500" />
                  </div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">100+</div>
                  <div className="text-sm text-gray-600">Premium Products</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <div className="text-3xl font-bold text-gray-900">4.9</div>
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </div>
                  <div className="text-sm text-gray-600">Customer Rating</div>
                </div>
              </div>
            </div>

      
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop&crop=center&auto=format&q=80" 
                  alt="Beauty Products" 
                  className="w-full h-full object-cover"
                />
              </div>
              
           
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl animate-float">
                <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl animate-float-delayed">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">Free Shipping</div>
                  <div className="text-sm text-gray-600">On orders over $50</div>
                </div>
              </div>

              <div className="absolute top-1/2 -left-4 bg-white rounded-full p-3 shadow-lg animate-pulse">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

   
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signup"
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 1.5s;
        }
      `}</style>
    </>
  )
}

export default Hero