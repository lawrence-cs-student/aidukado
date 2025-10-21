import Term from "../components/Term"


export default function TermPage() {
    const terms = [1, 2, 3];

    return (
        <div className="w-full h-full flex justify-center items-center gap-[5%]">
            {terms.map((term, index) => (
                <Term key={index} term={term}/>
            ))}
        </div>
    )
}