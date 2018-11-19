let fs = require('fs');

let PdfKit = require('pdfkit');

let SignPdf = require('node-signpdf').SignPdf;

let addSignaturePlaceholder = require('./node_modules/node-signpdf/dist/helpers.js').addSignaturePlaceholder;



let signer = new SignPdf();

let pdf = new PdfKit();

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


// Set a title and pass the X and Y coordinates
pdf.fontSize(25).text('Lorem Ipsum', 50, 50);

// Set the paragraph width and align direction
pdf.fontSize(15).text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eget dolor vitae tortor iaculis cursus ' +
    'sed hendrerit sapien. Duis vel turpis quis lorem rutrum commodo a nec orci. Integer eget ex fermentum, ' +
    'finibus ipsum a, convallis nisl. Vivamus sodales, neque ut tristique volutpat, nisi elit congue quam, quis ' +
    'scelerisque sem velit in justo. Sed at ante ut massa tempor vulputate sed ac diam. Quisque posuere ligula nec ' +
    'tincidunt tincidunt. Etiam ac accumsan sem, elementum lobortis urna. Phasellus venenatis, lectus eget convallis ' +
    'condimentum, elit risus elementum nisi, commodo aliquet magna sapien nec eros. Quisque iaculis sit amet arcu eu ' +
    'tempus. Curabitur lectus justo, tincidunt tincidunt elit vitae, dapibus pulvinar nisi.', {
    width: 410,
    align: 'left'
});

// write buffer instead pdf.pipe(fs.createWriteStream('output.pdf'));


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