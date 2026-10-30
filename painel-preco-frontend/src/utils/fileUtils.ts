export const downloadPDF = (fileName: string, file: string) => {
  const anchorElement = document.createElement("a");
  anchorElement.href = `data:application/pdf;base64,${file}`;
  anchorElement.download = fileName;
  anchorElement.click();
};
