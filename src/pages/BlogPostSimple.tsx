import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { articlesList } from "../data/articles/articlesList";

const BlogPostSimple = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const article = articlesList.find((a) => a.slug === slug);

  useEffect(() => {
    // Log for debugging
    console.log("Requested slug:", slug);
    console.log("Article found:", !!article);
  }, [slug, article]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-6 max-w-2xl">
            <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
              <Clock className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Article Not Found
            </h1>
            <p className="text-muted-foreground text-lg">
              The article "{slug}" doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => navigate("/blog")}
              className="mt-6"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/blog")}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>

          {/* Article Header */}
          <div className="space-y-6 mb-12">
            <div className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
              {article.category}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {article.title}
            </h1>

            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>

          {/* Content Placeholder */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="bg-accent/5 border-l-4 border-accent p-8 rounded-r-lg mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4 mt-0">
                📚 Article Content Loading...
              </h2>
              <p className="text-muted-foreground mb-4">
                We're currently optimizing our blog articles for better
                performance. This article will be available soon!
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Article:</strong> {article.title}
                <br />
                <strong>Category:</strong> {article.category}
                <br />
                <strong>Reading Time:</strong> {article.readTime}
              </p>
            </div>

            <div className="text-center py-12">
              <p className="text-muted-foreground mb-6">
                In the meantime, check out our other articles:
              </p>
              <Button onClick={() => navigate("/blog")} size="lg">
                Browse All Articles
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPostSimple;
