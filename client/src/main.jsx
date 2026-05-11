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
import { ToastContainer } from "react-toastify";
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
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
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
                              <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50 text-center px-4">
                                <h1 className="text-6xl font-bold text-blue-600">404</h1>
                                <p className="text-xl text-gray-700 mt-4">Page not found</p>
                                <p className="text-gray-500 mt-2">The page you are looking for does not exist.</p>
                                <a href="/" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                  Go Home
                                </a>
                              </div>
                            }
                          />
                        </Routes>
                        <ToastContainer
                          position="top-right"
                          autoClose={3000}
                          hideProgressBar={false}
                          closeOnClick
                          pauseOnHover
                          theme="light"
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
    </AuthProvider>
  </BrowserRouter>
);
