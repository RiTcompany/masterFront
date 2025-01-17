import React from "react";

import("./OrangeButton.css")

interface OrangeButtonProps {
    text: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
export function OrangeButton({text, onClick}: OrangeButtonProps): React.JSX.Element {
    return (
        <button className={"orange-button"} onClick={onClick}>{text}</button>
    )
}
