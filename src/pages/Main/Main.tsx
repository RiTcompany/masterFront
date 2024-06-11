import React, {useEffect, useRef, useState} from "react";
import "./Main.css"
import {OrangeButton} from "../../components/OrangeButton/OrangeButton.tsx";
import {Link} from "react-router-dom";
import {OrangeCircle} from "../../components/OrangeCircle/OrangeCircle.tsx";
import {ServiceCard} from "../../components/ServiceCard/ServiceCard.tsx";

export interface ReviewType {
    id: number,
    image: string,
    text: string,
    name: string,
    rating: number,
    tasksCompleted: number,
}

interface ReviewProps {
    review: ReviewType;
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

interface TaskType {
    id: number,
    title: string,
    customer: string,
    description: string;
    date: Date;
    price: number
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

function search(e: { preventDefault: () => void; }) {
    e.preventDefault()
}

function SearchField(): React.JSX.Element {
    return (
        <form className={"search-container"}>
            <input type="text" className="search-input" placeholder="Услуга или специалист"/>
            <div className={"search-button"}>
                <OrangeButton text={"Найти"} onClick={search}/>
            </div>
        </form>
    )
}

function Review({review}: ReviewProps): React.JSX.Element {
    return (
        <div className="review">
            <div className="review-image">
                <OrangeCircle image={review.image}/>
            </div>
            <div className="review-content">
                <p className="review-text">{review.text}</p>
                <div className="review-footer">
                    <div className="review-header">
                        <span className="review-name">{review.name}</span>
                        <span className="review-rating">Рейтинг исполнителя: <span
                            className="review-star">⭐</span> {review.rating}</span>
                    </div>
                    <span className="review-tasks">Выполнил {review.tasksCompleted} заданий</span>
                </div>
            </div>
        </div>
    )
}

function CreatedCard({image, title, description, master, city, age, rating}: ServiceType): React.JSX.Element {

    const stars = Array(rating).fill("/star-icon.png");

    return (
        <div className="created-card">
            <img className="image" src={image}/>
            <div className="content">
                <h1>{master}</h1>
                <div className="info">
                    <div className="text-block">
                        <p>{age} лет <span>{city}</span></p>
                        <p className="rating">Оценки
                            <span className="stars">
                                {stars.map((star, index) => (
                                    <img key={index} src={"./star.png"} className="star-icon" alt="Star"/>
                                ))}
                            </span>
                            {rating}</p>
                    </div>
                    <div className="card-icons">
                        <img src="/top10.png" className="icon-10"/>
                        <img src="/card-icon.png" className="icon"/>
                    </div>
                </div>
                <h2>{title}</h2>
                <h5>{description}</h5>
            </div>
        </div>
    )
}

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
    const scrollRef = useRef(null);

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

    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('create');

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const handleToggleChange = () => {
        setIsChecked(!isChecked);
    };

    return (
        <>
            <div className="intro-container common">
                <img alt="logo" src={'/logo.png'}/>
                <h1 className="big-title">Мастер на час</h1>
                <h3 className="small-title">мастер на час</h3>
                <div className="intro-search">
                    <SearchField/>
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
                            <OrangeButton text={"Подписаться"} onClick={search}/>
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
                            {/*<img className="review-image" src={service.image} alt={service.name} />*/}
                            {/*<p>{service.name}</p>*/}
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
                <div className="search">
                    <SearchField/>
                </div>

            </div>

            <div className="reviews-container common">
                {reviews.map((review) => (
                    <Review review={review} key={review.id}/>
                ))}
            </div>

            <div className="login-container common">
                <div className="left"></div>
                <div className="right">
                    <img alt="logo" src='/black-logo.png'/>
                    <form className="form-login">
                        <h3>Войти</h3>
                        <div className="login-field">
                            <label htmlFor="email">Логин</label>
                            <input type="email" placeholder="Почта или номер телефона"/>
                        </div>
                        <div className="login-field">
                            <label htmlFor="password">Пароль</label>
                            <input type="password" placeholder="Пароль"/>
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
                        <div className={"login-button"}>
                            <OrangeButton text={"Войти"} onClick={search}/>
                        </div>
                        <hr/>
                        <p className="register-link">Не зарегистрированы? <Link to={"/"}>Пройти регистрацию</Link></p>
                    </form>
                    {/*<div className="register-bottom">*/}
                    {/*    <p>@</p>*/}
                    {/*    <p>© Perfect Login 2021</p>*/}
                    {/*</div>*/}
                </div>
            </div>
        </>
    )
}
