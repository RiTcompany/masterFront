import React from "react";
import './OrangeCircle.css'

interface OrangeCircleProps {
    image: string;
    title?: string
}

export function OrangeCircle({image, title}: OrangeCircleProps): React.JSX.Element {
    return (
        <>
            <div className={'or-circle'}>
            <div className="round-image">
                {
                    image === "/default-avatar.jpg" ? <img src={"/default-avatar.jpg"} style={{height: "90px"}}/> : <img className={title ? 'category-image' : 'round-image'} src={image} alt={title} />
                }

            </div>
            <p className="image-text">{title}</p>
            </div>
        </>
    )
}
