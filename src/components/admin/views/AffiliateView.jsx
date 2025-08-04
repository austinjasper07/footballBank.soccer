import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Users,
  DollarSign,
  TrendingUp,
  Link,
  Copy,
  Eye,
  Plus,
  Search,
  Filter,
  Download,
  Mail,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AffiliateView() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const affiliateStats = [
    {
      title: "Total Affiliates",
      value: "247",
      icon: Users,
      change: "+12 this month",
      positive: true,
      variant: "blue"
    },
    {
      title: "Total Commissions",
      value: "$15,420",
      icon: DollarSign,
      change: "+23% this month",
      positive: true,
      variant: "green"
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      icon: TrendingUp,
      change: "+0.8% this month",
      positive: true,
      variant: "amber"
    },
    {
      title: "Active Links",
      value: "1,834",
      icon: Link,
      change: "156 new this week",
      positive: true,
      variant: "red"
    }
  ];

  const affiliates = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      status: "active",
      joinDate: "2024-01-15",
      totalEarnings: "$2,340",
      clicks: 1250,
      conversions: 48,
      conversionRate: "3.8%",
      referralCode: "JOHN2024"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      status: "active",
      joinDate: "2024-02-20",
      totalEarnings: "$1,890",
      clicks: 980,
      conversions: 32,
      conversionRate: "3.3%",
      referralCode: "SARAH2024"
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike@example.com",
      status: "pending",
      joinDate: "2024-07-10",
      totalEarnings: "$0",
      clicks: 0,
      conversions: 0,
      conversionRate: "0%",
      referralCode: "MIKE2024"
    }
  ];

  const commissionTiers = [
    { sales: "0-10", rate: "5%" },
    { sales: "11-25", rate: "7%" },
    { sales: "26-50", rate: "10%" },
    { sales: "51+", rate: "15%" }
  ];

  const getVariantClasses = (variant) => {
    switch (variant) {
      case 'blue':
        return {
          iconColor: 'text-white',
          iconBg: 'bg-accent-blue',
          textColor: 'text-accent-blue'
        };
      case 'green':
        return {
          iconColor: 'text-white',
          iconBg: 'bg-accent-green',
          textColor: 'text-accent-green'
        };
      case 'amber':
        return {
          iconColor: 'text-white',
          iconBg: 'bg-accent-amber',
          textColor: 'text-accent-amber'
        };
      case 'red':
        return {
          iconColor: 'text-white',
          iconBg: 'bg-accent-red',
          textColor: 'text-accent-red'
        };
      default:
        return {
          iconColor: 'text-white',
          iconBg: 'bg-primary',
          textColor: 'text-primary'
        };
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-accent-green text-white">Active</Badge>;
      case 'pending':
        return <Badge className="bg-accent-amber text-white">Pending</Badge>;
      case 'suspended':
        return <Badge className="bg-accent-red text-white">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredAffiliates = affiliates.filter((affiliate) => {
    const matchesSearch =
      affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.referralCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "all" || affiliate.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 font-[var(--body)]">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {affiliateStats.map((stat, index) => {
          const Icon = stat.icon;
          const variantClasses = getVariantClasses(stat.variant);
          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold font-[(var(--heading))]">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${variantClasses.iconBg}`}>
                    <Icon className={`h-6 w-6 ${variantClasses.iconColor}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className={`h-4 w-4 ${stat.positive ? 'text-accent-green' : 'text-accent-red'}`} />
                  <p className={`text-sm font-medium ${stat.positive ? 'text-accent-green' : 'text-accent-red'}`}>
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="affiliates" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="links">Tracking Links</TabsTrigger>
          <TabsTrigger value="materials">Marketing Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="affiliates" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-[(var(--heading))]">Affiliate Management</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Affiliate
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Affiliate</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Enter affiliate name" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter email address" />
                    </div>
                    <div>
                      <Label htmlFor="referralCode">Referral Code</Label>
                      <Input id="referralCode" placeholder="Custom referral code (optional)" />
                    </div>
                    <div>
                      <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select commission rate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="7">7%</SelectItem>
                          <SelectItem value="10">10%</SelectItem>
                          <SelectItem value="15">15%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">Add Affiliate</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  <Input
                    placeholder="Search affiliates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              {/* Affiliates Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Referral Code</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAffiliates.map((affiliate) => (
                    <TableRow key={affiliate.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{affiliate.name}</p>
                          <p className="text-sm text-[hsl(var(--muted-foreground))]">{affiliate.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(affiliate.status)}</TableCell>
                      <TableCell>{affiliate.joinDate}</TableCell>
                      <TableCell className="font-medium">{affiliate.totalEarnings}</TableCell>
                      <TableCell>{affiliate.clicks.toLocaleString()}</TableCell>
                      <TableCell>{affiliate.conversions}</TableCell>
                      <TableCell>{affiliate.conversionRate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="bg-[hsl(var(--muted))] px-2 py-1 rounded text-sm">
                            {affiliate.referralCode}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(affiliate.referralCode)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="font-[(var(--heading))]">Commission Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Monthly Sales</TableHead>
                      <TableHead>Commission Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissionTiers.map((tier, index) => (
                      <TableRow key={index}>
                        <TableCell>{tier.sales}</TableCell>
                        <TableCell className="font-medium text-accent-green">{tier.rate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="font-[var(--heading)]">Pending Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-[hsl(var(--muted))]/50 rounded-lg">
                    <div>
                      <p className="font-medium">John Smith</p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">Commission earned</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent-green">$234.50</p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">Due: July 30</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-[hsl(var(--muted))]/50  rounded-lg">
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">Commission earned</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent-green">$189.25</p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">Due: July 30</p>
                    </div>
                  </div>
                  <Button className="w-full">Process All Payouts</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="links" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="font-[var(--heading)]">Tracking Links Generator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="affiliate-select">Select Affiliate</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an affiliate" />
                      </SelectTrigger>
                      <SelectContent>
                        {affiliates.map((affiliate) => (
                          <SelectItem key={affiliate.id} value={affiliate.id.toString()}>
                            {affiliate.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="campaign">Campaign (Optional)</Label>
                    <Input id="campaign" placeholder="e.g., summer-sale" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="destination">Destination URL</Label>
                  <Input id="destination" placeholder="https://yoursite.com/product" />
                </div>
                <Button>
                  <Link className="w-4 h-4 mr-2" />
                  Generate Tracking Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-[(var(--heading))]">Marketing Materials</CardTitle>
              <Button className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Material
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4">
                  <div className="aspect-video bg-[hsl(var(--muted))] rounded mb-4 flex items-center justify-center">
                    <Target className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
                  </div>
                  <h3 className="font-medium mb-2">Banner Ad - Large</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">728x90 pixels</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="aspect-video bg-[hsl(var(--muted))] rounded mb-4 flex items-center justify-center">
                    <Target className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
                  </div>
                  <h3 className="font-medium mb-2">Social Media Post</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">1080x1080 pixels</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="aspect-video bg-[hsl(var(--muted))] rounded mb-4 flex items-center justify-center">
                    <Target className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
                  </div>
                  <h3 className="font-medium mb-2">Email Template</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">HTML format</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}