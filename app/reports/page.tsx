import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, BarChart3, Calendar, Download, MoreHorizontal } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
      
      <Sidebar />

      <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
        
        <TopNavBar />

        {/* Main Canvas */}
        <main className="flex-1 p-8 lg:p-xl overflow-y-auto w-full max-w-[1440px] mx-auto">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h2 className="font-h2 text-h2 text-on-surface">Reports and Analytics</h2>
              <p className="font-body-md text-body-md  mt-1">
                View comprehensive attendance data and trends.
              </p>
            </div>
            
            {/* Date Range Picker */}
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1 shadow-sm overflow-x-auto max-w-full">
              <Button variant="ghost" size="sm" className="whitespace-nowrap">
                This Week
              </Button>
              <Button variant="secondary" size="sm" className="whitespace-nowrap">
                This Month
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 whitespace-nowrap">
                <Calendar className="h-4 w-4" />
                Custom Date
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="student-attendance" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student-attendance">Student Attendance</TabsTrigger>
              <TabsTrigger value="ustaz-attendance">Ustaz Attendance</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>
            
            <TabsContent value="student-attendance" className="space-y-8">

              {/* Bento Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Chart Card */}
                <Card className="lg:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                    <CardTitle>Daily Attendance Trends</CardTitle>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end gap-2 sm:gap-4 pt-8">
                      {/* Mock Bar Chart */}
                      <div className="flex-1 bg-muted rounded-t-md flex items-end justify-center group relative cursor-pointer" style={{ height: "60%" }}>
                        <div className="w-full bg-primary/60 rounded-t-md group-hover:bg-primary/80 transition-colors"></div>
                        <span className="absolute -bottom-6 text-xs text-muted-foreground">Mon</span>
                      </div>
                      <div className="flex-1 bg-muted rounded-t-md flex items-end justify-center group relative cursor-pointer" style={{ height: "75%" }}>
                        <div className="w-full bg-primary/60 rounded-t-md group-hover:bg-primary/80 transition-colors"></div>
                        <span className="absolute -bottom-6 text-xs text-muted-foreground">Tue</span>
                      </div>
                      <div className="flex-1 bg-muted rounded-t-md flex items-end justify-center group relative cursor-pointer" style={{ height: "85%" }}>
                        <div className="w-full bg-primary rounded-t-md"></div>
                        <span className="absolute -bottom-6 text-xs font-medium">Wed</span>
                      </div>
                      <div className="flex-1 bg-muted rounded-t-md flex items-end justify-center group relative cursor-pointer" style={{ height: "65%" }}>
                        <div className="w-full bg-primary/60 rounded-t-md group-hover:bg-primary/80 transition-colors"></div>
                        <span className="absolute -bottom-6 text-xs text-muted-foreground">Thu</span>
                      </div>
                      <div className="flex-1 bg-muted rounded-t-md flex items-end justify-center group relative cursor-pointer" style={{ height: "90%" }}>
                        <div className="w-full bg-primary/60 rounded-t-md group-hover:bg-primary/80 transition-colors"></div>
                        <span className="absolute -bottom-6 text-xs text-muted-foreground">Fri</span>
                      </div>
                      <div className="flex-1 bg-muted rounded-t-md flex items-end justify-center group relative cursor-pointer" style={{ height: "40%" }}>
                        <div className="w-full bg-yellow-400/40 rounded-t-md group-hover:bg-yellow-400/60 transition-colors"></div>
                        <span className="absolute -bottom-6 text-xs text-muted-foreground">Sat</span>
                      </div>
                      <div className="flex-1 bg-muted rounded-t-md flex items-end justify-center group relative cursor-pointer" style={{ height: "30%" }}>
                        <div className="w-full bg-yellow-400/40 rounded-t-md group-hover:bg-yellow-400/60 transition-colors"></div>
                        <span className="absolute -bottom-6 text-xs text-muted-foreground">Sun</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="flex flex-col gap-6">
                  <Card>
                    <CardContent className="flex flex-col justify-center p-6">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Average Attendance Rate</p>
                      <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-bold">87%</h2>
                        <span className="text-sm text-green-600 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" /> 2.4%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="flex flex-col justify-center p-6">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Total Absences (This Month)</p>
                      <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-bold">142</h2>
                        <span className="text-sm text-red-600 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" /> 5.1%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Data Table */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Class Attendance Summary</CardTitle>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Class Name</TableHead>
                        <TableHead>Ustaz</TableHead>
                        <TableHead>Total Students</TableHead>
                        <TableHead>Attendance Rate</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-muted/50">
                        <TableCell className="font-medium">Tajweed Fundamentals</TableCell>
                        <TableCell>Ust. Ahmad Ali</TableCell>
                        <TableCell>24</TableCell>
                        <TableCell>92%</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                            Excellent
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-muted/50">
                        <TableCell className="font-medium">Fiqh for Beginners</TableCell>
                        <TableCell>Ust. Zainab Noor</TableCell>
                        <TableCell>18</TableCell>
                        <TableCell>85%</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            Good
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-muted/50">
                        <TableCell className="font-medium">Advanced Seerah</TableCell>
                        <TableCell>Ust. Omar Farooq</TableCell>
                        <TableCell>30</TableCell>
                        <TableCell>78%</TableCell>
                        <TableCell>
                          <Badge variant="destructive">
                            Needs Attention
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </main>
      </div>
    </div>
  );
}