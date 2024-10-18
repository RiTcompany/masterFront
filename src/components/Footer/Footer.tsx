import React from "react";
import './Footer.css'

export function Footer(): React.JSX.Element {
    return (
        <div className="footer">
            <div className={'footer-content'}>
                <div style={{display: "flex", gap: "7px"}}>
                    <a href="/Spb-masters.ru_website_privacy_policy.pdf" target="_blank" className={"footer-links"}>Политика конфидециальности</a>
                    <a href="/Spb-masters.ru_User_agreement.pdf" target="_blank" className={"footer-links"}>Пользовательское соглашение</a>
                </div>
                <div className={"footer-links"}>
                    <p>Проказин Иван Леонидович, ИНН 532114769283</p>
                    <p>Адрес: Ленинградская область, Всеволожский р-н, г. Мурино, ул. Шувалова, д. 27/7, кв. 623</p>
                    <p>тел.: +7-911-035-95-06</p>
                    <p>e-mail: master-na-chas-spb@yandex.ru</p>
                </div>
                <div className={"developers"}>
                    Created by RiT
                </div>
            </div>
        </div>
    )
}
