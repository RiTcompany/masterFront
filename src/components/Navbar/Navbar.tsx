import React from "react";
import './Navbar.css'
import {OrangeButton} from "../OrangeButton/OrangeButton.tsx";

export function Navbar(): React.JSX.Element {
    function search(e: { preventDefault: () => void; }) {
        e.preventDefault()
    }

    return (
        <header>
            <div className={'navbar-content'}>
                <img src={'/logo.png'} alt='logo'/>
                <div className={'navigate'}>
                    <p>Создать услугу</p>
                    <p>Подобрать исполнителя</p>
                    <p>Найти задание</p>
                </div>
                <div className={"login-button"}>
                    <OrangeButton text={'Войти'} onClick={search} />
                </div>
            </div>
        </header>
    )
}
