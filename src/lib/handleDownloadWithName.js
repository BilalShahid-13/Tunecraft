export const handleDownloadWithRef = async (fileUrl, fileName, linkRef) => {
  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    if (linkRef.current) {
      linkRef.current.href = url;
      linkRef.current.download = fileName;
      linkRef.current.click();
    }

    // Clean up the blob URL after a short delay
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Download failed:", error);
    // Fallback to opening in new tab
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  }
};
