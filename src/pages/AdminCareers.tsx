import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Download, Eye, Loader2, Search, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type CareerStatus = "new" | "reviewing" | "shortlisted" | "rejected" | "hired";

interface CareerApplication {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone_number: string;
  position_applied: string;
  skills_summary: string;
  portfolio_url: string | null;
  resume_file_name: string;
  resume_file_path: string;
  resume_file_size: number;
  status: CareerStatus;
  admin_notes: string | null;
}

const CAREERS_CV_BUCKET =
  import.meta.env.VITE_CAREERS_CV_BUCKET || "careers-cv";

const statusStyles: Record<CareerStatus, string> = {
  new: "bg-blue-600 hover:bg-blue-700 text-white",
  reviewing: "bg-slate-600 hover:bg-slate-700 text-white",
  shortlisted: "bg-emerald-600 hover:bg-emerald-700 text-white",
  rejected: "bg-red-600 hover:bg-red-700 text-white",
  hired: "bg-green-600 hover:bg-green-700 text-white",
};

const statusOptions: CareerStatus[] = [
  "new",
  "reviewing",
  "shortlisted",
  "rejected",
  "hired",
];

const AdminCareers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CareerStatus>("all");

  const [selected, setSelected] = useState<CareerApplication | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<CareerStatus>("new");
  const [editNotes, setEditNotes] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("career_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications((data as CareerApplication[]) || []);
    } catch (error: any) {
      toast({
        title: "Failed to load applications",
        description: error?.message || "Could not fetch career applications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        app.full_name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.position_applied.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  const openDetails = (application: CareerApplication) => {
    setSelected(application);
    setEditStatus(application.status);
    setEditNotes(application.admin_notes || "");
    setDialogOpen(true);
  };

  const updateApplication = async () => {
    if (!selected) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from("career_applications")
        .update({
          status: editStatus,
          admin_notes: editNotes.trim() ? editNotes.trim() : null,
        })
        .eq("id", selected.id);

      if (error) throw error;

      toast({
        title: "Updated",
        description: "Career application updated successfully.",
      });

      setDialogOpen(false);
      setSelected(null);
      fetchApplications();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error?.message || "Could not update application.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getResumeSignedUrl = async (
    application: CareerApplication,
    forDownload: boolean,
  ) => {
    const { data, error } = await supabase.storage
      .from(CAREERS_CV_BUCKET)
      .createSignedUrl(application.resume_file_path, 120, {
        download: forDownload ? application.resume_file_name : undefined,
      });

    if (error) throw error;
    if (!data?.signedUrl) throw new Error("Could not generate resume URL");

    return data.signedUrl;
  };

  const viewResume = async (application: CareerApplication) => {
    try {
      const signedUrl = await getResumeSignedUrl(application, false);
      window.open(signedUrl, "_blank", "noopener,noreferrer");
    } catch (error: any) {
      toast({
        title: "Preview failed",
        description:
          error?.message || "Could not open resume. Check storage policies.",
        variant: "destructive",
      });
    }
  };

  const downloadResume = async (application: CareerApplication) => {
    try {
      const signedUrl = await getResumeSignedUrl(application, true);
      window.open(signedUrl, "_blank", "noopener,noreferrer");
    } catch (error: any) {
      toast({
        title: "Download failed",
        description:
          error?.message ||
          "Could not download resume. Check storage policies.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate("/admin")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Career Applications
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Review applicants, update status, and download CVs
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{applications.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">New</p>
              <p className="text-2xl font-bold">
                {applications.filter((a) => a.status === "new").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Hired</p>
              <p className="text-2xl font-bold">
                {applications.filter((a) => a.status === "hired").length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Application Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or position"
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as "all" | CareerStatus)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-16 flex items-center justify-center">
                <Loader2 className="w-7 h-7 animate-spin text-accent" />
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                No career applications found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{app.full_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {app.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{app.position_applied}</TableCell>
                      <TableCell>
                        {new Date(app.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusStyles[app.status]}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewResume(app)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadResume(app)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => openDetails(app)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
            </DialogHeader>

            {selected && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Full Name</p>
                    <p className="font-medium">{selected.full_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{selected.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{selected.phone_number}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Position</p>
                    <p className="font-medium">{selected.position_applied}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Resume File</p>
                    <p className="font-medium">{selected.resume_file_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Resume Size</p>
                    <p className="font-medium">
                      {formatFileSize(selected.resume_file_size)}
                    </p>
                  </div>
                </div>

                {selected.portfolio_url && (
                  <div>
                    <p className="text-muted-foreground text-sm">Portfolio</p>
                    <a
                      href={selected.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline break-all"
                    >
                      {selected.portfolio_url}
                    </a>
                  </div>
                )}

                <div>
                  <p className="text-muted-foreground text-sm mb-2">
                    Skills Summary
                  </p>
                  <p className="text-sm leading-relaxed bg-slate-50 rounded-md p-3 border">
                    {selected.skills_summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm mb-2">Status</p>
                    <Select
                      value={editStatus}
                      onValueChange={(value) =>
                        setEditStatus(value as CareerStatus)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end gap-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => viewResume(selected)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View CV
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => downloadResume(selected)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download CV
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm mb-2">Admin Notes</p>
                  <Textarea
                    rows={5}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add internal notes about this application"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={updateApplication} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminCareers;
