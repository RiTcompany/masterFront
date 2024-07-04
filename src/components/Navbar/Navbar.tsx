import React, {useEffect, useState} from "react";
import './Navbar.css'
import {OrangeButton} from "../OrangeButton/OrangeButton.tsx";
import {Link} from "react-router-dom";

export function Navbar(): React.JSX.Element {
    function scrollToBottom() {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }

    function handleLogout() {
        localStorage.removeItem("authToken")
        setIsLoggedIn(false)
    }

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem("authToken"));

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem("authToken"));
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    });

    return (
        <header>
            <div className={'navbar-content'}>
                <Link to={"/"}>
                    <img src={'/logo.png'} alt='logo'/>
                </Link>
                <div className={'navigate'}>
                    <p>Создать услугу</p>
                    <p>Подобрать исполнителя</p>
                    <p>Найти задание</p>
                </div>
                <div className={"login-button"}>
                    <Link to="/#login">
                        { isLoggedIn ? <OrangeButton text="Выйти" onClick={handleLogout}/> :
                            <OrangeButton text="Войти" onClick={scrollToBottom}/>}
                    </Link>
                </div>
            </div>
        </header>
    )
}
