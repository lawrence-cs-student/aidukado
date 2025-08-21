

export default function SubjectCard({onClick}) {
    return (
        <div className="w-[20%] h-[35%] border-solid border-2 rounded-xl" onClick={onClick}>
            <div className="w-full h-[35%] bg-[#102E50] rounded-xl p-2">
                <h2 className="font-bold">Programming Language</h2>
                <h2>IV-CS1</h2>
                <h2>Leandro Ercia</h2>
            </div>
        </div>
    )
}