import React, {useState} from "react";
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

interface serviceType {
    id: number,
    image: string,
    name: string,
    description: string,
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

const services: serviceType[] = [
    {
        id: 1,
        image: 'intro-background.png',
        name: "Прокладка труб",
        description: "Описание описание описание",
    },
    {
        id: 2,
        image: 'intro-background.png',
        name: "Прокладка труб",
        description: "Описание описание описание",
    },
    {
        id: 3,
        image: 'intro-background.png',
        name: "Прокладка труб",
        description: "Описание описание описание",
    },
    {
        id: 4,
        image: 'intro-background.png',
        name: "Прокладка труб",
        description: "Описание описание описание",
    },
    {
        id: 5,
        image: 'intro-background.png',
        name: "Прокладка труб",
        description: "Описание описание описание",
    },
    {
        id: 6,
        image: 'intro-background.png',
        name: "Прокладка труб",
        description: "Описание описание описание",
    }
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

function Review({review} : ReviewProps ): React.JSX.Element {
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
                        <span className="review-rating">Рейтинг исполнителя: <span className="review-star">⭐</span> {review.rating}</span>
                    </div>
                    <span className="review-tasks">Выполнил {review.tasksCompleted} заданий</span>
                </div>
            </div>
        </div>
    )
}

export function Main(): React.JSX.Element {
    const [isChecked, setIsChecked] = useState(false);

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
            </div>

            <div className="service-container common">
                <div className="service-circles">
                    {services.map(service => (
                        <div className="service-item" key={service.id}>
                            <OrangeCircle image={service.image} name={service.name}/>
                            {/*<img className="review-image" src={service.image} alt={service.name} />*/}
                            {/*<p>{service.name}</p>*/}
                        </div>
                    ))}
                </div>
                <h1>МАСТЕРА</h1>
                <div className={"test"}>
                    <div className="service-cards">
                        {services.map(service => (
                            <ServiceCard key={service.id} image={service.image} description={service.description}/>
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
                                <div className={`switch-toggle ${isChecked ? 'checked' : ''}`} onClick={handleToggleChange}>
                                    <div className="switch-toggle-slider" />
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
