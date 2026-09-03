import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { StudentModel } from '@/models/Student';
import { AssessmentModel } from '@/models/Assessment';
import { StudentMarkModel } from '@/models/StudentMark';
import { amharicFontBase64 } from './amharicFont';

export interface ExportStudentMarkOptions {
  students: StudentModel[];
  assessments: AssessmentModel[];
  studentMarks: StudentMarkModel[];
  className: string;
  ustazName?: string;
}

export function exportStudentMarksToPDF(options: ExportStudentMarkOptions) {
  const { students, assessments, studentMarks, className, ustazName } = options;
  
  // 1. DYNAMIC ORIENTATION: Use 'landscape' if there are more than 3 assessments
  const orientation = assessments.length > 3 ? 'landscape' : 'portrait';
  const doc = new jsPDF({ orientation });
  
  // Add Custom Amharic Font
  doc.addFileToVFS('NotoSansEthiopic.ttf', amharicFontBase64);
  doc.addFont('NotoSansEthiopic.ttf', 'AmharicFont', 'normal');
  doc.setFont('AmharicFont');
  
  // Header section
  const headerY = 20;
  doc.setFontSize(20);
  doc.text('Student Marks Report', 14, headerY);
  
  doc.setFontSize(11);
  let currentY = headerY + 10;
  doc.text(`Class: ${className}`, 14, currentY);
  currentY += 7;
  
  if (ustazName) {
    doc.text(`Ustaz: ${ustazName}`, 14, currentY);
    currentY += 7;
  }
  
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, currentY);
  currentY += 7;
  doc.text(`Total Students: ${students.length}`, 14, currentY);
  currentY += 7;
  doc.text(`Total Assessments: ${assessments.length}`, 14, currentY);
  currentY += 12;
  
  // Sort students by total marks (descending)
  const sortedStudents = [...students].sort((a, b) => {
    const getStudentTotal = (studentId: string) => {
      const validMarks = studentMarks.filter(
        m => m.student_id === studentId && 
             assessments.some(a => a.id === m.assessment_id) &&
             m.score !== null && 
             !m.is_excused
      );
      return validMarks.reduce((sum, m) => sum + (m.score || 0), 0);
    };
    
    const totalA = getStudentTotal(a.id);
    const totalB = getStudentTotal(b.id);
    return totalB - totalA; // Sort descending (highest first)
  });
  
  // Prepare table data
  const tableData = sortedStudents.map((student, index) => {
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
    
    // Calculate total & average
    const validMarks = studentMarks.filter(
      m => m.student_id === student.id && 
           assessments.some(a => a.id === m.assessment_id) &&
           m.score !== null && 
           !m.is_excused
    );
    
    const totalMarks = validMarks.reduce((sum, m) => sum + (m.score || 0), 0);
    const totalPossibleMarks = assessments.reduce((sum, a) => sum + a.total_marks, 0);
    row.push(totalMarks > 0 ? `${totalMarks.toFixed(1)}/${totalPossibleMarks}` : 'N/A');
    
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
  
  // 2. CONFIGURE AUTOTABLE FOR WIDE DATA
  autoTable(doc, {
    head: [tableHeaders],
    body: tableData,
    startY: currentY,
    theme: 'grid',
    horizontalPageBreak: true, // <-- EXTREMELY IMPORTANT: Allows table to span multiple pages horizontally if too wide
    horizontalPageBreakRepeat: 1, // Repeats the 'Student Name' column on the new page
    styles: {
      font: 'AmharicFont',
      fontSize: 9, // Slightly larger font
      cellPadding: 3,
      valign: 'middle' // Centers text vertically
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'normal',
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' }, // #
      1: { cellWidth: 45 }, // <-- FIX: Give Student Name a fixed width so it never shrinks
      // Notice we are NO LONGER hardcoding widths for assessments. 
      // AutoTable will naturally divide the remaining space for assessments, totals, and averages.
    }
  });
  
  const classNameForFile = className.replace(/[\s/\\:*?"<>|]/g, '_');
  const ustazNameForFile = ustazName ? ustazName.replace(/[\s/\\:*?"<>|]/g, '_') : '';
  const filename = ustazName 
    ? `student-marks-${ustazNameForFile}-${classNameForFile}.pdf`
    : `student-marks-${classNameForFile}.pdf`;
  doc.save(filename);
  
  return filename;
}