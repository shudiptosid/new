import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Silence React Router v7 warnings
const futureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

// Lazy load all pages for better code splitting
const Index = lazy(() => import("./pages/Index"));
const Services = lazy(() => import("./pages/Services"));
const Projects = lazy(() => import("./pages/Projects"));
const Blog = lazy(() => import("./pages/Blog"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CompletedProjects = lazy(() => import("./pages/CompletedProjects"));
const Resources = lazy(() => import("./pages/Resources"));
const SortQuestionsPage2 = lazy(() => import("./pages/SortQuestionsPage2"));
// Compressed blog version with all 10 articles (80% smaller than original)
const BlogPost = lazy(() => import("./pages/BlogPost"));
const ECEResources = lazy(() => import("./pages/ECEResources"));
const CostEstimator = lazy(() => import("./pages/CostEstimator"));
// Authentication pages
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const TestSupabase = lazy(() => import("./pages/TestSupabase"));
const DebugAuth = lazy(() => import("./pages/DebugAuth"));

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (previously cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-pulse text-primary text-xl">Loading...</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SpeedInsights />
        <Analytics />
        <BrowserRouter future={futureConfig}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/completed-projects"
                element={<CompletedProjects />}
              />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/ece" element={<ECEResources />} />
              <Route
                path="/resources/questions/2"
                element={<SortQuestionsPage2 />}
              />
              <Route path="/cost-estimator" element={<CostEstimator />} />
              {/* Authentication routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/test-supabase" element={<TestSupabase />} />
              <Route path="/debug-auth" element={<DebugAuth />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
