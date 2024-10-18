import {Outlet, useNavigate} from 'react-router-dom';
import HeaderAdmin from "../header/HeaderAdmin.tsx";
import React, {useEffect, useState} from "react";

import styled from "../Admin.module.css";

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';


const LayoutAdmin: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    NProgress.configure({ showSpinner: false, speed: 500, minimum: 0.1 });

    useEffect(() => {

        document.body.classList.add(styled.adminBody);
        const storedToken = localStorage.getItem("authToken");
        if (!storedToken) {

            setErrorMessage('Недостаточно прав для доступа к этой странице.');
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } else {
            setToken(storedToken);
        }


        return () => {
            document.body.classList.remove(styled.adminBody);
        };
    }, [navigate]);

    if (!token) {
        return (
            <div className={styled.modalOverlay}>
                <div className={styled.modalContent}>
                    <p>{errorMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styled.adminLayout}>
            <HeaderAdmin/>
            <div className={styled.adminLayoutContent}>
                <Outlet/>
            </div>
        </div>
    );
};

export default LayoutAdmin;

