import { useState, useEffect } from 'react';
import './CookieConsent.css';

export const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');
        if (!cookiesAccepted) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookiesAccepted', 'true');
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="cookie-consent">
            <div className="cookie-content">
                <p>Мы используем файлы cookie.</p>
                <button onClick={handleAccept}>Принять</button>
            </div>
        </div>
    );
};
