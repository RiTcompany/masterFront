import {Outlet, useNavigate} from 'react-router-dom';
import HeaderAdmin from "../header/HeaderAdmin.tsx";
import React, {useEffect} from "react";

import styled from "../Admin.module.css";

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';


const LayoutAdmin: React.FC = () => {

    const navigate = useNavigate();
    NProgress.configure({ showSpinner: false, speed: 500, minimum: 0.1 });

    useEffect(() => {

        document.body.classList.add(styled.adminBody);



        return () => {
            document.body.classList.remove(styled.adminBody);
        };
    }, [navigate]);



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

