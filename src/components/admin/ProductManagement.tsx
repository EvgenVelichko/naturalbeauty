import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Filter, X, Save } from "lucide-react";
import {
  Product,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../lib/supabase";
import { searchProducts } from "../../lib/admin";

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    featured: false,
  });

  const categories = [
    "Skincare",
    "Makeup",
    "Fragrances",
    "Hair Care",
    "Body Care",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      let results = products;

      if (searchQuery.trim()) {
        results = await searchProducts(searchQuery);
      }

      if (selectedCategory) {
        results = results.filter(
          (product) => product.category === selectedCategory
        );
      }

      setFilteredProducts(results);
    } catch (error) {
      console.error("Error searching products:", error);
      setFilteredProducts(products);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setSaving(true);

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image_url:
          formData.image_url ||
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
        featured: formData.featured,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }

      resetForm();
      await fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image_url: product.image_url,
      featured: product.featured,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        await fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image_url: "",
      featured: false,
    });
    setShowAddForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products... (e.g., 'Духи', 'Крем')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {filteredProducts.length} of {products.length} products
            </span>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    rows={3}
                    placeholder="Enter product description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to use default image
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="mr-2 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm font-medium text-gray-700"
                  >
                    Featured Product
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {saving
                        ? "Saving..."
                        : editingProduct
                        ? "Update"
                        : "Save"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-square bg-gray-100 rounded-t-xl overflow-hidden">
              <img
                src={
                  product.image_url ||
                  `https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop&crop=center&auto=format&q=80`
                }
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop&crop=center&auto=format&q=80";
                }}
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-1">
                  {product.name}
                </h3>
                {product.featured && (
                  <span className="bg-rose-100 text-rose-800 text-xs px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-gray-900">
                  ${product.price}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1 text-sm"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-1 text-sm"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery || selectedCategory
              ? "No products found"
              : "No products yet"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || selectedCategory
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first product to the catalog"}
          </p>
          {!searchQuery && !selectedCategory && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors"
            >
              Add Your First Product
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
