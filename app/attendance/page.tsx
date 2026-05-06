import Sidebar from "@/components/Sidebar";
import TopNavBar from "@/components/TopNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, CheckCircle, X, Clock, Save, ChevronDown } from "lucide-react";

export default function AttendancePage() {
  return (
    <div className="flex bg-background min-h-screen font-body-md antialiased text-on-background">
      
      <Sidebar />

      <div className="md:ml-[280px] flex-1 flex flex-col min-h-screen overflow-hidden relative">
        
        <TopNavBar />

        {/* Page Canvas */}
        <main className="flex-1 overflow-y-auto p-8 flex flex-col gap-12">
          
          {/* Page Header & Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h2 className="font-h1 text-h1 text-on-background mb-2">Take Attendance</h2>
              <p className="font-body-md text-body-md text-secondary">
                Record daily attendance for students.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Date Picker */}
              <div className="flex flex-col gap-2 flex-1 sm:min-w-[200px]">
                <label className="text-sm font-medium text-muted-foreground" htmlFor="attendance-date">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    id="attendance-date"
                    type="date"
                    defaultValue="2023-10-25"
                  />
                </div>
              </div>
              
              {/* Class Selector */}
              <div className="flex flex-col gap-2 flex-1 sm:min-w-[200px]">
                <label className="text-sm font-medium text-muted-foreground" htmlFor="class-select">
                  Class
                </label>
                <Select defaultValue="quranic-studies-1">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quranic-studies-1">Quranic Studies - Level 1</SelectItem>
                    <SelectItem value="arabic-language-2">Arabic Language - Level 2</SelectItem>
                    <SelectItem value="fiqh-advanced">Fiqh - Advanced</SelectItem>
                    <SelectItem value="seerah-fundamentals">Seerah - Fundamentals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Student List Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Student List</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-muted-foreground">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-muted-foreground">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-muted-foreground">Late</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Student Name</TableHead>
                    <TableHead className="w-[20%]">ID Number</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Student Row 1 */}
                  <TableRow className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          AA
                        </div>
                        <span className="font-medium">Ahmad Abdullah</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">STU-1042</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex rounded-lg border overflow-hidden">
                        <Button variant="ghost" size="sm" className="rounded-none border-r bg-green-50 text-green-700 hover:bg-green-100">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Present
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-none border-r">
                          <X className="h-4 w-4 mr-1" />
                          Absent
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-none">
                          <Clock className="h-4 w-4 mr-1" />
                          Late
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Student Row 2 */}
                  <TableRow className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          FZ
                        </div>
                        <span className="font-medium">Fatima Zahra</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">STU-1045</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex rounded-lg border overflow-hidden">
                        <Button variant="ghost" size="sm" className="rounded-none border-r bg-green-50 text-green-700 hover:bg-green-100">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Present
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-none border-r">
                          <X className="h-4 w-4 mr-1" />
                          Absent
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-none">
                          <Clock className="h-4 w-4 mr-1" />
                          Late
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Student Row 3 */}
                  <TableRow className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          OK
                        </div>
                        <span className="font-medium">Omar Khalid</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">STU-1051</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex rounded-lg border overflow-hidden">
                        <Button variant="ghost" size="sm" className="rounded-none border-r">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Present
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-none border-r bg-red-50 text-red-700 hover:bg-red-100">
                          <X className="h-4 w-4 mr-1" />
                          Absent
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-none">
                          <Clock className="h-4 w-4 mr-1" />
                          Late
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Student Row 4 */}
                  <TableRow className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          ZB
                        </div>
                        <span className="font-medium">Zainab Bilal</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">STU-1062</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex rounded-lg border overflow-hidden">
                        <Button variant="ghost" size="sm" className="rounded-none border-r">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Present
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-none border-r">
                          <X className="h-4 w-4 mr-1" />
                          Absent
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-none bg-yellow-50 text-yellow-700 hover:bg-yellow-100">
                          <Clock className="h-4 w-4 mr-1" />
                          Late
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Action Area */}
          <div className="flex justify-end mt-auto pt-6 border-t">
            <Button size="lg" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Attendance
            </Button>
          </div>

        </main>
      </div>
    </div>
  );
}