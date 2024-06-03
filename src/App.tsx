import './App.css'
import {Route, Routes} from "react-router-dom";
import {Navbar} from "./components/Navbar/Navbar.tsx";
import {Main} from "./pages/Main/Main.tsx";

function App() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path={'/'} element={<Main/>}/>
      </Routes>
    </>
  )
}

export default App
