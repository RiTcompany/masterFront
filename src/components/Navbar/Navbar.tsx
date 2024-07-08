import React, {useEffect, useState} from "react";
import './Navbar.css'
import {OrangeButton} from "../OrangeButton/OrangeButton.tsx";
import {Link} from "react-router-dom";
import {parseJwt} from "../../App.tsx";

interface UserType {
    role: string,
    entity_id: number
}

export function Navbar(): React.JSX.Element {
    const [user, setUser] = useState<UserType>();
    function scrollToBottom() {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }

    function handleLogout() {
        localStorage.removeItem("authToken")
        // setIsLoggedIn(false)
        window.location.replace("/")
    }

    // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem("authToken"));

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        if (authToken !== null) {
            setUser(parseJwt(authToken));
        }
        // const handleStorageChange = () => {
        //     setIsLoggedIn(!!localStorage.getItem("authToken"));
        // };
        // //
        // window.addEventListener("storage", handleStorageChange);
        // //
        // return () => {
        //     window.removeEventListener("storage", handleStorageChange);
        // };
    }, []);

    return (
        <header>
            <div className={'navbar-content'}>
                <Link to={"/"}>
                    <img src={'/logo.png'} alt='logo'/>
                </Link>
                <div className='navigate'>
                    {user && user.role === "ROLE_CLIENT" &&
                        <Link to={"/create-order"}><p>Создать заказ</p></Link>}
                    {user && user.role === "ROLE_MASTER" && <p>Найти задание</p>}
                    {user && user.role === "ROLE_CLIENT" &&
                        <Link to={`/profile/${user.entity_id}`}><p>Подобрать исполнителя</p></Link>
                    }
                </div>
                <div className={"login-button"}>
                    <Link to="/#login">
                        {user && <OrangeButton text="Выйти" onClick={handleLogout}/>}
                        {!user && <OrangeButton text="Войти" onClick={scrollToBottom}/>}
                    </Link>
                </div>
            </div>
        </header>
    )
}
