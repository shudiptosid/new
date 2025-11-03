import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAllRequests,
  getRequestDetails,
  submitAdminReply,
} from "@/lib/supabaseService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Mail,
  Clock,
  CheckCircle,
  Search,
  Calculator,
  LayoutDashboard,
  Users,
  MessageSquare,
  Home,
  LogOut,
  Cpu,
  Gauge,
  Zap,
  Monitor,
  Package,
  ChevronRight,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Download,
  RotateCcw,
} from "lucide-react";
import productsData from "@/data/productsData.json";

interface Request {
  id: string;
  request_type: string;
  user_id: string;
  user_email: string;
  user_name: string;
  created_at: string;
  updated_at: string;
  status: string;
  summary: string;
  admin_notes: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("pending");
  const [allRequests, setAllRequests] = useState<Request[]>([]); // Store ALL requests
  const [requests, setRequests] = useState<Request[]>([]); // Filtered requests for current tab
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCostEstimator, setShowCostEstimator] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryComponents, setCategoryComponents] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: { product: any; quantity: number };
  }>({});
  const [showCart, setShowCart] = useState(false);

  // Calculate component categories
  const componentCategories = [
    {
      id: "mcu",
      name: "MCU",
      icon: Cpu,
      color: "from-blue-500 to-blue-600",
      categories: ["Development Board"],
    },
    {
      id: "sensors",
      name: "Sensors",
      icon: Gauge,
      color: "from-purple-500 to-purple-600",
      categories: [
        "Distance Sensor",
        "Environmental Sensor",
        "Motion Sensor",
        "Light Sensor",
        "Magnetic Sensor",
        "Navigation Sensor",
        "Medical Sensor",
        "Touch Sensor",
        "Sound Sensor",
        "Gas Sensor",
        "Camera Sensor",
        "Force Sensor",
        "Biometric Sensor",
        "Radiation Sensor",
        "Fire Sensor",
        "Gesture Sensor",
      ],
    },
    {
      id: "power",
      name: "Power",
      icon: Zap,
      color: "from-yellow-500 to-yellow-600",
      categories: ["Power Supply", "Battery"],
    },
    {
      id: "actuators",
      name: "Actuators",
      icon: Package,
      color: "from-green-500 to-green-600",
      categories: ["Motor", "Servo", "Pump"],
    },
    {
      id: "displays",
      name: "Displays",
      icon: Monitor,
      color: "from-pink-500 to-pink-600",
      categories: ["LCD Display", "OLED Display", "TFT Display"],
    },
  ];

  // Calculate component counts
  const getCategoryCount = (categories: string[]) => {
    return productsData.filter((product: any) =>
      categories.includes(product.category)
    ).length;
  };

  // Note: Admin authentication is now handled by ProtectedRoute with requireAdmin={true}
  // User is guaranteed to be authenticated and admin when this component renders

  // Load ALL requests on mount
  useEffect(() => {
    loadAllRequests();
  }, []);

  // Filter requests when tab changes
  useEffect(() => {
    if (allRequests.length > 0) {
      const filtered = allRequests.filter((req) => req.status === activeTab);
      setRequests(filtered);
    }
  }, [activeTab, allRequests]);

  const loadAllRequests = async () => {
    try {
      setLoading(true);
      // Load ALL requests without status filter
      const data = await getAllRequests(); // No status parameter = get all
      setAllRequests(data || []);
      // Set initial filtered requests for pending tab
      const pendingRequests = (data || []).filter(
        (req) => req.status === "pending"
      );
      setRequests(pendingRequests);
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestClick = async (request: Request) => {
    try {
      setDetailsLoading(true);
      setDialogOpen(true);
      const details = await getRequestDetails(request.request_type, request.id);
      setSelectedRequest({ ...request, ...details });
      setReplyMessage("");
    } catch (error) {
      console.error("Error loading request details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyMessage.trim() || !selectedRequest) return;

    try {
      setSubmitting(true);

      await submitAdminReply({
        requestType: selectedRequest.request_type,
        requestId: selectedRequest.id,
        userId: selectedRequest.user_id,
        userEmail: selectedRequest.user_email,
        replyMessage: replyMessage.trim(),
        newStatus: "under_review",
        previousStatus: selectedRequest.status,
      });

      // Refresh requests and close dialog
      await loadAllRequests();
      setDialogOpen(false);
      setSelectedRequest(null);
      setReplyMessage("");
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("Failed to submit reply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsSolved = async () => {
    if (!selectedRequest) return;

    const confirmMessage =
      "Mark this request as solved? User will see this status change.";
    if (!window.confirm(confirmMessage)) return;

    try {
      setSubmitting(true);

      await submitAdminReply({
        requestType: selectedRequest.request_type,
        requestId: selectedRequest.id,
        userId: selectedRequest.user_id,
        userEmail: selectedRequest.user_email,
        replyMessage: replyMessage.trim() || "Request marked as solved.",
        newStatus: "solved",
        previousStatus: selectedRequest.status,
      });

      await loadAllRequests();
      setDialogOpen(false);
      setSelectedRequest(null);
      setReplyMessage("");
    } catch (error) {
      console.error("Error marking as solved:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      pending: "bg-yellow-500",
      under_review: "bg-blue-500",
      solved: "bg-green-500",
    };
    return (
      <Badge className={`${variants[status]} text-white`}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const getRequestTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      consulting: "Consulting",
      prototyping: "Prototyping",
      firmware: "Firmware",
      ondemand: "On-Demand",
    };
    return labels[type] || type;
  };

  const handleCategoryClick = (category: any) => {
    const components = productsData.filter((product: any) =>
      category.categories.includes(product.category)
    );
    setCategoryComponents(components);
    setSelectedCategory(category.id);
    setShowCart(false); // Show components list
  };

  const addToCart = (product: any) => {
    setSelectedItems((prev) => {
      const existing = prev[product.id];
      if (existing) {
        return {
          ...prev,
          [product.id]: { product, quantity: existing.quantity + 1 },
        };
      }
      return { ...prev, [product.id]: { product, quantity: 1 } };
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setSelectedItems((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], quantity },
    }));
  };

  const removeFromCart = (productId: string) => {
    setSelectedItems((prev) => {
      const newItems = { ...prev };
      delete newItems[productId];
      return newItems;
    });
  };

  const calculateTotal = () => {
    return Object.values(selectedItems).reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const clearCart = () => {
    setSelectedItems({});
  };

  const cartItemCount = Object.keys(selectedItems).length;

  // Calculate statistics
  const stats = {
    total: allRequests.length,
    pending: allRequests.filter((r) => r.status === "pending").length,
    underReview: allRequests.filter((r) => r.status === "under_review").length,
    solved: allRequests.filter((r) => r.status === "solved").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-6 w-6 text-accent" />
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {profile?.full_name || "Admin"}
                  </p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with Sidebar Layout */}
      <div className="flex gap-6 max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Main Content Area */}
        <div className="flex-1 max-w-5xl">
          {/* Component Categories */}
          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-accent" />
                Component Inventory
              </CardTitle>
              <CardDescription>
                Click a category to view available components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {componentCategories.map((category) => (
                  <Card
                    key={category.id}
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      selectedCategory === category.id
                        ? "ring-2 ring-accent"
                        : ""
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <CardContent className="p-4">
                      <div
                        className={`h-12 w-12 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center mx-auto mb-2`}
                      >
                        <category.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-sm font-semibold text-center mb-1">
                        {category.name}
                      </h3>
                      <p className="text-2xl font-bold text-center text-accent">
                        {getCategoryCount(category.categories)}
                      </p>
                      <p className="text-xs text-muted-foreground text-center">
                        components
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">
                      Total Requests
                    </p>
                    <h3 className="text-3xl font-bold">{stats.total}</h3>
                  </div>
                  <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium mb-1">
                      Pending
                    </p>
                    <h3 className="text-3xl font-bold">{stats.pending}</h3>
                  </div>
                  <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium mb-1">
                      Under Review
                    </p>
                    <h3 className="text-3xl font-bold">{stats.underReview}</h3>
                  </div>
                  <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium mb-1">
                      Solved
                    </p>
                    <h3 className="text-3xl font-bold">{stats.solved}</h3>
                  </div>
                  <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Manager Quick Access */}
          <Card
            className="mb-8 bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            onClick={() => navigate("/admin/price-manager")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">💰 Price Manager</h3>
                  <p className="text-orange-100 text-sm">
                    Manage component prices and inventory
                  </p>
                </div>
                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                  <ChevronRight className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Bar */}
          <Card className="mb-6 shadow-md">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by email, name, or summary..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Card className="shadow-lg">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b border-slate-200 dark:border-slate-700">
                <TabsList className="w-full grid grid-cols-3 bg-transparent p-0 h-auto rounded-none">
                  <TabsTrigger
                    value="pending"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-yellow-500 data-[state=active]:bg-yellow-50 dark:data-[state=active]:bg-yellow-900/20 py-4 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Pending</span>
                      <Badge className="bg-yellow-500 text-white hover:bg-yellow-600 ml-2">
                        {stats.pending}
                      </Badge>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="under_review"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-purple-50 dark:data-[state=active]:bg-purple-900/20 py-4 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">Under Review</span>
                      <Badge className="bg-purple-500 text-white hover:bg-purple-600 ml-2">
                        {stats.underReview}
                      </Badge>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="solved"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-900/20 py-4 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">Solved</span>
                      <Badge className="bg-green-500 text-white hover:bg-green-600 ml-2">
                        {stats.solved}
                      </Badge>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content */}
              {["pending", "under_review", "solved"].map((status) => (
                <TabsContent key={status} value={status}>
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    </div>
                  ) : filteredRequests.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">
                          No {status.replace("_", " ")} requests found
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 p-6">
                      {filteredRequests.map((request) => (
                        <Card
                          key={request.id}
                          className="cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-300 border-l-4 border-l-accent bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-800"
                          onClick={() => handleRequestClick(request)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center text-white font-bold">
                                  {(request.user_name || "A")
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                                <div>
                                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                                    {request.user_name || "Anonymous User"}
                                  </CardTitle>
                                  <CardDescription className="text-sm">
                                    {request.user_email}
                                  </CardDescription>
                                </div>
                              </div>
                              <div className="flex gap-2 items-center">
                                {getStatusBadge(request.status)}
                                <Badge
                                  variant="outline"
                                  className="font-medium"
                                >
                                  {getRequestTypeLabel(request.request_type)}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 mb-3">
                              {request.summary || "No description available"}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>
                                Submitted:{" "}
                                {new Date(request.created_at).toLocaleString()}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </Card>

          {/* Request Details Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">
                      Request Details
                    </DialogTitle>
                    <DialogDescription>
                      View and respond to customer request
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {detailsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
              ) : selectedRequest ? (
                <div className="space-y-6">
                  {/* Request Info */}
                  <div className="grid grid-cols-2 gap-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-800 p-5 rounded-lg border">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Customer
                      </label>
                      <p className="text-sm text-slate-900 dark:text-white font-medium mt-1">
                        {selectedRequest.user_name || "Anonymous"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Email
                      </label>
                      <p className="text-sm text-slate-900 dark:text-white font-medium mt-1">
                        {selectedRequest.user_email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Type
                      </label>
                      <p className="text-sm text-slate-900 dark:text-white font-medium mt-1">
                        {getRequestTypeLabel(selectedRequest.request_type)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Status
                      </label>
                      <div className="mt-1">
                        {getStatusBadge(selectedRequest.status)}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Submitted
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4 text-accent" />
                        <p className="text-sm text-slate-900 dark:text-white font-medium">
                          {new Date(
                            selectedRequest.created_at
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Request Details</h3>
                    <div className="space-y-3 bg-muted/30 p-4 rounded-lg max-h-60 overflow-y-auto">
                      {Object.entries(selectedRequest)
                        .filter(
                          ([key]) =>
                            ![
                              "id",
                              "user_id",
                              "created_at",
                              "updated_at",
                              "status",
                              "user_email",
                              "user_name",
                              "request_type",
                              "admin_notes",
                            ].includes(key)
                        )
                        .map(([key, value]) => (
                          <div key={key}>
                            <label className="text-sm font-medium capitalize">
                              {key.replace(/_/g, " ")}:
                            </label>
                            <p className="text-sm text-muted-foreground">
                              {String(value) || "N/A"}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Reply Section */}
                  <div className="border-t pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Mail className="h-5 w-5 text-accent" />
                      <h3 className="font-semibold text-lg">Admin Reply</h3>
                    </div>
                    <Textarea
                      placeholder="Type your reply to the customer..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={6}
                      className="w-full border-2 focus:border-accent transition-colors"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-end border-t pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      disabled={submitting}
                      className="px-6"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitReply}
                      disabled={!replyMessage.trim() || submitting}
                      className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 px-6 shadow-lg"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Reply (Under Review)
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleMarkAsSolved}
                      disabled={submitting}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 shadow-lg"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Solved
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : null}
            </DialogContent>
          </Dialog>
        </div>

        {/* Right Sidebar - Cost Estimator */}
        <div className="w-96 hidden lg:block">
          <div className="sticky top-24">
            <Card className="shadow-xl border-2 border-accent/20">
              <CardHeader className="bg-gradient-to-r from-accent to-accent/80 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calculator className="h-6 w-6" />
                    <div>
                      <CardTitle>Cost Estimator</CardTitle>
                      <CardDescription className="text-white/90">
                        Add components & calculate
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {cartItemCount > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-white/80">Total</p>
                        <p className="text-lg font-bold">₹{calculateTotal()}</p>
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant={showCart ? "secondary" : "ghost"}
                      onClick={() => setShowCart(!showCart)}
                      className={showCart ? "" : "text-white hover:bg-white/20"}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {cartItemCount > 0 && (
                        <Badge className="ml-1 bg-white text-accent">
                          {cartItemCount}
                        </Badge>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
                {!showCart ? (
                  <div className="space-y-4">
                    {/* Show selected category components */}
                    {selectedCategory && categoryComponents.length > 0 ? (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-accent" />
                            {
                              componentCategories.find(
                                (c) => c.id === selectedCategory
                              )?.name
                            }
                          </h3>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedCategory(null)}
                          >
                            ✕
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {categoryComponents.map((component) => (
                            <Card
                              key={component.id}
                              className="p-3 hover:shadow-md transition-shadow"
                            >
                              <div className="flex justify-between items-center gap-2">
                                <div className="flex-1">
                                  <p className="text-sm font-medium line-clamp-1">
                                    {component.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {component.category}
                                  </p>
                                  <p className="text-sm font-bold text-accent mt-1">
                                    ₹{component.price}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => addToCart(component)}
                                  className="bg-accent hover:bg-accent/90"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Click a category above to browse components
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Add items to cart to calculate total cost
                        </p>
                      </div>
                    )}

                    {/* Current Total Summary - Always visible when items in cart */}
                    {cartItemCount > 0 && (
                      <Card className="bg-gradient-to-r from-accent to-accent/80 text-white p-4 mt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-white/80">
                              Current Total
                            </p>
                            <p className="text-2xl font-bold">
                              ₹{calculateTotal()}
                            </p>
                            <p className="text-xs text-white/80 mt-1">
                              {Object.values(selectedItems).reduce(
                                (sum, item) => sum + item.quantity,
                                0
                              )}{" "}
                              items in cart
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setShowCart(true)}
                            className="gap-2"
                          >
                            View Cart
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Cart View */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4 text-accent" />
                        Your Cart ({cartItemCount})
                      </h3>
                      {cartItemCount > 0 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={clearCart}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {cartItemCount === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-sm text-muted-foreground">
                          Your cart is empty
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowCart(false)}
                          className="mt-4"
                        >
                          Browse Components
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {Object.values(selectedItems).map(
                            ({ product, quantity }) => (
                              <Card key={product.id} className="p-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1">
                                      <p className="text-sm font-medium line-clamp-2">
                                        {product.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        ₹{product.price} each
                                      </p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => removeFromCart(product.id)}
                                      className="text-red-500 hover:text-red-600 h-8 w-8 p-0"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          updateQuantity(
                                            product.id,
                                            quantity - 1
                                          )
                                        }
                                        className="h-7 w-7 p-0"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                      <span className="text-sm font-medium w-8 text-center">
                                        {quantity}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          updateQuantity(
                                            product.id,
                                            quantity + 1
                                          )
                                        }
                                        className="h-7 w-7 p-0"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <p className="text-sm font-bold text-accent">
                                      ₹{product.price * quantity}
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            )
                          )}
                        </div>

                        {/* Total Section */}
                        <Card className="bg-gradient-to-r from-accent to-accent/80 text-white p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span>Subtotal:</span>
                              <span>₹{calculateTotal()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span>Items:</span>
                              <span>
                                {Object.values(selectedItems).reduce(
                                  (sum, item) => sum + item.quantity,
                                  0
                                )}
                              </span>
                            </div>
                            <div className="border-t border-white/20 pt-2">
                              <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total:</span>
                                <span>₹{calculateTotal()}</span>
                              </div>
                            </div>
                          </div>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={clearCart}
                            className="flex-1 gap-2"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Clear
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 gap-2 bg-accent hover:bg-accent/90"
                            onClick={() => {
                              // You can add download/export functionality here
                              alert(
                                `Total: ₹${calculateTotal()}\nItems: ${
                                  Object.values(selectedItems).length
                                }`
                              );
                            }}
                          >
                            <Download className="h-4 w-4" />
                            Export
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
