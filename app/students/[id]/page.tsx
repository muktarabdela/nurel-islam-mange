import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Edit, Mail, Calendar, CheckCircle, X, BookOpen, Plus, Info, CalendarDays } from "lucide-react";

export default function StudentProfilePage() {
  return (
    <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
      
      <Sidebar />

      <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden">
        
        <TopNavBar />

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto max-w-[1440px] mx-auto w-full">
          
          {/* Header Section */}
          <div className="mb-12 flex flex-col md:flex-row justify-between items-start gap-6 md:gap-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarImage 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4oQAl2zqqYNtWAnYyKG0JV2Dhf2AIT5G4WVYgfsIE-JuPEg8zmSmHAshxf7xwZLWTo_QNzLSQOvOqHQhiudDm1bXpbvjTsjFSACCaPS8sVEB84uUnIQE8jftUUQsSMyRMwS6FB7ImTqm-Y--D24toyrPBxBonZegxqD96msNPSsU3fRSl1xvRIKssuoVlkD3TUw-zITUqFKle3CvNcDkrWrDLVrn3CIS4hiq6E-yg8SsGR5sLZvNrf97zir1m8KbSceZ82T-R-1Q"
                  alt="Student Avatar"
                />
                <AvatarFallback>AO</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-bold mb-2">Ahmad Ibn Omar</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">Year 4 - Hifz Advanced</span>
                  <span className="mx-2 text-muted-foreground hidden sm:inline">•</span>
                  <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/10">
                    Active
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 w-full md:w-auto justify-center md:justify-end">
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
              <Button className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Guardian
              </Button>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Section 1: Basic Information */}
            <Card className="lg:col-span-1 h-fit">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-4">
                <Info className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Student ID</p>
                  <p className="text-base">STU-2023-0482</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Date of Birth</p>
                  <p className="text-base">15 Rajab 1434 (25 May 2013)</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Guardian Contact</p>
                  <p className="text-base">+60 12-345 6789 (Father)</p>
                  <p className="text-base mt-1">omar.abdullah@email.com</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Address</p>
                  <p className="text-base">
                    123 Jalan Setia Murni,<br />
                    Bukit Damansara,<br />
                    50490 Kuala Lumpur
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Main Column (Attendance & Notes) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Section 2: Attendance History */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    Recent Attendance
                  </CardTitle>
                  <Button variant="link">
                    View All
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time In</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-muted/50">
                        <TableCell>Today, 24 Oct</TableCell>
                        <TableCell className="text-muted-foreground">Hifz Advanced</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle className="h-3 w-3 mr-1" /> Present
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">07:45 AM</TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-muted/50">
                        <TableCell>Yesterday, 23 Oct</TableCell>
                        <TableCell className="text-muted-foreground">Hifz Advanced</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle className="h-3 w-3 mr-1" /> Present
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">07:50 AM</TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-muted/50">
                        <TableCell>22 Oct 2023</TableCell>
                        <TableCell className="text-muted-foreground">Hifz Advanced</TableCell>
                        <TableCell>
                          <Badge variant="destructive">
                            <X className="h-3 w-3 mr-1" /> Absent
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Section 3: Behavior Notes */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    Behavior & Progress Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Notes List */}
                  <div className="space-y-4 mb-6">
                    <div className="p-4 rounded-lg bg-muted border">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold">Ustaz Ibrahim</span>
                          <Badge variant="secondary" className="px-2 py-0.5">Hifz Class</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">2 Days Ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Ahmad has shown excellent progress in memorizing Surah Al-Mulk. His tajweed is improving steadily. Needs to focus a bit more during afternoon revision session.
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-muted border">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold">Ustazah Aminah</span>
                          <Badge variant="outline" className="px-2 py-0.5">Akhlaq Class</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">1 Week Ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Very helpful with younger students today. Demonstrated good leadership qualities during group activities.
                      </p>
                    </div>
                  </div>

                  {/* Add Note Form */}
                  <div className="border-t pt-4">
                    <h4 className="text-base font-semibold mb-3">Add New Note</h4>
                    <form className="flex flex-col gap-3">
                      <Textarea 
                        placeholder="Write a note regarding behavior, progress, or general observation..." 
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <Button type="submit" className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Save Note
                        </Button>
                      </div>
                    </form>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}