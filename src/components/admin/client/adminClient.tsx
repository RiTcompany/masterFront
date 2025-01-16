import  {useEffect, useState} from "react";
import {getClients, requestBlockUser} from '../utils/request.ts'
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
                console.log(data);
            } catch (error) {
                console.error('Ошибка:', error);
            }

            NProgress.done();
        };

        fetchClients();
    }, []);

    const bannedUser = async (username: string, isCurrentlyBanned: boolean) => {
        try {

            const newBanStatus = !isCurrentlyBanned;


            await requestBlockUser(username, newBanStatus);

            setClients((prevState) => {
                if (!prevState) return prevState;

                const updatedClients = prevState.content.map((client) => {
                    if (client.user.username === username) {
                        return {
                            ...client,
                            user: {
                                ...client.user,
                                isBanned: newBanStatus,
                            },
                        };
                    }
                    return client;
                });

                return { ...prevState, content: updatedClients };
            });
        } catch (error) {
            console.error("Ошибка при блокировке/разблокировке пользователя:", error);
        }
    };
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


                            <div>{item.email}</div>
                        </div>

                        <div className={styled.clientBlockData}>
                            <SvgComponent num={1}/>


                            {item.phoneNumber}
                        </div>
                        <div  className={styled.deleteButton} onClick={() => bannedUser(item.user.username, item.user.isBanned)}>
                            {item.user.isBanned }
                        </div>
                    </div>


                </div>

                ))}


            </div>
        </>
    )

}

export default AdminClient;