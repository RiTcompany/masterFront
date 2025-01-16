import React from "react";
import "./ServiceCard.css"

interface ServiceCardProps {
    image: string;
    description: string
}

export function ServiceCard({image, description}: ServiceCardProps): React.JSX.Element {
    return (
        <div className='service-card'>
            <img src={image} alt='image'/>
            <div>{description}</div>
        </div>
    )
}
