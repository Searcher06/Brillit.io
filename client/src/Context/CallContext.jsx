import { createContext, useState } from "react";

export const CallContext = createContext()

export function CallContextProvider({ children }) {
    const [called, setIscalled] = useState(false)

    return <CallContext.Provider value={{ called, setIscalled }}>
        {children}
    </CallContext.Provider>
}
