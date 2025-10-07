import axios from "axios";


export default function DeleteUser({ userId, onClose, onSuccess}) {

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`http://localhost:8000/user/delete/${userId}`, )
            if(onSuccess) onSuccess();
        } catch (err) {
            console.error("Error Deleting User", err)
        }
    }


    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-white p-[4%] shadow-xl">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-2/3 h-1/2 gap-[2%] text-left rounded-2xl"
            >
                <p className="text-[#10375C] font-bold text-xl"> ARE YOU SURE YOU WANT TO DELETE THIS USER WITH ID: {userId}</p>
                <div className="w-full flex gap-2">
                    <button
                    onClick={onClose}
                    type="button"
                    className="w-full mt-[1%] bg-[#10375C] text-white transition-transform duration-200 hover:scale-95 shadow-md"
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    className="w-full mt-[1%] bg-[#E62727] text-white transition-transform duration-200 hover:scale-95 shadow-md"
                    >
                    Confirm
                    </button>
                </div>
                
            </form>
        </div>
    )
}