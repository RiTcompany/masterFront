import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import "./Profile.css";
import {TaskCard} from "../../components/TaskCard/TaskCard.tsx";
import {OrangeButton} from "../../components/OrangeButton/OrangeButton.tsx";

interface UserType {
    email: string,
    id: number,
    isAccepted: boolean,
    lastName?: string,
    middleName?: string,
    phoneNumber: string,
    photoLink?: string,
    categories: string[],
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
    endDate: string;
    isCompleted: boolean
}


interface FeedbackType {
    rate: number,
    feedback: string,
    price: number,
    categoryName: string,
    clientName: string
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
    const [completedTasks, setCompletedTasks] = useState<TaskType[]>([]);
    const [uncompletedTasks, setUncompletedTasks] = useState<TaskType[]>([]);
    const [feedbacks, setFeedBacks] = useState<FeedbackType[]>([])

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

                console.log(userData)

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
    }, [user, userId]);

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
    }, [user, userId]);

    useEffect(() => {
        if (tasks) {
            setCompletedTasks(tasks.filter(task => task.isCompleted))
            setUncompletedTasks(tasks.filter(task => !task.isCompleted))
        }

    }, [tasks]);

    useEffect(() => {
        (
            async function ()  {
                if (user?.role === "ROLE_MASTER") {
                    try {
                        const response = await fetch(`http://195.133.197.53:8081/masters/${userId}/feedbacks`, {
                            credentials:"include",
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${authToken}`,
                            }}
                        )
                        setFeedBacks(await response.json())
                        console.log(feedbacks)
                        console.log(feedbacks)
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        )()
    }, [user, userId]);

    const [photoData, setPhotoData] = useState("/default-avatar.jpg");

    useEffect(() => {
        async function fetchUserPhoto() {
            if (user?.role === "ROLE_MASTER") {
                try {
                    const response = await fetch(`http://195.133.197.53:8081/masters/${userId}/photo`, {
                        credentials: "include",
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        }
                    });
                    if (response.ok) {
                        const arrayBuffer = await response.arrayBuffer();
                        const uint8Array = new Uint8Array(arrayBuffer);
                        const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
                        const base64String = btoa(binaryString);
                        if (base64String) {
                            setPhotoData(`data:image/jpeg;base64,${base64String}`);
                        } else {
                            setPhotoData("/default-avatar.jpg")
                        }

                        // console.log(photoData)
                    } else {
                        console.error('Failed to fetch user photo');

                    }
                } catch (error) {
                    console.error('Error fetching user photo:', error);
                }
            }
        }

        fetchUserPhoto();
    }, [user?.photoLink, user, userId, authToken]);

    useEffect(() => {
        console.log(photoData)
    });

    const photoInputRef = useRef<HTMLInputElement>(null);

    const handleAddPhotoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (photoInputRef.current) {
            photoInputRef.current.click();
        }
    };

    const handleAddPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (user) {
            const file = e.target.files?.[0];
            if (!file) {
                console.log("No file selected");
                return;
            }

            const formData = new FormData();
            formData.append("username", user.email);
            formData.append("file", file);

            try {
                const response = await fetch("http://195.133.197.53:8081/masters/photo", {
                    method: "POST",
                    credentials: "include",
                    body: formData
                });

                if (!response.ok) {
                    console.log(await response.json());
                    return
                }

                if (response.ok) {
                    window.location.reload()
                }

                console.log(await response.text())

            } catch (error) {
                console.log(error)
            }
        }

        // console.log(data)
    };


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
                    <div style={{ width: '150px', height: '45px', margin: '30px 0 0 20px', }}>
                        <OrangeButton onClick={() => navigate(-1)} text={"Назад"}/>
                    </div>
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
                                    <img alt="avatar" src={photoData}/>
                                    {isMyProfile &&
                                        <>
                                            <button className="add-photo-button" onClick={handleAddPhotoClick}>
                                                Добавить фото
                                            </button>
                                            <input
                                                type="file"
                                                ref={photoInputRef}
                                                style={{display: 'none'}}
                                                onChange={handleAddPhotoChange}
                                            />
                                        </>
                                    }
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
                                                onClick={() => handleTabClick("tab1")} style={{color: "black"}}>Обо мне</button>
                                        <button className={activeTab === "tab2" ? "active" : ""}
                                                onClick={() => handleTabClick("tab2")} style={{color: "black"}}>Заказы</button>
                                    </>
                                )}
                            </div>

                            {user.role === "ROLE_CLIENT" &&
                                <div>
                                    <h2 className="orders-title">Заказы</h2>
                                    <div className="profile-select">
                                        <button className={activeTab === "tab1" ? "active" : ""}
                                                onClick={() => handleTabClick("tab1")} style={{color: "black"}}>Активные</button>
                                        <button className={activeTab === "tab2" ? "active" : ""}
                                                onClick={() => handleTabClick("tab2")} style={{color: "black"}}>Выполненные</button>
                                    </div>
                                </div>
                            }
                            <hr/>
                            {user.role === "ROLE_CLIENT" && activeTab === "tab1" &&
                                <div>
                                    {tasks && tasks
                                        .filter(task => !task.isCompleted)
                                        .map((task) => (
                                            <div key={task.id}>
                                                <TaskCard data={task} />
                                            </div>
                                        ))}
                                </div>
                            }
                            {user.role === "ROLE_CLIENT" && activeTab === "tab2" &&
                                <div>
                                    {tasks && tasks
                                        .filter(task => task.isCompleted)
                                        .map((task) => (
                                            <div key={task.id}>
                                                <TaskCard data={task} />
                                            </div>
                                        ))}
                                </div>
                            }

                            {user.role === "ROLE_MASTER" && activeTab === "tab1" && (
                                <div className="profile-about">
                                    <h3>Немного о себе</h3>
                                    <p>{user.description}</p>
                                    <h3>Виды выполняемых работ</h3>
                                    {user.categories &&
                                        <div>
                                            {user.categories.map((cat) =>
                                                <div key={cat}>
                                                    {cat}
                                                </div>
                                            )}
                                        </div>
                                    }
                                </div>
                            )}
                            {user.role === "ROLE_MASTER" && activeTab === "tab2" && (
                                <div>
                                    <h2>Выполненные</h2>
                                    <div style={{marginBottom: "40px"}}>
                                        {completedTasks[0] ? completedTasks.map(task => (
                                            <Link to={`/task/${task.id}`} key={task.id} style={{color: "black"}}>
                                                <TaskCard data={task} />
                                            </Link>
                                        )) : <h3>Задач пока нет.</h3>
                                        }
                                    </div>
                                    <h2>В процессе</h2>
                                    {uncompletedTasks[0] ? uncompletedTasks.map(task => (
                                        <Link to={`/task/${task.id}`} key={task.id} style={{color: "black"}}>
                                            <TaskCard data={task} />
                                        </Link>
                                    )) : <h3>Задач пока нет.</h3>
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
                        <h2>Отзывы</h2>
                        <div className="feedbacks">
                            {feedbacks ? feedbacks.map((fb) =>
                                <div className="profile-review-card">
                                    <p className="title">{fb.categoryName}</p>
                                    <p className="price">Стоимость работ: {fb.price}₽</p>
                                    <p className="text">Оценка: {fb.rate}</p>
                                    <p className="text">{fb.feedback}</p>
                                    <div className="master">
                                        Отзыв оставил(а): {fb.clientName}
                                    </div>
                                </div>
                            ): <p>Отзывов нет</p>}
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
