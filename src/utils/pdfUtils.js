// PDF utility functions for handling document downloads

export const downloadPDF = (pdfUrl, filename) => {
  try {
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = filename
    link.target = "_blank"

    // For better browser compatibility
    if (document.createEvent) {
      const event = document.createEvent("MouseEvents")
      event.initEvent("click", true, true)
      link.dispatchEvent(event)
    } else {
      link.click()
    }

    // Clean up
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link)
      }
    }, 100)
  } catch (error) {
    console.error("Error downloading PDF:", error)
    // Fallback: open in new tab
    window.open(pdfUrl, "_blank")
  }
}

export const openPDFInNewTab = (pdfUrl) => {
  window.open(pdfUrl, "_blank", "noopener,noreferrer")
}

