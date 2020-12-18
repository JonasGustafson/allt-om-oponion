import React from 'react';
import {Link} from 'react-router-dom';

import footerBackground from '../../resources/imgs/footer-background.png'

import './Footer.scss';

const Footer = () => {
    return (
        <div className="footer">
            <div className="background-wrapper">
                <img className="footer-background" src={footerBackground}/>
            </div>
           <p>Allt om Opinion © Alla rättigheter förbehållna | <Link to="privacy">Integritetspolicy</Link></p>
        </div>
    )
} 

export default Footer;
