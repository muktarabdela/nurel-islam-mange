import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { StudentModel } from '@/models/Student';
import { AssessmentModel } from '@/models/Assessment';
import { StudentMarkModel } from '@/models/StudentMark';

// Import the base64 font you created in Step 3
import { amharicFontBase64 } from './amharicFont';

export interface ExportStudentMarkOptions {
  students: StudentModel[];
  assessments: AssessmentModel[];
  studentMarks: StudentMarkModel[];
  className: string;
}

export function exportStudentMarksToPDF(options: ExportStudentMarkOptions) {
  const { students, assessments, studentMarks, className } = options;
  
  // Create new PDF document
  const doc = new jsPDF();
  
  // --- ADD CUSTOM AMHARIC FONT ---
  // 1. Add the base64 string to the Virtual File System (VFS)
  doc.addFileToVFS('NotoSansEthiopic.ttf', amharicFontBase64);
  
  // 2. Add the font to jsPDF
  doc.addFont('NotoSansEthiopic.ttf', 'AmharicFont', 'normal');
  
  // 3. Set the font to be used in the document
  doc.setFont('AmharicFont');
  // -------------------------------
  
  // Header section
  const headerY = 20;
  
  // Title
  doc.setFontSize(20);
  doc.text('Student Marks Report', 14, headerY);
  
  // Report details
  doc.setFontSize(12);
  let currentY = headerY + 10;
  
  doc.text(`Class: ${className}`, 14, currentY);
  currentY += 8;
  
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, currentY);
  currentY += 8;
  
  doc.text(`Total Students: ${students.length}`, 14, currentY);
  currentY += 8;
  
  doc.text(`Total Assessments: ${assessments.length}`, 14, currentY);
  currentY += 15;
  
  // Prepare table data
  const tableData = students.map((student, index) => {
    const row: (string | number)[] = [
      (index + 1).toString(),
      student.full_name
    ];
    
    // Add assessment scores
    assessments.forEach(assessment => {
      const mark = studentMarks.find(
        m => m.student_id === student.id && m.assessment_id === assessment.id
      );
      
      if (mark && mark.score !== null && !mark.is_excused) {
        row.push(`${mark.score}/${assessment.total_marks}`);
      } else if (mark && mark.is_excused) {
        row.push('Excused');
      } else {
        row.push('N/A');
      }
    });
    
    // Calculate total marks
    const validMarks = studentMarks.filter(
      m => m.student_id === student.id && 
           assessments.some(a => a.id === m.assessment_id) &&
           m.score !== null && 
           !m.is_excused
    );
    
    const totalMarks = validMarks.reduce((sum, m) => sum + (m.score || 0), 0);
    row.push(totalMarks > 0 ? totalMarks.toFixed(1) : 'N/A');
    
    // Calculate average score
    if (validMarks.length > 0) {
      const totalPercentage = validMarks.reduce((sum, m) => {
        const assessment = assessments.find(a => a.id === m.assessment_id);
        if (!assessment) return sum;
        return sum + ((m.score || 0) / assessment.total_marks) * 100;
      }, 0);
      const average = totalPercentage / validMarks.length;
      row.push(average.toFixed(1) + '%');
    } else {
      row.push('N/A');
    }
    
    return row;
  });
  
  // Prepare table headers
  const tableHeaders = ['#', 'Student Name', ...assessments.map(a => a.title), 'Total Marks', 'Average'];
  
  // Generate table
  autoTable(doc, {
    head: [tableHeaders],
    body: tableData,
    startY: currentY,
    theme: 'grid',
    styles: {
      font: 'AmharicFont',
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [59, 130, 246], // Blue color
      textColor: 255,
      fontStyle: 'normal'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245] // Light gray
    },
    columnStyles: {
      0: { cellWidth: 10 }, // #
      1: { cellWidth: 'auto' }, // Student Name
      ...Object.fromEntries(
        assessments.map((_, i) => [i + 2, { cellWidth: 25, halign: 'center' }])
      ),
      [assessments.length + 2]: { cellWidth: 25, halign: 'center' }, // Total Marks
      [assessments.length + 3]: { cellWidth: 25, halign: 'center' }  // Average
    }
  });
  
  // Generate filename
  const classNameForFile = className.replace(/[\s/\\:*?"<>|]/g, '_');
  const filename = `student-marks-${classNameForFile}.pdf`;
  
  // Save the PDF
  doc.save(filename);
  
  return filename;
}
