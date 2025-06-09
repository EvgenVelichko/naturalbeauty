import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Save,
  X,
  AlertCircle,
  Database,
} from "lucide-react";
import {
  Product,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../lib/supabase";

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    featured: false,
  });

  useEffect(() => {
    checkSupabaseConnection();
    fetchProducts();
  }, []);

  const checkSupabaseConnection = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const connected =
      supabaseUrl &&
      supabaseKey &&
      !supabaseUrl.includes("your-project") &&
      !supabaseKey.includes("your-anon-key");

    setIsSupabaseConnected(connected);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isSupabaseConnected) {
        setProducts([
          {
            id: "demo-1",
            name: "Luxury Face Serum (Demo)",
            description: "Anti-aging serum with vitamin C and hyaluronic acid",
            price: 89.99,
            category: "Skincare",
            image_url:
              "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            featured: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "demo-2",
            name: "Matte Lipstick Set (Demo)",
            description: "Long-lasting matte lipstick in 6 beautiful shades",
            price: 45.99,
            category: "Makeup",
            image_url:
              "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
            featured: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
        return;
      }

      const data = await getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(
        "Failed to connect to database. Please check your Supabase configuration."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSupabaseConnected) {
      alert("Please connect to Supabase first to manage real products");
      return;
    }

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
      setError(null);

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

      // Reset form and refresh products
      resetForm();
      await fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      setError("Error saving product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    if (!isSupabaseConnected) {
      alert("Please connect to Supabase first to edit products");
      return;
    }

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
    if (!isSupabaseConnected) {
      alert("Please connect to Supabase first to delete products");
      return;
    }

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setError(null);
        await deleteProduct(id);
        await fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        setError("Error deleting product. Please try again.");
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
    setError(null);
  };

  const categories = [
    "Skincare",
    "Makeup",
    "Fragrances",
    "Hair Care",
    "Body Care",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Database Connection Status */}
        {!isSupabaseConnected && (
          <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Database className="w-6 h-6 text-blue-500 mt-1" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">
                  Database Connection Required
                </h3>
                <p className="text-blue-700 text-sm mb-3">
                  You're currently viewing demo products. To manage real
                  products, please connect to Supabase.
                </p>
                <div className="bg-blue-100 p-3 rounded text-sm text-blue-800">
                  <p className="font-medium mb-1">To connect:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Click "Connect to Supabase" in the top right corner</li>
                    <li>Follow the setup instructions</li>
                    <li>Your database will be automatically configured</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {!isSupabaseConnected && (
                  <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg text-sm">
                    Demo mode: Connect to Supabase to save real products
                  </div>
                )}

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
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
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
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first product to the catalog.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors"
            >
              Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
