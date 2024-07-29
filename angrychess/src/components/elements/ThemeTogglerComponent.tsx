import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const ThemeTogglerComponent: React.FC = () => {

    const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
        const storedTheme = Cookies.get('theme');
        return storedTheme ? JSON.parse(storedTheme) : false;
      });
    
      useEffect(() => {
        document.body.className = isDarkTheme ? 'dark-theme' : '';
      }, [isDarkTheme]);

      const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.checked;
        setIsDarkTheme(newValue);
        Cookies.set('theme', JSON.stringify(newValue), { expires: 365 });
      };


    return (
        <div className="toggle-container">
            <label className="switch">
                <input type="checkbox" id="themeToggle" checked={isDarkTheme} onChange={handleThemeChange} />
                <span className="slider round"></span>
            </label>
            <span id="themeIcon" className="theme-icon"></span>
        </div> 
    );
};

export default ThemeTogglerComponent;