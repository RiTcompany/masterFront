import {Link, useNavigate, useParams} from "react-router-dom";
import React, {forwardRef, useEffect, useState} from "react";
import "./TaskPage.css"
import {parseJwt} from "../../App.tsx";
import {OrangeButton} from "../../components/OrangeButton/OrangeButton.tsx";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import {ru} from 'date-fns/locale/ru';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('ru', ru);
setDefaultLocale('ru');

interface TaskType {
    id: number,
    userId: number,
    categoryId: number,
    categoryName: string,
    userName: string,
    description: string;
    startDate: string;
    endDate: string;
    maxPrice: number;
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
        firstName: string;
        lastName: string;
        rate: number;
        user: {
            id: number
        }
    };
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
                const res = await fetch(`https://spb-masters.ru/tasks/${params.id}`, {
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
                const res = await fetch(`https://spb-masters.ru/clients/bids/task/${params.id}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                })
                setMasters(await res.json())
                console.log(masters)
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
        }
        // else if (task?.maxPrice && response.price > task?.maxPrice) {
        //     setError("TooBigPrice")}
        else {
            setError("")
            try {
                const res = await fetch("https://spb-masters.ru/masters/bid", {
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
            const res = await fetch(`https://spb-masters.ru/clients/bid/${id}`, {
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
            const res = await fetch(`https://spb-masters.ru/tasks/${task?.id}/complete`, {
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
            const res = await fetch(`https://spb-masters.ru/tasks/feedback`, {
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
            const response = await fetch(`https://spb-masters.ru/tasks/${task?.id}`, {
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
                    <p>Начать {task.startDate && formatDate(task.startDate)}</p>
                    <p>Закончить {task.endDate && formatDate(task.endDate)}</p>
                </div>
            )}
            {user && user.role === "ROLE_MASTER" && task && !task.masterEmail &&(
                    <form className="response-form">
                        <label>Введите примерную стоимость ваших работ в рублях</label>
                        <input className="input-container" placeholder="Сумма" type="number" onChange={handlePrice} value={response.price} name="price"/>
                        <div style={{display: "flex", gap: "30px", flexDirection: "column"}}>
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
                                locale="ru"
                                customInput={<CustomInput />}
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
                                locale="ru"
                                customInput={<SecCustomInput />
                            }
                            />
                        </div>
                        <div className="error-container">
                            {error === "EmptyDate" && (
                                <p className="error-message">Заполните, пожалуйста, все поля</p>
                            )}
                            {error === "EndDateBeforeStartDate" && (
                                <p className="error-message">Дата окончания должна быть не раньше даты начала работ</p>
                            )}
                            {/*{error === "TooBigPrice" && (*/}
                            {/*    <p className="error-message">Ваша цена не может быть больше указанной в заказе</p>*/}
                            {/*)}*/}
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
                        <div className="master-card" key={master.master.user.id}>
                            <Link to={`/profile/${master.master.user.id}`}><p className="master-name">{master.master.firstName} {master.master.lastName}</p></Link>
                            {master.dateStart && <p className="master-date-start">Готов начать: {formatDate(master.dateStart)}</p>}
                            {master.dateStart && <p className="master-date-end">Дата окончания работ: {formatDate(master.dateEnd)}</p>}
                            <p className="master-price">Предполагаемая цена: {master.price}</p>
                            <p className="master-rate">Оценка мастера: {master.master.rate}</p>
                            <div className="response-button" style={{marginTop: '20px'}}>
                                <OrangeButton text={"Нанять"} onClick={() => handleHire(master.id)}/>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {user && user.id !== task?.userId && task && task.masterEmail && <h1>Исполнитель выбран</h1>}
            {user && user.role === "ROLE_MASTER" && task && task.masterId === user.id && !task.isCompleted &&
                <div>
                    <h1>Вы выбраны в качестве исполнителя</h1>
                    <h3 style={{marginBottom: '10px'}}>Заказчик <Link to={`/profile/${task.userId}`} style={{fontSize: "18px"}}>{task.clientName}</Link></h3>
                    <span style={{fontSize: '18px'}}>Контакты:</span>
                    <p>{task.clientEmail}</p>
                    <p>{task.clientPhoneNumber}</p>
                </div>
            }
            {user && user.role === "ROLE_MASTER" && task && task.masterId === user.id && task.isCompleted &&
                <div>
                    <h2 style={{margin: "15px 0"}}>Задание выполнено</h2>
                    {task.rate &&
                        <div>
                            <h3>Оценка исполнителя: {task.rate}</h3>
                        </div>
                    }
                    {task.feedback &&
                        <div>
                            <h3>Отзыв исполнителя: <span style={{fontWeight:"400"}}>{task.feedback}</span></h3>
                        </div>
                    }
                </div>
            }
            {user && user.role === "ROLE_CLIENT" && user.id === task?.userId && task.masterEmail &&(
                <div className="responses">
                    <h1>Исполнитель выбран</h1>
                    {task &&
                        <div>
                            <h3 style={{marginBottom: '10px'}}>Ваш исполнитель <Link to={`/profile/${task.masterId}`} style={{fontSize: "18px"}}>{task.masterName}</Link></h3>
                            <span style={{fontSize: '18px'}}>Контакты:</span>
                            <p>{task.masterEmail}</p>
                            <p>{task.masterPhoneNumber}</p>
                        </div>
                    }
                    {!task.isCompleted && !task.feedback &&
                        <div>
                            <p style={{margin: '15px 0'}}>Если задание выполнено, нажмите на кнопку</p>
                            <div className="response-button" style={{marginTop: '20px'}}>
                                <OrangeButton text={"Задание выполнено"} onClick={handleDone}/>
                            </div>
                        </div>
                    }
                    {task.isCompleted && !task.feedback &&
                        <div style={{display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px"}}>
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
                            <textarea
                                name="feedback"
                                placeholder="Напишите, пожалуйста, пару слов об исполнителе"
                                value={feedback.feedback}
                                onChange={handleChangeFeedback}
                                style={{height: "100px"}}
                            />
                            <div className="response-button" style={{marginTop: '20px'}}>
                                <OrangeButton text={"Отправить отзыв"} onClick={handleSubmitFeedback}/>
                            </div>
                        </div>
                    }
                    {task.feedback &&
                        <h2 style={{marginTop: '15px'}}>Спасибо за отзыв!</h2>
                    }
                </div>
            )}
        </div>
    )
}

interface CustomInputProps {
    value?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(({ value, onClick }, ref) => (
    <button
        className="input-container"
        style={{ backgroundColor: 'white', color: 'black', width: "200px" }}
        onClick={(e) => { e.preventDefault(); onClick?.(e); }}
        ref={ref as React.RefObject<HTMLButtonElement>}
    >
        {value || "Выберите дату начала"}
    </button>
));

const SecCustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(({ value, onClick }, ref) => (
    <button className="input-container"
            style={{backgroundColor: 'white', color: 'black', width: "200px"}}
            onClick={(e) => { e.preventDefault(); onClick?.(e); }}
            ref={ref}>
        {value || "Выберите дату окончания"}
    </button>
));
