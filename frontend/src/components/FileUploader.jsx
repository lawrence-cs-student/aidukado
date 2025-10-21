

export default function FileUploader({type, handleFileChange}) {
  return (
    <div className="w-full mx-auto p-6 border-2 border-dashed rounded-lg bg-gray-50">
      <label
        htmlFor="file-upload"
        className="block mb-2 text-sm font-medium text-[#102E50]"
      >
        Upload file
      </label>
      <input
        type="file"
        id="file-upload"
        accept={type}
        onChange={handleFileChange}
        className="block w-full text-sm text-[#102E50] border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-semibold
                   file:bg-[#102E50] file:text-white
                   hover:file:bg-[#0d243f]"
      />
    </div>
  );
}

