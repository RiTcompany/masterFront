import React from "react";
import './OrangeCircle.css'

interface OrangeCircleProps {
    image: string;
    name?: string
}

export function OrangeCircle({image, name}: OrangeCircleProps): React.JSX.Element {
    return (
        <>
            <img className="round-image" src={image} alt={name} />
            <p className="image-text">{name}</p>
        </>
    )
}
