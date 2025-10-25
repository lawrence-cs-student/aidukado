

export default function EditLesson({materialId, onClose, onSuccess}) {

    const [metaData, setMetaData] = useState({
        classId: classId,
        termId: getTermId(term),
        title: "",
        description: ""
    })    

    const inputClass = "w-full sm:h-[6%] border-solid border border-[#C9CCD5] bg-transparent text-[#102E50] p-[1%] rounded-md shadow-md";
    const labelClass = "text-[#102E50] font-bold opacity-75";
    return (
        <form className="flex flex-col justify-center w-full h-full gap-[2%] text-left rounded-2xl bg-[#F4F6FF] p-4 shadow-2xl">
            {uploadError && (<p className="text-red-800">{uploadError}</p>)}
            <label className={labelClass}>
                Title
            </label>
            <input 
                className={inputClass}
                value={metaData.title}
                onChange={(e) => setMetaData((prev) => ({...prev, title: e.target.value}))}
            >

            </input>
            <label className={labelClass}>
                Term
            </label>
            <input className={inputClass} value={term} readOnly></input>
            
            <label className={labelClass}>
                Description
            </label>
            <textarea 
                className="w-full h-[20%] border-solid border border-[#C9CCD5] bg-transparent text-[#102E50] p-[1%] rounded-md shadow-md"
                value={metaData.description}
                onChange={(e) => setMetaData((prev) => ({...prev, description: e.target.value}))}
                rows={2} 
                cols={5}
            />
           <div className="flex gap-2">
                <button onClick={() => setIsOpen(false)} className="bg-[#9BA4B4] w-1/2" type="button">CANCEL</button>
                <button className="bg-[#102E50] w-1/2" onClick={handleUpload}>UPLOAD</button>
           </div>
        </form>
        
    )    
}