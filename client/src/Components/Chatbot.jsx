import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCog, faPlus, faSearch, faRedo } from "@fortawesome/free-solid-svg-icons"
import { faCopy, faPaperPlane } from "@fortawesome/free-regular-svg-icons"
import { useState, useRef, useEffect } from "react"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"
import { useSidebar } from "../Context/SidebarContext"
import { useAuth } from "../Context/AuthContext"
import {
  Sparkles, PanelLeftClose, PanelLeftOpen,
  MessageSquare, Archive, Library,
  FolderPlus, BookOpen, Video, Brain,
  Paperclip, Settings, LayoutGrid, Mic,
  Crown, Search, History,
} from "lucide-react"

const recentChats = [
  "How does Brillit personalize my feed?",
  "Best videos for learning React",
  "Explain gradient descent simply",
  "Recommend calculus resources",
  "What is machine learning?",
  "How to study effectively",
]

const quickActions = [
  { label: "Find Videos", icon: Search },
  { label: "Brainstorm",  icon: Brain },
  { label: "Study Plan",  icon: BookOpen },
]

const featureCards = [
  { icon: Video,    action: "Find Videos", title: "Video Recommender", desc: "Get curated educational videos tailored to your learning goals and interests." },
  { icon: Brain,    action: "Brainstorm",  title: "Concept Explorer",  desc: "Break down complex topics into clear, digestible explanations instantly." },
  { icon: BookOpen, action: "Study Plan",  title: "Study Planner",     desc: "Build a structured learning roadmap for any subject you want to master." },
]

