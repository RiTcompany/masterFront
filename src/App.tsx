import './App.css'
import {Route, Routes} from "react-router-dom";
import {Navbar} from "./components/Navbar/Navbar.tsx";
import {Main} from "./pages/Main/Main.tsx";
import {Registration} from "./pages/Registration/Registration.tsx";
import {Profile} from "./pages/Profile/Profile.tsx";
import {useEffect, useState} from "react";

function parseJwt(token: string) {
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
    const [user, setUser] = useState(null);

    // useEffect(() => {
    //     console.log(user)
    // }, []);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const data = parseJwt(token)
            console.log(data)

            const fetchData = async (url: string) => {
                try {
                    const response = await fetch(url, { method: 'GET', credentials: 'include' });
                    if (!response.ok) {
                        console.log(response.statusText);
                        return null;
                    }
                    return await response.json();
                } catch (error) {
                    console.error('Error fetching data:', error);
                    return null;
                }
            };

            const getUserData = async () => {
                let userData = null;
                if (data.role === "ROLE_MASTER") {
                    userData = await fetchData(`http://195.133.197.53:8081/masters/info/${data.entity_id}`);
                } else if (data.role === "ROLE_CLIENT") {
                    userData = await fetchData(`http://195.133.197.53:8081/clients/6`);
                }
                if (userData) {
                    console.log(userData)
                    setUser(userData);
                }
            };

            getUserData();
        }
    }, []);

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path={'/'} element={<Main/>}/>
        <Route path={'/registration'} element={<Registration/>}/>
        <Route path="/profile/:id" element={<Profile user={user}/>} />
      </Routes>
    </>
  )
}

export default App
