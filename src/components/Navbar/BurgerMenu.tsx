import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import {OrangeButton} from "../OrangeButton/OrangeButton.tsx";

export const BurgerMenu = ({ user, handleLogout }: any) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="burger-menu">
            <button className="burger-button" onClick={toggleMenu}>
                <img src={'/menu.svg'} alt='menu'/>
            </button>
            {isOpen && (
                <div className="menu">
                    {user && user.role === "ROLE_CLIENT" && (
                        <Link to={"/create-order"} onClick={toggleMenu}>
                            <p style={{ color: "white" }}>Создать заказ</p>
                        </Link>
                    )}
                    {user && user.role === "ROLE_MASTER" && (
                        <Link to={"/"} onClick={toggleMenu}>
                            <p style={{ color: "white" }}>Найти задание</p>
                        </Link>
                    )}
                    {user && (
                        <Link to={`/profile/${user.id}`} onClick={toggleMenu}>
                            <p style={{ color: "white" }}>Мой профиль</p>
                        </Link>
                    )}
                    <div className={"login-button"}>
                        <Link to="/#login">
                            {user && (
                                <OrangeButton text="Выйти" onClick={handleLogout}/>
                            )}
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};
