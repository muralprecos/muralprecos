

export const downloadBlob = (blob: Blob, name = 'file.pdf') => {
  
  // For other browsers:
  // Create a link pointing to the ObjectURL containing the blob.
  const data = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = data;
  link.download = name;

  // this is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', { 
      bubbles: true, 
      cancelable: true, 
      view: window 
    })
  );

  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(data);
    link.remove();
  }, 100);
}

export const downloadPDF = (fileName: string, file: string) => {
  const anchorElement = document.createElement('a');
  anchorElement.href = `data:application/pdf;base64,${file}`;
  anchorElement.download = fileName;
  anchorElement.click();
}
