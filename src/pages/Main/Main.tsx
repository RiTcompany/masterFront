import React, {useEffect, useRef, useState} from "react";
import "./Main.css"
import {OrangeButton} from "../../components/OrangeButton/OrangeButton.tsx";
import {Link} from "react-router-dom";
import {OrangeCircle} from "../../components/OrangeCircle/OrangeCircle.tsx";
import {ServiceCard} from "../../components/ServiceCard/ServiceCard.tsx";
import {Review} from "./Review.tsx";
// import {SearchField} from "./SearchField.tsx";
import {CreatedCard} from "./CreatedCard.tsx";
import {parseJwt} from "../../App.tsx";
import {TaskCard} from "../../components/TaskCard/TaskCard.tsx";

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


interface ServiceType {
    id: number,
    image: string,
    title: string,
    master: string,
    city: string,
    age: number;
    rating: number;
    description: string;
}

interface CategoryType {
    id: number,
    name: string,
}

interface TaskType {
    id: number,
    title: string,
    customer: string,
    description: string;
    date: Date;
    price: number
}

interface TasksType {
    id: number,
    userId: number,
    categoryId: number,
    categoryName: string,
    userName: string,
    description: string;
    startDate: string;
    endDate: string
}

const reviews: ReviewType[] = [
    {
        id: 1,
        image: 'intro-background.png',
        text: 'Чётко, вежливо, с соблюдением всех наших пожеланий, а самое главное — тёплый человеческий неравнодушный подход!',
        name: 'Кирилл П.',
        rating: 5,
        tasksCompleted: 2590,
    },
    {
        id: 2,
        image: 'intro-background.png',
        text: 'Чётко, вежливо, с соблюдением всех наших пожеланий, а самое главное — тёплый человеческий неравнодушный подход!',
        name: 'Кирилл П.',
        rating: 5,
        tasksCompleted: 2590,
    },
    {
        id: 3,
        image: 'intro-background.png',
        text: 'Чётко, вежливо, с соблюдением всех наших пожеланий, а самое главное — тёплый человеческий неравнодушный подход!',
        name: 'Кирилл П.',
        rating: 5,
        tasksCompleted: 2590,
    },
    {
        id: 4,
        image: 'intro-background.png',
        text: 'Чётко, вежливо, с соблюдением всех наших пожеланий, а самое главное — тёплый человеческий неравнодушный подход!',
        name: 'Кирилл П.',
        rating: 5,
        tasksCompleted: 2590,
    },
];

const services: ServiceType[] = [
    {
        id: 1,
        image: 'intro-background.png',
        title: "Прокладка труб",
        description: "Описание описание описание",
        master: "Михаил",
        city: "Санкт-Петербург",
        age: 25,
        rating: 5,
    },
    {
        id: 2,
        image: 'intro-background.png',
        title: "Прокладка труб",
        description: "Описание описание описание",
        master: "Михаил",
        city: "Санкт-Петербург",
        age: 25,
        rating: 4,
    },
    {
        id: 3,
        image: 'intro-background.png',
        title: "Прокладка труб",
        description: "Описание описание описание",
        master: "Михаил",
        city: "Санкт-Петербург",
        age: 25,
        rating: 3,
    },
    {
        id: 4,
        image: 'intro-background.png',
        title: "Прокладка труб",
        description: "Описание описание описание Описание описание описание ",
        master: "Михаил",
        city: "Санкт-Петербург",
        age: 25,
        rating: 2,
    },
    {
        id: 5,
        image: 'intro-background.png',
        title: "Прокладка труб",
        description: "Описание описание описание",
        master: "Михаил",
        city: "Санкт-Петербург",
        age: 25,
        rating: 1,
    },
    {
        id: 6,
        image: 'intro-background.png',
        title: "Прокладка труб",
        description: "Описание описание описание",
        master: "Михаил",
        city: "Санкт-Петербург",
        age: 25,
        rating: 0,
    }
];

