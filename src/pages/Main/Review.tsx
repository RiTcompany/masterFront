import React from "react";
import {OrangeCircle} from "../../components/OrangeCircle/OrangeCircle.tsx";
import {ReviewType} from "./Main.tsx";


interface ReviewProps {
    review: ReviewType;
}

export function Review({review}: ReviewProps): React.JSX.Element {
    return (
        <div className="review">
            <div className="review-image">
                <OrangeCircle image={"/default-avatar.jpg"}/>
            </div>
            <div className="review-content">
                <p className="review-text">{review.text}</p>
                <div className="review-footer">
                    <div className="review-header">
                        <span className="review-name">{review.name}</span>
                        <span className="review-rating">Рейтинг исполнителя: <span
                            className="review-star">⭐</span> {review.rating}</span>
                    </div>
                    {/*<span className="review-tasks">Выполнил {review.tasksCompleted} заданий</span>*/}
                </div>
            </div>
        </div>
    )
}
