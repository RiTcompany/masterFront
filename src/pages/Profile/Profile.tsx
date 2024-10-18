import React, {useEffect, useRef, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import "./Profile.css";
import {TaskCard} from "../../components/TaskCard/TaskCard.tsx";
import {OrangeButton} from "../../components/OrangeButton/OrangeButton.tsx";
import Select, {CSSObjectWithLabel, MultiValue} from "react-select";

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
    telegramTag: string,
    userId: number,
    firstName: string,
    age?: number,
    metroStation?: string[],
    rate?: number,
    description?: string,
    documents?: string[],
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
    id: number,
    rate: number,
    feedback: string,
    price: number,
    categoryName: string,
    clientName: string
}

interface ProfileProps {
    authUserId: number
}

interface OptionType {
    value: string;
    label: string;
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
    const [metro, setMetro] = useState([]);
    const [categories, setCategories] = useState<{id: number, name: string}[]>([])
    const [changeInfoClient, setChangeInfoClient] = useState({email: "", phoneNumber: "", telegramTag: ""})
    const [changeInfoMaster, setChangeInfoMaster] = useState({email: "", phoneNumber: "", telegramTag: "", description: "", metroStation: [""], categories: [""]})
    const [error, setError] = useState("")

    const metroStationOptions = (user?.metroStation ?? []).map(station => ({
        value: station,
        label: station
    }));

