import { createContext, useState } from "react";

export const SearchContext = createContext()

export function ContextProvider({ children }) {
    const [search, setSearch] = useState("")
    function SearchHandler(event) {
        setSearch(event)
    }
    return <SearchContext.Provider value={{ search, SearchHandler }}>
        {children}
    </SearchContext.Provider>
}