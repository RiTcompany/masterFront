import React, {useEffect, useState} from "react";
// import {useParams} from "react-router-dom";
import {ServiceCard} from "../../components/ServiceCard/ServiceCard.tsx";
import("./Profile.css")

export function Profile({user} : any): React.JSX.Element {
    // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

    // const params = useParams();
    // const userId = params.id
    // console.log(user)

    const [loadingProfile, setLoadingProfile] = useState(true);
    const [activeTab, setActiveTab] = useState<string>("about")

    useEffect(() => {
        if (user) {
            setLoadingProfile(false);
        }
    }, [user]);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    // const getUserData = async () => {

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
    // };

    if (loadingProfile) {
        return <div>Загрузка...</div>;
    }

    if (!user || !user.firstName) {
        return <p>Вы не авторизованы</p>;
    }


    // const token = localStorage.getItem('authToken');
    return (
        <div className="common">
            {user ? (
                <div>
                <div className="info-container">
                    <div className="profile-left">
                        <h1>Здравствуйте, {user.firstName}!</h1>
                        <div className="base-info">
                            <div className="profile-photo">
                                <img alt="avatar" src="/default-avatar.jpg"/>
                                <button className="add-photo-button">добавить фото</button>
                            </div>
                            <div>
                                { user.age > 0 && <p>Возраст: {user.age}</p> }
                                <p>Метро: {user.metroStation}</p>
                                <p>Рейтинг: {user.rate}</p>
                            </div>
                        </div>
                        <div className="profile-select">
                            <button className={activeTab === "about" ? "active" : ""}
                                onClick={() => handleTabClick("about")}>Обо мне</button>
                            <button className={activeTab === "orders" ? "active" : ""}
                                onClick={() => handleTabClick("orders")}>Заказы</button>
                            <button className={activeTab === "portfolio" ? "active" : ""}
                                onClick={() => handleTabClick("portfolio")}>Портфолио</button>
                        </div>
                        <hr/>

                        {
                            activeTab === "about" &&
                            <div className="profile-about">
                                <h3>Немного о себе</h3>
                                <p>{user.description}</p>
                                <h3>Виды выполняемых работ</h3>
                                <h4>Демонтажные работы</h4>
                                <h4>Демонтажные работы</h4>
                                <h4>Демонтажные работы</h4>
                            </div>
                        }
                        {
                            activeTab === "orders" &&
                            <div>
                                <h2>Выполненные</h2>
                                <h2>В процессе</h2>
                            </div>
                        }
                        {
                            activeTab === "portfolio" &&
                            <div className={"profile-portfolio"}>
                                <ServiceCard image={"/intro-background.png"} description={"kerklkelk"}/>
                                <ServiceCard image={"/intro-background.png"} description={"kerklkelk"}/>
                                <ServiceCard image={"/intro-background.png"} description={"kerklkelk"}/>
                                <ServiceCard image={"/intro-background.png"} description={"kerklkelk"}/>
                            </div>
                        }
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
                <div className={"profile-bottom"}>
                    <h2>Ваши отзывы</h2>
                    <div className="profile-review-card">
                        <p className="title">Перевезти вещи на новую квартиру</p>
                        <p className="price">Стоимость работ: 2000₽</p>
                        <p className="text">Супер, рекомендую! Очень быстро и комфортно переехали.</p>
                        <div className="master">
                            <img src={"/about-background.jpg"} alt="master-photo"/>
                            <div className="master-info">
                                <p className="name">Сергей</p>
                                <p className="rating">Рейтинг исполнителя: 5</p>
                                <p className="tasks">Выполнил 306 заданий</p>
                            </div>
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
