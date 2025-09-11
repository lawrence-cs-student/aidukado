import { MdDelete, MdEdit } from "react-icons/md";

export default function Table({ columns, data, setSelectedUserId, setIsOpenEditModal, setIsOpenDeleteModal }) {

    const columnStyle = "px-4 py-2 text-left";
    const tableDataStyle = "text-[#10375C] px-4 py-2 text-left"

    return (
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
                {data && data.length > 0 ? (
                    data.map((row, i) => (
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
                                            setSelectedUserId(row.id);
                                            setIsOpenEditModal(true);
                                        }}
                            
                                    />
                                    <MdDelete size={24} color="red" 
                                        onClick={ () => {
                                            setSelectedUserId(row.id);
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
    )
}