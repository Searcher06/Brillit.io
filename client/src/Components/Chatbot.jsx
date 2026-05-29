import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCog, faPlus, faSearch, faRedo } from "@fortawesome/free-solid-svg-icons"
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons/faEllipsisH"
import { faCopy, faPaperPlane, faPlayCircle } from "@fortawesome/free-regular-svg-icons"
import { useState } from "react"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"
import { useSidebar } from "../Context/SidebarContext"

let chats = [
    "Vite config error fixing error react",
    "Explain the big bang theory",
    "Vite config error fixing error react",
    "what is the best way to learn javascript",
    "Regex basics in javascript 2025",
    "Vite config error fixing error react",
    "what is the best way to learn javascript",
    "Vite config error fixing error react",
    "How can I improve my time management",
]
chats = chats.concat(chats.slice(0, chats.length))

const conversation = [
    { type: "prompt",   content: "Hi my name is Ahmad Ibrahim" },
    { type: "response", content: "Nice to meet you Ahmad!, how can I help ?" },
    { type: "prompt",   content: "Who are you ?" },
    { type: "response", content: "Am a large language model trained on large sets of data" },
    { type: "prompt",   content: "Generate a random lorem test" },
    { type: "response", content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit maiores explicabo vel adipisci, fugiat a veniam animi debitis rem deleniti itaque ea quia maxime facilis iure! Ullam facilis quasi modi?" },
    { type: "prompt",   content: "Generate again" },
    { type: "response", content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit maiores explicabo vel adipisci, fugiat a veniam animi debitis rem deleniti itaque ea quia maxime facilis iure! Ullam facilis quasi modi?" },
]

export function Chatbot() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { sidebarExpanded, isMobile } = useSidebar()
    const sidebarWidth = isMobile ? 0 : (sidebarExpanded ? 200 : 64)

    return (
        <div className="min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
            <Navbar />
            <Sidebar />

            <main
                className="mt-16 mb-0 flex h-[calc(100vh-64px)] main-content"
                style={{ marginLeft: `${sidebarWidth}px`, transition: "margin-left 250ms cubic-bezier(0.4,0,0.2,1)" }}
            >
                {/* ── Chat history sidebar (hidden on mobile unless toggled) ── */}
                <aside
                    className={`
                        flex-shrink-0 flex flex-col border-r
                        fixed sm:relative inset-y-0 left-0 z-40
                        w-64 sm:w-56 md:w-64
                        transition-transform duration-250
                        ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
                    `}
                    style={{
                        top: "64px",
                        height: "calc(100vh - 64px)",
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--border-subtle)",
                    }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-4 h-14 flex-shrink-0"
                        style={{ borderBottom: "1px solid var(--border-subtle)" }}
                    >
                        <span className="text-base font-bold gradient-text">SynthAI</span>
                        <button style={{ color: "var(--text-muted)" }}>
                            <FontAwesomeIcon icon={faEllipsisH} />
                        </button>
                    </div>

                    {/* Profile */}
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">A</div>
                            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Ahmad Ibrahim</span>
                        </div>
                        <button style={{ color: "var(--text-muted)" }}>
                            <FontAwesomeIcon icon={faCog} />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="px-3 mb-3">
                        <div
                            className="flex items-center gap-2 h-9 rounded-xl px-3"
                            style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}
                        >
                            <FontAwesomeIcon icon={faSearch} style={{ color: "var(--text-faint)", fontSize: 12 }} />
                            <input
                                type="search"
                                className="flex-1 bg-transparent outline-none text-sm"
                                placeholder="Search chats"
                                style={{ color: "var(--text-primary)" }}
                            />
                        </div>
                    </div>

                    {/* Chat history */}
                    <div className="flex-1 overflow-y-auto px-3 scrollbar-hide">
                        <p className="text-[11px] font-semibold tracking-wider mb-2 px-1" style={{ color: "var(--text-faint)" }}>
                            CHAT HISTORY
                        </p>
                        {chats.map((chat, index) => (
                            <button
                                key={index}
                                className="w-full text-left text-sm px-2 py-1.5 rounded-lg mb-0.5 truncate transition-colors"
                                style={{ color: "var(--text-muted)" }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)" }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
                            >
                                {chat.slice(0, 28)}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Overlay for mobile sidebar */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 sm:hidden"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* ── Main chat area ── */}
                <div className="flex-1 flex flex-col min-w-0 relative">
                    {/* Chat topbar */}
                    <div
                        className="flex items-center justify-between px-4 h-14 flex-shrink-0"
                        style={{ borderBottom: "1px solid var(--border-subtle)" }}
                    >
                        {/* Mobile: hamburger to open chat history */}
                        <button
                            className="sm:hidden p-2 rounded-lg mr-2"
                            style={{ color: "var(--text-muted)" }}
                            onClick={() => setSidebarOpen(true)}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                            </svg>
                        </button>

                        <select
                            className="text-sm rounded-lg px-2 py-1 outline-none"
                            style={{
                                backgroundColor: "var(--bg-tertiary)",
                                border: "1px solid var(--border-color)",
                                color: "var(--text-primary)",
                            }}
                        >
                            <option>Gemini 4.0</option>
                            <option>Gemini 2.5 flash</option>
                            <option>Gemini 1.5 flash</option>
                        </select>

                        <button className="btn-gradient h-9 px-4 rounded-xl text-sm font-medium flex items-center gap-1.5">
                            <FontAwesomeIcon icon={faPlus} />
                            <span className="hidden xs:inline">New chat</span>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 scrollbar-hide">
                        <div className="max-w-2xl mx-auto flex flex-col gap-4">
                            {conversation.map((element, index) => {
                                const isLast = index === conversation.length - 1
                                if (element.type === "prompt") {
                                    return (
                                        <div key={index} className="flex justify-end">
                                            <div
                                                className="max-w-[80%] sm:max-w-[60%] px-4 py-3 rounded-b-2xl rounded-tl-2xl text-sm leading-relaxed"
                                                style={{ backgroundColor: "rgba(124,58,237,0.15)", color: "var(--text-primary)", border: "1px solid rgba(124,58,237,0.2)" }}
                                            >
                                                {element.content}
                                            </div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div key={index} className={`flex flex-col gap-1 ${isLast ? "pb-4" : ""}`}>
                                            <div className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                                                {element.content}
                                            </div>
                                            <div className="flex gap-3 mt-1">
                                                {[faCopy, faPlayCircle, faRedo].map((icon, i) => (
                                                    <button key={i} className="transition-colors" style={{ color: "var(--text-faint)" }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-muted)" }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-faint)" }}
                                                    >
                                                        <FontAwesomeIcon icon={icon} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>

                    {/* Input bar */}
                    <div className="flex-shrink-0 px-3 sm:px-6 pb-4 pt-2">
                        <div
                            className="max-w-2xl mx-auto rounded-2xl overflow-hidden"
                            style={{
                                backgroundColor: "var(--bg-secondary)",
                                border: "1px solid var(--border-color)",
                            }}
                        >
                            <input
                                type="text"
                                className="w-full h-12 px-4 bg-transparent outline-none text-sm"
                                placeholder="Ask anything..."
                                style={{ color: "var(--text-primary)" }}
                            />
                            <div
                                className="flex items-center justify-between px-4 pb-3"
                                style={{ borderTop: "1px solid var(--border-subtle)" }}
                            >
                                <button className="p-1.5 rounded-lg transition-colors" style={{ color: "var(--text-muted)" }}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                                <button className="btn-gradient w-8 h-8 rounded-xl">
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}