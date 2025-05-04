import { createContext, useState } from "react";

export const FilterContext = createContext()

export const FilterProvider = ({ children }) => {
    const [displayfilter, setDisplayfilter] = useState(false)
    return <FilterContext.Provider value={{ displayfilter, setDisplayfilter }}>
        {children}
    </FilterContext.Provider>
}