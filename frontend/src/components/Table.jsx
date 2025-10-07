import { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

export default function Table({ columns, data, setSelectedData, setIsOpenEditModal, setIsOpenDeleteModal }) {

    const columnStyle = "px-4 py-2 text-left";
    const tableDataStyle = "text-[#10375C] px-4 py-2 text-left"

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentItems = data.slice(startIndex, endIndex);

    const totalPages = Math.ceil(data.length / itemsPerPage)

    return (
        <>
            <table className="w-full border border-gray-300 rounded-lg">
                <thead className="bg-[#10375C] text-white">
                    <tr>
                        {columns.map((column) => (
                            <th key={column.id} className={columnStyle}>
                                {column.name}
                            </th>
                            
                        ))}
                        <th className={columnStyle}>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {currentItems && currentItems.length > 0 ? (
                        currentItems.map((row, i) => (
                            <tr key={row.id || i}>
                                {columns.map((column) => (
                                    <td key={column.id} className={tableDataStyle}>
                                        {row[column.key]}
                                    </td>
                                ))}
                                <td className={tableDataStyle}>
                                    <div className="w-full h-full flex">
                                        <MdEdit size={24} color="#F5C45E"
                                            onClick={ () => {
                                                setSelectedData(row);
                                                setIsOpenEditModal(true);
                                            }}
                                
                                        />
                                        <MdDelete size={24} color="red" 
                                            onClick={ () => {
                                                setSelectedData(row);
                                                setIsOpenDeleteModal(true);
                                                }
                                            }
                                        />
                                                                        
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-2 text-left text-red-800">
                                No Data
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-[#F3C623] text-white" : "bg-[#10375C]"}`}
                >
                    {i + 1}
                </button>
                ))}
            </div>        
        </>
    )
}