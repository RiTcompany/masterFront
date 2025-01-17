import React, {useState} from 'react';

import styled from '../../Admin.module.css';
import SvgComponent from "../../svg/svgComponent.tsx";
import {MasterItemProps} from "../../interfaces/admin.props.ts";
import {
    deleteMaster,
    postMaster,
    requestBlockUser,
    responseAddComment,
    responseGetDocument
} from "../../utils/request.ts";




const MasterItem: React.FC<MasterItemProps> = ({ item, url,onUpdate }) => {
    const [addComment,setAddComment] = useState<number | null>(null);
    const [comment, setComment] = useState("");
    const switchStateComment = (id:number| null) => {
        setAddComment(id);
    }



    const bannedUser = async (username: string, isCurrentlyBanned: boolean) => {
        try {

            const newBanStatus = !isCurrentlyBanned;


            await requestBlockUser(username, newBanStatus);

            onUpdate();


        } catch (error) {
            console.error("Ошибка при блокировке/разблокировке пользователя:", error);
        }
    };

    const showDocument = async (id: number) => {
        try {
            const documentUrl = await responseGetDocument(id);
            if (documentUrl) {
                window.open(documentUrl, '_blank');
            }
        } catch (error) {
            console.error('Ошибка получение pdf:', error);
            alert('Ошибка получение pdf');
        }
    };
    const handleAddComment = async (id:number) => {
        if (!comment.trim()) {
            alert("Пожалуйста, введите комментарий.");
            return;
        }


        try {
            const data = await responseAddComment(id, comment);
            alert('Комментарий успешно добавлен:');
            console.log(data);
            setComment("");
        } catch (error) {
            console.error('Ошибка добавления комментария:', error);
        }
    };



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
                    <SvgComponent num={3}/>
                    <p className={styled.masterName}>{item.firstName}</p>
                    <p className={styled.masterName}>{item.lastName}</p>
                </div>
                <div className={styled.masterBlockData}>
                    <SvgComponent num={2}/>
                    {item.email}
                </div>
                <div className={styled.masterBlockData}>
                    <SvgComponent num={1}/>
                    {item.phoneNumber}
                </div>
                <div className={styled.masterBlockData}>
                    <SvgComponent num={4}/>
                    <p className={styled.masterName}>
                        {metroStationsString}
                    </p>


                </div>

                <div className={styled.masterBlockData}>
                    <SvgComponent num={5}/>
                    <p className={styled.masterName}>{item.description}</p>
                </div>
                <div className={styled.masterBlockData}>
                    <SvgComponent num={6}/>
                    <p className={styled.masterName}>
                        {categoryString}
                    </p>
                </div>


                {url === "/access-requests" && (
                    <div className={styled.masterBlockData}>
                        <div onClick={() => handleVerify(`/accept/${item.id}`)} className={styled.verifyButton}>
                            Верифицировать
                        </div>
                        <div onClick={() => handleDelete(`/discard/${item.id}`)} className={styled.deleteButton}>
                            Удалить
                        </div>
                    </div>
                )}

                {url === "/non-verified-masters" && (
                    <div className={styled.flexCol}>
                        <div className={styled.masterBlockData}>
                            <div onClick={() => handleVerify(`/verify/${item.id}`)} className={styled.verifyButton}>
                                Верифицировать
                            </div>
                            <div onClick={() => handleDelete(`/discard/${item.id}`)} className={styled.deleteButton}>
                                Удалить
                            </div>
                        </div>
                        {addComment != item.id ? (
                            <div className={styled.addCom} onClick={() => switchStateComment(item.id)}>
                                Добавление комментария
                            </div>
                        ) : (
                            <div className={styled.commentForm}>

                                  <textarea
                                      placeholder="Введите комментарий"
                                      className={styled.commentInput}
                                      value={comment}
                                      onChange={(e) => setComment(e.target.value)}
                                  />
                                <div className={styled.addCom} onClick={() => handleAddComment(item.id)}>Добавить</div>


                                <div className={styled.cancelBtn} onClick={() => switchStateComment(null)}>
                                    Отмена
                                </div>
                            </div>
                        )}
                        <div className={styled.addCom} onClick={() => showDocument(item.id)}>
                            Показать документ
                        </div>
                    </div>
                )}
                <div className={styled.deleteButton} onClick={() => bannedUser(item.userId.username, item.userId.isBanned)}>
                    {item.userId.isBanned ? "Разблокировать" : "Блокировать"}
                </div>


            </div>
        </div>
    );
};

export default MasterItem;