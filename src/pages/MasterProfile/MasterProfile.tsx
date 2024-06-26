import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import("./MasterProfile.css")

export function MasterProfile({user} : any): React.JSX.Element {
    // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    // const [loading, setLoading] = useState<boolean>(true);

    const params = useParams();
    const userId = params.id
    // console.log(user)

    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        if (user) {
            setLoadingProfile(false);
        }
    }, [user]);

    const getUserData = async () => {

        // let userData = null;
        // if (data.role === "ROLE_MASTER") {
        //     userData = await fetchData(`http://195.133.197.53:8081/masters/info/${data.entity_id}`);
        // } else if (data.role === "ROLE_CLIENT") {
        //     userData = await fetchData(`http://195.133.197.53:8081/clients/6`);
        // }
        // if (userData) {
        //     console.log(userData)
        //     setUser(userData);
        // }
    };

    if (loadingProfile) {
        return <div>Загрузка...</div>;
    }

    if (!user || !user.firstName) {
        return <p>Вы не авторизованы</p>;
    }


    // const token = localStorage.getItem('authToken');
    return (
        <div className="profile-container common">
            {user ? (
                <div className="info-container">
                    <div className="profile-left">
                        <h1>Здравствуйте, {user.firstName}!</h1>
                        <img alt="avatar" src="/default-avatar.jpg"/>
                        <button className="add-photo-button">добавить фото</button>
                    </div>
                    <div className="profile-right">
                        <h2>Исполнитель</h2>
                        <p>Чтобы повысить уровень лояльности, подтвердите ваши  данные:  паспорт, контактный телефон,
                            и электронную почту</p>
                        <div className="contacts">
                            <img src="/confirm-documents-icon.png" alt="documents-icon"/>
                            <div>
                                <strong>Документы</strong>
                                {
                                    user.documents[0] ? <p style={{"color": "green"}}>Подтверждены</p> : <p style={{"color": "red"}}>Не подтверждены</p>
                                }
                            </div>
                        </div>
                        <div className="contacts">
                            <img src="/phone-icon.png" alt="phone-icon"/>
                            <div className="contact-text">
                                <strong>Телефон</strong>
                                <p>Скрыт</p>
                            </div>
                        </div>
                        <div className="contacts">
                            <img src="/email-icon.png" alt="email-icon"/>
                            <div className="contact-text">
                                <strong>Email</strong>
                                <p>Скрыт</p>
                            </div>
                        </div>
                        <div className="contacts">
                            <img src="/tg-icon.png" alt="tg-icon"/>
                            <div className="contact-text">
                                <strong>Телеграм</strong>
                                <p>Скрыт</p>
                            </div>
                        </div>

                    </div>
                </div>
            ) : (
                <p>вы не авторизованы!</p>
            )}
        </div>
    )
}
