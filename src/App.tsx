import './App.css'
import {Route, Routes, Navigate, useLocation} from "react-router-dom";
import {Navbar} from "./components/Navbar/Navbar.tsx";
import {Main} from "./pages/Main/Main.tsx";
import {Registration} from "./pages/Registration/Registration.tsx";
import {Profile} from "./pages/Profile/Profile.tsx";
import {useEffect, useState} from "react";
import {NewOrder} from "./pages/NewOrder/NewOrder.tsx";
import {TaskPage} from "./pages/TaskPage/TaskPage.tsx";
import {Footer} from "./components/Footer/Footer.tsx";
import {CookieConsent} from "./components/CookieConsent/CookieConsent.tsx";
import LayoutAdmin from "./components/admin/layout/layout-admin.tsx";
import AdminClient from "./components/admin/client/adminClient.tsx";
import MastersComponent from "./components/admin/masters/mastersComponent.tsx";

export function parseJwt(token: string) {
    console.log(token)
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        // const jsonPayload = atob(base64);
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

    const location = useLocation()
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
    const hideNavbar = location.pathname.startsWith('/admin');

  return (
     <>
    {/*//     <Router>*/}
            {!hideNavbar && <Navbar />}

            <Routes>
                <Route path="/admin" element={<LayoutAdmin />}>
                    <Route path="" element={<Navigate to="/admin/clients" />} />
                    <Route path="/admin/clients" element={<AdminClient/>}/>
                    <Route path="/admin/masters" element={<MastersComponent/>}/>
                </Route>

            </Routes>

            <Routes>
                <Route path={'/'} element={<Main />}/>
                <Route path={'/registration'} element={<Registration/>}/>
                <Route path="/profile/:id" element={<Profile authUserId={authUserId}/>} />
                <Route path="/create-order" element={<NewOrder />} />
                <Route path="/task/:id" element={<TaskPage />} />
            </Routes>
            {location.pathname === "/" &&
                <Footer/>
            }
            <CookieConsent />
        {/*</Router>*/}
    </>
  )
}

export default App
