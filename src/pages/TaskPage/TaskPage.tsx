import {useNavigate, useParams} from "react-router-dom";
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
    // customer: string,
    description: string;
    startDate: string;
    endDate: string
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
                const res = await fetch(`http://localhost:8081/clients/bids/task/${params.id}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                })
                let result = await res.json()
                console.log(result)
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
        }
    }, [user, task]);

    useEffect(() => {
        console.log(response)
    });

    const handlePrice = (e: any) => {
        setResponse({...response, [e.target.name]: e.target.value})
    }

    const handleResponse = async (e: any) => {
        e.preventDefault()
        try {
            await fetch("http://195.133.197.53:8081/masters/bid", {
                method: "POST",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(response),
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="task-container common">
            {<button onClick={() => navigate(-1)}>bach</button>}
            {task &&
                <div>
                    <h1>{task.categoryName}</h1>
                    <h3>{task.description}</h3>
                    <p>Начать {formatDate(task.startDate)}</p>
                    <p>Закончить {formatDate(task.endDate)}</p>
                </div>
            }
            {
                user && user.role === "ROLE_MASTER" &&
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
                        <div className="response-button">
                            <OrangeButton text={"Откликнуться"} onClick={handleResponse}/>
                        </div>
                    </form>
            }
            {
                user && user.role === "ROLE_CLIENT" && user.id === task?.userId &&
                <div>
                    <h1>Отклики</h1>
                    <p>Пока что отклиов нет</p>
                </div>

            }
        </div>
    )
}
