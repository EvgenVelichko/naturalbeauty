/*
  # Create products table for beauty brand website

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, required) - Product name
      - `description` (text, required) - Product description
      - `price` (decimal, required) - Product price
      - `category` (text, required) - Product category
      - `image_url` (text) - Product image URL
      - `featured` (boolean, default false) - Whether product is featured
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access
    - Add policy for authenticated users to manage products (admin)
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  category text NOT NULL,
  image_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Allow public read access to products"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to insert products
CREATE POLICY "Allow authenticated users to insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for authenticated users to update products
CREATE POLICY "Allow authenticated users to update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy for authenticated users to delete products
CREATE POLICY "Allow authenticated users to delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO products (name, description, price, category, image_url, featured) VALUES
('Luxury Face Serum', 'Anti-aging serum with vitamin C and hyaluronic acid for radiant, youthful skin', 89.99, 'Skincare', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center&auto=format&q=80', true),
('Matte Lipstick Set', 'Long-lasting matte lipstick collection in 6 beautiful, highly-pigmented shades', 45.99, 'Makeup', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=400&fit=crop&crop=center&auto=format&q=80', true),
('Hydrating Face Mask', 'Deep moisturizing face mask with natural ingredients for glowing skin', 29.99, 'Skincare', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&crop=center&auto=format&q=80', true),
('Eye Shadow Palette', '12-color eyeshadow palette with shimmer and matte finishes for versatile looks', 52.99, 'Makeup', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop&crop=center&auto=format&q=80', true),
('Gentle Cleanser', 'Gentle daily facial cleanser suitable for all skin types', 24.99, 'Skincare', 'https://images.unsplash.com/photo-1556228578-dd5799e0d622?w=400&h=400&fit=crop&crop=center&auto=format&q=80', false),
('Foundation Stick', 'Full coverage foundation stick with SPF 15 protection', 35.99, 'Makeup', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop&crop=center&auto=format&q=80', false),
('Rose Perfume', 'Elegant rose-scented perfume with long-lasting fragrance', 75.99, 'Fragrances', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&crop=center&auto=format&q=80', false),
('Hair Repair Serum', 'Nourishing hair serum for damaged and dry hair', 42.99, 'Hair Care', 'https://images.unsplash.com/photo-1522338140262-f46f5913618f?w=400&h=400&fit=crop&crop=center&auto=format&q=80', false);