import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import "./TaskPage.css"
import {parseJwt} from "../../App.tsx";
import {OrangeButton} from "../../components/OrangeButton/OrangeButton.tsx";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

interface TaskType {
    id: number,
    userId: number,
    categoryId: number,
    categoryName: string,
    userName: string,
    description: string;
    startDate: string;
    endDate: string;
    masterId: number | null;
    masterEmail: string | null;
    masterPhoneNumber: string | null;
    masterName: string | null;
    clientEmail: string | null;
    clientPhoneNumber: string | null;
    clientName: string | null;
    isCompleted: boolean;
    feedback: string;
    rate: number
}

interface MasterType {
    id: number,
    dateStart: string;
    dateEnd: string;
    price: number;
    master: {
        id: number;
        firstName: string;
        lastName: string;
        rate: number;
    }
}

interface UserType {
    id: number,
    role: string
}

interface ResponseType {
    userId: number,
    taskId: number,
    price: number,
    dateStart: string | null,
    dateEnd: string | null
}

export function TaskPage(): React.JSX.Element {
    const params = useParams();
    const authToken = localStorage.getItem("authToken");
    const navigate = useNavigate()

    const [task, setTask] = useState<TaskType | null>(null);
    const [user, setUser] = useState<UserType | null>(null);
    const [response, setResponse] = useState<ResponseType>({userId: -1, taskId: -1, price: 0, dateStart: null, dateEnd: null})
    const [error, setError] = useState<string>("")
    const [masters, setMasters] = useState<MasterType[]>([])
    const [feedback, setFeedback] = useState({
        taskId: -1,
        rate: '',
        feedback: ''
    });

    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    const formatDate = (dateString: string | null) => {
        if (dateString === null) {
            return "Invalid date";
        }
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    };

    useEffect(() => {
        (async function () {
            if (authToken) {
                setUser(parseJwt(authToken))
            }

            try {
                const res = await fetch(`http://195.133.197.53:8081/tasks/${params.id}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                })
                let result = await res.json()
                console.log(result)
                setTask(result)
            } catch (error) {
                console.log(error)
            }
        })()
    }, []);

    useEffect(() => {
        (async function () {
            try {
                const res = await fetch(`http://195.133.197.53:8081/clients/bids/task/${params.id}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                })
                setMasters(await res.json())
            } catch (error) {
                console.log(error)
            }

        })()
    }, []);

    useEffect(() => {
        if (user && task) {
            setResponse(prev => ({
                ...prev,
                userId: user.id,
                taskId: task.id,
                price: response.price,
            }));
            setFeedback(prev => ({
                ...prev,
                taskId: task.id,
            }))
        }
    }, [user, task]);

    useEffect(() => {

        console.log(task)
    });

    const handlePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResponse({...response, [e.target.name]: parseInt(e.target.value, 10)});
    }

    const handleResponse = async (e: any) => {
        e.preventDefault()
        if (!response.dateStart || !response.dateEnd || !response.price) {
            setError("EmptyDate");
        } else if (response.dateEnd < response.dateStart) {
            setError("EndDateBeforeStartDate")
        } else {
            setError("")
            try {
                const res = await fetch("http://195.133.197.53:8081/masters/bid", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(response),
                })

                await res.json()
                navigate(-1)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleHire = async (id: number) => {
        try {
            const res = await fetch(`http://195.133.197.53:8081/clients/bid/${id}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (res.ok) {
                console.log(`Master with ID ${id} hired successfully.`);
                window.location.reload()
            } else {
                console.error(`Failed to hire master with ID ${id}`);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    const handleDone = async () => {
        try {
            const res = await fetch(`http://195.133.197.53:8081/tasks/${task?.id}/complete`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
            if (res.ok) {
                window.location.reload()
            } else {
                console.error(`Failed`);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleChangeFeedback = (event: any) => {
        const { name, value } = event.target;
        setFeedback({
            ...feedback,
            [name]: value
        });

        console.log(feedback)
    }

    const handleSubmitFeedback = async () => {
        try {
            const res = await fetch(`http://195.133.197.53:8081/tasks/feedback`, {
                method: "PATCH",
                body: JSON.stringify(feedback),
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            })
            if (res.ok) {
                window.location.reload()
            } else {
                console.error(`Failed`);
            }
        } catch (error) {
            console.log(error)
        }
    };


    const handleDelete = async () => {
        try {
            const response = await fetch(`http://195.133.197.53:8081/tasks/${task?.id}`, {
                credentials: "include",
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
            if (response.ok) {
                navigate(`/profile/${task?.userId}`)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="task-container common">
            <div style={{display: "flex", justifyContent: "space-between"}}>
                {<button onClick={() => navigate(-1)} className={"back-button"}>Назад</button>}
                {user && user.role === "ROLE_CLIENT" && user.id === task?.userId &&(
                    <span className="material-symbols-outlined" style={{color: "gray", fontSize: "30px"}} onClick={handleDelete}>delete</span>
                )}
            </div>
            {task && (
                <div className="task-details" onClick={() =>{}}>
                    <h1>{task.categoryName}</h1>
                    <h3>{task.description}</h3>
                    <h3>{task.userName}</h3>
                    <p>Начать {formatDate(task.startDate)}</p>
                    <p>Закончить {formatDate(task.endDate)}</p>
                </div>
            )}
            {user && user.role === "ROLE_MASTER" && task && !task.masterEmail &&(
                    <form className="response-form">
                        <label>Введите примерную стоимость ваших работ в рублях</label>
                        <input className="input-container" placeholder="Сумма" type="number" onChange={handlePrice} value={response.price} name="price"/>
                        <div style={{display: "flex", gap: "30px"}}>
                            <DatePicker
                                className="input-container"
                                selected={response.dateStart ? new Date(response.dateStart) : null}
                                onChange={date => setResponse(prev => ({
                                    ...prev,
                                    dateStart: date ? (date as Date).toISOString() : null
                                }))}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Выберите дату начала"
                                minDate={minDate}
                                maxDate={maxDate}
                            />
                            <DatePicker
                                className="input-container"
                                selected={response.dateEnd ? new Date(response.dateEnd) : null}
                                onChange={date => setResponse(prev => ({
                                    ...prev,
                                    dateEnd: date ? (date as Date).toISOString() : null
                                }))}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Выберите дату окончания"
                                minDate={minDate}
                                maxDate={maxDate}
                            />
                        </div>
                        <div className="error-container">
                            {error === "EmptyDate" && (
                                <p className="error-message">Заполните, пожалуйста, все поля</p>
                            )}
                            {error === "EndDateBeforeStartDate" && (
                                <p className="error-message">Дата окончания должна быть не раньше даты начала работ</p>
                            )}
                        </div>
                        <div className="response-button">
                            <OrangeButton text={"Откликнуться"} onClick={handleResponse}/>
                        </div>
                    </form>
            )}
            {user && user.role === "ROLE_CLIENT" && user.id === task?.userId && !task.masterEmail &&(
                <div className="responses">
                    <h1>Отклики</h1>
                    {!masters[0] && <p>Пока что откликов нет</p>}
                    {masters && masters.map((master) => (
                        <div className="master-card" key={master.id}>
                            <Link to={`/profile/${master.id}`}><p className="master-name">{master.master.firstName} {master.master.lastName}</p></Link>
                            {master.dateStart && <p className="master-date-start">Готов начать: {formatDate(master.dateStart)}</p>}
                            {master.dateStart && <p className="master-date-end">Дата окончания работ: {formatDate(master.dateEnd)}</p>}
                            <p className="master-price">Предполагаемая цена: {master.price}</p>
                            <p className="master-rate">Оценка мастера: {master.master.rate}</p>
                            <OrangeButton text={"Нанять"} onClick={() => handleHire(master.id)}/>
                        </div>
                    ))}
                </div>
            )}
            {user && user.id !== task?.userId && task && task.masterEmail && <h1>Исполнитель выбран</h1>}
            {user && user.role === "ROLE_MASTER" && task && task.masterId === user.id && !task.isCompleted &&
                <div>
                    <h1>Вы выбраны в качестве исполнителя</h1>
                    <h3>Заказчик <Link to={`/profile/${task.userId}`} style={{fontSize: "18px"}}>{task.clientName}</Link></h3>
                    <span>Контакты:</span>
                    <p>{task.clientEmail}</p>
                    <p>{task.clientPhoneNumber}</p>
                </div>
            }
            {user && user.role === "ROLE_MASTER" && task && task.masterId === user.id && task.isCompleted &&
                <div>
                    <h1>Задание выполнено</h1>
                    {task.rate &&
                        <div>
                            <h3>Оценка исполнителя</h3>
                            <p>{task.rate}</p>
                        </div>
                    }
                    {task.feedback &&
                        <div>
                            <h3>Отзыв исполнителя</h3>
                            <p>{task.feedback}</p>
                        </div>
                    }
                </div>
            }
            {user && user.role === "ROLE_CLIENT" && user.id === task?.userId && task.masterEmail &&(
                <div className="responses">
                    <h1>Исполнитель выбран</h1>
                    {task &&
                        <div>
                            <h3>Ваш исполнитель <Link to={`/profile/${task.masterId}`} style={{fontSize: "18px"}}>{task.masterName}</Link></h3>
                            <span>Контакты:</span>
                            <p>{task.masterEmail}</p>
                            <p>{task.masterPhoneNumber}</p>
                        </div>
                    }
                    {!task.isCompleted && !task.feedback &&
                        <div>
                            <p>Если задание выполнено, нажмите на кнопку</p>
                            <OrangeButton text={"Задание выполнено"} onClick={handleDone}/>
                        </div>
                    }
                    {task.isCompleted && !task.feedback &&
                        <div>
                            <label>Ваша оценка:</label>
                            <select name="rate" value={feedback.rate} onChange={handleChangeFeedback}>
                                <option value="">Выберите оценку</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>

                            <label>Отзыв:</label>
                            <input
                                name="feedback"
                                placeholder="Напишите, пожалуйста, пару слов об исполнителе"
                                value={feedback.feedback}
                                onChange={handleChangeFeedback}
                            />
                            <OrangeButton text={"Отправить отзыв"} onClick={handleSubmitFeedback}/>
                        </div>
                    }
                    {task.feedback &&
                        <h2>Спасибо за отзыв!</h2>
                    }
                </div>
            )}
        </div>
    )
}
