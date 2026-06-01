import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCog, faPlus, faSearch, faRedo } from "@fortawesome/free-solid-svg-icons"
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons/faEllipsisH"
import { faCopy, faPaperPlane, faPlayCircle } from "@fortawesome/free-regular-svg-icons"
import { useState, useRef, useEffect } from "react"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"
import { useSidebar } from "../Context/SidebarContext"
import { useAuth } from "../Context/AuthContext"
import { Sparkles } from "lucide-react"

let chats = [
    "Vite config error fixing error react",
    "Explain the big bang theory",
    "what is the best way to learn javascript",
    "Regex basics in javascript 2025",
    "How can I improve my time management",
    "What is quantum computing",
    "Explain neural networks simply",
    "Best resources for learning Python",
]

const conversation = [
    { type: "prompt",   content: "Hi my name is Ahmad Ibrahim" },
    { type: "response", content: "Nice to meet you Ahmad! I'm SynthAI, your personal learning assistant on Brillit. How can I help you today?" },
    { type: "prompt",   content: "Explain the big bang theory" },
    { type: "response", content: "The Big Bang Theory describes the origin of the universe approximately 13.8 billion years ago. It proposes that the universe began from an extremely hot, dense singularity and has been expanding ever since.\n\nKey points:\n• All matter, energy, space, and time originated from this single event\n• The universe continues to expand and cool\n• Evidence includes cosmic microwave background radiation and the redshift of distant galaxies" },
]

