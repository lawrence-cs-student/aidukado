


export default function SearchForm({query, setQuery, inputPlaceholder}) {
    return (
        <form className="w-2/5 h-full">
            <label htmlFor="searchbar" className="mb-2 text-sm font-medium text-gray-900 sr-only">
                Search
            </label>
            <div className="relative h-full">
                    
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                    className="w-4 h-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                >
                <path
                    stroke="currentColor"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
                </svg>
                </div>

                <input
                    name="searchbar"
                    type="search"
                    className="block w-full h-full pl-10 text-md text-gray-900 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-md"
                    placeholder={inputPlaceholder}
                    required
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
        </form>        
    )
}