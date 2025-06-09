import React, { useState } from 'react'
import { ShoppingBag, Menu, X, User, LogOut, Settings, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { signOut } from '../lib/auth'
import { isUserAdmin } from '../lib/admin'
import AuthModal from './auth/AuthModal'
import SearchBar from './SearchBar'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { user, profile } = useAuth()

  React.useEffect(() => {
    if (user) {
      checkAdminStatus()
    }
  }, [user])

  const checkAdminStatus = async () => {
    if (user) {
      const adminStatus = await isUserAdmin(user.id)
      setIsAdmin(adminStatus)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setShowUserMenu(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const handleProductSelect = (product: any) => {
    console.log('Selected product:', product)
  
  }

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900 group-hover:text-rose-500 transition-colors">Beauty</span>
            </Link>

           
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-rose-500 transition-colors font-medium relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-rose-500 transition-colors font-medium relative group">
                Products
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/categories" className="text-gray-700 hover:text-rose-500 transition-colors font-medium relative group">
                Categories
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-rose-500 transition-colors font-medium relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-rose-500 transition-colors font-medium relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>

         
            <div className="hidden lg:block flex-1 max-w-md mx-8">
              <SearchBar onProductSelect={handleProductSelect} />
            </div>

       
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-rose-500 transition-colors relative p-2 hover:bg-rose-50 rounded-full">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">2</span>
              </button>

             
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-full"
                  >
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile" 
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{profile?.full_name || 'User'}</p>
                        <p className="text-sm text-gray-500">{profile?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Profile Settings</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <button
                    onClick={() => openAuthModal('signin')}
                   className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all duration-300 font-medium"
                  >
                    Sign In
                  </button>
                 
                </div>
              )}
              
            
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-700 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-full"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

       
          <div className="lg:hidden pb-4">
            <SearchBar onProductSelect={handleProductSelect} />
          </div>

         
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <nav className="py-4 space-y-2">
                <Link to="/" className="block py-2 text-gray-700 hover:text-rose-500 transition-colors font-medium">Home</Link>
                <Link to="/products" className="block py-2 text-gray-700 hover:text-rose-500 transition-colors font-medium">Products</Link>
                <Link to="/categories" className="block py-2 text-gray-700 hover:text-rose-500 transition-colors font-medium">Categories</Link>
                <Link to="/about" className="block py-2 text-gray-700 hover:text-rose-500 transition-colors font-medium">About</Link>
                <Link to="/contact" className="block py-2 text-gray-700 hover:text-rose-500 transition-colors font-medium">Contact</Link>
                
                {!user && (
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <button
                      onClick={() => openAuthModal('signin')}
                      className="block w-full text-left py-2 text-gray-700 hover:text-rose-500 transition-colors font-medium"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => openAuthModal('signup')}
                      className="block w-full text-left py-2 text-rose-500 hover:text-rose-600 transition-colors font-medium"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

    
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  )
}

export default Header