import React from 'react';
import Cookies from 'js-cookie';
import { useState, useEffect  } from 'react';
import { useNavigate} from 'react-router-dom';

import bird from './img/bird-bumerang.png'
import pig from './img/king-pig-wo-eyes.png'
import eyes_png from './img/eyes.png'
import './css/Error.css'

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = Cookies.get('theme');
    const result = storedTheme ? JSON.parse(storedTheme) : false;
    document.body.className = result ? 'dark-theme' : '';
  }, []);

  useEffect(() => {
    const image1 = document.getElementById("image-error1") as HTMLInputElement;
    const image2 = document.getElementById("image-error2") as HTMLInputElement;

    const imageEvent = () => {
      navigate('/');
    };

    image1.addEventListener('click', imageEvent);
    image2.addEventListener('click', imageEvent);
    return () => {
      image1.removeEventListener('click', imageEvent);
      image2.removeEventListener('click', imageEvent);
    };
    

  },[]);


  return (
    <div>
      <main>
        <div className="error">
            <p className="error__p">4</p>
            <img src={bird} draggable="false" id="image-error1" alt="0" className="error__img-light" style={{cursor: 'pointer'}}/>
            <img src={pig} draggable="false" id="image-error2" alt="0" className="error__img-dark" style={{cursor: 'pointer'}}/>
            <img src={eyes_png} draggable="false" alt="0" id="eyes"/>
            <p className="error__p">4</p>
        </div>

      </main>
    </div>
  );
};

export default NotFoundPage;
