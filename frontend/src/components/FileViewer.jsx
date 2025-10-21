import { useState } from "react";

export default function FileViewer({ fileUrl }) {
  const [isLoading, setIsLoading] = useState(true);

  if (!fileUrl) return <p>No file to display</p>;

  const encodedUrl = encodeURIComponent(fileUrl);
  const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;

  return (
    <div className="relative w-full h-[80vh]">
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/80 z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#F5C45E]"></div>
        </div>
      )}

      
      <iframe
        src={officeViewerUrl}
        title="Document Viewer"
        className="w-full h-full rounded-lg border border-gray-300"
        allowFullScreen
        onLoad={() => setIsLoading(false)} 
      ></iframe>
    </div>
  );
}
