import React from 'react';
import './Footer.scss';

function Footer() {
    return (
        <footer className='footer'>
            <div className='footer__content'>
                <p>Developed by <a href="https://github.com/AdirElmaleh/autocomplete" target="_blank" rel="noreferrer">Adir Elmaleh</a> © {new Date().getFullYear()}</p>
            </div>
        </footer>
    );
}

export default Footer;
