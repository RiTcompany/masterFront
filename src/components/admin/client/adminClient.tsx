import { useEffect, useState } from "react";
import { getClients, requestBlockUser } from '../utils/request.ts';
import styled from "../Admin.module.css";
import { AdminResponseClient, Client } from "../interfaces/admin.props.ts";
import SvgComponent from "../svg/svgComponent.tsx";
import NProgress from "nprogress";

const AdminClient = () => {
    const [clients, setClients] = useState<AdminResponseClient | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0); // Текущая страница

    useEffect(() => {
        const fetchClients = async () => {
            try {
                NProgress.start();
                const data = await getClients(currentPage); // Передаем текущую страницу
                setClients((prevClients) => ({
                    ...data,
                    content: prevClients ? [...prevClients.content, ...data.content] : data.content, // Сохраняем предыдущие клиенты и добавляем новые
                }));
                console.log(data);
            } catch (error) {
                console.error('Ошибка:', error);
            }
            NProgress.done();
        };

        fetchClients();
    }, [currentPage]);

    const bannedUser = async (username: string, isCurrentlyBanned: boolean) => {
        try {
            const newBanStatus = !isCurrentlyBanned;

            await requestBlockUser(username, newBanStatus);

            // Обновляем статус блокировки пользователя
            setClients((prevState) => {
                if (!prevState) return prevState;

                const updatedClients = prevState.content.map((client) => {
                    if (client.userId.username === username) {
                        return {
                            ...client,
                            userId: {
                                ...client.userId,
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

    const handleShowMore = () => {
        setCurrentPage(currentPage + 1); // Увеличиваем номер страницы на 1
    };

    return (
        <>
            <h2 className={styled.h2Master}>Заказчики</h2>
            <div className={styled.clientContainer}>
                {clients?.content?.length && clients.content.map((item: Client) => (
                    <div key={item.id} className={styled.clientBlock}>
                        <div className={styled.clientBlockFlex}>
                            <div className={styled.clientBlockData}>
                                <SvgComponent num={3} />
                                {item.name}
                            </div>
                            <div className={styled.clientBlockData}>
                                <SvgComponent num={2} />
                                <div>{item.email}</div>
                            </div>
                            <div className={styled.clientBlockData}>
                                <SvgComponent num={1} />
                                {item.phoneNumber}
                            </div>
                            <div className={styled.deleteButton} onClick={() => bannedUser(item.userId.username, item.userId.isBanned)}>
                                {item.userId.isBanned ? "Разблокировать" : "Блокировать"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Кнопка "Показать еще" */}
            {clients && clients.totalPages > currentPage + 1 && (
                <div className={styled.showMoreContainer}>
                    <button className={styled.showMoreButton} onClick={handleShowMore}>
                        Показать еще
                    </button>
                </div>
            )}
        </>
    );
};

export default AdminClient;