export function Chatbot() {
  const [chatSidebarCollapsed, setChatSidebarCollapsed] = useState(false)
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const { sidebarExpanded, isMobile } = useSidebar()
  const { user } = useAuth()
  const sidebarWidth = isMobile ? 0 : (sidebarExpanded ? 200 : 64)
  const initials = user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() : "?"
  const isEmpty = messages.length === 0

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { type: "prompt", content: input.trim() }])
    setInput("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
  }

  const handleSuggestion = (text) => { setInput(text); textareaRef.current?.focus() }

  return (
    <div className="h-screen w-full overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Navbar />
      <Sidebar />

      <main className="flex main-content" style={{ marginLeft: `${sidebarWidth}px`, height: "calc(100vh - 64px)", marginTop: 64, transition: "margin-left 250ms cubic-bezier(0.4,0,0.2,1)" }}>

        {/* Mobile backdrop */}
        {chatSidebarOpen && <div className="fixed inset-0 z-30 sm:hidden bg-black/50" onClick={() => setChatSidebarOpen(false)} />}

        {/* ══ CHAT SIDEBAR ══ */}
        <aside
          className={`flex-shrink-0 flex flex-col fixed sm:relative z-40 sm:z-auto transition-all duration-300 ${chatSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
          style={{ width: chatSidebarCollapsed ? 0 : 220, minWidth: chatSidebarCollapsed ? 0 : 220, overflow: "hidden", height: "100%", top: isMobile ? 64 : 0, backgroundColor: "var(--bg-secondary)", borderRight: "1px solid var(--border-subtle)" }}
        >
          <div className="flex flex-col h-full" style={{ width: 220, minWidth: 220 }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 h-14 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                  <Sparkles size={12} className="text-white" />
                </div>
                <span className="text-sm font-bold gradient-text">SynthAI</span>
              </div>
              <button onClick={() => setChatSidebarCollapsed(true)} className="p-1.5 rounded-lg transition-colors" style={{ color: "var(--text-faint)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.backgroundColor = "var(--bg-tertiary)" }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-faint)"; e.currentTarget.style.backgroundColor = "transparent" }}>
                <PanelLeftClose size={15} />
              </button>
            </div>

            {/* New Chat */}
            <div className="px-3 pb-3">
              <button onClick={() => { setMessages([]); setChatSidebarOpen(false) }}
                className="w-full h-9 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all"
                style={{ backgroundColor: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", color: "var(--violet-light)" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(139,92,246,0.18)" }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(139,92,246,0.1)" }}>
                <FontAwesomeIcon icon={faPlus} size="xs" /> New Chat
              </button>
            </div>

            {/* Search */}
            <div className="px-3 pb-4">
              <div className="flex items-center gap-2 h-8 rounded-lg px-3" style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border-color)" }}>
                <FontAwesomeIcon icon={faSearch} style={{ color: "var(--text-faint)", fontSize: 10 }} />
                <input type="search" className="flex-1 bg-transparent outline-none text-xs" placeholder="Search chats" style={{ color: "var(--text-primary)" }} />
              </div>
            </div>

            {/* Features */}
            <div className="px-3 mb-3">
              <p className="text-[10px] font-semibold tracking-widest px-1 mb-2" style={{ color: "var(--text-faint)" }}>FEATURES</p>
              {[{ icon: MessageSquare, label: "Chat" }, { icon: Archive, label: "Archived" }, { icon: Library, label: "Library" }].map(({ icon: Icon, label }) => (
                <button key={label} className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs transition-colors mb-0.5" style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-primary)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-muted)" }}>
                  <Icon size={13} style={{ color: "var(--text-faint)" }} />{label}
                </button>
              ))}
            </div>

            {/* Workspaces */}
            <div className="px-3 mb-3">
              <p className="text-[10px] font-semibold tracking-widest px-1 mb-2" style={{ color: "var(--text-faint)" }}>WORKSPACES</p>
              {[{ icon: FolderPlus, label: "New Project" }, { icon: Video, label: "Video Search" }, { icon: History, label: "Watch History" }].map(({ icon: Icon, label }) => (
                <button key={label} className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs transition-colors mb-0.5" style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-primary)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-muted)" }}>
                  <Icon size={13} style={{ color: "var(--text-faint)" }} />{label}
                </button>
              ))}
            </div>

            {/* Recent */}
            <div className="flex-1 overflow-y-auto px-3 scrollbar-hide">
              <p className="text-[10px] font-semibold tracking-widest px-1 mb-2" style={{ color: "var(--text-faint)" }}>RECENT</p>
              {recentChats.map((chat, i) => (
                <button key={i} className="w-full text-left text-xs px-2 py-2 rounded-lg mb-0.5 truncate transition-colors" style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-primary)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-muted)" }}>
                  {chat}
                </button>
              ))}
            </div>

            {/* Pro card */}
            <div className="px-3 py-3 flex-shrink-0" style={{ borderTop: "1px solid var(--border-subtle)" }}>
              <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.18)" }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Crown size={13} style={{ color: "var(--violet-light)" }} />
                  <span className="text-xs font-semibold" style={{ color: "var(--violet-light)" }}>Brillit Pro</span>
                </div>
                <p className="text-[11px] mb-2.5" style={{ color: "var(--text-muted)" }}>Unlock unlimited AI chats and advanced video recommendations.</p>
                <button className="btn-gradient w-full h-7 rounded-lg text-xs font-semibold">Upgrade</button>
              </div>
            </div>
          </div>
        </aside>

        {/* ══ MAIN AREA ══ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative" style={{ height: "100%" }}>

          {/* Expand sidebar button — only when collapsed, top-left corner */}
          {(chatSidebarCollapsed || isMobile) && (
            <button
              className="absolute top-3 left-3 z-10 p-1.5 rounded-lg transition-colors sm:flex hidden"
              style={{ color: "var(--text-faint)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.backgroundColor = "var(--bg-tertiary)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-faint)"; e.currentTarget.style.backgroundColor = "transparent" }}
              onClick={() => setChatSidebarCollapsed(false)}
              title="Expand sidebar"
            >
              <PanelLeftOpen size={15} />
            </button>
          )}

          {/* Mobile hamburger */}
          <button className="sm:hidden absolute top-3 left-3 z-10 p-1.5 rounded-lg" style={{ color: "var(--text-muted)" }} onClick={() => setChatSidebarOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="10" y2="18"/></svg>
          </button>

          {/* Messages / Welcome */}
          <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ minHeight: 0 }}>
            {isEmpty ? (
              <div className="min-h-full flex flex-col items-center justify-center px-4 py-12 select-none">
                <div className="relative" style={{ marginBottom: "-2rem" }}>
                  <img
                    src="/synthAI.png"
                    alt="SynthAI"
                    className="w-56 h-56 object-contain"
                    style={{ filter: "drop-shadow(0 0 24px rgba(139,92,246,0.5))" }}
                  />
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-center" style={{ color: "var(--text-primary)" }}>Ready to Learn Something New?</h2>
                <p className="text-sm text-center max-w-sm mb-8" style={{ color: "var(--text-muted)" }}>Ask SynthAI anything — get explanations, video recommendations, and personalized study plans.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl px-2">
                  {featureCards.map(({ icon: Icon, action, title, desc }) => (
                    <button key={title} onClick={() => handleSuggestion(action)} className="text-left p-4 rounded-2xl transition-all"
                      style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.35)"; e.currentTarget.style.backgroundColor = "var(--bg-tertiary)" }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.backgroundColor = "var(--bg-secondary)" }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(139,92,246,0.12)" }}>
                          <Icon size={15} style={{ color: "var(--violet-light)" }} />
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(139,92,246,0.1)", color: "var(--violet-light)", border: "1px solid rgba(139,92,246,0.2)" }}>{action}</span>
                      </div>
                      <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{title}</p>
                      <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-6 px-4 sm:px-8">
                <div className="max-w-2xl mx-auto flex flex-col gap-6">
                  {messages.map((el, i) => el.type === "prompt" ? (
                    <div key={i} className="flex justify-end gap-3 items-end">
                      <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff" }}>{el.content}</div>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: "rgba(139,92,246,0.12)", color: "var(--violet-light)", border: "1px solid rgba(139,92,246,0.2)" }}>{initials}</div>
                    </div>
                  ) : (
                    <div key={i} className="flex items-end gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}><Sparkles size={14} className="text-white" /></div>
                      <div className="flex flex-col gap-2 max-w-[80%]">
                        <div className="px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed whitespace-pre-wrap" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>{el.content}</div>
                        <div className="flex gap-1 px-1">
                          {[{ icon: faCopy, label: "Copy" }, { icon: faRedo, label: "Retry" }].map(({ icon, label }) => (
                            <button key={label} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all" style={{ color: "var(--text-faint)" }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-muted)" }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-faint)" }}>
                              <FontAwesomeIcon icon={icon} size="xs" /><span>{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex-shrink-0 px-4 sm:px-8 pb-5 pt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2 mb-3 flex-wrap">
                {quickActions.map(({ label, icon: Icon }) => (
                  <button key={label} onClick={() => handleSuggestion(label)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                    style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-muted)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.35)"; e.currentTarget.style.color = "var(--violet-light)"; e.currentTarget.style.backgroundColor = "rgba(139,92,246,0.08)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.backgroundColor = "var(--bg-secondary)" }}>
                    <Icon size={11} />{label}
                  </button>
                ))}
              </div>
              <div className="rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}>
                <div className="flex items-start gap-3 px-4 pt-4 pb-2">
                  <Sparkles size={16} style={{ color: "var(--violet-light)", marginTop: 2, flexShrink: 0 }} />
                  <textarea ref={textareaRef} rows={1} value={input}
                    onChange={(e) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px" }}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                    placeholder="Ask Anything..."
                    className="flex-1 bg-transparent outline-none text-sm resize-none scrollbar-hide"
                    style={{ color: "var(--text-primary)", minHeight: 28, maxHeight: 120 }} />
                </div>
                <div className="flex items-center justify-between px-4 pb-3 pt-1" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                  <div className="flex items-center gap-1">
                    {[{ icon: Paperclip, label: "Attach" }, { icon: Settings, label: "Settings" }, { icon: LayoutGrid, label: "Options" }].map(({ icon: Icon, label }) => (
                      <button key={label} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-all" style={{ color: "var(--text-faint)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-muted)" }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-faint)" }}>
                        <Icon size={12} /><span>{label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-full flex items-center justify-center transition-all" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-muted)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--border-color)" }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)" }}>
                      <Mic size={14} />
                    </button>
                    <button onClick={handleSend} disabled={!input.trim()} className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                      style={{ background: input.trim() ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "var(--bg-tertiary)", color: input.trim() ? "#fff" : "var(--text-faint)" }}>
                      <FontAwesomeIcon icon={faPaperPlane} size="xs" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs mt-2" style={{ color: "var(--text-faint)" }}>SynthAI can make mistakes. Verify important information.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
