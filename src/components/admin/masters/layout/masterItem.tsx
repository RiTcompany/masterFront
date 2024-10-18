import React from 'react';

import styled from '../../Admin.module.css';
import SvgComponent from "../../svg/svgComponent.tsx";
import {MasterItemProps} from "../../interfaces/admin.props.ts";
import {deleteMaster, postMaster} from "../../utils/request.ts";




const MasterItem: React.FC<MasterItemProps> = ({ item, url,onUpdate }) => {
    const metroStations = item.metroStation.map((metro) => {
        if (typeof metro === 'string') {
            return metro;
        } else {
            return metro.name;
        }
    });
    const metroStationsString = metroStations.join(' ');

    const categoryMaster = item.categories.map((metro) => {
        if (typeof metro === 'string') {
            return metro;
        } else {
            return metro.name;
        }
    });

    const categoryString =categoryMaster.join(' ');



    const handleVerify = async (url:string) => {
        try {

            const response = await postMaster(url);
            console.log('Верифицирован:', response);

            onUpdate();
        } catch (error) {
            onUpdate();
            console.error('Ошибка верификации:', error);
        }
    };

    const handleDelete = async (url:string) => {
        try {

            const response = await deleteMaster(url);
            console.log('Удален:', response);
            onUpdate();

        } catch (error) {
            onUpdate();
            console.error('Ошибка удаления:', error);
        }
    };



    return (
        <div className={styled.masterBlock}>
            <div className={styled.masterBlockFlex}>
                <div className={styled.masterBlockData}>
                    <SvgComponent num={3} />
                    <p className={styled.masterName}>{item.firstName}</p>
                    <p className={styled.masterName}>{item.lastName}</p>
                </div>
                <div className={styled.masterBlockData}>
                    <SvgComponent num={2} />
                    {item.email}
                </div>
                <div className={styled.masterBlockData}>
                    <SvgComponent num={1} />
                    {item.phoneNumber}
                </div>
                <div className={styled.masterBlockData}>
                    <SvgComponent num={4}/>
                    <p className={styled.masterName}>
                        {metroStationsString}
                    </p>


                </div>

                <div className={styled.masterBlockData}>
                    <SvgComponent num={5} />
                    <p className={styled.masterName}>{item.description}</p>
                </div>
                <div className={styled.masterBlockData}>
                    <SvgComponent num={6}/>
                    <p className={styled.masterName}>
                        {categoryString}
                    </p>
                </div>

                {url === "/access-requests" && (
                    <div className={styled.masterBlockData} >
                        <div  onClick={() => handleVerify(`/accept/${item.id}`)} className={styled.verifyButton}>
                            Верифицировать
                        </div>
                        <div onClick={() => handleDelete(`/discard/${item.id}`)} className={styled.deleteButton}>
                            Удалить
                        </div>
                    </div>
                )}

                {url === "/non-verified-masters" && (
                    <div className={styled.masterBlockData}>
                        <div onClick={() => handleVerify(`/verify/${item.id}`)} className={styled.verifyButton}>
                            Верифицировать
                        </div>
                        <div onClick={() => handleDelete(`/discard/${item.id}`)} className={styled.deleteButton}>
                            Удалить
                        </div>
                    </div>
                )}



            </div>
        </div>
    );
};

export default MasterItem;