import { createRoot } from 'react-dom/client'
import App from './App.jsx';
import { Chatbot } from './Components/Chatbot.jsx';
import Videoplay from './Components/Videoplay.jsx'
import { ContextProvider } from './Context/SearchContext.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CallContextProvider } from './Context/CallContext.jsx'
import { ActiveContextProvider } from './Context/ActiveContext.jsx'
import { FilterProvider } from './Context/FilterContext.jsx';
import { SearchVideoProvider } from './Context/searchVideosContext.jsx';
import SignUp from './Components/signup.jsx';
import Login from './Components/Login.jsx';
import { ToastContainer } from 'react-toastify';
import UpdateProfile from './Components/UpdateProfile.jsx';
import { AuthProvider } from './Context/authContext.jsx';
import { PrivateRoute } from './routes/PrivateRoute.jsx';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <FilterProvider>
      <SearchVideoProvider>
        <ContextProvider>
          <CallContextProvider>
            <ActiveContextProvider>
              <BrowserRouter>
                <Routes>
                  <Route path='/' element={
                    <PrivateRoute>
                      <App />
                    </PrivateRoute>
                  }></Route>
                  <Route path='/synthai' element={
                    <PrivateRoute>
                      <Chatbot />
                    </PrivateRoute>
                  }>
                  </Route>
                  <Route path='/videos/:id' element={
                    <PrivateRoute>
                      <Videoplay />
                    </PrivateRoute>
                  }>
                  </Route>
                  <Route path='/update-profile' element={
                    <PrivateRoute>
                      <UpdateProfile />
                    </PrivateRoute>
                  }>
                  </Route>
                  <Route path='/signUp' element={<SignUp />}></Route>
                  <Route path='/login' element={<Login />}></Route>
                  <Route path='*' element={<h1>where you dey go </h1>}></Route>
                </Routes>
                <ToastContainer
                  position='top-right'
                  autoClose={3000}
                  hideProgressBar={false}
                  closeOnClick
                  pauseOnHover
                  theme='light'
                />
              </BrowserRouter>
            </ActiveContextProvider>
          </CallContextProvider>
        </ContextProvider>
      </SearchVideoProvider>
    </FilterProvider>
  </AuthProvider>
)
