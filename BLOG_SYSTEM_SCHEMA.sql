-- Blog Management System Schema

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  read_time TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Blog comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_active ON blogs(is_active);
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id);

-- RLS Policies
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Blogs are viewable by everyone" ON blogs;
DROP POLICY IF EXISTS "Admins can insert blogs" ON blogs;
DROP POLICY IF EXISTS "Admins can update blogs" ON blogs;
DROP POLICY IF EXISTS "Admins can delete blogs" ON blogs;
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON blog_comments;
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON blog_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON blog_comments;
DROP POLICY IF EXISTS "Admins can delete any comment" ON blog_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON blog_comments;

-- Blogs policies
CREATE POLICY "Blogs are viewable by everyone" ON blogs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can insert blogs" ON blogs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update blogs" ON blogs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete blogs" ON blogs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Blog comments policies
CREATE POLICY "Comments are viewable by everyone" ON blog_comments
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can insert comments" ON blog_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON blog_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any comment" ON blog_comments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can delete their own comments" ON blog_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_blog_views(blog_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE blogs
  SET view_count = view_count + 1
  WHERE slug = blog_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_blogs_timestamp ON blogs;

CREATE TRIGGER update_blogs_timestamp
BEFORE UPDATE ON blogs
FOR EACH ROW
EXECUTE FUNCTION update_blog_timestamp();
