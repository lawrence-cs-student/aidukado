import FileUploader from "../../components/FileUploader"

export default function UploadLesson({setIsOpen}) {

    const inputClass = "w-full sm:h-[6%] border-solid border border-[#C9CCD5] bg-transparent text-[#102E50] p-[1%] rounded-md shadow-md";
    
    const labelClass = "text-[#102E50] font-bold opacity-75";
    return (
        <form className="flex flex-col justify-center w-full h-full gap-[2%] text-left rounded-2xl bg-[#F4F6FF] p-4 shadow-2xl">
            <FileUploader />
            <label className={labelClass}>
                Title
            </label>
            <input className={inputClass}></input>
            <label className={labelClass}>
                Term
            </label>
            <select className="w-full sm:h-[6%] border border-[#C9CCD5] bg-transparent text-[#102E50] rounded-md">
                <option className="bg-transparent text-[#102E50] rounded-md">PRELIMS</option>
                <option className="bg-transparent text-[#102E50] rounded-md">MIDTERMS</option>
                <option className="bg-transparent text-[#102E50] rounded-md">FINALS</option>
            </select>
            <label className={labelClass}>
                Description
            </label>
            <textarea 
                className="w-full h-[20%] border-solid border border-[#C9CCD5] bg-transparent text-[#102E50] p-[1%] rounded-md shadow-md"
                rows={2} 
                cols={5}
            />
           <div className="flex gap-2">
                <button onClick={() => setIsOpen(false)} className="bg-[#9BA4B4] w-1/2" type="button">CANCEL</button>
                <button className="bg-[#102E50] w-1/2">UPLOAD</button>
           </div>
        </form>
        
    )
}