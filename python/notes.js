/* =========================
   DOWNLOAD NOTES AS PDF
   Supports Light & Dark Mode
========================= */
async function downloadPDF(mode = "light") {
  if (!window.jspdf) {
    alert("PDF generator library not loaded yet.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const content = document.querySelector(".notes-content");

  if (!content) {
    alert("Content not found!");
    return;
  }

  const originalBtns = document.querySelectorAll('.action-btn');
  originalBtns.forEach(btn => {
    btn.style.opacity = '0.5';
    btn.style.pointerEvents = 'none';
    btn.innerText = "Generating PDF...";
  });

  // Save original styles array to restore later
  const originalStyles = new Map();
  originalStyles.set(content, content.getAttribute('style') || '');

  const glassPanels = content.querySelectorAll('.glass-panel');
  const mainHeader = content.querySelector('.main-header');
  const textElements = content.querySelectorAll('p, h1, h2, h3, h4, li, td, th, blockquote');
  const codeBlocks = content.querySelectorAll('.code-block');
  const codeHeaders = content.querySelectorAll('.code-header');

  if (mode === "dark") {
    content.style.background = "#050508";
    content.style.padding = "20px";
    
    glassPanels.forEach(panel => {
      originalStyles.set(panel, panel.getAttribute('style') || '');
      panel.style.background = "#0f172a";
      panel.style.border = "1px solid #1e293b";
    });
    
    if (mainHeader) mainHeader.style.background = "#0f172a";
    
  } else {
    // Light mode overrides
    content.style.background = "#ffffff";
    content.style.padding = "20px";

    glassPanels.forEach(panel => {
      originalStyles.set(panel, panel.getAttribute('style') || '');
      panel.style.background = "#f8fafc";
      panel.style.border = "1px solid #e2e8f0";
    });

    if (mainHeader) mainHeader.style.background = "#f1f5f9";

    textElements.forEach(el => {
      originalStyles.set(el, el.getAttribute('style') || '');
      el.style.color = "#0f172a";
    });

    codeBlocks.forEach(cb => {
      originalStyles.set(cb, cb.getAttribute('style') || '');
      cb.style.background = "#1e293b";
      cb.style.border = "1px solid #334155";
    });

    codeHeaders.forEach(ch => {
      originalStyles.set(ch, ch.getAttribute('style') || '');
      ch.style.background = "#334155";
      ch.style.color = "#f8fafc";
    });
  }

  try {
    // Render using scale: 4 for high-density crisp text
    const canvas = await html2canvas(content, {
      scale: 4, 
      useCORS: true,
      backgroundColor: mode === "dark" ? "#050508" : "#ffffff",
      windowWidth: content.scrollWidth,
      windowHeight: content.scrollHeight,
      logging: false
    });

    // Use PNG for lossless, crisp text rendering
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    let position = 0;
    
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
    let heightLeft = pdfHeight - pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    const fileName = mode === "dark" ? "Python_Notes_Dark.pdf" : "Python_Notes_Light.pdf";
    pdf.save(fileName);

  } catch (err) {
    console.error("PDF generation error: ", err);
    alert("PDF download failed. See console for details.");
  } finally {
    // Restore all original styles cleanly
    originalStyles.forEach((styleStr, element) => {
      element.setAttribute('style', styleStr);
    });

    originalBtns.forEach(btn => {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'all';
      if(btn.classList.contains("btn-light")) {
        btn.innerHTML = `<i class="fa-solid fa-file-pdf"></i> Download Light PDF`;
      } else {
        btn.innerHTML = `<i class="fa-solid fa-moon"></i> Download Dark PDF`;
      }
    });
  }
}
