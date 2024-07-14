import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import "./Profile.css";
import {TaskCard} from "../../components/TaskCard/TaskCard.tsx";

interface UserType {
    email: string,
    id: number,
    isAccepted: boolean,
    lastName?: string,
    middleName?: string,
    phoneNumber: string,
    photoLink?: string,
    role: string
    telegramTag?: string,
    userId: number,
    firstName: string,
    age?: number,
    metroStation?: string,
    rate?: number,
    description?: string,
    documents?: boolean,
}

interface TaskType {
    id: number,
    userId: number,
    categoryId: number,
    categoryName: string,
    userName: string,
    description: string;
    startDate: string;
    endDate: string
    category: {
        name: string,
        id: number
    }
}

interface ProfileProps {
    authUserId: number
}

export function Profile({authUserId} : ProfileProps): React.JSX.Element {
    const params = useParams();
    const navigate = useNavigate()
    const userId = params.id;
    const authToken = localStorage.getItem("authToken");

    const isMounted = useRef(true);

    const [isMyProfile, setIsMyProfile] = useState<boolean>(false)
    const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<string>("tab1");
    const [user, setUser] = useState<UserType | null>(null);
    const [tasks, setTasks] = useState<TaskType[]>([]);

    useEffect(() => {
        if (!isMounted.current) {
            return;
        }

        (async function() {
            try {
                if (!authToken) {
                    throw new Error("Auth token not found in localStorage");
                }

                const response = await fetch(`http://195.133.197.53:8081/profiles/${userId}`, {
                    method: "GET",
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`HTTP error! status: ${response.status}, response: ${errorText}`);
                    throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
                }

                const userData = await response.json();
                console.log('Fetched user:', userData);

                if (!userData.userId) {
                    console.error('Fetched user does not have a userId:', userData);
                    throw new Error('Fetched user does not have a userId');
                }

                setUser(userData);
                setIsMyProfile(+userData.userId === +authUserId);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingProfile(false);
            }
        })()
    }, [userId, authUserId, authToken]);

    useEffect(() => {
        (
           async function ()  {
               if (user?.role === "ROLE_CLIENT") {
                   try {
                       const response = await fetch(`http://195.133.197.53:8081/tasks/client/${userId}`, {
                           credentials:"include",
                           method: "GET",
                           headers: {
                               Authorization: `Bearer ${authToken}`,
                           }}
                       )
                       setTasks(await response.json())
                   } catch (error) {
                       console.log(error)
                   }
               }
           }
        )()
    }, [user]);

    useEffect(() => {
        (
            async function ()  {
                if (user?.role === "ROLE_MASTER") {
                    try {
                        const response = await fetch(`http://195.133.197.53:8081/tasks/master/${userId}`, {
                            credentials:"include",
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${authToken}`,
                            }}
                        )
                        setTasks(await response.json())
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        )()
    }, [user]);


    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    if (loadingProfile) {
        return <div>Загрузка...</div>;
    }

    if (!user || !user.role) {
        console.log('User state:', user);
        return <p>Вы не авторизованы</p>;
    }

    console.log('authUserId:', authUserId);
    console.log('userId:', user.userId);
    console.log('isMyProfile:', isMyProfile);

    return (
        <div className="common">
            {/*{user.role === "ROLE_MASTER" && (*/}
                <>
                    <button className={"back-button"} onClick={() => navigate(-1)} style={{marginTop: "20px", width: "80px"}}>Назад</button>
                    <div className="info-container">
                        <div className="profile-left">
                            {isMyProfile ? (
                                <h1>Здравствуйте, {user.firstName}!</h1>
                            ) : (
                                <h1>{user.firstName} {user.middleName} {user.lastName}</h1>
                            )}
                            {user.role === "ROLE_MASTER" &&
                            <div className="base-info">
                                <div className="profile-photo">
                                    <img alt="avatar" src="/default-avatar.jpg"/>
                                    <button className="add-photo-button">добавить фото</button>
                                </div>
                                <div>
                                    {user.age !== undefined && user.age > 0 && <p>Возраст: {user.age}</p>}
                                    <p>Метро: {user.metroStation}</p>
                                    <p>Рейтинг: {user.rate}</p>
                                </div>
                            </div>
                            }
                            <div className="profile-select">
                                {user.role === "ROLE_MASTER" && (
                                    <>
                                        <button className={activeTab === "tab1" ? "active" : ""}
                                                onClick={() => handleTabClick("tab1")}>Обо мне</button>
                                        <button className={activeTab === "tab2" ? "active" : ""}
                                                onClick={() => handleTabClick("tab2")}>Заказы</button>
                                    </>
                                )}
                            </div>

                            {user.role === "ROLE_CLIENT" &&
                                <div>
                                    <h2 className="orders-title">Заказы</h2>
                                    <div className="profile-select">
                                        <button className={activeTab === "tab1" ? "active" : ""}
                                                onClick={() => handleTabClick("tab1")}>Активные</button>
                                        <button className={activeTab === "tab2" ? "active" : ""}
                                                onClick={() => handleTabClick("tab2")}>Выполненные</button>
                                    </div>
                                </div>
                            }
                            <hr/>
                            {user.role === "ROLE_CLIENT" && activeTab === "tab1" &&
                                <div>
                                    {tasks && tasks.map((task) =>
                                        <div key={task.id}>
                                            <TaskCard data={task}/>
                                        </div>
                                    )}
                                </div>
                            }

                            {user.role === "ROLE_MASTER" && activeTab === "tab1" && (
                                <div className="profile-about">
                                    <h3>Немного о себе</h3>
                                    <p>{user.description}</p>
                                    <h3>Виды выполняемых работ</h3>
                                    <h4>Демонтажные работы</h4>
                                    <h4>Демонтажные работы</h4>
                                    <h4>Демонтажные работы</h4>
                                </div>
                            )}
                            {user.role === "ROLE_MASTER" && activeTab === "tab2" && (
                                <div>
                                    <h2>Выполненные</h2>
                                    <h2>В процессе</h2>
                                    {
                                        tasks && tasks.map((task) =>
                                        <Link to={`/task/${task.id}`} key={task.id}>
                                            <TaskCard data={task}/>
                                        </Link>
                                        )
                                    }
                                </div>
                            )}
                        </div>
                        <div className="profile-right">
                            {user.role === "ROLE_MASTER" && <h2>Исполнитель</h2>}
                            {user.role === "ROLE_CLIENT" && <h2>Заказчик</h2>}
                            {user.role === "ROLE_MASTER" && <p>Чтобы повысить уровень лояльности, подтвердите ваши
                                данные: паспорт, контактный телефон, и электронную почту</p>}
                            {user.role === "ROLE_MASTER" &&
                                <div className="contacts">
                                    <img src="/confirm-documents-icon.png" alt="documents-icon"/>
                                    <div>
                                        <strong>Документы</strong>
                                        {user.documents ? (
                                            <p style={{color: "green"}}>Подтверждены</p>
                                        ) : (
                                            <p style={{color: "red"}}>Не подтверждены</p>
                                        )}
                                    </div>
                                </div>
                            }
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
                    {user.role === "ROLE_MASTER" &&
                    <div className="profile-bottom">
                        <h2>Ваши отзывы</h2>
                        <div className="profile-review-card">
                            <p className="title">Перевезти вещи на новую квартиру</p>
                            <p className="price">Стоимость работ: 2000₽</p>
                            <p className="text">Супер, рекомендую! Очень быстро и комфортно переехали.</p>
                            <div className="master">
                                <img src="/about-background.jpg" alt="master-photo"/>
                                <div className="master-info">
                                    <p className="name">Сергей</p>
                                    <p className="rating">Рейтинг исполнителя: 5</p>
                                    <p className="tasks">Выполнил 306 заданий</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                </>
            {/*{user.role === "ROLE_CLIENT" && (*/}
            {/*    <>*/}
            {/*        <div className="info-container">*/}
            {/*            <div className="profile-left">*/}
            {/*                <h1>Здравствуйте, {user.firstName}!</h1>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </>*/}
            {/*)}*/}
        </div>
    );
}
