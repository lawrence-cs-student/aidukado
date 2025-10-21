import { useState, useEffect, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export default function PdfViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("PDF URL:", fileUrl);
  }, [fileUrl]);

  // Memoize file object to prevent unnecessary reloads
  const file = useMemo(() => ({
    url: fileUrl,
    httpHeaders: {},
    withCredentials: false
  }), [fileUrl]);

  // Memoize options to prevent unnecessary reloads
  const options = useMemo(() => ({
    cMapUrl: 'https://unpkg.com/pdfjs-dist@5.4.296/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@5.4.296/standard_fonts/',
  }), []);

  function onDocumentLoadSuccess({ numPages }) {
    console.log("PDF loaded successfully, pages:", numPages);
    setNumPages(numPages);
    setPageNumber(1); // Reset to page 1 when new document loads
    setLoading(false);
  }

  function onDocumentLoadError(error) {
    console.error("Error loading PDF:", error);
    setError(error.message);
    setLoading(false);
  }

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.6));
  const nextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages));
  const prevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));

  return (
    <div className="w-full h-3/4 flex flex-col items-center gap-3">
      {/* Controls */}
      <div className="flex gap-2">
        <button 
          onClick={zoomOut} 
          className="px-3 py-1 bg-[#102E50] text-white rounded hover:bg-opacity-90"
        >
          -
        </button>
        <span className="text-[#102E50]">Zoom: {(scale * 100).toFixed(0)}%</span>
        <button 
          onClick={zoomIn} 
          className="px-3 py-1 bg-[#102E50] text-white rounded hover:bg-opacity-90"
        >
          +
        </button>
      </div>

      {/* PDF display */}
      <div className="w-full flex-1 border p-3 rounded-lg bg-gray-50 overflow-auto flex justify-center items-start">
        {loading && <p className="text-gray-600 mt-10">Loading PDF...</p>}
        {error && (
          <div className="text-red-600 mt-10 text-center">
            <p className="font-semibold">Error loading PDF</p>
            <p className="text-sm mt-2">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}
        
        {!error && (
          <Document 
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div className="text-gray-600">Loading document...</div>}
            options={options}
          >
            <Page 
              pageNumber={pageNumber} 
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-lg"
            />
          </Document>
        )}
      </div>

      {/* Pagination */}
      <div className="flex gap-3 items-center">
        <button
          onClick={prevPage}
          disabled={pageNumber <= 1}
          className="px-3 py-1 bg-[#F5C45E] text-[#102E50] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
        >
          Prev
        </button>
        <span className="text-[#102E50]">
          Page {pageNumber} of {numPages || "--"}
        </span>
        <button
          onClick={nextPage}
          disabled={pageNumber >= numPages}
          className="px-3 py-1 bg-[#F5C45E] text-[#102E50] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90"
        >
          Next
        </button>
      </div>
    </div>
  );
}