const tasks: TaskType[] = [
    {
        id: 1,
        title: "Замена окон",
        customer: "Дмитрий Ц.",
        description: "Демонтаж окон в квартире, 4 шт.",
        date: new Date(2024, 5, 6),
        price: 12000
    },
    {
        id: 2,
        title: "Замена окон",
        customer: "Дмитрий Ц.",
        description: "Демонтаж окон в квартире, 4 шт.",
        date: new Date(2024, 5, 6),
        price: 12000
    },
    {
        id: 3,
        title: "Замена окон",
        customer: "Дмитрий Ц.",
        description: "Демонтаж окон в квартире, 4 шт.",
        date: new Date(2024, 5, 6),
        price: 12000
    },
    {
        id: 4,
        title: "Замена окон",
        customer: "Дмитрий Ц.",
        description: "Демонтаж окон в квартире, 4 шт.",
        date: new Date(2024, 5, 6),
        price: 12000
    },
    {
        id: 5,
        title: "Замена окон",
        customer: "Дмитрий Ц.",
        description: "Демонтаж окон в квартире, 4 шт.",
        date: new Date(2024, 5, 6),
        price: 12000
    },
]

function FoundCard({title, customer, description, date, price}: TaskType): React.JSX.Element {
    const formattedDate = date.toLocaleDateString();

    return (
        <div className="found-card">
            <div className="left">
                <h1>{title}</h1>
                <p>{description}</p>
                <p>Начать {formattedDate}</p>
            </div>
            <div className="right">
                <h1>до {price}&#8381;</h1>
                <p>{customer}</p>
            </div>
        </div>
    )
}

