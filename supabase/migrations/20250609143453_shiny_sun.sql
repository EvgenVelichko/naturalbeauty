/*
  # Admin System and Enhanced Features

  1. New Tables
    - `admin_users` - Admin user management
    - `site_settings` - Site configuration
    - `user_sessions` - Track user activity

  2. Admin Features
    - Admin role management
    - Site access control
    - User management capabilities

  3. Enhanced Security
    - Admin-only policies
    - Site maintenance mode
    - User access control
*/

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'admin',
  permissions jsonb DEFAULT '{"manage_users": true, "manage_products": true, "site_settings": true}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user sessions table for tracking
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address inet,
  user_agent text,
  last_activity timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Only admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

CREATE POLICY "Only super admins can manage admin users"
  ON admin_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() 
      AND au.permissions->>'manage_admins' = 'true'
    )
  );

-- Site settings policies
CREATE POLICY "Admins can view site settings"
  ON site_settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage site settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() 
      AND au.permissions->>'site_settings' = 'true'
    )
  );

-- User sessions policies
CREATE POLICY "Users can view own sessions"
  ON user_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all sessions"
  ON user_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

-- Insert default admin user (you'll need to update this with your user ID)
-- First, insert default site settings
INSERT INTO site_settings (key, value, description) VALUES
('site_maintenance', '{"enabled": false, "message": "Site is under maintenance"}', 'Site maintenance mode'),
('user_registration', '{"enabled": true}', 'Allow new user registration'),
('site_access', '{"enabled": true}', 'Site access control'),
('search_enabled', '{"enabled": true}', 'Enable search functionality')
ON CONFLICT (key) DO NOTHING;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get site setting
CREATE OR REPLACE FUNCTION get_site_setting(setting_key text)
RETURNS jsonb AS $$
DECLARE
  setting_value jsonb;
BEGIN
  SELECT value INTO setting_value 
  FROM site_settings 
  WHERE key = setting_key;
  
  RETURN COALESCE(setting_value, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add search functionality to products
CREATE INDEX IF NOT EXISTS products_search_idx ON products 
USING gin(to_tsvector('english', name || ' ' || description || ' ' || category));

-- Create search function
CREATE OR REPLACE FUNCTION search_products(search_query text)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  price decimal,
  category text,
  image_url text,
  featured boolean,
  created_at timestamptz,
  updated_at timestamptz,
  rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.category,
    p.image_url,
    p.featured,
    p.created_at,
    p.updated_at,
    ts_rank(to_tsvector('english', p.name || ' ' || p.description || ' ' || p.category), plainto_tsquery('english', search_query)) as rank
  FROM products p
  WHERE to_tsvector('english', p.name || ' ' || p.description || ' ' || p.category) @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC, p.featured DESC, p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update triggers
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();