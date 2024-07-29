import React from 'react';
import { useState, useEffect  } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import RegisterForm from '../components/forms/RegisterForm';
import ThemeTogglerComponent from '../components/elements/ThemeTogglerComponent'

import bird from './img/bird-bumerang.png'
import pig from './img/king-pig-wo-eyes.png'
import eyes from './img/eyes.png'
import './css/Register.css'

const RegisterPage: React.FC = () => {

  useEffect(() => {
    const themeToggle = document.getElementById('themeToggle') as HTMLInputElement;
    const eyes = document.getElementById('eyes') as HTMLImageElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const cnfmPassword = document.getElementById('cnfrm_password') as HTMLInputElement;

    const handleThemeChange = () => {
      eyes.style.transition = `0.4s`;
      if (themeToggle.checked) {
        eyes.style.transform = `translateX(70%)`;
      } else {
        eyes.style.transform = `translateY(51.1%) translateX(70%) rotate(-18deg)`;
      }
    };

    const handlePasswordFocus = () => {
      eyes.style.transition = `0.4s`;
      password.classList.add('in_focus');
      document.querySelector('.register__img-dark')?.classList.add('in_focus');
      if (themeToggle.checked) {
        eyes.style.transform = `translateX(70%) translateY(383%) rotate(180deg)`;
      } else {
        eyes.style.transform = `translateY(51.1%) translateX(70%) rotate(-18deg)`;
      }
    };

    const handlePasswordBlur = () => {
      eyes.style.transition = `0.4s`;
      password.classList.remove('in_focus');
      document.querySelector('.register__img-dark')?.classList.remove('in_focus');
      if (themeToggle.checked) {
        eyes.style.transform = `translateX(70%)`;
      } else {
        eyes.style.transform = `translateY(51.1%) translateX(70%) rotate(-18deg)`;
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (document.body.classList.contains('dark-theme')) {
        const { clientX: mouseX, clientY: mouseY } = event;
        const eyeRect = eyes.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;
        const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
        const maxDistance = Math.min(eyeRect.width, eyeRect.height) / 40;
        const eyeTranslateX = Math.cos(angle) * maxDistance;
        const eyeTranslateY = Math.sin(angle) * maxDistance;

        if (!password.classList.contains('in_focus')) {
          eyes.style.transform = `translate(${70 + eyeTranslateX}px, ${eyeTranslateY}px)`;
        }
        eyes.style.transition = `0.1s ease`;
      }
    };
    
    themeToggle.addEventListener('change', handleThemeChange);
    password.addEventListener('focus', handlePasswordFocus);
    cnfmPassword.addEventListener('focus', handlePasswordFocus);
    password.addEventListener('blur', handlePasswordBlur);
    cnfmPassword.addEventListener('blur', handlePasswordBlur);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      themeToggle.removeEventListener('change', handleThemeChange);
      password.removeEventListener('focus', handlePasswordFocus);
      cnfmPassword.removeEventListener('focus', handlePasswordFocus);
      password.removeEventListener('blur', handlePasswordBlur);
      cnfmPassword.removeEventListener('blur', handlePasswordBlur);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  

  return (
    <div>
      <main>
        <ThemeTogglerComponent/>
        <div className="title">
            <div className="title__block">
                <svg width="220.84918835920803" height="200.60752563476564" viewBox="0 0 312.5 308.60782283369844" className="title__logo">
                    <defs id="SvgjsDefs1015"></defs>
                    <g id="SvgjsG1017" transform="matrix(1.793106007732617,0,0,1.7293106007732617,83.14240198522162,23.18502043936323)" >
                        <g xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.1,80.7c5.6,4.2,12.6,4.1,19.3,3.1c7.6-1.1,14.8-2.8,22.5-2.8c7.5,0,15.2,2,22.7,1c6.6-0.9,12.1-4.9,13.9-11.5   c1.7-6,0.1-12.7-4.6-16.9c-3.3-2.9-8.1,1.9-4.8,4.8c3,2.6,3.9,6.8,2.7,10.6c-1.6,4.9-6.4,6.3-11.1,6.3c-5.9,0-11.7-1.2-17.5-1.2   c-6.4,0-12.8,0.7-19.1,1.9c-5.2,1-11.1,2.6-16.3,1c-4.8-1.4-7.5-5.7-7.8-10.5c-0.6-11,10.2-18.7,19.2-22.4c5.7-2.3,11.9-3.5,18-3.7   c3.3-0.1,6.6,0.1,9.9,0.7c3,0.5,5.9,1.3,8.9,1.3c1.1,0,1.8-1.5,0.9-2.3c-4.9-4.4-12.5-5.3-18.8-5.6c-7-0.4-14.2,0.8-20.7,3.3   C15.8,42.3,3.7,51.4,3.1,64.8C2.8,70.8,5.2,77.1,10.1,80.7z"></path>
                            <path d="M76.6,46.7c-0.4-0.2-0.7-0.5-1.1-0.7c-0.5-0.3-1.3-0.4-1.9-0.2c-0.5,0.2-0.9,0.5-1.3,0.9c-0.8,1-0.6,2.3,0.2,3.2   c0.3,0.3,0.6,0.7,0.9,1c0.5,0.5,1.2,0.7,1.9,0.8c0.8,0,1.6-0.4,2.1-1c0.4-0.6,0.6-1.2,0.5-1.9C77.8,47.8,77.3,47.2,76.6,46.7z"></path><path d="M30.3,58.1c-2.3,1-4.2,2.5-5.8,4.3c-1.2,1.3-1.4,3.1-0.3,4.6c1,1.3,3,1.9,4.5,0.9c1.8-1.2,3.5-2.4,5.5-3.2   c1.8-0.8,2.4-3.6,1.4-5.2C34.3,57.6,32.3,57.2,30.3,58.1z"></path>
                            <path d="M59.6,58.1c-1.8-0.8-4.2-0.6-5.2,1.4c-0.9,1.6-0.6,4.4,1.4,5.2c1.9,0.8,3.7,2,5.5,3.2c1.4,1,3.5,0.4,4.5-0.9   c1.1-1.4,0.9-3.2-0.3-4.6C63.8,60.6,61.9,59.1,59.6,58.1z"></path>
                            <path d="M82.8,12c-1.3-2.1-4.5-3.4-6.8-1.8c-2.5,1.8-4.9,3.2-6.6,5.9c-1.1,1.8,0.1,3.6,1.7,4.3c3,1.2,6.9,0,9.8-1.7   C83.3,17.5,84.3,14.2,82.8,12z"></path>
                            <path d="M7,18.8c2.9,1.7,6.8,2.9,9.8,1.7c1.7-0.7,2.8-2.5,1.7-4.3c-1.7-2.8-4.1-4.1-6.6-5.9C9.9,8.7,6.4,9.8,5.2,12   C4,14.4,4.6,17.4,7,18.8z"></path>
                        </g>
                    </g>
                    <g id="SvgjsG1018" transform="matrix(1.3978272801755817,0,0,1.3978272801755817,7.00000171246963,192.80625056896804)" >
                        <path d="M22.24 20.12 l-3.2 0 l4.04 19.88 l-8.12 0 l-0.76 -3.68 l-7.08 0 l-0.64 3.68 l-6.48 0 l3.44 -19.88 l-1.96 0 l0 -9.88 l20.76 0 l0 9.88 z M8.56 27.8 l3.92 0 l-1.56 -7.68 l-1 0 z M37.68 26.68 l0 -16.44 l6 0 l0 29.76 l-7.64 0 l-4.12 -21.16 l0 21.16 l-6.84 0 l0 -29.76 l9.68 0 z M56.28000000000001 10.239999999999998 c8 0 10.64 2.6 10.64 8.68 l0 2.6 l-5.64 0 c-0.04 -2.44 -1.16 -3.44 -4.44 -3.44 c-3.36 0 -4.44 1.12 -4.44 3.64 l0 7.88 c0 2.48 1.12 3.8 4.44 3.8 c3.56 0 4.36 -1.16 4.44 -3.48 l-5.52 0 l0 -6.48 l11.16 0 l0 7.52 c0 6.08 -1.76 9.04 -10.64 9.04 c-8 0 -10.6 -3.08 -10.6 -9.04 l0 -12.04 c0 -5.96 2.52 -8.68 10.6 -8.68 z M79.48000000000002 31.48 c-0.16 -0.2 -0.36 -0.28 -0.56 -0.28 l-3.16 0 l0 7.32 l-6.84 0 l0 -28.28 l9.24 0 c7.36 0 8.8 1.76 8.8 5.36 l0 7.12 c0 3.12 -2.4 3.64 -4.24 4.16 c1.84 1.12 4.04 1.8 4.04 5.76 l-0.12 7.36 l-6.84 0 l0.08 -7.44 c0 -0.44 -0.12 -0.84 -0.4 -1.08 z M75.76000000000002 23 c0.36 0.12 0.8 0.16 1.36 0.16 c1.96 0 2.6 -0.64 2.6 -2.16 l0 -2.96 c0 -1.52 -0.44 -2.24 -2.6 -2.24 c-0.56 0 -1 0.04 -1.36 0.16 l0 7.04 z M101.64000000000001 17.92 l3.96 -7.68 l6.16 0 l-8 15.92 l0 13.84 l-6.8 0 l0 -13.84 l-8 -15.92 l8.76 0 z M133.56 10.239999999999998 c8.88 0 10.64 2.96 10.64 9.04 l0 6.72 l-5.64 0 l0 -3.48 c0 -2.52 -0.72 -3.8 -4.44 -3.8 c-3.32 0 -4.44 1.32 -4.44 3.8 l0 6 c0 2.52 1.08 3.64 4.44 3.64 c3.28 0 4.4 -1 4.44 -3.44 l5.64 0 l0 2.6 c0 6.08 -2.64 8.68 -10.64 8.68 c-8.08 0 -10.6 -2.68 -10.6 -8.68 l0 -12.04 c0 -5.96 2.6 -9.04 10.6 -9.04 z M159.76000000000002 25 l0 -14.76 l5.96 0 l0 29.76 l-5.96 0 l0 -6.48 l-5.8 0 l0 6.48 l-7.76 0 l0 -29.76 l7.76 0 l0 14.76 l5.8 0 z M167.72000000000003 40 l0 -29.76 l17.32 0 l0 8.36 l-10.48 0 l0 3.68 l8.6 0 l0 5.96 l-8.6 0 l0 3.4 l10.48 0 l0 8.36 l-17.24 0 l-0.08 0 z M196.40000000000003 31.560000000000002 c-5.4 0 -7.08 -1.16 -7.08 -3.76 l0 -3.12 l4.76 0 l0 0.84 c0 0.68 0.56 1 2.44 1 c1.84 0 2.44 -0.32 2.44 -1 l0 -1.4 c0 -0.44 -0.12 -0.72 -0.76 -0.88 c-0.24 -0.08 -0.52 -0.12 -0.8 -0.08 l-2.16 0 l0 0 c-3.36 -0.08 -5.04 -0.8 -5.64 -2.16 c-0.2 -0.44 -0.28 -1 -0.28 -1.6 l0 -5.24 c0 -2.6 1.68 -3.92 6.8 -3.92 c5.64 0 6.76 1.28 6.76 3.92 l0 4.32 l-4.64 0 l0 -2.28 c0 -1.24 -0.28 -1.88 -1.68 -1.88 c-1.24 0 -1.64 0.64 -1.64 1.88 l0 2.48 l0 0 c0 0.12 0.16 1.76 2.08 1.76 c1.44 0 4.12 -0.2 5.52 0.68 c0.56 0.36 0.92 0.88 0.92 1.64 l0 5.04 c0 2.64 -1.72 3.76 -7.04 3.76 z M221.64000000000001 25.439999999999998 c0.68 0.48 1.12 1.2 1.12 2.28 l0 7 c0 3.68 -2.12 5.24 -8.56 5.28 l0 0 l-27.16 0 l0 -7.04 l27.16 0 c2.28 -0.04 3 -0.44 3 -1.4 l0 -1.96 c0 -0.6 -0.2 -1 -0.96 -1.24 c-0.32 -0.08 -0.64 -0.12 -1 -0.12 c-0.48 0.04 -2.32 0.04 -2.68 0.04 l0 0 c-4.2 -0.16 -6.24 -1.12 -7 -3.04 c-0.24 -0.64 -0.36 -1.36 -0.36 -2.2 l0 -7.32 c0 -3.6 2.08 -5.48 8.44 -5.48 c7.04 0 8.44 1.8 8.44 5.48 l0 6.04 l-5.76 0 l0 -3.2 c0 -1.76 -0.36 -2.6 -2.08 -2.6 c-1.6 0 -2.08 0.88 -2.08 2.6 l0 3.44 l0 0 c0 0.2 0.2 2.44 2.6 2.44 c1.76 0 5.12 -0.24 6.88 1 z"></path>
                    </g>
                    <g id="SvgjsG1019" transform="matrix(0.7473766766469754,0,0,0.7473766766469754,55.31577915419128,267.04416563289487)">
                        <path d="M6.4 20.26 c-2.85 0 -5.15 -2.26 -5.15 -5.14 c0 -2.87 2.3 -5.14 5.15 -5.14 c2.84 0 5.14 2.27 5.14 5.14 c0 2.88 -2.3 5.14 -5.14 5.14 z M6.4 18.25 c1.72 0 3.05 -1.4 3.05 -3.13 c0 -1.72 -1.33 -3.14 -3.05 -3.14 c-1.73 0 -3.06 1.42 -3.06 3.14 c0 1.73 1.33 3.13 3.06 3.13 z M29.113500000000002 8.13 c-0.7 0 -1.25 -0.55 -1.25 -1.24 c0 -0.7 0.55 -1.25 1.25 -1.25 c0.69 0 1.24 0.55 1.24 1.25 c0 0.69 -0.55 1.24 -1.24 1.24 z M33.173500000000004 18.19 c0.18 0 0.3 0.12 0.3 0.3 l0 1.21 c0 0.18 -0.12 0.3 -0.3 0.3 l-8.61 0 c-0.18 0 -0.3 -0.12 -0.3 -0.3 l0 -1.21 c0 -0.18 0.12 -0.3 0.3 -0.3 l3.49 0 l0 -6.18 l-2.99 0 c-0.18 0 -0.3 -0.12 -0.3 -0.3 l0 -1.21 c0 -0.18 0.12 -0.3 0.3 -0.3 l4.85 0 c0.18 0 0.3 0.12 0.3 0.3 l0 7.69 l2.96 0 z M52.117000000000004 9.98 c2.09 0 3.54 1.42 3.54 4.04 l0 5.68 c0 0.18 -0.12 0.3 -0.3 0.3 l-1.56 0 c-0.18 0 -0.3 -0.12 -0.3 -0.3 l0 -5.36 c0 -1.67 -0.86 -2.37 -2.17 -2.37 c-1.9 0 -2.72 1.64 -2.72 2.08 l0 5.65 c0 0.18 -0.12 0.3 -0.3 0.3 l-1.56 0 c-0.18 0 -0.3 -0.12 -0.3 -0.3 l0 -9.2 c0 -0.18 0.12 -0.3 0.3 -0.3 l1.48 0 c0.18 0 0.28 0.12 0.3 0.3 l0.08 1.32 l0.21 0 c0.58 -0.94 1.65 -1.84 3.3 -1.84 z M78.44050000000001 19.64 c0.16 0.2 0.06 0.36 -0.18 0.36 l-1.79 0 c-0.16 0 -0.25 -0.04 -0.36 -0.18 l-3.26 -3.96 l-1.61 1.71 l0 2.13 c0 0.18 -0.12 0.3 -0.3 0.3 l-1.56 0 c-0.18 0 -0.3 -0.12 -0.3 -0.3 l0 -14 c0 -0.18 0.12 -0.3 0.3 -0.3 l1.56 0 c0.18 0 0.3 0.12 0.3 0.3 l0 9.19 l4.2 -4.53 c0.11 -0.12 0.23 -0.16 0.37 -0.16 l1.9 0 c0.26 0 0.35 0.17 0.16 0.36 l-3.67 3.88 z M113.9175 20.26 c-2.85 0 -5.15 -2.26 -5.15 -5.14 c0 -2.87 2.3 -5.14 5.15 -5.14 c2.84 0 5.14 2.27 5.14 5.14 c0 2.88 -2.3 5.14 -5.14 5.14 z M113.9175 18.25 c1.72 0 3.05 -1.4 3.05 -3.13 c0 -1.72 -1.33 -3.14 -3.05 -3.14 c-1.73 0 -3.06 1.42 -3.06 3.14 c0 1.73 1.33 3.13 3.06 3.13 z M136.631 8.13 c-0.7 0 -1.25 -0.55 -1.25 -1.24 c0 -0.7 0.55 -1.25 1.25 -1.25 c0.69 0 1.24 0.55 1.24 1.25 c0 0.69 -0.55 1.24 -1.24 1.24 z M140.691 18.19 c0.18 0 0.3 0.12 0.3 0.3 l0 1.21 c0 0.18 -0.12 0.3 -0.3 0.3 l-8.61 0 c-0.18 0 -0.3 -0.12 -0.3 -0.3 l0 -1.21 c0 -0.18 0.12 -0.3 0.3 -0.3 l3.49 0 l0 -6.18 l-2.99 0 c-0.18 0 -0.3 -0.12 -0.3 -0.3 l0 -1.21 c0 -0.18 0.12 -0.3 0.3 -0.3 l4.85 0 c0.18 0 0.3 0.12 0.3 0.3 l0 7.69 l2.96 0 z M159.63450000000003 9.98 c2.09 0 3.54 1.42 3.54 4.04 l0 5.68 c0 0.18 -0.12 0.3 -0.3 0.3 l-1.56 0 c-0.18 0 -0.3 -0.12 -0.3 -0.3 l0 -5.36 c0 -1.67 -0.86 -2.37 -2.17 -2.37 c-1.9 0 -2.72 1.64 -2.72 2.08 l0 5.65 c0 0.18 -0.12 0.3 -0.3 0.3 l-1.56 0 c-0.18 0 -0.3 -0.12 -0.3 -0.3 l0 -9.2 c0 -0.18 0.12 -0.3 0.3 -0.3 l1.48 0 c0.18 0 0.28 0.12 0.3 0.3 l0.08 1.32 l0.21 0 c0.58 -0.94 1.65 -1.84 3.3 -1.84 z M185.95800000000003 19.64 c0.16 0.2 0.06 0.36 -0.18 0.36 l-1.79 0 c-0.16 0 -0.25 -0.04 -0.36 -0.18 l-3.26 -3.96 l-1.61 1.71 l0 2.13 c0 0.18 -0.12 0.3 -0.3 0.3 l-1.56 0 c-0.18 0 -0.3 -0.12 -0.3 -0.3 l0 -14 c0 -0.18 0.12 -0.3 0.3 -0.3 l1.56 0 c0.18 0 0.3 0.12 0.3 0.3 l0 9.19 l4.2 -4.53 c0.11 -0.12 0.23 -0.16 0.37 -0.16 l1.9 0 c0.26 0 0.35 0.17 0.16 0.36 l-3.67 3.88 z M221.43500000000003 20.26 c-2.85 0 -5.15 -2.26 -5.15 -5.14 c0 -2.87 2.3 -5.14 5.15 -5.14 c2.84 0 5.14 2.27 5.14 5.14 c0 2.88 -2.3 5.14 -5.14 5.14 z M221.43500000000003 18.25 c1.72 0 3.05 -1.4 3.05 -3.13 c0 -1.72 -1.33 -3.14 -3.05 -3.14 c-1.73 0 -3.06 1.42 -3.06 3.14 c0 1.73 1.33 3.13 3.06 3.13 z M244.1485 8.13 c-0.7 0 -1.25 -0.55 -1.25 -1.24 c0 -0.7 0.55 -1.25 1.25 -1.25 c0.69 0 1.24 0.55 1.24 1.25 c0 0.69 -0.55 1.24 -1.24 1.24 z M248.20850000000002 18.19 c0.18 0 0.3 0.12 0.3 0.3 l0 1.21 c0 0.18 -0.12 0.3 -0.3 0.3 l-8.61 0 c-0.18 0 -0.3 -0.12 -0.3 -0.3 l0 -1.21 c0 -0.18 0.12 -0.3 0.3 -0.3 l3.49 0 l0 -6.18 l-2.99 0 c-0.18 0 -0.3 -0.12 -0.3 -0.3 l0 -1.21 c0 -0.18 0.12 -0.3 0.3 -0.3 l4.85 0 c0.18 0 0.3 0.12 0.3 0.3 l0 7.69 l2.96 0 z M267.152 9.98 c2.09 0 3.54 1.42 3.54 4.04 l0 5.68 c0 0.18 -0.12 0.3 -0.3 0.3 l-1.56 0 c-0.18 0 -0.3 -0.12 -0.3 -0.3 l0 -5.36 c0 -1.67 -0.86 -2.37 -2.17 -2.37 c-1.9 0 -2.72 1.64 -2.72 2.08 l0 5.65 c0 0.18 -0.12 0.3 -0.3 0.3 l-1.56 0 c-0.18 0 -0.3 -0.12 -0.3 -0.3 l0 -9.2 c0 -0.18 0.12 -0.3 0.3 -0.3 l1.48 0 c0.18 0 0.28 0.12 0.3 0.3 l0.08 1.32 l0.21 0 c0.58 -0.94 1.65 -1.84 3.3 -1.84 z M293.47549999999995 19.64 c0.16 0.2 0.06 0.36 -0.18 0.36 l-1.79 0 c-0.16 0 -0.25 -0.04 -0.36 -0.18 l-3.26 -3.96 l-1.61 1.71 l0 2.13 c0 0.18 -0.12 0.3 -0.3 0.3 l-1.56 0 c-0.18 0 -0.3 -0.12 -0.3 -0.3 l0 -14 c0 -0.18 0.12 -0.3 0.3 -0.3 l1.56 0 c0.18 0 0.3 0.12 0.3 0.3 l0 9.19 l4.2 -4.53 c0.11 -0.12 0.23 -0.16 0.37 -0.16 l1.9 0 c0.26 0 0.35 0.17 0.16 0.36 l-3.67 3.88 z"></path>
                    </g>
                </svg>
            </div>
        </div>
        <div className="register">
            <img src={bird} draggable="false" alt="123" className="register__img-light"/>
            <img src={pig} draggable="false" alt="123" className="register__img-dark"/>
            <img src={eyes} draggable="false" alt="123" id="eyes"/>
            <RegisterForm />
        </div>
        <div className="add">
            <div className="add__form">
                <div className="add__text">
                    Alredy have an account?
                </div>
                <div className="add__text">
                  <Link to="/login" className="add__link">Login</Link>
                </div>
            </div>
        </div>
    </main>
    <footer>
    </footer>
    </div>
  );
};

export default RegisterPage;
