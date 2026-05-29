/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const handler = (e) => {
      setIsMobile(e.matches);
      if (!e.matches) setMobileDrawerOpen(false); // close drawer when going to desktop
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggleSidebar = () => setSidebarExpanded((p) => !p);
  const toggleMobileDrawer = () => setMobileDrawerOpen((p) => !p);
  const closeMobileDrawer = () => setMobileDrawerOpen(false);

  return (
    <SidebarContext.Provider value={{
      sidebarExpanded, toggleSidebar,
      isMobile,
      mobileDrawerOpen, toggleMobileDrawer, closeMobileDrawer,
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside <SidebarProvider>");
  return ctx;
};
