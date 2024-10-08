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
                <img className={title ? 'category-image' : 'round-image'} src={image} alt={title} />
            </div>
            <p className="image-text">{title}</p>
            </div>
        </>
    )
}
