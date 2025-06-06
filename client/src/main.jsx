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
createRoot(document.getElementById('root')).render(

  <FilterProvider>
    <SearchVideoProvider>
      <ContextProvider>
        <CallContextProvider>
          <ActiveContextProvider>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<App />}></Route>
                <Route path='/synthai' element={<Chatbot />}></Route>
                <Route path='/videos/:id' element={<Videoplay />}></Route>
                <Route path='*' element={<h1>where you dey go </h1>}></Route>
              </Routes>
            </BrowserRouter>
          </ActiveContextProvider>
        </CallContextProvider>
      </ContextProvider>
    </SearchVideoProvider>
  </FilterProvider>

)
