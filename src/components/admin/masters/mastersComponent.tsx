import { useEffect, useState } from "react";
import { Master, MasterReq } from "../interfaces/admin.props.ts";
import { getMasters } from "../utils/request.ts";
import styled from "../Admin.module.css";
import MasterItem from "./layout/masterItem.tsx";
import NProgress from "nprogress";

const MastersComponent = () => {
    const [masters, setMasters] = useState<Master[]>([]);
    const [isData, setData] = useState<MasterReq | null>(null);
    const [activePath, setActivePath] = useState<string>("/masters");
    const [currentPage, setCurrentPage] = useState<number>(0);

    // Функция для загрузки мастеров
    useEffect(() => {
        const fetchMasters = async () => {
            NProgress.start();
            try {
                const data = await getMasters(activePath, currentPage); // Передаем активный путь и текущую страницу
                setMasters(data.content);
                setData(data); // Сохраняем данные для пагинации
            } catch (error) {
                console.error('Ошибка:', error);
                setMasters([]);
            }
            NProgress.done();
        };

        fetchMasters();
    }, [activePath, currentPage]); // Пагинация и смена пути

    const handleUpdateMasters = async () => {
        try {
            const data = await getMasters(activePath, currentPage); // Передаем текущую страницу
            setMasters(data.content);
            console.log('Обновленные мастера:', data);
        } catch (error) {
            setMasters([]);
            console.error('Ошибка при обновлении мастеров:', error);
        }
    };

    const switchState = (path: string) => {
        setActivePath(path);
        setCurrentPage(1); // Сбрасываем на первую страницу при изменении пути
    };

    const handleLoadMore = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };



    return (
        <>
            <h2 className={styled.h2Master}>
                {activePath === "/masters" ? "Проверенные мастера" : activePath === "/non-verified-masters" ? "Не проверенные по почте" : "Не проверенные по документам"}
            </h2>
            <div className={styled.containerButtonMasters}>
                <div onClick={() => switchState("/masters")} className={activePath === "/masters" ? styled.bActive : ""}>
                    Проверенные
                </div>
                <div onClick={() => switchState("/access-requests")} className={activePath === "/access-requests" ? styled.bActive : ""}>
                    Не проверенные по почте
                </div>
                <div onClick={() => switchState("/non-verified-masters")} className={activePath === "/non-verified-masters" ? styled.bActive : ""}>
                    Не проверенные по документам
                </div>
            </div>
            <div className={styled.masterContainer}>
                {masters.map((item: Master) => (
                    <MasterItem key={item.id} item={item} url={activePath} onUpdate={handleUpdateMasters} />
                ))}
                {masters.length === 0 && (
                    <h2>Ничего не найдено!</h2>
                )}
            </div>

            {/* Пагинация */}
            {isData && currentPage < isData.totalPages - 1 && (
                <div className={styled.showMoreContainer}>
                    <button className={styled.showMoreButton} onClick={handleLoadMore}>
                        Показать еще
                    </button>
                </div>
            )}
        </>
    );
};

export default MastersComponent;
