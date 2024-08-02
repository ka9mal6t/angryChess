import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { getInfo, startSearchGame, stopSearchGame, checkStatusGame} from '../api/auth';
import {updateRating} from '../functional/raiting'
import LoadingComponent from '../components/elements/LoadingComponent'
import HeaderComponent from "../components/elements/HeaderComponent";
import FooterComponent from "../components/elements/FooterComponent";
import ThemeTogglerComponent from '../components/elements/ThemeTogglerComponent'

import Cookies from 'js-cookie';

import './css/Main.css'

const HomePage: React.FC = () => {

  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [matches, setMatches] = useState<number | null>(null);
  const [wins, setWins] = useState<number | null>(null);
  const [draws, setDraws] = useState<number | null>(null);
  const [losses, setLosses] = useState<number | null>(null);
  const token = Cookies.get('accessToken');
  const [myUserId, setMyUserId] = useState<number>();

  const [inMatch, setInMatch] = useState<boolean>(false);

  const [ratingClass, setRatingClass] = useState<string>('');
  const [nicnameClass, setNicnameClass] = useState<string>('');

  const [searchingRating, setSearchingRating] = useState<boolean>(false);

  const startSearchRating = async () => {
    if (token) {
      try {
        const responce = await startSearchGame(token);
        setSearchingRating(true);
      } catch (error) {
        console.error('Failed to start game', error);
      }
    }
    else{
      navigate('/login');
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (searchingRating) {
      intervalId = setInterval(async () => {
        try {
          if (token) {
            const status = await checkStatusGame(token);
            if (status.match) { 
              clearInterval(intervalId);
              navigate('/playRating'); 
            }
            
          }
          else{
            navigate('/login');
          }

          } catch (error) {
            console.error('Failed to check game status', error);
        }
      }, 5000); // 5 секунд
    }

    // Очистка интервала при размонтировании компонента или когда остановлен поиск
    return () => clearInterval(intervalId);
  }, [searchingRating, token, navigate]);

  const stopSearchRating = async () => {
    if (token) {
      try {
        const responce = await stopSearchGame(token);
        setSearchingRating(false);
      } catch (error) {
        console.error('Failed to stop game', error);
      }
    }
    else{
      navigate('/login');
    }
    
  };

  useEffect(() => {
    const playOnOneDevice = document.getElementById('playOnOneDevice') as HTMLInputElement;
    const playRating = document.getElementById('playRating') as HTMLInputElement; 
    const returnToGame = document.getElementById('returnToGame') as HTMLInputElement; 

    

    const playRatingEvent = () => {
      startSearchRating();
    };

    
    const playOnOneDeviceEvent = () => {
      Cookies.set('OnOneDevice', JSON.stringify(true), { expires: 365 });
      navigate('/playOnOneDevice');
    };

    const returnToGameEvent = () => {
      navigate('/playRating');
    };

    playOnOneDevice.addEventListener('click', playOnOneDeviceEvent);
    playRating.addEventListener('click', playRatingEvent);

    returnToGame.addEventListener('click', returnToGameEvent);
    return () => {
      playOnOneDevice.removeEventListener('click', playOnOneDeviceEvent);
      playRating.removeEventListener('click', playRatingEvent);
      returnToGame.removeEventListener('click', returnToGameEvent);
    };

  },[]);


  useEffect(() => {
    const fetchUsername = async () => {
      if (token) {
        try {
          Cookies.remove('OnOneDevice');
          const {id, user, totalGamesPlayed, wins, losses, draws, rating} = await getInfo(token);
          setMyUserId(id);
          setUsername(user.username);
          setRating(rating);
          setMatches(totalGamesPlayed);
          setWins(wins);
          setDraws(draws);
          setLosses(losses);
          updateRating(setNicnameClass, setRatingClass, rating);
          

        } catch (error) {
          console.error('Failed to fetch username', error);
          navigate('/login');
        }
        try{
          await checkStatusGame(token);
          setInMatch(true);
        }
        catch (error) {
          setInMatch(false);
        }

      }
    };
    fetchUsername();
  }, []);

  return (
    <div>
      <header>
      <HeaderComponent userId={myUserId}/>
  </header>
  <main>
      <ThemeTogglerComponent/>
      <div className="main">
          <div className="main__info" 
          style={{display: inMatch ? 'flex' : 'none'}}
          ><p className="status__in_game">You in game now</p></div>
           
          <div className="main__button"
          style={{display: inMatch ? 'flex' : 'none'}}
          >
              <button className="btn_rating" id="returnToGame">Return to game</button>
          </div>

          <div className="main__info">
              <div className={`nickname ${nicnameClass}`}>{username}</div>
              <div className={`rating ${ratingClass}`}>{rating}</div>

          </div>
          <div className="2p_1d main__button">
              <button className="btn_search" id='playOnOneDevice'>Play on 1 device</button>
          </div>
          <div className="2p_2d main__button">
              <button className="btn_search" id='playRating'>Play rating</button>
          </div>
          <div className="2p_2d main__button">
              <button className="btn_search">Play with friend</button>
          </div>
          <div className="main__history">
              <table className="history__table">
                  <thead>
                      <tr>
                          <th>Matches</th>
                          <th>Wins</th>
                          <th>Draws</th>
                          <th>Losses</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr onClick={()=>{navigate(`/statistics/${myUserId}`)}}>
                          <td>{matches}</td>
                          <td className="win">{wins}</td>
                          <td className="draw">{draws}</td>
                          <td className="loss">{losses}</td>
                      </tr>
                    
                  </tbody>
              </table>
          </div>
      </div>
  </main>

  <FooterComponent/>
  {searchingRating && (
      <LoadingComponent
          isOpen={searchingRating}
          handleClose={() => {
              stopSearchRating();
          }}
          message={'Search opponents'}
          messageCancel='Cancel'
      />
  )}
  
  {searchingRating && <div className="overlay" />}
</div>
  );
};

export default HomePage;
