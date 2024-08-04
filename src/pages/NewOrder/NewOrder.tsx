import React, {forwardRef, useEffect, useState} from "react";
import {OrangeButton} from "../../components/OrangeButton/OrangeButton.tsx";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {parseJwt} from "../../App.tsx";


interface CategoryType {
    id: number,
    name: string
}

interface DataType {
    userId: number;
    categoryName: string;
    startDate: string | null;
    endDate: string | null;
    description: string;
    maxPrice: number
}

export function NewOrder() {
    const [step, setStep] = useState<number>(1)
    const [data, setData] = useState<DataType>(
        {userId: -1, categoryName: "", startDate: null, endDate: null, description: "", maxPrice: 0})
    const [categories, setCategories] = useState<CategoryType[]>()
    const [error, setError] = useState('')

    const minDate = new Date();

    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        if (authToken !== null) {
            setData(prevData => ({
                ...prevData,
                userId: parseJwt(authToken).id
            }));
        }
        (async function () {
            try {
                const response = await fetch("http://195.133.197.53:8081/categories", {
                    method: "GET",
                    credentials: "include"
                })
                let result = await response.json()
                setCategories(result)
            } catch (error) {
                console.log(error)
            }
        })()
    }, []);

    const fetchTask = async () => {
        try {
            await fetch("http://195.133.197.53:8081/tasks/", {
                credentials: "include",
                method: "POST",
                body: JSON.stringify(data),
                headers: {'Content-Type': 'application/json'}
            })
        } catch (e) {
            console.log(error)
        }

    }

    useEffect(() => {
        console.log(data)
    });

    const handleNext = (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if (step === 1) {
            if (!data.categoryName) {
                setError("EmptyCategory");
            } else {
                setError("");
                setStep(prevState => prevState + 1);
            }
        }
        if (step === 2) {
            if (!data.startDate || !data.endDate) {
                setError("EmptyDate");
            } else if (data.endDate < data.startDate) {
                setError("EndDateBeforeStartDate")}
            else {
                setError("");
                setStep(prevState => prevState + 1);
            }
        }
        if (step === 3) {
            if (!data.description) {
                setError("EmptyDescription");
            } else {
                setError("");
                setStep(prevState => prevState + 1);
            }
        }
        if (step === 4) {
            if (!data.maxPrice || +data.maxPrice < 500) {
                setError("EmptyPrice");
            } else {
                setError("");
                setStep(prevState => prevState + 1);
            }
        }
        if (step === 5) {
            (async () => {
                await fetchTask();
                window.location.hash = (`/profile/${data.userId}`);
                window.location.reload()
            })();
        }
        // setStep(prevState => prevState + 1)
    }

    const handleBack = (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        setStep(prevState => prevState - 1)
    }

    const buttonStyle = (step === 1) ? {width: "100vw"} : {};

    const handleCategoryClick = (category: string) => {
        if (data.categoryName === category) {
            setData(prevData => ({
                ...prevData,
                categoryName: ""
            }));
        } else {
            setData(prevData => ({
                ...prevData,
                categoryName: category
            }));
        }
    };

    const handleCategoryRemove = () => {
        setData(prevData => ({
            ...prevData,
            categoryName: ""
        }));
    };

    const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setData({...data, [e.target.name]: e.target.value})
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Дата не выбрана';
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    };

    return (
        <form className="registration-form">
            {step === 1 &&
                <div className="steps">
                    <h1>Какие услуги вам нужны?</h1>
                    <label>Название</label>
                    <div className="input-container">
                        {data.categoryName && (
                            <span className="selected-service">
                            {data.categoryName}
                                <button type="button" onClick={handleCategoryRemove} style={{color: "black", marginLeft: "8px", marginTop: "2px"}}>x</button>
                        </span>
                        )}
                    </div>
                    <div style={{ margin: '10px 0' }}>
                        {categories && categories.map(category => (
                            <button
                                type="button"
                                key={category.name}
                                onClick={() => handleCategoryClick(category.name)}
                                style={{
                                    margin: '5px',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    background: data.categoryName === category.name ? '#ddd' : '#fff',
                                    color: "black"
                                }}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                    <div className="error-container">
                        {error === "EmptyCategory" && (
                            <p className="error-message">Выберите, пожалуйста, категорию</p>
                        )}
                    </div>
                </div>
            }
            {step === 2 &&
                <div className="steps">
                    <h1>Когда нужно приступить к работе?</h1>
                    <label>Укажите дату начала работ и ориентировочные сроки выполнения работ.</label>
                    <div style={{display: "flex", gap: "30px", flexDirection: 'column'}}>
                        <DatePicker
                            className="input-container"
                            selected={data.startDate ? new Date(data.startDate) : null}
                            onChange={date => setData(prevData => ({
                                ...prevData,
                                startDate: date ? (date as Date).toISOString() : null
                            }))}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Выберите дату начала"
                            minDate={minDate}
                            maxDate={maxDate}
                            customInput={<CustomInput />}
                        />
                        <DatePicker
                            className="input-container"
                            selected={data.endDate ? new Date(data.endDate) : null}
                            onChange={date => setData(prevData => ({
                                ...prevData,
                                endDate: date ? (date as Date).toISOString() : null
                            }))}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Выберите дату окончания"
                            minDate={minDate}
                            maxDate={maxDate}
                            customInput={<SecCustomInput />}
                        />
                    </div>

                    <div className="error-container">
                        {error === "EmptyDate" && (
                            <p className="error-message">Выберите, пожалуйста, дату</p>
                        )}
                        {error === "EndDateBeforeStartDate" && (
                            <p className="error-message">Дата окончания должна быть не раньше даты начала работ</p>
                        )}
                    </div>
                </div>
            }
            {step === 3 &&
                <div className="steps">
                    <h1>Опишите задание, уточните детали</h1>
                    <label>Опишите задание для более точного и быстрого ответа исполнителей</label>
                    <textarea name="description" value={data.description} onChange={handleChangeDescription}
                              placeholder={"Например, необходимо установить межкомнатные двери, 4 шт."}/>
                    <div className="error-container">
                        {error === "EmptyDescription" &&
                            <p className="error-message">Напишите, пожалуйста, описание</p>
                        }
                    </div>
                </div>
            }
            {step === 4 &&
                <div className="steps">
                    <h1>Укажите максимальную стоимость</h1>
                    <label>Максимальная сумма, которую вы готовы заплатить за выполнение задания. Исполнители не смогут предложить цену, превышающую указанную сумму.</label>
                    <input className="input-container" placeholder="Сумма" type="number" onChange={handleChangeDescription} value={data.maxPrice} name="maxPrice"/>
                    <div className="error-container">
                        {error === "EmptyPrice" &&
                            <p className="error-message">Заполните, пожалуйста, поле. Сумма должна быть не менее 500 рублей.</p>
                        }
                    </div>
                </div>
            }
            {step === 5 &&
                <div className="steps">
                    <h1>{data.categoryName}</h1>
                    <p style={{margin: "20px 0 0"}}>{data.description}</p>
                    <p style={{margin: "10px 0 20px"}}>Макимальная цена: {data.maxPrice}</p>
                    {data.startDate &&
                        <p>Начать {formatDate(data.startDate)}</p>
                    }
                    {data.endDate &&
                        <p style={{marginBottom: '20px'}}>Закончить {formatDate(data.endDate)}</p>
                    }
                </div>
            }

            <div className="buttons">
                {
                    step > 1 &&
                    <div className="back-button">
                        <OrangeButton text={"Назад"} onClick={handleBack}/>
                    </div>
                }

                {step < 5 &&
                    <div className="next-button" style={buttonStyle}>
                        <OrangeButton text={"Далее"} onClick={handleNext}/>
                    </div>
                }

                {step === 5 &&
                    <div className="next-button" style={buttonStyle}>
                        <OrangeButton text={"Завершить"} onClick={handleNext}/>
                    </div>
                }
            </div>
        </form>
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
