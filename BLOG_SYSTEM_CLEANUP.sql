-- CLEANUP SCRIPT - Run this FIRST if schema already exists
-- This removes all existing blog system components so you can start fresh

-- Drop all policies
DROP POLICY IF EXISTS "Blogs are viewable by everyone" ON blogs;
DROP POLICY IF EXISTS "Admins can insert blogs" ON blogs;
DROP POLICY IF EXISTS "Admins can update blogs" ON blogs;
DROP POLICY IF EXISTS "Admins can delete blogs" ON blogs;
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON blog_comments;
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON blog_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON blog_comments;
DROP POLICY IF EXISTS "Admins can delete any comment" ON blog_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON blog_comments;

-- Drop trigger
DROP TRIGGER IF EXISTS update_blogs_timestamp ON blogs;

-- Drop functions
DROP FUNCTION IF EXISTS increment_blog_views(TEXT);
DROP FUNCTION IF EXISTS update_blog_timestamp();

-- Drop indexes
DROP INDEX IF EXISTS idx_blogs_slug;
DROP INDEX IF EXISTS idx_blogs_category;
DROP INDEX IF EXISTS idx_blogs_active;
DROP INDEX IF EXISTS idx_blog_comments_blog_id;
DROP INDEX IF EXISTS idx_blog_comments_parent_id;

-- Drop tables (careful - this deletes all data!)
-- Uncomment the lines below if you want to completely reset
-- DROP TABLE IF EXISTS blog_comments CASCADE;
-- DROP TABLE IF EXISTS blogs CASCADE;

-- Verify cleanup
SELECT 'Cleanup completed successfully!' as status;
