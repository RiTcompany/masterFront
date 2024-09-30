import {useEffect, useState} from "react";
import { getClients } from '../utils/request.ts'
import styled from "../Admin.module.css";
import {AdminResponseClient, Client} from "../interfaces/admin.props.ts";
import SvgComponent from "../svg/svgComponent.tsx";
import NProgress from "nprogress";
const AdminClient = () =>{
    const [clients, setClients] = useState<AdminResponseClient>();
    useEffect(() => {
        const fetchClients = async () => {
            try {
                NProgress.start();
                const data = await getClients();
                setClients(data);
            } catch (error) {
                console.error('Ошибка:', error);
            }

            NProgress.done();
        };

        fetchClients();
    }, []);
    return(
        <>
            <h2 className={styled.h2Master}>Заказчики</h2>
            <div className={styled.clientContainer}>
                {clients?.content?.length && clients.content.map((item:Client ) => (
                <div key={item.id} className={styled.clientBlock}>
                    <div className={styled.clientBlockFlex}>
                        <div className={styled.clientBlockData}>
                            <SvgComponent num={3}/>


                            {item.name}
                        </div>

                        <div className={styled.clientBlockData}>
                            <SvgComponent num={2}/>


                            {item.email}
                        </div>

                        <div className={styled.clientBlockData}>
                            <SvgComponent num={1}/>


                            {item.phoneNumber}
                        </div>
                    </div>


                </div>

            ))}








        </div>
            </>
    )

}

export default AdminClient;