    useEffect(() => {
        if (!isMounted.current) {
            return;
        }

        (async function() {
            try {
                if (!authToken) {
                    throw new Error("Auth token not found in localStorage");
                }

                const response = await fetch(`http://89.23.117.193:80/profiles/${userId}`, {
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
                console.log(user)
                setIsMyProfile(+userData.userId === +authUserId);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingProfile(false);
            }
        })()
    }, [userId, authUserId, authToken]);

    useEffect(() => {
        if (user && user.role === "ROLE_CLIENT") {
            setChangeInfoClient({phoneNumber: user.phoneNumber, telegramTag: user.telegramTag, email: user.email})
        } else if (user && user.role === "ROLE_MASTER") {
            setChangeInfoMaster({phoneNumber: user.phoneNumber, telegramTag: user.telegramTag, email: user.email,
                description: user.description || "", metroStation: user.metroStation || [], categories: user.categories || []})
            console.log(changeInfoMaster)
        }
    }, [user]);

    useEffect(() => {
        (
           async function ()  {
               if (user?.role === "ROLE_CLIENT") {
                   try {
                       const response = await fetch(`http://89.23.117.193:80/tasks/client/${userId}`, {
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
                        const response = await fetch(`http://89.23.117.193:80/tasks/master/${userId}`, {
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
        if (tasks && tasks.length > 0) {
            setCompletedTasks(tasks.filter(task => task.isCompleted))
            setUncompletedTasks(tasks.filter(task => !task.isCompleted))
        }

    }, [tasks]);

    useEffect(() => {
        (
            async function ()  {
                if (user?.role === "ROLE_MASTER") {
                    try {
                        const response = await fetch(`http://89.23.117.193:80/masters/${userId}/feedbacks`, {
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
                    const response = await fetch(`http://89.23.117.193:80/masters/${userId}/photo`, {
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
                const response = await fetch("http://89.23.117.193:80/masters/photo", {
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

    useEffect(() => {
        (async function () {
            try {
                const response = await fetch("http://89.23.117.193:80/masters/metro-stations", {
                    method: "GET",
                    credentials: "include"
                })
                let result = await response.json()
                setMetro(result)
            } catch (error) {
                console.log(error)
            }
        })()
    }, []);

    useEffect(() => {
        (async function () {
            try {
                const response = await fetch("http://89.23.117.193:80/categories", {
                    method: "GET",
                    credentials: "include"
                })
                let result = await response.json()
                // console.log(response)
                setCategories(result)
                console.log(categories)
            } catch (error) {
                console.log(error)
            }
        })()
    }, []);

    const handleServiceClick = (categoryName: string) => {
        setChangeInfoMaster(prevData => {
            const newCategories = prevData.categories.includes(categoryName)
                ? prevData.categories
                : [...(prevData.categories), categoryName];

            return { ...prevData, categories: newCategories };
        });
    };

    const handleServiceRemove = (categoryName: string) => {
        setChangeInfoMaster(prevData => {
            const newCategories = prevData.categories.filter(cat => cat !== categoryName);

            return { ...prevData, categories: newCategories };
        });
    };

    const handleChangeClient = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setChangeInfoClient({...changeInfoClient, [e.target.name]: e.target.value})
    }

    const handleChangeMaster = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setChangeInfoMaster({...changeInfoMaster, [e.target.name]: e.target.value})
    }

    const metroOptions: OptionType[] = metro.map(station => ({ value: station, label: station }));
    const allOption: OptionType = { value: 'ALL', label: 'Выбрать все' };
    const options: OptionType[] = [allOption, ...metroOptions];

    // const selectedValues: OptionType[] = user?.metroStation?.length === metro.length ? [allOption, ...metroOptions] : metroOptions.filter((option: OptionType) => user?.metroStation?.includes(option.value));

    const [selectedStations, setSelectedStations] = useState<string[]>([]);
    useEffect(() => {
        user?.metroStation && setSelectedStations(user?.metroStation)
    }, [activeTab])

    const handleMultiSelectChange = (selectedOptions: MultiValue<OptionType>) => {
        let values: string[] = [];

        if (selectedOptions.some(option => option.value === 'ALL')) {
            values = metro.map(station => station);
        } else {
            values = selectedOptions.map(option => option.value);
        }

        setSelectedStations(values);

        handleChangeMaster({
            target: {
                name: 'metroStation',
                value: values
            }
        } as unknown as React.ChangeEvent<HTMLInputElement>);
    };



    const submitClientChanges = async (e: any) => {
        e.preventDefault();
        if (!changeInfoClient.phoneNumber) {
            setError("EmptyPhoneError")
        } else if (!changeInfoClient.email) {
            setError("EmptyPhoneError")
        } else {
            setError("")
        }
        try {
            console.log(changeInfoClient)
            const response = await fetch(`http://89.23.117.193:80/profiles/${user?.userId}/change`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,},
                body: JSON.stringify(changeInfoClient)
                })
            if (response.ok) {
                window.location.reload()
            }
            console.log(await response.json())
        } catch (error) {
            console.log(error)
        }
    }

    const submitMasterChanges = async (e: any) => {
        e.preventDefault();
        if (!changeInfoMaster.phoneNumber) {
            setError("EmptyPhoneError")
        } else if (!changeInfoMaster.email) {
            setError("EmptyEmailError")
        } else if (!changeInfoMaster.metroStation) {
            setError("EmptyMetroError")
        } else if (changeInfoMaster.categories.length === 0) {
            setError("EmptyCategoriesError")
        } else if (!changeInfoMaster.description) {
            setError("EmptyDescriptionError")
        } else {
            setError("")
        }
        try {
            console.log(changeInfoMaster)
            const response = await fetch(`http://89.23.117.193:80/profiles/${user?.userId}/change`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,},
                body: JSON.stringify(changeInfoMaster)
            })
            if (response.ok) {
                window.location.reload()
            }
            console.log(await response.json())
        } catch (error) {
            console.log(error)
        }
    }


    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    if (loadingProfile) {
        return <div>Загрузка...</div>;
    }

    if (!user || !user.role) {
        return <p>Вы не авторизованы</p>;
    }

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
                                    {
                                        user.metroStation &&
                                        <p>Метро:
                                            <Select
                                                name="metroStations"
                                                value={user.metroStation && user.metroStation.length > 0 ? { value: user.metroStation[0], label: user.metroStation[0] } : null}
                                                onChange={() => {}}
                                                options={metroStationOptions}
                                                styles={{ control: (base: CSSObjectWithLabel) => ({ ...base, color: 'black', cursor: 'not-allowed', }) }}
                                            />
                                        </p>
                                    }
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
                                        {isMyProfile &&
                                            <button className={activeTab === "tab3" ? "active" : "settings"} onClick={() => handleTabClick("tab3")} >
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={activeTab === "tab3" ? "#000000" : "#B7B7B7"}>
                                                    <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
                                                </svg>
                                            </button>
                                        }
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
                                        {isMyProfile &&
                                            <button className={activeTab === "tab3" ? "active" : "settings"} onClick={() => handleTabClick("tab3")} >
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={activeTab === "tab3" ? "#000000" : "#B7B7B7"}>
                                                    <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
                                                </svg>
                                            </button>
                                        }
                                    </div>
                                </div>
                            }
                            <hr/>
                            {user.role === "ROLE_CLIENT" && activeTab === "tab1" &&
                                <div>
                                    {uncompletedTasks.length > 0 ? uncompletedTasks
                                        .map((task) => (
                                            <div key={task.id}>
                                                <TaskCard data={task} />
                                            </div>
                                        )) : <h4>Заказов нет</h4>}
                                </div>
                            }
                            {user.role === "ROLE_CLIENT" && activeTab === "tab2" &&
                                <div>
                                    {completedTasks.length > 0 ? completedTasks
                                        .map((task) => (
                                            <div key={task.id}>
                                                <TaskCard data={task} />
                                            </div>
                                        )) : <h4>Заказов нет</h4>}
                                </div>
                            }
                            {user.role === "ROLE_CLIENT" && activeTab === "tab3" &&
                                <div>
                                    <h3 style={{marginBottom: "30px"}}>Редактирование профиля</h3>

                                    <label>Email</label>
                                    <input name="email" className="input-container change-info" value={changeInfoClient.email}
                                            onChange={handleChangeClient}/>
                                    <label>Телефон</label>
                                    <input name="phoneNumber" className="input-container change-info" value={changeInfoClient.phoneNumber}
                                           onChange={handleChangeClient}/>
                                    <label>Телеграм</label>
                                    <input name="telegramTag" className="input-container change-info"
                                           value={changeInfoClient.telegramTag ? changeInfoClient.telegramTag : ""}
                                           onChange={handleChangeClient}/>
                                    <div className="error-container">
                                        {error === "EmptyEmailError" &&
                                            <p className="error-message">Поле email не должно быть пустым</p>
                                        }
                                        {error === "EmptyPhoneError" &&
                                            <p className="error-message">Поле номера телефона не должно быть пустым</p>
                                        }
                                    </div>
                                    <div style={{width: "200px", height: "45px"}}>
                                        <OrangeButton text="Сохранить" onClick={submitClientChanges}/>
                                    </div>
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
                            {user.role === "ROLE_MASTER" && activeTab === "tab3" &&
                                <div>
                                    <h3 style={{marginBottom: "30px"}}>Редактирование профиля</h3>

                                    <label>Email</label>
                                    <input name="email" className="input-container change-info" value={changeInfoMaster.email}
                                           onChange={handleChangeMaster}/>
                                    <label>Телефон</label>
                                    <input name="phoneNumber" className="input-container change-info" value={changeInfoMaster.phoneNumber}
                                           onChange={handleChangeMaster}/>
                                    <label>Телеграм</label>
                                    <input name="telegramTag" className="input-container change-info"
                                           value={changeInfoMaster.telegramTag ? changeInfoMaster.telegramTag : ""}
                                           onChange={handleChangeMaster}/>
                                    <label>Категории</label>
                                    <div className="input-container change-info">
                                        {changeInfoMaster.categories.map(category => (
                                            <span key={category} className="selected-service">
                                                {category}
                                                <button type="button" onClick={() => handleServiceRemove(category)} style={{marginLeft: "8px", color: "black"}}>x</button>
                                            </span>
                                        ))}
                                    </div>
                                    <div style={{margin: '0 0 30px'}}>
                                        {categories && categories.map(category => (
                                            <button
                                                type="button"
                                                key={category.name}
                                                onClick={() => handleServiceClick(category.name)}
                                                style={{
                                                    color: 'black',
                                                    margin: '5px',
                                                    padding: '10px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '5px',
                                                    background: changeInfoMaster.categories.includes(category.name) ? '#ddd' : '#fff'
                                                }}
                                            >
                                                {category.name}
                                            </button>
                                        ))}
                                    </div>
                                    <label>Описание</label>
                                    <textarea name="description" className="input-container change-info" style={{height: "100px"}}
                                           value={changeInfoMaster.description ? changeInfoMaster.description : ""}
                                           onChange={handleChangeMaster}/>
                                    <label>Метро</label>
                                    {/*<select name="metroStation" value={changeInfoMaster.metroStation} className="input-container change-info"*/}
                                    {/*        onChange={handleChangeMaster} style={{color: "black"}}>*/}
                                    {/*    <option/>*/}
                                    {/*    {metro && metro.map((metro) => (*/}
                                    {/*        <option key={metro}>{metro}</option>*/}
                                    {/*    ))}*/}
                                    {/*</select>*/}
                                    <Select
                                        name="metroStation"
                                        value={metroOptions.filter((option: OptionType) => selectedStations.includes(option.value))}
                                        onChange={handleMultiSelectChange}
                                        options={options}
                                        isMulti
                                        styles={{ control: (base: CSSObjectWithLabel) => ({ ...base, color: 'black' }) }}
                                    />
                                    <div className="error-container">
                                        {error === "EmptyEmailError" &&
                                            <p className="error-message">Поле email не должно быть пустым</p>
                                        }
                                        {error === "EmptyPhoneError" &&
                                            <p className="error-message">Поле номера телефона не должно быть пустым</p>
                                        }
                                        {error === "EmptyCategoriesError" &&
                                            <p className="error-message">Поле категорий не должно быть пустым</p>
                                        }
                                        {error === "EmptyMetroError" &&
                                            <p className="error-message">Поле метро не должно быть пустым</p>
                                        }
                                        {error === "EmptyDescriptionError" &&
                                            <p className="error-message">Поле описания не должно быть пустым</p>
                                        }
                                    </div>
                                    <div style={{width: "200px", height: "45px"}}>
                                        <OrangeButton text="Сохранить" onClick={submitMasterChanges}/>
                                    </div>
                                </div>
                            }
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
                                        {user.documents && user.documents.length > 0 ? (
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
                                    {userId && authUserId && +userId === authUserId ?
                                        <p>{user.phoneNumber}</p> : <p>Скрыт</p>
                                    }
                                </div>
                            </div>
                            <div className="contacts">
                                <img src="/email-icon.png" alt="email-icon"/>
                                <div className="contact-text">
                                    <strong>Email</strong>
                                    {userId && authUserId && +userId === authUserId ?
                                        <p>{user.email}</p> : <p>Скрыт</p>
                                    }
                                </div>
                            </div>
                            <div className="contacts">
                                <img src="/tg-icon.png" alt="tg-icon"/>
                                <div className="contact-text">
                                    <strong>Телеграм</strong>
                                    {userId && authUserId && user.telegramTag && +userId === authUserId ?
                                        <p>{user.telegramTag}</p> : userId && authUserId && !user.telegramTag ?
                                            <p>Не указан</p>
                                        : <p>Скрыт</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {user.role === "ROLE_MASTER" &&
                    <div className="profile-bottom">
                        <h2>Отзывы</h2>
                        <div className="feedbacks">
                            {feedbacks && feedbacks.length > 0 ? feedbacks.map((fb) =>
                                <div className="profile-review-card" key={fb.id}>
                                    <p className="title">{fb.categoryName}</p>
                                    <p className="price">Стоимость работ: {fb.price}₽</p>
                                    <p className="text">Оценка: {fb.rate}</p>
                                    <p className="text">{fb.feedback}</p>
                                    <div className="master">
                                        Отзыв оставил(а): {fb.clientName}
                                    </div>
                                </div>
                            ): <h4 style={{marginBottom: "100px"}}>Отзывов нет</h4>}
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
