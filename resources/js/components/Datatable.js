import * as jzip from 'jszip';
import 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts.js'
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-buttons-bs4';
import 'datatables.net-buttons/js/buttons.colVis.js';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';
//import 'datatables.net-responsive-dt'
//import 'datatables.net-responsive-bs4';
window.JSZip = jzip;
pdfMake.vfs = pdfFonts.pdfMake.vfs