import React, {useEffect, useRef, useState} from "react";
// import {useNavigate} from "react-router-dom";
import "./Registration.css"
import {OrangeButton} from "../../components/OrangeButton/OrangeButton.tsx";

interface DocumentType {
    url: string;
}

interface DataType {
    lastName?: string,
    firstName: string,
    middleName?: string,
    email: string,
    phoneNumber: string,
    role: string,
    photoLink?: string,
    documents?: DocumentType[],
    description: string,
    metroStation: string,
    password: string,
    categories?: string[]
}

interface CategoryType {
    id: number,
    name: string
}

export function Registration(): React.JSX.Element {
    // const navigate = useNavigate();

    const [step, setStep] = useState<number>(1);
    const [error, setError] = useState<string>("")
    const [data, setData] = useState<DataType>({
        email: '',
        firstName: '',
        middleName: '',
        lastName: '',
        phoneNumber:'',
        password: '',
        role: '',
        photoLink: '',
        metroStation: '',
        documents: [],
        description: '',
        categories: []
    });
    const [agreement, setAgreement] = useState<boolean>(false)

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const [repeatPassword, setRepeatPassword] = useState<string>("")
    const [metro, setMetro] = useState<string[]>([])
    const [categories, setCategories] = useState<CategoryType[]>([])

    const photoInputRef = useRef<HTMLInputElement>(null);
    const documentInputRef = useRef<HTMLInputElement>(null);

    const buttonStyle = (step === 1 || step > 5) ? {width: "100vw"} : {};

    useEffect(() => {
        (async function () {
            try {
                const response = await fetch("http://195.133.197.53:8081/masters/metro-stations", {
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
                const response = await fetch("http://195.133.197.53:8081/categories", {
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

    // useEffect(() => {
    //     console.log(data)
    // }, [data])

    const isPasswordValid = (password: string): boolean => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasMinimumLength = password.length >= 8;
        const hasValidSymbols = /^[A-Za-z0-9!.,?:;@&]*$/.test(password);
        return hasUpperCase && hasLowerCase && hasNumber && hasMinimumLength && hasValidSymbols;
    }

    function parseJwt(token: string) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Invalid token:', error);
            return null;
        }
    }

    const handleSubmit = async () => {
        setError("");
        if (data.password !== repeatPassword) {
            setError("MismatchedPasswords");
            return
        }
        if (!isPasswordValid(data.password)) {
            setError("WrongPassword");
            return
        }

        try {
            const response = await fetch("http://195.133.197.53:8081/auth/sign-up", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: "include",
            })

            if (response.ok) {
                const responseData = await response.json();
                console.log('Sign-up successful:', responseData);

                localStorage.setItem('authToken', responseData.token);

                const decodedToken = parseJwt(responseData.token);
                console.log(decodedToken)

                window.location.replace(`/profile/${decodedToken.id}`)
            } else {
                console.error('Sign-up failed:', response.statusText);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const next = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (step === 1) {
            if (!data.role) {
                setError("EmptyRoleError")
            } else {
                setError("")
                setStep(prevState => prevState + 1)
            }
        } else if (step === 2) {
            if (!agreement || !data.email || !data.firstName || (data.role === "ROLE_MASTER" && (!data.lastName))) {
                setError("EmptyNameError")
            } else {
                setError("")
                setStep(prevState => prevState + 1)
            }
        } else if (step === 3) {
            if (!data.phoneNumber) {
                setError("EmptyPhoneError");
            } else {
                setError("");
                if (data.role === "ROLE_MASTER") {
                    setStep(prevState => prevState + 1)
                } else if (data.role === "ROLE_CLIENT") {
                    setStep(prevState => prevState + 5)
                }
            }
        } else if (step === 4) {
            if (!selectedCategories[0]) {
                setError("EmptyCategories")
            } else {
                setError("");
                setStep(prevState => prevState + 1)
            }
        } else if (step === 5) {
            if (!data.metroStation) {
                setError("EmptyMetroError")
            } else {
                setError("");
                setStep(prevState => prevState + 1)
            }
        } else if (step === 6) {
            if (!data.description) {
                setError("EmptyDescriptionError")
            } else {
                setError("");
                setStep(prevState => prevState + 1)
            }
        } else if (step === 10) {
            handleSubmit()
        } else {
            setStep(prevState => prevState + 1)
        }
    }

    const back = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (data.role === "ROLE_CLIENT" && step === 6) {
            setStep(prevState => prevState - 4)
        } else {
            setStep(prevState => prevState - 1)
        }
    }

    const handleServiceClick = (categoryName: string) => {
        if (!selectedCategories.includes(categoryName)) {
            setSelectedCategories([...selectedCategories, categoryName]);
        }
    };

    const handleServiceRemove = (categoryName: string) => {
        setSelectedCategories(selectedCategories.filter(s => s !== categoryName));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setData({...data, [e.target.name]: e.target.value})
    }

    const handleChangeRepeatPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatPassword(e.target.value)
    }

    const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAgreement(e.target.checked);
    }

    const handleAddPhotoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (photoInputRef.current) {
            photoInputRef.current.click();
        }
    };

    const handleAddDocumentsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (documentInputRef.current) {
            documentInputRef.current.click();
        }
    }

    const handleAddPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            console.log("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("file", file);

        try {
            const response = await fetch("http://195.133.197.53:8081/masters/photo", {
                method: "POST",
                credentials: "include",
                body: formData
            });

            // if (!response.ok) {
            //     console.log(await response.json());
            //     return
            // }
            setData({...data, photoLink: await response.text()});

        } catch (error) {
            console.log(error)
        }
        // console.log(data)
    };

    const handleAddDocumentsChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            console.log("No files selected");
            return;
        }

        const formData = new FormData();
        formData.append("email", data.email);
        const filesToUpload = Array.from(files).slice(0, 5);
        filesToUpload.forEach(file => {
            formData.append("files", file);
        });

        try {
            const response = await fetch("http://195.133.197.53:8081/masters/documents", {
                method: "POST",
                credentials: "include",
                body: formData
            });

            if (!response.ok) {
                console.log(await response.json());
                return
            }

            const responseText = await response.text();
            const newDocuments: DocumentType[] = JSON.parse(responseText).map((url: string) => ({ url }));

            setData((prevData) => ({
                ...prevData,
                documents: [...(prevData.documents || []), ...newDocuments]
            }));

            // console.log(data)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form className="registration-form">
            {step === 1 &&
                <div className="steps">
                    <h1>Укажите качестве кого вы хотите зарегистрироваться</h1>
                    <select name="role" value={data.role} onChange={handleChange}>
                        <option/>
                        <option value="ROLE_MASTER">Исполнитель</option>
                        <option value="ROLE_CLIENT">Заказчик</option>
                    </select>
                    <div className="error-container">
                        {error === "EmptyRoleError" && <p className="error-message">Выберите, пожалуйста, роль</p>}
                    </div>
                </div>
            }
            {step === 2 &&
                <div className="steps">
                    <h1>Как вас зовут?</h1>
                    <label>Пожалуйста укажите ваше Ф.И.О. Как в паспорте, для прохождения проверки</label>
                    <input name="lastName" value={data.lastName} placeholder="Фамилия" onChange={handleChange}/>
                    <input name="firstName" value={data.firstName} placeholder="Имя" onChange={handleChange}/>
                    <input name="middleName" value={data.middleName} placeholder="Отчество" onChange={handleChange}/>
                    <label htmlFor="email">Укажите вашу электронную почту</label>
                    <input name="email" value={data.email} placeholder="Ivanov@mail.ru" onChange={handleChange}/>
                    <div className="agreement">
                        {/*<div>*/}
                        {/*    <input className="agree-checkbox" type="checkbox"/>*/}
                        {/*    <p>Пожалуйста укажите ваше Ф.И.О. Как в паспорте, для прохождения проверки</p>*/}
                        {/*</div>*/}
                        <div>
                            <input name="agreement" checked={agreement} className="agree-checkbox" type="checkbox"
                                   onChange={handleAgreementChange}/>
                            <p>Я принимаю условия публичной оферты и условия использования</p>
                        </div>
                    </div>
                    <div className="error-container">
                        {error === "EmptyNameError" &&
                            <p className="error-message">Заполните, пожалуйста, все обязательные поля</p>
                        }
                    </div>
                </div>
            }
            {step === 3 &&
                <div className="steps">
                    <h1>Укажите свой номер телефона</h1>
                    <label>Веедите номер телефона в формате +7ХХХХХХХХХХ</label>
                    <input name="phoneNumber" value={data.phoneNumber} placeholder="Номер телефона" onChange={handleChange}/>
                    <div className="error-container">
                        {error === "EmptyPhoneError" &&
                            <p className="error-message">Введите, пожалуйста, номер</p>
                        }
                    </div>
                </div>
            }
            {step === 4 &&
                <div className="steps">
                    <h1>Чем вы занимаетесь?</h1>
                    <label>Укажите какого вида услуги вы оказываете</label>
                    <div className="input-container">
                        {selectedCategories.map(category => (
                            <span key={category} className="selected-service">
                                {category}
                                <button type="button" onClick={() => handleServiceRemove(category)}>x</button>
                            </span>
                        ))}
                    </div>
                    <div style={{margin: '10px 0'}}>
                        {categories && categories.map(category => (
                            <button
                                type="button"
                                key={category.name}
                                onClick={() => handleServiceClick(category.name)}
                                style={{
                                    margin: '5px',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    background: selectedCategories.includes(category.name) ? '#ddd' : '#fff'
                                }}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                    <div className="error-container">
                        {error === "EmptyCategories" &&
                            <p className="error-message">Выберите, пожалуйста, хотя бы одну категорию услуг</p>
                        }
                    </div>
                </div>
            }
            {step === 5 &&
                <div className="steps">
                    <h1>Укажите район или метро</h1>
                    <label>Укажите удобный для вас район города или метро для оказания услуг</label>
                    <select name="metroStation" value={data.metroStation} onChange={handleChange}>
                        <option/>
                        {metro && metro.map((metro) => (
                            <option key={metro}>{metro}</option>
                        ))}
                    </select>
                    <div className="error-container">
                        {error === "EmptyMetroError" &&
                            <p className="error-message">Выберите, пожалуйста, станцию</p>
                        }
                    </div>
                </div>
            }

            {step === 6 &&
                <div className="steps">
                    <h1>Добавьте описание для своего профиля</h1>
                    <label>Напишите все, что нужно знать заказчику</label>
                    <textarea name="description" value={data.description} onChange={handleChange}/>
                    <div className="error-container">
                        {error === "EmptyDescriptionError" &&
                            <p className="error-message">Напишите, пожалуйста, описание профиля</p>
                        }
                    </div>
                </div>
            }

            {step === 7 &&
                <div className="steps">
                    <h1>Загрузите ваше фото</h1>
                    <label>Профили с фото и подтвержденными данными получают больше откликов и заказов.</label>
                    <div className="photo-instruction">
                        <img alt="avatar" src="./default-avatar.jpg"/>
                        <div className="instruction">
                            <p>Требования к фото:</p>
                            <ul>
                                <li>лицо должно быть четко видно</li>
                                <li>не должны быть на фото головные уборы, солнечные очки и другие предметы скрывающие
                                    лицо
                                </li>
                                <li>в кадре не должны присутствовать посторонние люди или предметы</li>
                                <li>на фото не должны быть сигареты, алкоголь либо иные предметы, запрещенные к
                                    публикации
                                </li>
                            </ul>
                            <p>Администрация сайта оставляет за собой право отказать в публикации фото, если оно не
                                отвечает требованиям.</p>
                            <p>Размер фото не должен превышать 100 х 200 пикселей</p>
                        </div>
                    </div>
                    <button className="add-photo-button" onClick={handleAddPhotoClick}>
                        Добавить фото
                    </button>
                    <input
                        type="file"
                        ref={photoInputRef}
                        style={{display: 'none'}}
                        onChange={handleAddPhotoChange}
                    />
                    <label>Для успешного завершения регистрации и подтверждения личности, загрузите документ
                        подтверждяающий вашу личность.</label>
                    <div className="add-document">
                        <img alt="document-icon" src="./document-icon.png"/>
                        <div className="add-document-button">
                            <OrangeButton text="Загрузить" onClick={handleAddDocumentsClick}/>
                            <input
                                type="file"
                                ref={documentInputRef}
                                style={{display: 'none'}}
                                onChange={handleAddDocumentsChange}
                                multiple
                            />
                        </div>
                    </div>
                </div>
            }

            {step === 8 &&
                <div className="steps done-step">
                    <h1>Ваш профиль успешно создан</h1>
                    <img className="register-done-image" alt="register-done-image" src="./register-done.png"/>
                    <p>Дождитесь прохождения модерации. На вашу почту, указанную при регистрации отправлено
                        письмо для подтверждения регистрации. </p>
                </div>
            }

            {step === 9 &&
                <div className="steps confirm-step">
                    <h1>Подтвердите вашу почту</h1>
                    <label>Укажите пароль, который вы получили в письме, отправленном на вашу почту</label>
                    <input/>
                </div>
            }

            {step === 10 &&
                <div className="steps password-step">
                    <h1>Установите новый пароль для входа </h1>
                    <label>Придумайте пароль</label>
                    <input name="password" type="text" value={data.password} onChange={handleChange}/>
                    <label>Повторите пароль</label>
                    <input name="repeatPassword" type="password" value={repeatPassword} onChange={handleChangeRepeatPassword}/>
                    <div className="error-container">
                        {error === "MismatchedPasswords" && <p className="error-message">Пароли не совпадают</p>}
                        {error === "WrongPassword" && <p className="error-message">Пароль должен содержать не менее 8 символов и включать в себя заглавные и строчные буквы и цифры</p>}
                    </div>
                </div>
            }

            <div className="buttons">
                {
                    step > 1 && step <= 6 &&
                    <div className="back-button">
                        <OrangeButton text={"Назад"} onClick={back}/>
                    </div>
                }

                {step <= 6 &&
                    <div className="next-button" style={buttonStyle}>
                        <OrangeButton text={"Далее"} onClick={next}/>
                    </div>
                }

                {step === 7 &&
                    <div className="next-button" style={buttonStyle}>
                        <OrangeButton text={"Завершить регистрацию"} onClick={next}/>
                    </div>
                }

                {step > 7 &&
                    <div className="next-button" style={buttonStyle}>
                        <OrangeButton text={"Готово"} onClick={next}/>
                    </div>
                }
            </div>
        </form>
    )
}
