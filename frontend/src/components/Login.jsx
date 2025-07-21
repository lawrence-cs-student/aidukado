import { NavLink } from "react-router-dom";


export default function Login() {
    return (
        <div className="bg-[#333446] flex h-full w-full flex flex-col side-background">
            <div className="absolute left-[68%] top-[40%]">
                <h1 className="text-white opacity-[0.7] text-4xl">
                    <span className="block">Sign up to unlock personalized</span>
                    <span className="block">learning powered by AI</span>
                </h1>
                <NavLink to={"/signup"}>
                    <button className="w-[100%] h-[10%] mt-[6%] p-1 bg-[#333446] text-white">Signup</button>
                </NavLink>
            </div>
            <div className="flex h-full w-[60%] bg-white justify-center items-center flex-col">
                <form className="bg-transparent h-[50%] w-[40%] flex justify-center flex-col gap-2 rounded-3xl p-[4%] border-2 border-[#7F8CAA] ">
                    <h2 className="text-3xl font-bold text-[#333446] self-center mb-4">Login</h2>
                    <label className="block font-medium mb-1 text-[#7F8CAA]">Email:</label>
                    <input className="bg-transparent border-2 rounded-md w-[95%] h-[10%] p-1 text-[#7F8CAA]" placeholder="Email"></input>
                    <label className="block font-medium mb-1 text-[#7F8CAA]">Password:</label>
                    <input className="bg-transparent border-2 rounded-md w-[95%] h-[10%] p-1 text-[#7F8CAA]" placeholder="Password"></input>
                    <button className="w-[95%] h-[10%] mt-2 p-1 bg-[#333446]">Login</button>
                </form>
            </div>
        </div>
    )
}