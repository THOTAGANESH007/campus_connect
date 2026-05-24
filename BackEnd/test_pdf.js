import pdfParse from 'pdf-parse';
console.log('default:', typeof pdfParse);
if (typeof pdfParse === 'object') {
  console.log('keys:', Object.keys(pdfParse));
  if (pdfParse.default) {
       console.log('default keys:', Object.keys(pdfParse.default));
  }
}