export function Main(): React.JSX.Element {
    const scrollRef = useRef<HTMLDivElement>(null);
    const token = localStorage.getItem("authToken");
    // const navigate = useNavigate();


    const [activeTab, setActiveTab] = useState<string>('create');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [error, setError] = useState('');
    // const [authUserId, setAuthUserId] = useState()
    const [searchResults, setSearchResults] = useState<TasksType[]>();
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [categories, setCategories] = useState<CategoryType[]>([])
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>()



    const search = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `http://195.133.197.53:8081/tasks/category/${selectedCategory?.id}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (response.ok) {
                const result = await response.json();
                console.log(result)
                setSearchResults(result);
                setShowSearchResults(true);
            } else {
                console.error("Ошибка при загрузке заданий:", response.statusText);
            }
        } catch (error) {
            console.error("Ошибка при выполнении запроса:", error);
        }
    };

    useEffect(() => {
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

    const handleChange = (e: any) => {
        const categoryId = parseInt(e.target.value);
        console.log(categories)
        const category = categories.find(cat => cat.id === categoryId);
        setSelectedCategory(category);
    }

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;
        const handleScroll = () => {
            if (scrollContainer.scrollLeft + scrollContainer.offsetWidth >= scrollContainer.scrollWidth) {
                scrollContainer.scrollLeft = 0;
            }
        };
        scrollContainer.addEventListener('scroll', handleScroll);

        return () => {
            scrollContainer.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // const [isChecked, setIsChecked] = useState<boolean>(false);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

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
            const response = await fetch('http://195.133.197.53:8081/auth/sign-in', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            if (response.ok) {
                const responseData = await response.json();
                localStorage.setItem('authToken', responseData.token);

                const token = responseData.token;
                const data = parseJwt(token);
                if (data && data.id && localStorage.getItem('authToken')) {
                    window.location.replace(`/#/profile/${data.id}`)
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

    return (
        <>
            <div className="intro-container common">
                <img alt="logo" src={'/logo.png'}/>
                <h1 className="big-title">Мастер на час</h1>
                <h3 className="small-title">мастер на час</h3>
                <div className="intro-search">
                    <form className={"search-container"}>
                        <select
                            name="metroStation"
                            className="search-input"
                            value={selectedCategory ? selectedCategory.id : ''}
                            onChange={handleChange}
                        >
                            <option value="" disabled hidden>Поиск заданий по категориям</option>
                            {categories && categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        <div className={"search-button"}>
                            <OrangeButton text={"Найти"} onClick={search}/>
                        </div>
                    </form>
                </div>
                <div className='selection'>
                    <div className="switcher">
                        <button
                            className={activeTab === 'create' ? 'active' : ''}
                            onClick={() => handleTabClick('create')}
                        >
                            Создать услугу
                        </button>
                        <button
                            className={activeTab === 'find' ? 'active' : ''}
                            onClick={() => handleTabClick('find')}
                        >
                            Найти услугу
                        </button>
                    </div>
                </div>
            </div>

            {showSearchResults &&
                <div className="search-result-container common">
                    {searchResults && searchResults.map((res) =>
                        <div key={res.id}>
                            {/*<Link to={`/task/${res.id}`}>*/}
                                <TaskCard data={res}/>
                            {/*</Link>*/}
                        </div>
                    )}
                    {searchResults && searchResults[0] === undefined &&
                        <div>В этой категории пока что заказов нет.</div>
                    }
                </div>
            }

            <div className="mini-service-container common">
                <div className="service-circles service-scroll">
                    {services.map((service) => (
                        <div className="service-item" key={service.id}>
                            <OrangeCircle key={service.id} image={service.image} title={service.title}/>
                        </div>
                    ))}
                </div>
                <div className="finder-container">
                    <form className="finder-form">
                        <label htmlFor="service-search" className="finder-label">Поиск исполнителя</label>
                        <div className="finder-inputs">
                            <input type="text" id="service-search" name="search" placeholder="Услуга или специалист"
                                   className="finder-input"/>
                            <select id="location-select" name="location" className="finder-select">
                                <option value="">Радиус, метро, район</option>
                            </select>
                        </div>
                    </form>
                </div>
            </div>

            {activeTab === 'create' &&
                <div className="create-service-container">
                    {services && services.map((service) =>
                        <CreatedCard image={service.image} title={service.title} master={service.master}
                                     city={service.city} age={service.age} rating={service.rating}
                                     description={service.description} id={service.id} key={service.id}
                        />)}
                </div>
            }

            {activeTab === 'find' &&
                <div className="find-service-container">
                    <div className="subscribe-card">
                        <p>Подпишитесь на уведомления о новых заказах</p>
                        <div className="subscribe-button">
                            <OrangeButton text={"Подписаться"} onClick={(e) => e.preventDefault()}/>
                        </div>
                    </div>
                    {tasks && tasks.map((task) =>
                        <FoundCard title={task.title} customer={task.customer} description={task.description}
                                   date={task.date} price={task.price} id={task.id} key={task.id}
                        />
                    )}
                </div>
            }

            <div className="service-container common">
                <div className="service-circles">
                    {services.map(service => (
                        <div className="service-item" key={service.id}>
                            <OrangeCircle image={service.image} title={service.title}/>
                        </div>
                    ))}
                </div>
                <h1>МАСТЕРА</h1>
                <div className={"test"}>
                    <div className="service-scroll" ref={scrollRef}>
                        {services.concat(services).map((service, index) => (
                            <ServiceCard key={`${service.id}-${index}`} image={service.image}
                                         description={service.description}/>
                        ))}
                    </div>
                </div>
            </div>

            <div className="about-container common">
                <h1 className="about-title">КАК МЫ РАБОТАЕМ</h1>
                <div className="points">
                    <div>
                        <h3>Опишите</h3>
                        <h5>свою задачу и условия. Это бесплатно и займёт 3‑4 минуты</h5>
                    </div>
                    <div>
                        <h3>Получите отклики</h3>
                        <h5>с ценами от исполнителей. Обычно они приходят в течение 30 минут</h5>
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

            {!token && <div className="login-container common" id="login">
                <div className="left"></div>
                <div className="right">
                    <img alt="logo" src='/black-logo.png'/>
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
                            <input type="password"
                                   placeholder="Пароль"
                                   value={password}
                                   onChange={handlePasswordChange}
                                   required
                            />
                        </div>
                        {
                            error && <p>Заполните, пожалуйста, все поля</p>
                        }
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
