import React, {useEffect, useRef, useState} from "react";
import "./Main.css"
import {OrangeButton} from "../../components/OrangeButton/OrangeButton.tsx";
import {Link} from "react-router-dom";
import {OrangeCircle} from "../../components/OrangeCircle/OrangeCircle.tsx";
import {ServiceCard} from "../../components/ServiceCard/ServiceCard.tsx";
import {Review} from "./Review.tsx";
// import {SearchField} from "./SearchField.tsx";
import {parseJwt} from "../../App.tsx";
import {TaskCard} from "../../components/TaskCard/TaskCard.tsx";
import Select, {CSSObjectWithLabel, MultiValue} from 'react-select';

// interface MainProps {
//     authUserId: number
// }

export interface ReviewType {
    id: number,
    image: string,
    text: string,
    name: string,
    rating: number,
    tasksCompleted: number,
}


// interface ServiceType {
//     id: number,
//     image: string,
//     title: string,
//     master: string,
//     city: string,
//     age: number;
//     rating: number;
//     description: string;
// }

interface CategoryType {
    id: number,
    name: string,
}

interface OptionType {
    value: string;
    label: string;
}

// interface TaskType {
//     id: number,
//     title: string,
//     customer: string,
//     description: string;
//     date: Date;
//     price: number
// }

interface TasksType {
    id: number,
    userId: number,
    categoryId: number,
    categoryName: string,
    userName: string,
    description: string;
    startDate: string;
    endDate: string;
    masterId: number;
}

interface MasterType {
    photoLink: string,
    description: string,
    userId: number,
    photo: string
}

const reviews: ReviewType[] = [
    {
        id: 1,
        image: 'intro-background.png',
        text: 'Огромное Спасибо Ивану за сборку кухни и подключение всех комплектующих) Работой и ценой доволен, буду ещё обращаться))',
        name: 'Сергей П.',
        rating: 5,
        tasksCompleted: 2590,
    },
    {
        id: 2,
        image: 'intro-background.png',
        text: 'Всё аккуратно и за адекватный прайс',
        name: 'Александр Ж.',
        rating: 5,
        tasksCompleted: 2590,
    },
    {
        id: 3,
        image: 'intro-background.png',
        text: 'Оперативно приехал, сделал все быстро и качественно. Большая благодарность. Рекомендую мастера.',
        name: 'Юлия',
        rating: 5,
        tasksCompleted: 2590,
    },
    {
        id: 4,
        image: 'intro-background.png',
        text: `Добрый день! Отличный мастер, рекомендую!`,
        name: 'Александр',
        rating: 5,
        tasksCompleted: 2590,
    },
];

// const services: ServiceType[] = [
//     {
//         id: 1,
//         image: 'intro-background.png',
//         title: "Прокладка труб",
//         description: "Описание описание описание",
//         master: "Михаил",
//         city: "Санкт-Петербург",
//         age: 25,
//         rating: 5,
//     },
//     {
//         id: 2,
//         image: 'intro-background.png',
//         title: "Прокладка труб",
//         description: "Описание описание описание",
//         master: "Михаил",
//         city: "Санкт-Петербург",
//         age: 25,
//         rating: 4,
//     },
//     {
//         id: 3,
//         image: 'intro-background.png',
//         title: "Прокладка труб",
//         description: "Описание описание описание",
//         master: "Михаил",
//         city: "Санкт-Петербург",
//         age: 25,
//         rating: 3,
//     },
//     {
//         id: 4,
//         image: 'intro-background.png',
//         title: "Прокладка труб",
//         description: "Описание описание описание Описание описание описание ",
//         master: "Михаил",
//         city: "Санкт-Петербург",
//         age: 25,
//         rating: 2,
//     },
//     {
//         id: 5,
//         image: 'intro-background.png',
//         title: "Прокладка труб",
//         description: "Описание описание описание",
//         master: "Михаил",
//         city: "Санкт-Петербург",
//         age: 25,
//         rating: 1,
//     },
//     {
//         id: 6,
//         image: 'intro-background.png',
//         title: "Прокладка труб",
//         description: "Описание описание описание",
//         master: "Михаил",
//         city: "Санкт-Петербург",
//         age: 25,
//         rating: 0,
//     }
// ];

