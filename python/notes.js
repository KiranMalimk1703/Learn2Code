
function goHome() {
  window.location.href = "index.html";
}



/* Back to previous page OR home */
function goBack() {
  // safer option: always go to landing page
  window.location.href = "index.html";
}

/* Download Notes as PDF (simple method) */
function downloadNotes() {
  window.print();
}

/* Card navigation */
function goToMCQ() {
  window.location.href = "python-mcq.html";
}

function goToFillBlanks() {
  window.location.href = "python-fill.html";
}

function goToCompiler() {
  window.location.href = "python-compiler.html";
}



/* =========================
   BACK BUTTON FUNCTION
========================= */
function goBack() {
  window.history.back();
}


/* =========================
   DOWNLOAD NOTES AS PDF
   Supports Light & Dark Mode
========================= */
function downloadPDF(mode = "light") {
  const { jsPDF } = window.jspdf;

  const content = document.querySelector(".container");

  if (!content) {
    alert("Content not found!");
    return;
  }

  // Save original styles
  const originalBg = document.body.style.background;
  const originalColor = document.body.style.color;

  // Apply PDF mode styles
  if (mode === "dark") {
    document.body.style.background = "#0f2027";
    document.body.style.color = "#ffffff";
  } else {
    document.body.style.background = "#ffffff";
    document.body.style.color = "#000000";
  }

  
  html2canvas(content, {
    scale: 2,
    useCORS: true
  }).then(canvas => {
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

  
    const fileName =
      mode === "dark"
        ? "Python_Notes_Dark_Mode.pdf"
        : "Python_Notes_Light_Mode.pdf";

    pdf.save(fileName);

    
    document.body.style.background = originalBg;
    document.body.style.color = originalColor;
  }).catch(err => {
    console.error(err);
    alert("PDF download failed. Check console.");
  });
}
