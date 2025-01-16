import { useEffect, useState } from "react";
import { Master } from "../interfaces/admin.props.ts";
import {getMasters} from "../utils/request.ts";
import styled from "../Admin.module.css";

import MasterItem from "./layout/masterItem.tsx";
import NProgress from "nprogress";

const MastersComponent = () => {
    const [masters, setMasters] = useState<Master[]>([]);
    const [activePath, setActivePath] = useState<string>("/masters");

    useEffect(() => {
        const fetchMasters = async () => {
            NProgress.start();
            try {
                const data = await getMasters(activePath);
                setMasters(data);
                console.log(data)
            } catch (error) {
                console.error('Ошибка:', error);
                setMasters([])
            }
            NProgress.done();
        };

        fetchMasters();
    }, [activePath]);




    const handleUpdateMasters = async () => {
        try {
            const data = await getMasters(activePath);
            setMasters(data);
            console.log('Обновленные мастера:', data);
        } catch (error) {
            setMasters([])
            console.error('Ошибка при обновлении мастеров:', error);
        }
    };

    const switchState = (path: string) => {
        setActivePath(path);
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
                { masters.map((item: Master) => (
                    <MasterItem key={item.id} item={item} url={activePath}  onUpdate={handleUpdateMasters} />
                ))}
                {masters.length == 0 && (
                    <h2>Ничего не найдено!</h2>
                )}
            </div>
        </>
    );
}

export default MastersComponent;