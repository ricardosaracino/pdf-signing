let fs = require('fs');

let SignPdf = require('node-signpdf').SignPdf;

let addSignaturePlaceholder = require('./node_modules/node-signpdf/dist/helpers.js').addSignaturePlaceholder;

let PdfPrinter = require('pdfmake');

let signer = new SignPdf();

var fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
};

var printer = new PdfPrinter();

var docDefinition = {
    content: [
        'First paragraph',
        'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
    ]
};

var pdf = printer.createPdfKitDocument(docDefinition);


let buffers = [];

pdf.on('data', buffers.push.bind(buffers));
pdf.on('end', () => {

    const pdfData = Buffer.concat(buffers);

    const certData = fs.readFileSync('./certs/certificate.pfx');

    const signedPdf = signer.sign(pdfData, certData, {passphrase: 'test'});

    let writeStream = fs.createWriteStream('signed-output.pdf');
    writeStream.write(signedPdf);
    writeStream.end();
});


// Externally (to PDFKit) add the signature placeholder.
const refs = addSignaturePlaceholder({
    pdf,
    reason: 'I am the author',
    ...{},
});


// Externally end the streams of the created objects.
// PDFKit doesn't know much about them, so it won't .end() them.
Object.keys(refs).forEach(key => refs[key].end());

// PDF Creation logic goes here
pdf.end();