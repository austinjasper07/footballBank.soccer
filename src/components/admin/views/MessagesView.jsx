import { Reply, Archive, Trash2, Star, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function MessagesView() {
  const messages = [
    {
      id: 1,
      sender: "John Smith",
      email: "john@example.com",
      subject: "Question about player submission",
      preview: "Hi, I submitted my player profile last week and haven't heard back...",
      timestamp: "2 hours ago",
      isRead: false,
      isStarred: true,
      priority: "high"
    },
    {
      id: 2,
      sender: "Maria Garcia",
      email: "maria@example.com",
      subject: "Order status inquiry",
      preview: "Could you please provide an update on my recent order #FB-2024-0890...",
      timestamp: "5 hours ago",
      isRead: false,
      isStarred: false,
      priority: "medium"
    },
    {
      id: 3,
      sender: "David Brown",
      email: "david@example.com",
      subject: "Thank you for the service",
      preview: "I wanted to express my gratitude for the excellent service...",
      timestamp: "1 day ago",
      isRead: true,
      isStarred: false,
      priority: "low"
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Message Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Clock className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Unread</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Starred</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Archive className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Archived</p>
                <p className="text-2xl font-bold">48</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Reply className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Replied</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages List */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg border hover:bg-[hsl(var(--muted))]/50 cursor-pointer ${
                  !message.isRead
                    ? 'bg-[hsl(var(--muted))]/30 border-[hsl(var(--primary))]/20'
                    : 'bg-[hsl(var(--background))]'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(message.priority)}`} />
                    <div>
                      <p className={`font-medium ${!message.isRead ? 'font-semibold' : ''}`}>
                        {message.sender}
                      </p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">{message.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {message.isStarred && (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    )}
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">
                      {message.timestamp}
                    </span>
                  </div>
                </div>

                <h3 className={`font-medium mb-2 ${!message.isRead ? 'font-semibold' : ''}`}>
                  {message.subject}
                </h3>

                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3 line-clamp-2">
                  {message.preview}
                </p>

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {message.priority.toUpperCase()} PRIORITY
                  </Badge>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Reply className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
