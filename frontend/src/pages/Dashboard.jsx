export default function Dashboard() {
  return (
    <div className="h-full w-full flex-col justify-center">
      <h1 className="text-4xl font-bold text-[#424874] p-[2%]">Welcome to Dashboard</h1>
      <div className="flex h-[80%] space-x-10">
          <div className="flex w-[20%] h-[40%] border-2 border-grey-500 m-[2%] rounded-xl justify-center items-center text-black">Graph</div>
          <div className="flex w-[45%] h-[40%] bg-[#424874] m-[2%] justify-center text-bold text-xl">Suggestion</div>
      </div>
    </div>
  )
}
