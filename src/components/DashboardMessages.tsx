import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserMessages, markMessageAsRead } from "@/lib/supabaseService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MailOpen, Clock, Loader2, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminMessage {
  id: string;
  created_at: string;
  request_type: string;
  request_id: string;
  admin_name: string;
  reply_message: string;
  previous_status: string;
  new_status: string;
  is_read_by_user: boolean;
  read_at: string | null;
}

const DashboardMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadMessages();
    } else {
      // If no user, don't show loading
      setLoading(false);
    }
  }, [user]);

  const loadMessages = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getUserMessages(user.id);
      setMessages(data || []);
    } catch (error) {
      console.error("Error loading messages:", error);
      // Don't block UI on error
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = async (message: AdminMessage) => {
    setSelectedMessage(message);
    setDialogOpen(true);

    // Mark as read if unread
    if (!message.is_read_by_user) {
      try {
        await markMessageAsRead(message.id);
        // Update local state
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === message.id ? { ...msg, is_read_by_user: true } : msg
          )
        );
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  };

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

  const unreadCount = messages.filter((msg) => !msg.is_read_by_user).length;

  // Show a minimal loading state instead of blocking
  if (loading) {
    return (
      <Card className="mb-6 border-accent/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-accent animate-pulse" />
            <CardTitle>Messages from Admin</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Skeleton loading */}
            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-4 border rounded-lg animate-pulse bg-muted/20"
              >
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-1"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-6 border-accent/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-accent" />
              <CardTitle>Messages from Admin</CardTitle>
            </div>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">{unreadCount} New</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No messages yet. Admin responses will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => handleMessageClick(message)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    !message.is_read_by_user
                      ? "bg-accent/5 border-accent"
                      : "bg-card border-border"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {message.is_read_by_user ? (
                        <MailOpen className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Mail className="h-4 w-4 text-accent" />
                      )}
                      <span className="font-semibold text-sm">
                        {message.admin_name || "Admin"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(message.new_status)}
                      <Badge variant="outline" className="text-xs">
                        {getRequestTypeLabel(message.request_type)}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {message.reply_message}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(message.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Admin Response</DialogTitle>
            <DialogDescription>
              Reply from {selectedMessage?.admin_name || "Admin"}
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              {/* Status Info */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                <div>
                  <label className="text-sm font-semibold">Request Type</label>
                  <p className="text-sm text-muted-foreground">
                    {getRequestTypeLabel(selectedMessage.request_type)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedMessage.new_status)}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold">Date</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Status Change (if applicable) */}
              {selectedMessage.previous_status &&
                selectedMessage.previous_status !==
                  selectedMessage.new_status && (
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-sm">
                      <span className="font-semibold">Status changed:</span>{" "}
                      {selectedMessage.previous_status.replace("_", " ")} →{" "}
                      {selectedMessage.new_status.replace("_", " ")}
                    </p>
                  </div>
                )}

              {/* Admin Message */}
              <div>
                <label className="text-sm font-semibold block mb-2">
                  Message
                </label>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedMessage.reply_message}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardMessages;
