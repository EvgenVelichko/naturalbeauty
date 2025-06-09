import React from 'react'
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold">Beauty</span>
            </div>
            <p className="text-gray-400 mb-4">
              Discover your natural beauty with our premium collection of cosmetics and skincare products.
            </p>
            <div className="flex space-x-4">
              <Instagram className="w-5 h-5 text-gray-400 hover:text-rose-400 cursor-pointer transition-colors" />
              <Facebook className="w-5 h-5 text-gray-400 hover:text-rose-400 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-rose-400 cursor-pointer transition-colors" />
            </div>
          </div>

       
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Products</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

         
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

        
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4" />
                <span>support@brandbeauty.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4" />
                <span>123 Beauty St, New York, NY</span>
              </div>
            </div>
          </div>
        </div>

       
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest products and exclusive offers</p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-rose-500"
              />
              <button className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

      
        <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
          <p>&copy; 2025 Brand Beauty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer