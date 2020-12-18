import React, {useState, useEffect} from 'react';
import ReactGA from 'react-ga';

import {cookiesExist, setUpGoogleAnalytics} from '../../../utils/Helper';
import {Link} from 'react-router-dom';

import './CookieHandler.scss';

const CookieHandler = () => {

    const [cookiesAccepted, setAccepted] = useState(true)

    useEffect(() => {
        if (!cookiesExist(['_ga', '_gid'])) {
            setAccepted(false);
        }
    }, [])

    return (
        <div className={"cookie-handler" + (cookiesAccepted? '': ' cookies-not-accepted')}>
            <h2>Cookies</h2>
            <div className="cookie-actions">
                <p>Vi använder cookies för att öka användarupplevelsen på hemsidan. <br/>Undrar du hur? Läs mer <Link to="privacy" className="cookie-button">här</Link></p>
                <button className="cookie-button" onClick={() => {
                    setUpGoogleAnalytics();
                    setAccepted(true)
                }}>Jag Förstår</button>
            </div>
            
        </div>
    )
}

export default CookieHandler;

