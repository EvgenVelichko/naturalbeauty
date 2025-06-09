import React, { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { searchProducts } from '../lib/admin'
import { Product } from '../lib/supabase'

interface SearchBarProps {
  onProductSelect?: (product: Product) => void
  placeholder?: string
  className?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onProductSelect, 
  placeholder = "Search products...",
  className = ""
}) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.trim()) {
        handleSearch()
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const handleSearch = async () => {
    if (!query.trim()) return

    try {
      setLoading(true)
      const searchResults = await searchProducts(query)
      setResults(searchResults.slice(0, 8)) 
      setIsOpen(true)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleProductClick = (product: Product) => {
    setQuery('')
    setIsOpen(false)
    onProductSelect?.(product)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white shadow-sm"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=60&h=60&fit=crop&crop=center&auto=format&q=80'}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=60&h=60&fit=crop&crop=center&auto=format&q=80';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {product.category} • ${product.price}
                    </p>
                  </div>
                  {product.featured && (
                    <span className="bg-rose-100 text-rose-800 text-xs px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-4 text-center">
              <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No products found for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default SearchBar