import React from "react";
import './Navbar.css'
import {OrangeButton} from "../OrangeButton/OrangeButton.tsx";
import {Link} from "react-router-dom";

export function Navbar(): React.JSX.Element {
    function scrollToBottom() {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }

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
                    {
                        localStorage.getItem("authToken") ?
                            <OrangeButton text="Выйти" onClick={scrollToBottom}/> :
                            <Link to="/#login">
                                <OrangeButton text="Войти" onClick={scrollToBottom}/>
                            </Link>
                    }
                </div>
            </div>
        </header>
    )
}