function TypingIndicator() {
    return (
        <div className="flex items-end gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                <Sparkles size={14} className="text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
                <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400"
                            style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export function Chatbot() {
    const [chatSidebarOpen, setChatSidebarOpen] = useState(false)
    const [input, setInput] = useState("")
    const messagesEndRef = useRef(null)
    const { sidebarExpanded, isMobile } = useSidebar()
    const { user } = useAuth()
    const sidebarWidth = isMobile ? 0 : (sidebarExpanded ? 200 : 64)

    const initials = user
        ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
        : "?"

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [conversation])

    return (
        <div className="h-screen w-full overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
            <Navbar />
            <Sidebar />

            <main
                className="mt-16 flex main-content"
                style={{
                    marginLeft: `${sidebarWidth}px`,
                    height: "calc(100vh - 64px)",
                    transition: "margin-left 250ms cubic-bezier(0.4,0,0.2,1)"
                }}
            >
                {/* ── Chat sessions sidebar ── */}
                {/* Backdrop on mobile */}
                {chatSidebarOpen && (
                    <div className="fixed inset-0 z-30 sm:hidden bg-black/50"
                        onClick={() => setChatSidebarOpen(false)} />
                )}

                <aside
                    className={`
                        flex-shrink-0 flex flex-col
                        fixed sm:relative z-40 sm:z-auto
                        h-full sm:h-auto
                        transition-transform duration-300
                        ${chatSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
                    `}
                    style={{
                        width: 240,
                        top: isMobile ? 64 : 0,
                        backgroundColor: "var(--bg-secondary)",
                        borderRight: "1px solid var(--border-subtle)",
                    }}
                >
                    {/* Sidebar header */}
                    <div className="flex items-center justify-between px-4 h-14 flex-shrink-0"
                        style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                                <Sparkles size={12} className="text-white" />
                            </div>
                            <span className="text-sm font-bold gradient-text">SynthAI</span>
                        </div>
                        <button style={{ color: "var(--text-faint)" }}>
                            <FontAwesomeIcon icon={faEllipsisH} size="sm" />
                        </button>
                    </div>

                    {/* New chat button */}
                    <div className="px-3 pt-3 pb-2">
                        <button className="btn-gradient w-full h-9 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                            <FontAwesomeIcon icon={faPlus} size="sm" />
                            New chat
                        </button>
                    </div>

                    {/* Search */}
                    <div className="px-3 pb-3">
                        <div className="flex items-center gap-2 h-8 rounded-lg px-3"
                            style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}>
                            <FontAwesomeIcon icon={faSearch} style={{ color: "var(--text-faint)", fontSize: 11 }} />
                            <input type="search" className="flex-1 bg-transparent outline-none text-xs"
                                placeholder="Search chats" style={{ color: "var(--text-primary)" }} />
                        </div>
                    </div>

                    {/* Chat list */}
                    <div className="flex-1 overflow-y-auto px-2 scrollbar-hide">
                        <p className="text-[10px] font-semibold tracking-widest px-2 mb-1.5"
                            style={{ color: "var(--text-faint)" }}>RECENT</p>
                        {chats.map((chat, index) => (
                            <button key={index}
                                className="w-full text-left text-xs px-3 py-2 rounded-lg mb-0.5 truncate transition-colors"
                                style={{ color: "var(--text-muted)" }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)" }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
                            >
                                {chat}
                            </button>
                        ))}
                    </div>

                    {/* User info at bottom */}
                    <div className="px-3 py-3 flex-shrink-0"
                        style={{ borderTop: "1px solid var(--border-subtle)" }}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff" }}>
                                    {initials}
                                </div>
                                <span className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                                    {user?.firstName} {user?.lastName}
                                </span>
                            </div>
                            <button style={{ color: "var(--text-faint)" }}>
                                <FontAwesomeIcon icon={faCog} size="sm" />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* ── Main chat area ── */}
                <div className="flex-1 flex flex-col min-w-0 h-full">

                    {/* Topbar */}
                    <div className="flex items-center justify-between px-4 h-14 flex-shrink-0"
                        style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <div className="flex items-center gap-3">
                            {/* Mobile: open chat sidebar */}
                            <button className="sm:hidden p-1.5 rounded-lg"
                                style={{ color: "var(--text-muted)" }}
                                onClick={() => setChatSidebarOpen(true)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="3" y1="6" x2="21" y2="6"/>
                                    <line x1="3" y1="12" x2="15" y2="12"/>
                                    <line x1="3" y1="18" x2="10" y2="18"/>
                                </svg>
                            </button>

                            {/* Model selector */}
                            <div className="relative">
                                <select className="text-xs font-medium rounded-lg pl-3 pr-7 py-1.5 outline-none appearance-none cursor-pointer"
                                    style={{
                                        backgroundColor: "var(--bg-tertiary)",
                                        border: "1px solid var(--border-color)",
                                        color: "var(--text-primary)",
                                    }}>
                                    <option>Gemini 2.5 Flash</option>
                                    <option>Gemini 2.0 Flash</option>
                                    <option>Gemini 1.5 Flash</option>
                                </select>
                                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                                    width="10" height="10" viewBox="0 0 24 24" fill="none"
                                    stroke="var(--text-faint)" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9"/>
                                </svg>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 rounded-full"
                                style={{ backgroundColor: "rgba(139,92,246,0.1)", color: "var(--violet-light)", border: "1px solid rgba(139,92,246,0.2)" }}>
                                Educational AI
                            </span>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-8 scrollbar-hide">
                        <div className="max-w-2xl mx-auto flex flex-col gap-6">
                            {conversation.map((element, index) => {
                                if (element.type === "prompt") {
                                    return (
                                        <div key={index} className="flex justify-end gap-3 items-end">
                                            <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed"
                                                style={{
                                                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                                                    color: "#fff",
                                                }}>
                                                {element.content}
                                            </div>
                                            {/* User avatar */}
                                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                                                style={{ background: "linear-gradient(135deg, #7c3aed44, #4f46e544)", color: "var(--violet-light)", border: "1px solid rgba(139,92,246,0.3)" }}>
                                                {initials}
                                            </div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div key={index} className="flex items-end gap-3">
                                            {/* AI avatar */}
                                            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                                                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                                                <Sparkles size={14} className="text-white" />
                                            </div>
                                            <div className="flex flex-col gap-2 max-w-[80%]">
                                                <div className="px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed whitespace-pre-wrap"
                                                    style={{
                                                        backgroundColor: "var(--bg-secondary)",
                                                        border: "1px solid var(--border-color)",
                                                        color: "var(--text-primary)",
                                                    }}>
                                                    {element.content}
                                                </div>
                                                {/* Action buttons */}
                                                <div className="flex gap-2 px-1">
                                                    {[
                                                        { icon: faCopy, label: "Copy" },
                                                        { icon: faPlayCircle, label: "Read" },
                                                        { icon: faRedo, label: "Retry" },
                                                    ].map(({ icon, label }) => (
                                                        <button key={label}
                                                            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all"
                                                            style={{ color: "var(--text-faint)" }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"
                                                                e.currentTarget.style.color = "var(--text-muted)"
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = "transparent"
                                                                e.currentTarget.style.color = "var(--text-faint)"
                                                            }}>
                                                            <FontAwesomeIcon icon={icon} size="xs" />
                                                            <span>{label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input area */}
                    <div className="flex-shrink-0 px-4 sm:px-8 pb-5 pt-2">
                        <div className="max-w-2xl mx-auto">
                            <div className="relative rounded-2xl overflow-hidden"
                                style={{
                                    backgroundColor: "var(--bg-secondary)",
                                    border: "1px solid var(--border-color)",
                                    boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
                                }}>
                                <textarea
                                    rows={1}
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value)
                                        e.target.style.height = "auto"
                                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault()
                                            // submit handler goes here
                                        }
                                    }}
                                    placeholder="Ask SynthAI anything..."
                                    className="w-full bg-transparent outline-none text-sm resize-none px-4 pt-3.5 pb-2 scrollbar-hide"
                                    style={{
                                        color: "var(--text-primary)",
                                        minHeight: 48,
                                        maxHeight: 120,
                                    }}
                                />
                                <div className="flex items-center justify-between px-3 pb-3">
                                    <div className="flex items-center gap-1">
                                        <button className="p-1.5 rounded-lg transition-all text-xs flex items-center gap-1.5"
                                            style={{ color: "var(--text-faint)" }}
                                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-muted)" }}
                                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-faint)" }}>
                                            <FontAwesomeIcon icon={faPlus} size="xs" />
                                            <span>Attach</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs" style={{ color: "var(--text-faint)" }}>
                                            {input.length > 0 ? `${input.length} chars` : "Enter to send"}
                                        </span>
                                        <button
                                            disabled={!input.trim()}
                                            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                                            style={{
                                                background: input.trim()
                                                    ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                                                    : "var(--bg-tertiary)",
                                                color: input.trim() ? "#fff" : "var(--text-faint)",
                                            }}>
                                            <FontAwesomeIcon icon={faPaperPlane} size="xs" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p className="text-center text-xs mt-2" style={{ color: "var(--text-faint)" }}>
                                SynthAI can make mistakes. Verify important information.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                @keyframes bounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-6px); }
                }
            `}</style>
        </div>
    )
}
