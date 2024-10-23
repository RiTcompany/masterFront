import React, {useEffect, useState} from "react";
import './Navbar.css'
import {OrangeButton} from "../OrangeButton/OrangeButton.tsx";
import {Link} from "react-router-dom";
import {parseJwt} from "../../App.tsx";
import {BurgerMenu} from "./BurgerMenu.tsx";

interface UserType {
    role: string,
    id: number
}

export function Navbar(): React.JSX.Element {
    const [user, setUser] = useState<UserType>();

    function scrollToElementById(elementId: string) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function scrollToBottom() {
        scrollToElementById('login');
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
    }, [user?.role]);

    return (
        <header>
            <div className={'navbar-content'}>
                <Link to={"/"}>
                    <img src={'/logo.png'} alt='logo'/>
                </Link>
                <div className='navigate' >
                    {user && user.role === "ROLE_CLIENT" &&
                        <Link to={"/create-order"}><p style={{color: "white"}}>Создать заказ</p></Link>}
                    {user && user.role === "ROLE_MASTER" && <Link to={"/"}><p style={{color: "white"}}>Найти задание</p></Link>}
                    {user &&
                        <Link to={`/profile/${user.id}`}><p style={{color: "white"}}>Мой профиль</p></Link>
                    }
                </div>
                {user &&
                    <div className={`mobile-navigate`}>
                        <BurgerMenu user={user} handleLogout={handleLogout} />
                    </div>
                }

                <div className={"login-button"}>
                    <Link to="/#login">
                        {user && (
                            <div className={"logout-button"}>
                                <OrangeButton text="Выйти" onClick={handleLogout}/>
                            </div>
                        )}
                        {!user && <OrangeButton text="Войти" onClick={scrollToBottom}/>}
                    </Link>
                </div>
            </div>
        </header>
    )
}
