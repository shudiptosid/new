import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  MessageSquare,
  Send,
  Trash2,
  Reply,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  read_time: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

interface Comment {
  id: string;
  blog_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  comment_text: string;
  parent_id: string | null;
  created_at: string;
  replies?: Comment[];
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (slug) {
      fetchBlog();
      fetchComments();
      incrementViewCount();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      setBlog(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Blog post not found",
        variant: "destructive",
      });
      navigate("/blog");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_comments")
        .select("*")
        .eq(
          "blog_id",
          (await supabase.from("blogs").select("id").eq("slug", slug).single())
            .data?.id,
        )
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Organize comments into parent-child structure
      const commentMap: { [key: string]: Comment } = {};
      const rootComments: Comment[] = [];

      data?.forEach((comment: Comment) => {
        commentMap[comment.id] = { ...comment, replies: [] };
      });

      data?.forEach((comment: Comment) => {
        if (comment.parent_id) {
          commentMap[comment.parent_id]?.replies?.push(commentMap[comment.id]);
        } else {
          rootComments.push(commentMap[comment.id]);
        }
      });

      setComments(rootComments);
    } catch (error: any) {
      console.error("Error fetching comments:", error);
    }
  };

  const incrementViewCount = async () => {
    try {
      await supabase.rpc("increment_blog_views", { blog_slug: slug });
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to post a comment",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!commentText.trim()) {
      toast({
        title: "Validation Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("blog_comments").insert({
        blog_id: blog?.id,
        user_id: user.id,
        user_name:
          profile?.full_name || user.email?.split("@")[0] || "Anonymous",
        user_email: user.email,
        comment_text: commentText,
        parent_id: null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment posted successfully",
      });

      setCommentText("");
      fetchComments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to reply",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!replyText.trim()) {
      toast({
        title: "Validation Error",
        description: "Reply cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("blog_comments").insert({
        blog_id: blog?.id,
        user_id: user.id,
        user_name:
          profile?.full_name || user.email?.split("@")[0] || "Anonymous",
        user_email: user.email,
        comment_text: replyText,
        parent_id: parentId,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reply posted successfully",
      });

      setReplyText("");
      setReplyingTo(null);
      fetchComments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const { error } = await supabase
        .from("blog_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });

      fetchComments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const renderContent = (content: string) => {
    // Simple markdown-like rendering for bold and italic
    let rendered = content
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br />");

    return <div dangerouslySetInnerHTML={{ __html: rendered }} />;
  };

  const CommentItem = ({
    comment,
    depth = 0,
  }: {
    comment: Comment;
    depth?: number;
  }) => (
    <div className={`${depth > 0 ? "ml-8 mt-4" : "mt-6"}`}>
      <Card className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-semibold text-sm">{comment.user_name}</p>
            <p className="text-xs text-gray-500">
              {new Date(comment.created_at).toLocaleDateString()} at{" "}
              {new Date(comment.created_at).toLocaleTimeString()}
            </p>
          </div>
          {(user?.id === comment.user_id || profile?.role === "admin") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteComment(comment.id)}
              className="text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        <p className="text-gray-700 text-sm mb-3">{comment.comment_text}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setReplyingTo(comment.id)}
          className="text-emerald-600 hover:bg-emerald-50"
        >
          <Reply className="w-4 h-4 mr-1" />
          Reply
        </Button>

        {replyingTo === comment.id && (
          <div className="mt-3 space-y-2">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              rows={3}
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleReplySubmit(comment.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Send className="w-4 h-4 mr-1" />
                Post Reply
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  const commentCount = comments.reduce((acc, comment) => {
    return acc + 1 + (comment.replies?.length || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/blog")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>

        {/* Blog Header */}
        <Card className="p-8 mb-6">
          <div className="mb-4">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
              {blog.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(blog.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{blog.read_time}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{blog.view_count} views</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{commentCount} comments</span>
            </div>
          </div>
        </Card>

        {/* Blog Content */}
        <Card className="p-8 mb-8">
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {renderContent(blog.content)}
          </div>
        </Card>

        {/* Comments Section */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Comments ({commentCount})
          </h2>

          {/* Comment Form */}
          {user ? (
            <div className="mb-8 space-y-3">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="text-base"
              />
              <Button
                onClick={handleCommentSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Post Comment
              </Button>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-gray-100 rounded-lg text-center">
              <p className="text-gray-600 mb-3">
                Please login to post a comment
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Login
              </Button>
            </div>
          )}

          {/* Comments List */}
          {comments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
