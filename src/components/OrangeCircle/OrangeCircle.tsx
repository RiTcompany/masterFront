import React from "react";
import './OrangeCircle.css'

interface OrangeCircleProps {
    image: string;
    title?: string
}

export function OrangeCircle({image, title}: OrangeCircleProps): React.JSX.Element {
    return (
        <>
            <img className="round-image" src={image} alt={title} />
            <p className="image-text">{title}</p>
        </>
    )
}
