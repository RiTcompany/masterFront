import './App.css'
import {HashRouter, Route, Routes} from "react-router-dom";
import {Navbar} from "./components/Navbar/Navbar.tsx";
import {Main} from "./pages/Main/Main.tsx";
import {Registration} from "./pages/Registration/Registration.tsx";
import {Profile} from "./pages/Profile/Profile.tsx";
import {useEffect, useState} from "react";
import {NewOrder} from "./pages/NewOrder/NewOrder.tsx";
import {TaskPage} from "./pages/TaskPage/TaskPage.tsx";

export function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}

function App() {
    const [authUserId, setAuthUserId] = useState<number>(-1)
    // const [authUserRole, setAuthUserRole] = useState<string>()

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const data = parseJwt(token)
            console.log(data)
            setAuthUserId(data.id)
            // setAuthUserRole(data.role)
        }
    }, []);

  return (
    <>
      <Navbar/>
        <HashRouter basename="/">
            <Routes>
                <Route path={'/'} element={<Main />}/>
                <Route path={'/registration'} element={<Registration/>}/>
                <Route path="/profile/:id" element={<Profile authUserId={authUserId}/>} />
                <Route path="/create-order" element={<NewOrder />} />
                <Route path="/task/:id" element={<TaskPage />} />
            </Routes>
        </HashRouter>
    </>
  )
}

export default App
