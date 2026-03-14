import { jsPDF } from 'jspdf';
import { AnalysisResult, SitePrintAnalysisResult } from '../types';

const HP_LOGO = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/HP_logo_2025.svg/500px-HP_logo_2025.png";

export const downloadReport = async (
  inspectionMode: 'laptop' | 'siteprint',
  selectedModel: string,
  combinedResult: AnalysisResult | null,
  combinedSitePrintResult: SitePrintAnalysisResult | null,
  combinedError: string | null,
  formatPrice: (price: number) => string
) => {
  const doc = new jsPDF();
  const primaryColor = [0, 150, 214]; // HP Blue
  const darkColor = [20, 20, 20];
  const lightGray = [245, 245, 245];
  
  // Helper to add header to every page
  const addHeader = (pageDoc: any, isFirstPage: boolean) => {
    pageDoc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pageDoc.rect(0, 0, 210, 40, 'F');
    
    // Add HP Logo (White version or just the logo)
    pageDoc.setFillColor(255, 255, 255);
    pageDoc.circle(185, 20, 12, 'F');
    try {
      pageDoc.addImage(HP_LOGO, 'PNG', 177, 12, 16, 16);
    } catch (e) {
      pageDoc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pageDoc.setFontSize(12);
      pageDoc.setFont('helvetica', 'bold');
      pageDoc.text('hp', 182, 22);
    }
    
    pageDoc.setTextColor(255, 255, 255);
    pageDoc.setFontSize(22);
    pageDoc.setFont('helvetica', 'bold');
    pageDoc.text('HORUS AI', 20, 22);
    
    pageDoc.setFontSize(10);
    pageDoc.setFont('helvetica', 'normal');
    pageDoc.text('DIAGNOSTIC & MAINTENANCE REPORT', 20, 30);
    
    if (isFirstPage) {
      pageDoc.setFontSize(8);
      pageDoc.text(`Generated: ${new Date().toLocaleString()}`, 20, 36);
    }
  };

  addHeader(doc, true);
  
  let y = 55;
  
  // Title Section
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const title = inspectionMode === 'laptop' ? `Device: ${selectedModel}` : `Component: HP SitePrint Inkjet System`;
  doc.text(title, 20, y);
  
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(20, y + 2, 190, y + 2);
  y += 15;

  if (combinedError) {
    doc.setFillColor(254, 242, 242);
    doc.rect(20, y, 170, 20, 'F');
    doc.setTextColor(220, 38, 38);
    doc.setFontSize(12);
    doc.text(`Status: Validation Failed`, 25, y + 8);
    doc.setFontSize(10);
    doc.setTextColor(153, 27, 27);
    doc.text(`Reason: ${combinedError}`, 25, y + 14);
    y += 30;
  } else {
    const res = inspectionMode === 'laptop' ? combinedResult : combinedSitePrintResult;
    if (res) {
      // Condition Summary Card
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(20, y, 170, 35, 'F');
      
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const health = inspectionMode === 'laptop' ? combinedResult?.overallHealth : combinedSitePrintResult?.condition;
      doc.text(`Overall Health Status: ${health}`, 25, y + 10);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      const summaryText = doc.splitTextToSize(res.summary || '', 160);
      doc.text(summaryText, 25, y + 18);
      y += 45;

      if (inspectionMode === 'laptop' && combinedResult) {
        // Financial Summary
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Financial Assessment', 20, y);
        y += 8;
        
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Estimated Resale Value: ${formatPrice(combinedResult.estimatedResaleValue)}`, 25, y);
        doc.text(`Total Repair Cost: ${formatPrice(combinedResult.totalRepairCost)}`, 110, y);
        y += 15;

        // Detected Issues
        if (combinedResult.errors && combinedResult.errors.length > 0) {
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('Detected Issues', 20, y);
          y += 8;

          combinedResult.errors.forEach((err, i) => {
            if (y > 270) {
              doc.addPage();
              addHeader(doc, false);
              y = 50;
            }
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(230, 230, 230);
            doc.rect(20, y, 170, 15, 'FD');
            
            doc.setTextColor(err.type === 'critical' ? 220 : 50, 38, 38);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(`${err.type.toUpperCase()}: ${err.description}`, 25, y + 9);
            
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(9);
            doc.text(`Est. Cost: ${formatPrice(err.estimatedRepairCost)}`, 150, y + 9);
            y += 18;
          });
        }
      } else if (inspectionMode === 'siteprint' && combinedSitePrintResult) {
        // SitePrint Details
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Technical Assessment', 20, y);
        y += 8;

        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Wear Level: ${combinedSitePrintResult.wearLevel}%`, 25, y);
        doc.text(`Remaining Life: ${combinedSitePrintResult.remainingLife}`, 110, y);
        y += 15;

        // Recommendations
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Maintenance Recommendations', 20, y);
        y += 8;

        combinedSitePrintResult.recommendations.forEach((rec, i) => {
          if (y > 270) {
            doc.addPage();
            addHeader(doc, false);
            y = 50;
          }
          doc.setTextColor(100, 100, 100);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text(`• ${rec}`, 25, y);
          y += 7;
        });
      }
    }
  }

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
    doc.text('Horus AI Diagnostic System - Confidential HP Technical Report', 105, 290, { align: 'center' });
  }

  doc.save(`HorusAI_Report_${selectedModel.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
};
