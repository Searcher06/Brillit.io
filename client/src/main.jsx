import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Chatbot } from "./Components/Chatbot.jsx";
import Videoplay from "./Components/Videoplay.jsx";
import { ContextProvider } from "./Context/SearchContext.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CallContextProvider } from "./Context/CallContext.jsx";
import { ActiveContextProvider } from "./Context/ActiveContext.jsx";
import { FilterProvider } from "./Context/FilterContext.jsx";
import { SearchVideoProvider } from "./Context/searchVideosContext.jsx";
import SignUp from "./Components/signup.jsx";
import Login from "./Components/Login.jsx";
import { Toaster } from "sonner";
import History from "./Components/History.jsx";
import UpdateProfile from "./Components/UpdateProfile.jsx";
import { PrivateRoute } from "./routes/PrivateRoute.jsx";
import PersonalizationPage from "./Components/InfoBox.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { ProtectPersonalization } from "./routes/ProtectPersonalization.jsx";
import { CurrentVideoProvider } from "./Context/currentVideoContext.jsx";
import { ProtectWatchVideoPage } from "./routes/ProtectWatchVideoPage.jsx";
import { TabVideosContextProvider } from "./Context/TabVideosContext.jsx";
import { TabContextProvider } from "./Context/TabContext.jsx";
import { LoadingContextProvider } from "./Context/LoadingContext.jsx";
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import { SidebarProvider } from "./Context/SidebarContext.jsx";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
        <SidebarProvider>
          <CurrentVideoProvider>
            <FilterProvider>
              <SearchVideoProvider>
                <ContextProvider>
                  <CallContextProvider>
                    <ActiveContextProvider>
                      <TabVideosContextProvider>
                        <TabContextProvider>
                          <LoadingContextProvider>
                            <Routes>
                              <Route
                                path="/"
                                element={
                                  <PrivateRoute>
                                    <App />
                                  </PrivateRoute>
                                }
                              />
                              <Route
                                path="/synthai"
                                element={
                                  <PrivateRoute>
                                    <Chatbot />
                                  </PrivateRoute>
                                }
                              />
                              <Route
                                path="/videos/:id"
                                element={
                                  <PrivateRoute>
                                    <ProtectWatchVideoPage>
                                      <Videoplay />
                                    </ProtectWatchVideoPage>
                                  </PrivateRoute>
                                }
                              />
                              <Route
                                path="/history"
                                element={
                                  <PrivateRoute>
                                    <History />
                                  </PrivateRoute>
                                }
                              />
                              <Route
                                path="/update-profile"
                                element={
                                  <PrivateRoute>
                                    <UpdateProfile />
                                  </PrivateRoute>
                                }
                              />
                              <Route path="/signUp" element={<SignUp />} />
                              <Route path="/login" element={<Login />} />
                              <Route
                                path="/personalization"
                                element={
                                  <ProtectPersonalization>
                                    <PersonalizationPage />
                                  </ProtectPersonalization>
                                }
                              />
                              <Route
                                path="*"
                                element={
                                  <div
                                    className="min-h-screen flex flex-col items-center justify-center text-center px-4"
                                    style={{ backgroundColor: "var(--bg-primary)" }}
                                  >
                                    <div
                                      className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 opacity-10 pointer-events-none"
                                      style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }}
                                    />
                                    <p className="text-8xl font-bold gradient-text mb-4">404</p>
                                    <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                                      Page not found
                                    </h1>
                                    <p className="mb-8 max-w-xs" style={{ color: "var(--text-muted)" }}>
                                      The page you&apos;re looking for doesn&apos;t exist or has been moved.
                                    </p>
                                    <a
                                      href="/"
                                      className="btn-gradient h-11 px-8 rounded-xl text-sm font-semibold inline-flex items-center"
                                    >
                                      Go Home
                                    </a>
                                  </div>
                                }
                              />
                            </Routes>
                            <Toaster
                              position="top-right"
                              richColors
                              duration={3000}
                            />
                          </LoadingContextProvider>
                        </TabContextProvider>
                      </TabVideosContextProvider>
                    </ActiveContextProvider>
                  </CallContextProvider>
                </ContextProvider>
              </SearchVideoProvider>
            </FilterProvider>
          </CurrentVideoProvider>
        </SidebarProvider>
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
);
