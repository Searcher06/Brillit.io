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
import { AuthProvider } from "./Context/authContext.jsx";
import { ProtectPersonalization } from "./routes/ProtectPersonalization.jsx";
import { CurrentVideoProvider } from "./Context/currentVideoContext.jsx";
import { ProtectWatchVideoPage } from "./routes/ProtectWatchVideoPage.jsx";
import { Responsive } from "./Components/Responsive.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CurrentVideoProvider>
        <FilterProvider>
          <SearchVideoProvider>
            <ContextProvider>
              <CallContextProvider>
                <ActiveContextProvider>
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
                    <Route path="/responsive" element={<Responsive />} />
                    <Route path="*" element={<h1>Where you dey go 😭</h1>} />
                  </Routes>
                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    closeOnClick
                    pauseOnHover
                    theme="light"
                  />
                </ActiveContextProvider>
              </CallContextProvider>
            </ContextProvider>
          </SearchVideoProvider>
        </FilterProvider>
      </CurrentVideoProvider>
    </AuthProvider>
  </BrowserRouter>
);
