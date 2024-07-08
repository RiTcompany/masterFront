import React from "react";

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

export function CreatedCard({image, title, description, master, city, age, rating}: ServiceType): React.JSX.Element {

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
                                {stars.map((_, index) => (
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
