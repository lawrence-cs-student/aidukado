import PdfViewer from "../../components/PdfViewer";
import FileViewer from "../../components/FileViewer";


export default function FileView({fileExtension, fileUrl}) {
    
    return (
        <div className="md:w-full h-auto bg-[#102E50] p-2 rounded-lg shadow-2xl">
            {["pdf"].includes(fileExtension) && <PdfViewer fileUrl={fileUrl}/>}
            {["doc", "docx", "ppt", "pptx"].includes(fileExtension) && <FileViewer fileUrl={fileUrl}/>}
        </div>
    )
}