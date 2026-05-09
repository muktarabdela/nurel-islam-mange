import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { StudentModel } from '@/models/Student';
import { ClassModel } from '@/models/Class';
import { UstazModel } from '@/models/Ustaz';

// Import the base64 font you created in Step 3
import { amharicFontBase64 } from './amharicFont'; 

export interface ExportOptions {
  students: StudentModel[];
  classData: ClassModel;
  ustazData?: UstazModel;
}

export function exportStudentsToPDF(options: ExportOptions) {
  const { students, classData, ustazData } = options;
  
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
  doc.text('Students Report', 14, headerY);
  
  // Report details
  doc.setFontSize(12);
  let currentY = headerY + 10;
  
  doc.text(`Class: ${classData.name}`, 14, currentY);
  currentY += 8;
  
  if (ustazData) {
    doc.text(`Ustaz: ${ustazData.full_name}`, 14, currentY);
    currentY += 8;
  }
  
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, currentY);
  currentY += 8;
  
  doc.text(`Total Students: ${students.length}`, 14, currentY);
  currentY += 15;
  
  // Prepare table data
  const tableData = students.map((student, index) => [
    (index + 1).toString(),
    student.full_name,
    student.parent_phone || 'N/A'
  ]);
  
  // Generate table
  autoTable(doc, {
    head: [['#', 'Full Name', 'Parent Phone']],
    body: tableData,
    startY: currentY,
    theme: 'grid',
    styles: {
      font: 'AmharicFont', // CHANGE THIS TO YOUR CUSTOM FONT
      fontSize: 10,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [59, 130, 246], // Blue color
      textColor: 255,
      // Note: If you want bold, you need to add a Bold version of the font 
      // the same way you added the regular one. Otherwise, keep it normal.
      fontStyle: 'normal' 
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245] // Light gray
    },
    columnStyles: {
      0: { cellWidth: 15 }, // #
      1: { cellWidth: 'auto' }, // Full Name
      2: { cellWidth: 40 } // Parent Phone
    }
  });
  
  // Generate filename
  // Using a simpler regex just in case Amharic characters are in the class name
  const classNameForFile = classData.name.replace(/[\s/\\:*?"<>|]/g, '_');
  const filename = `students-${classNameForFile}.pdf`;
  
  // Save the PDF
  doc.save(filename);
  
  return filename;
}