const categoryImages: { [key: string]: string } = {
    "Конструктивные работы": "const-works.png",
    "Отделочные работы": "otd-works.png",
    "Монтажные работы": "mon-works.png",
    "Электромонтажные работы": "electromont-works.png",
    "Сантехнические работы": "sant-works.png",
    "Демонтажные работы": "demon-works.png",
    "Дополнительные услуги": "extra-serv.png"
}

export function Main(): React.JSX.Element {
    const scrollRef = useRef<HTMLDivElement>(null);
    const token = localStorage.getItem("authToken");
    // const navigate = useNavigate();


    // const [activeTab, setActiveTab] = useState<string>('create');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [error, setError] = useState('');
    // const [authUserId, setAuthUserId] = useState()
    const [searchResults, setSearchResults] = useState<TasksType[]>();
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [categories, setCategories] = useState<CategoryType[]>([])
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>()
    const [topMasters, setTopMasters] = useState<MasterType[]>([])
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [options, setOptions] = useState<OptionType[]>([]);
    const [selectedValues, setSelectedValues] = useState<OptionType[]>([]);

    const handleMultiSelectChange = (
        newValue: MultiValue<OptionType>,
        // actionMeta: ActionMeta<OptionType>
    ) => {
        if (newValue.some((option: OptionType) => option.value === 'all')) {
            setSelectedValues(options.filter(option => option.value !== 'all'));
        } else {
            setSelectedValues(newValue as OptionType[]);
        }
    };

    const search = async (e: React.FormEvent | null, cat?: number) => {
        if (e) e.preventDefault();
        const categ = cat ? cat : selectedCategory?.id
        console.log(categ)
        console.log(selectedCategory)
        try {
            const response = await fetch(
                `http://89.23.117.193:80/tasks/category/${categ}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (response.ok) {
                const result = await response.json();

                const filteredResults = result.filter((res: any) => !res.masterId);

                setSearchResults(filteredResults);
                setShowSearchResults(true);
            } else {
                console.error("Ошибка при загрузке заданий:", response.statusText);
            }
        } catch (error) {
            console.error("Ошибка при выполнении запроса:", error);
        }
    };

    const multiSearch = async () => {
        try {
            const categoryIdsArr = selectedValues.map(option => option.value);
            const categoryIds = categoryIdsArr.join(',')
            console.log(categoryIds)

            const response = await fetch(`http://89.23.117.193:80/tasks/category/list?categoryIds=${categoryIds}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных');
            }

            const data = await response.json();
            console.log(data)
            setSearchResults(data);
        } catch (error) {
            console.error('Ошибка при поиске:', error);
        }
    };

    const updateCategoryAndSearch = async (categoryId: number) => {
        const category = categories.find(cat => cat.id === categoryId);

        await new Promise<void>((resolve) => {
            setSelectedCategory(category);
            resolve();
        });
        console.log(selectedCategory)

        await search(null, category?.id);
    };


    useEffect(() => {
        (async function () {
            try {
                const response = await fetch("http://89.23.117.193:80/masters/top10", {
                    method: "GET",
                    credentials: "include"
                });
                let result = await response.json();
                console.log(result);
                setTopMasters(result);
                fetchAndSetPhotos(result);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    const fetchAndSetPhotos = async (masters: MasterType[]) => {
        const updatedMasters = await Promise.all(masters.map(async (master) => {
            try {
                const response = await fetch(`http://89.23.117.193:80/masters/${master.userId}/photo`, {
                    credentials: "include",
                    method: "GET",
                });
                if (response.ok) {
                    const arrayBuffer = await response.arrayBuffer();
                    const uint8Array = new Uint8Array(arrayBuffer);
                    const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
                    const base64String = btoa(binaryString);
                    if (base64String) {
                        master.photo = `data:image/jpeg;base64,${base64String}`;
                    } else {
                        master.photo = "/default-avatar.jpg";
                    }
                } else {
                    console.error(`Failed to fetch photo for master with id ${master.userId}`);
                    master.photo = "/default-avatar.jpg";
                }
            } catch (error) {
                console.error(`Error fetching photo for master with id ${master.userId}:`, error);
                master.photo = "/default-avatar.jpg";
            }
            return master;
        }));
        setTopMasters(updatedMasters);
    };

    useEffect(() => {
        (async function () {
            try {
                const response = await fetch("http://89.23.117.193:80/categories", {
                    method: "GET",
                    credentials: "include"
                })
                let result = await response.json()
                setCategories(result)
                const formattedOptions: OptionType[] = result.map((category: { id: number; name: string }) => ({
                    value: category.id,
                    label: category.name,
                }));
                setOptions([{ value: 'all', label: 'Выбрать все' }, ...formattedOptions]);
            } catch (error) {
                console.log(error)
            }
        })()
    }, []);

    const handleChange = (e: any) => {
        const categoryId = parseInt(e.target.value);
        console.log(categories)
        const category = categories.find(cat => cat.id === categoryId);
        setSelectedCategory(category);
    }

    useEffect(() => {
        console.log(selectedCategory)
    }, [selectedCategory]);

    // useEffect(() => {
    //     const scrollContainer = scrollRef.current;
    //     if (!scrollContainer) return;
    //
    //     const handleScroll = () => {
    //         if (scrollContainer.scrollLeft + scrollContainer.offsetWidth >= scrollContainer.scrollWidth) {
    //             scrollContainer.scrollLeft = 0;
    //         }
    //     };
    //
    //     scrollContainer.addEventListener('scroll', handleScroll);
    //
    //     return () => {
    //         scrollContainer.removeEventListener('scroll', handleScroll);
    //     };
    // }, []);

    const addMoreMasters = () => {
        setTopMasters((prevMasters) => prevMasters.concat(topMasters));
    };

    // Function to handle mouse events
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let isDown = false;
        let startX: number;
        let scrollLeft: number;

        const handleMouseDown = (e: any) => {
            isDown = true;
            scrollContainer.classList.add('active');
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        };

        const handleMouseLeave = () => {
            isDown = false;
            scrollContainer.classList.remove('active');
        };

        const handleMouseUp = () => {
            isDown = false;
            scrollContainer.classList.remove('active');
        };

        const handleMouseMove = (e: any) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = x - startX;
            scrollContainer.scrollLeft = scrollLeft - walk;
        };

        scrollContainer.addEventListener('mousedown', handleMouseDown);
        scrollContainer.addEventListener('mouseleave', handleMouseLeave);
        scrollContainer.addEventListener('mouseup', handleMouseUp);
        scrollContainer.addEventListener('mousemove', handleMouseMove);

        return () => {
            scrollContainer.removeEventListener('mousedown', handleMouseDown);
            scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
            scrollContainer.removeEventListener('mouseup', handleMouseUp);
            scrollContainer.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Function to handle scroll events
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const handleScroll = () => {
            if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10) {
                addMoreMasters();
            }
        };

        scrollContainer.addEventListener('scroll', handleScroll);

        return () => {
            scrollContainer.removeEventListener('scroll', handleScroll);
        };
    }, [topMasters]);

    // const [isChecked, setIsChecked] = useState<boolean>(false);

    // const handleTabClick = (tab: string) => {
    //     setActiveTab(tab);
    // };

    const handleToggleChange = () => {
        setIsChecked(!isChecked);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!email || !password) {
            setError("EmptyFieldError");
            return;
        }
        setError("");
        try {
            const response = await fetch('http://89.23.117.193:80/auth/sign-in', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            if (!response.ok) {
                setError("WrongPassword")
            }

            if (response.ok) {
                const responseData = await response.json();
                localStorage.setItem('authToken', responseData.token);

                const token = responseData.token;
                const data = parseJwt(token);
                if (data && data.id && localStorage.getItem('authToken')) {
                    window.location.hash=`#/profile/${data.id}`
                    window.location.reload();
                } else {
                    console.error('Invalid token data:', data);
                }
            } else {
                console.error('Sign-in failed:', response.statusText);
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(String(error));
            }
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };

    return (
        <>
            <div className="intro-container common">
                <img alt="logo" src={'/logo.png'}/>
                <h1 className="big-title">Мастер на час</h1>
                <h3 className="small-title">БЫСТРЫЕ РЕШЕНИЯ ДЛЯ ВАШЕГО РЕМОНТА </h3>
                <div className="intro-search">
                    <form className={"search-container"}>
                        <select
                            name="metroStation"
                            className="search-input"
                            value={selectedCategory ? selectedCategory.id : ''}
                            onChange={handleChange}
                            style={{color: "black"}}
                        >
                            <option value="" disabled hidden style={{color: "black"}}>Поиск заданий по категориям</option>
                            {categories && categories.map((category) => (
                                <option key={category.id} value={category.id} style={{color: "black"}}>{category.name}</option>
                            ))}
                        </select>
                        <div className={"search-button"}>
                            <OrangeButton text={"Найти"} onClick={search}/>
                        </div>
                    </form>
                </div>
                {/*<div className='selection'>*/}
                {/*    <div className="switcher">*/}
                {/*        <button*/}
                {/*            className={activeTab === 'create' ? 'active' : ''}*/}
                {/*            onClick={() => handleTabClick('create')}*/}
                {/*        >*/}
                {/*            Создать услугу*/}
                {/*        </button>*/}
                {/*        <button*/}
                {/*            className={activeTab === 'find' ? 'active' : ''}*/}
                {/*            onClick={() => handleTabClick('find')}*/}
                {/*        >*/}
                {/*            Найти услугу*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>

            {showSearchResults &&
                <div className="search-result-container common">
                    <Select
                        name="categories"
                        placeholder="Выбор категорий"
                        value={selectedValues}
                        onChange={handleMultiSelectChange}
                        options={options}
                        isMulti
                        styles={{ control: (base: CSSObjectWithLabel) => ({ ...base, color: 'black', width: "330px" }) }}
                    />
                    <div style={{width: "300px", height: "50px"}}>
                        <OrangeButton text={"Обновить"} onClick={multiSearch}/>
                    </div>
                    {searchResults && searchResults.map((res) =>
                        <div key={res.id} >
                            {/*<Link to={`/task/${res.id}`}>*/}
                                <TaskCard data={res}/>
                            {/*</Link>*/}
                        </div>
                    )}
                    {searchResults && searchResults[0] === undefined &&
                        <div style={{height: "150px"}}>В этой категории пока что заказов нет.</div>
                    }
                </div>
            }

            <div className="mini-service-container common">
                <div className="service-circles service-scroll">
                    {categories.map((category) => (
                        <div className="service-item" key={category.id} onClick={() => updateCategoryAndSearch(category.id)} style={{cursor: "pointer"}}>
                            <OrangeCircle key={category.id} image={categoryImages[category.name] || 'extra-serv.png'}  title={category.name}/>
                        </div>
                    ))}
                </div>
                {/*<div className="finder-container">*/}
                {/*    <form className="finder-form">*/}
                {/*        <label htmlFor="service-search" className="finder-label">Поиск исполнителя</label>*/}
                {/*        <div className="finder-inputs">*/}
                {/*            <input type="text" id="service-search" name="search" placeholder="Услуга или специалист"*/}
                {/*                   className="finder-input"/>*/}
                {/*            <select id="location-select" name="location" className="finder-select">*/}
                {/*                <option value="">Радиус, метро, район</option>*/}
                {/*            </select>*/}
                {/*        </div>*/}
                {/*    </form>*/}
                {/*</div>*/}
            </div>

            {/*{activeTab === 'create' &&*/}
            {/*    <div className="create-service-container">*/}
            {/*        {services && services.map((service) =>*/}
            {/*            <CreatedCard image={service.image} title={service.title} master={service.master}*/}
            {/*                         city={service.city} age={service.age} rating={service.rating}*/}
            {/*                         description={service.description} id={service.id} key={service.id}*/}
            {/*            />)}*/}
            {/*    </div>*/}
            {/*}*/}

            {/*{activeTab === 'find' &&*/}
            {/*    <div className="find-service-container">*/}
            {/*        <div className="subscribe-card">*/}
            {/*            <p>Подпишитесь на уведомления о новых заказах</p>*/}
            {/*            <div className="subscribe-button">*/}
            {/*                <OrangeButton text={"Подписаться"} onClick={(e) => e.preventDefault()}/>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        {tasks && tasks.map((task) =>*/}
            {/*            <FoundCard title={task.title} customer={task.customer} description={task.description}*/}
            {/*                       date={task.date} price={task.price} id={task.id} key={task.id}*/}
            {/*            />*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*}*/}

            <div className="service-container common">
                <div className="service-circles">
                    {categories.slice(0, 6).map((category) => (
                        <div className="service-item" key={category.id}
                             onClick={() => updateCategoryAndSearch(category.id)}
                             style={{cursor: "pointer"}}
                        >
                            <OrangeCircle key={category.id} image={categoryImages[category.name] || 'extra-serv.png'}  title={category.name} />
                        </div>
                    ))}
                </div>
                <h1>МАСТЕРА</h1>
                <div className={"test"}>
                    <div className="service-scroll" ref={scrollRef}>
                        {topMasters.concat(topMasters).map((master, index) => (
                            <Link to={`/profile/${master.userId}`}>
                                <ServiceCard key={`${master.userId}-${index}`} image={master.photo}
                                             description={master.description}/>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="about-container common">
                <h1 className="about-title">КАК МЫ РАБОТАЕМ</h1>
                <div className="points">
                    <div>
                        <h3>Опишите</h3>
                        <h5>вашу задачу и условия. Это бесплатно и занимает 3‑4 минуты</h5>
                    </div>
                    <div>
                        <h3>Получите отклики</h3>
                        <h5>с ценами от исполнителей. В среднем приходят в течение 30 минут</h5>
                    </div>
                    <div>
                        <h3>Выберите</h3>
                        <h5>подходящего исполнителя и обсудите сроки выполнения</h5>
                    </div>
                </div>
                {/*<div className="search">*/}
                {/*    <SearchField/>*/}
                {/*</div>*/}

            </div>

            <div className="reviews-container common">
                {reviews.map((review) => (
                    <Review review={review} key={review.id}/>
                ))}
            </div>

            <div id="login"/>

            {!token && <div className="login-container common">
                <div className="left"></div>
                <div className="right">
                    <img src='/login-image.jpg' className={"mobile-img"}/>
                    <img alt="logo" src='/black-logo.png' className={"mobile-logo"}/>
                    <form className="form-login">
                        <h3>Войти</h3>
                        <div className="login-field">
                            <label htmlFor="email">Логин</label>
                            <input type="email"
                                   placeholder="Почта или номер телефона"
                                   value={email}
                                   onChange={handleEmailChange}
                                   required
                            />
                        </div>
                        <div className="login-field">
                            <label htmlFor="password">Пароль</label>
                            {/*<input type="password"*/}
                            {/*       placeholder="Пароль"*/}
                            {/*       value={password}*/}
                            {/*       onChange={handlePasswordChange}*/}
                            {/*       required*/}
                            {/*/>*/}
                            <div className="password-input-container">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    placeholder="Пароль"
                                    onChange={handlePasswordChange}
                                    className="password-input"
                                />
                                <button type="button" onClick={toggleShowPassword} className="password-toggle-button" style={{top: "12px"}}>
                                    {showPassword ? <img alt="" src={"/visibility-off.svg"} style={{height: "24px"}}/>
                                        : <img alt="" src={"/visibility.svg"} style={{height: "24px"}}/>}
                                </button>
                            </div>
                        </div>
                        <div className="under-form-buttons">
                            <div className="switch-toggle-container">
                                <div className={`switch-toggle ${isChecked ? 'checked' : ''}`}
                                     onClick={handleToggleChange}>
                                    <div className="switch-toggle-slider"/>
                                </div>
                                <span className="switch-toggle-label">Запомнить меня</span>
                            </div>
                            <Link to={"/"}>Забыли пароль?</Link>
                        </div>

                        <div className="error-container">
                            {error === "WrongPassword" && <p className="error-message">Неправильный логин или пароль, либо ваш аккаунт еще не подтвержен</p>}
                            {error === "EmptyFieldError" && <p className="error-message">Заполните, пожалуйста, все поля</p>}
                        </div>

                        <div className="login-button">
                            <OrangeButton text="Войти" onClick={handleSubmit}/>
                        </div>
                        <hr/>
                        <p className="register-link">Не зарегистрированы? <Link to={"/registration"}>Пройти регистрацию</Link></p>
                    </form>
                    {/*<div className="register-bottom">*/}
                    {/*    <p>@</p>*/}
                    {/*    <p>© Perfect Login 2021</p>*/}
                    {/*</div>*/}
                </div>
            </div>}
        </>
    )
}
