const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

console.log('Testing PDFKit...');

try {
  // Create a simple PDF
  const doc = new PDFDocument();
  const stream = fs.createWriteStream('test.pdf');
  
  doc.pipe(stream);
  
  // Add some content
  doc.fontSize(25).text('Hello World!', 100, 100);
  doc.fontSize(14).text('This is a test PDF', 100, 150);
  
  // End the document
  doc.end();
  
  stream.on('finish', () => {
    console.log('Test PDF created successfully!');
    if (fs.existsSync('test.pdf')) {
      const stats = fs.statSync('test.pdf');
      console.log('File size:', stats.size, 'bytes');
    }
  });
  
  stream.on('error', (error) => {
    console.error('Stream error:', error);
  });
  
} catch (error) {
  console.error('Error creating test PDF:', error);
}
