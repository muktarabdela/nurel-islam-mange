import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClassTableData } from "@/utils/reportsUtils";

interface ClassAttendanceTableProps {
  data: ClassTableData[];
}

export default function ClassAttendanceTable({ data }: ClassAttendanceTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Class Attendance Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Name</TableHead>
              <TableHead>Ustaz</TableHead>
              <TableHead>Total Students</TableHead>
              <TableHead>Total Present</TableHead>
              <TableHead>Total Absent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No classes found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.ustaz}</TableCell>
                  <TableCell>{row.studentsCount}</TableCell>
                  <TableCell>{row.totalPresent}</TableCell>
                  <TableCell>{row.totalAbsent}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
