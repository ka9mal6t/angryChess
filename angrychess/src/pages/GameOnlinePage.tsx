import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate, Link} from 'react-router-dom';
import useWebSocket from '../hooks/useWebSocket';
import BoardOnlineComponent from "../components/BoardOnlineComponent";
import { Board } from "../models/Board";
import { Player } from "../models/Player";
import { Colors } from "../models/Colors";
import LostFigures from "../components/LostFigures";
import {checkStatusGame, gameOnlineDetails} from '../api/auth'

import './css/Game.css';
import Cookies from 'js-cookie';

const GameOnlinePage: React.FC = () => {
  const token = Cookies.get('accessToken');

  const { messages, sendMessage } = useWebSocket('' + token);
  const navigate = useNavigate();

  const [board, setBoard] = useState<Board>(new Board());
  const [whitePlayer, setWhitePlayer] = useState<Player>(new Player(Colors.WHITE));
  const [blackPlayer, setBlackPlayer] = useState<Player>(new Player(Colors.BLACK));
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [playerColor, setplayerColor] = useState<Colors>(Colors.WHITE);
  const [playerId, setplayerId] = useState<number>(0);

  const [ratingClass, setRatingClass] = useState<string>('');
  const [nicnameClass, setNicnameClass] = useState<string>('');
  const [enemyRatingClass, setEnemyRatingClass] = useState<string>('');
  const [enemyNicnameClass, setEnemyNicnameClass] = useState<string>('');

  const [username, setUsername] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [enemyUsername, setEnemyUsername] = useState<string | null>(null);
  const [enemyRating, setEnemyRating] = useState<number | null>(null);

  const[draw, setDraw] = useState<boolean>(false);
  const[loose, setLoose] = useState<boolean>(false);

  const[matchId, setMatchId] = useState<number>(0);
  


  const checkColor = async () => {
    if (token) {
      try {
        const {match, nickname, rating, enemy_nickname, enemy_rating, user_id, color} = await checkStatusGame(token);
        setMatchId(match);
        const moves = await gameOnlineDetails(token, match);
        
        if(color === 0){
          setplayerColor(Colors.WHITE);
          setplayerId(user_id);

          setUsername(nickname);
          setRating(rating);
          setEnemyUsername(enemy_nickname);
          setEnemyRating(enemy_rating);
          
          updateRating(rating);
          updateEnemyRating(enemy_rating);
        }
        else if(color === 1){
          setplayerColor(Colors.BLACK);
          setplayerId(user_id);

          setUsername(nickname);
          setRating(rating);
          setEnemyUsername(enemy_nickname);
          setEnemyRating(enemy_rating);

          updateRating(rating);
          updateEnemyRating(enemy_rating);
        }
        else{
          navigate('/angryChess/');
        }

        if(moves.length > 0){
          const boardState = JSON.parse(moves[moves.length - 1].board.board);
          const newBoard = new Board();
          newBoard.setBoardFromState(boardState);
          setBoard(newBoard);

          const myPlayer = playerColor === Colors.WHITE ? whitePlayer : blackPlayer;
          const enemyPlayer = playerColor === Colors.WHITE ? blackPlayer : whitePlayer;
          moves.length % 2 === 0 ? (playerColor === Colors.WHITE ? setCurrentPlayer(myPlayer) : setCurrentPlayer(enemyPlayer)) : 
          (playerColor === Colors.WHITE ? setCurrentPlayer(enemyPlayer) : setCurrentPlayer(myPlayer));
        }
        
      } catch (error) {
        console.error('Failed to start game', error);
        navigate('/angryChess/');
      }
    }
    else{
      navigate('/angryChess/login');
    }
  };

  useEffect(() => {
    restart();
    checkColor();
    setCurrentPlayer(whitePlayer);
  }, []);

  useEffect(() => {
    messages.forEach((message) => {
      if (message.board) {
        if(message.board === "win"){
          setLoose(true);
        }
        else if(message.board === "draw"){
          setDraw(true);
        }
        else{
          const boardState = JSON.parse(message.board);
          const newBoard = new Board();
          newBoard.setBoardFromState(boardState);
          setBoard(newBoard);
          const myPlayer = playerColor === Colors.WHITE ? whitePlayer : blackPlayer;
          const enemyPlayer = playerColor === Colors.WHITE ? blackPlayer : whitePlayer;
          playerId === messages[messages.length - 1].id ? setCurrentPlayer(enemyPlayer) : setCurrentPlayer(myPlayer);
        }
       
      }
    });
    
  }, [messages]);

  const restart = () => {
    const newBoard = new Board();
    newBoard.initCells();
    newBoard.addFigures();
    setBoard(newBoard);
    setCurrentPlayer(whitePlayer);
  };

  const updateRating = (value: number) => {
    if (value < 1000) {
      setRatingClass('rating__1');
      setNicnameClass('nickname__1');
    } else if (value < 1500) {
      setRatingClass('rating__2');
      setNicnameClass('nickname__2');
    } else if (value < 2000) {
      setRatingClass('rating__3');
      setNicnameClass('nickname__3');
    } else if (value < 2500) {
      setRatingClass('rating__4');
      setNicnameClass('nickname__4');
    } else if (value < 3000) {
      setRatingClass('rating__5');
      setNicnameClass('nickname__5');
    } else{
      setRatingClass('rating__6');
      setNicnameClass('nickname__6');
    }
  };

  const updateEnemyRating = (value: number) => {
    if (value < 1000) {
      setEnemyRatingClass('rating__1');
      setEnemyNicnameClass('nickname__1');
    } else if (value < 1500) {
      setEnemyRatingClass('rating__2');
      setEnemyNicnameClass('nickname__2');
    } else if (value < 2000) {
      setEnemyRatingClass('rating__3');
      setEnemyNicnameClass('nickname__3');
    } else if (value < 2500) {
      setEnemyRatingClass('rating__4');
      setEnemyNicnameClass('nickname__4');
    } else if (value < 3000) {
      setEnemyRatingClass('rating__5');
      setEnemyNicnameClass('nickname__5');
    } else{
      setEnemyRatingClass('rating__6');
      setEnemyNicnameClass('nickname__6');
    }
  };

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


  const swapPlayer = () => {
    setCurrentPlayer(currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer);
    return currentPlayer?.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
  };

  const handleMove = (newBoardState: Board) => {
    try{
        const boardState = JSON.stringify(newBoardState.getBoardState());
        sendMessage({ board: boardState });
        setBoard(newBoardState);
    }
    catch (error) {
        console.error(error);
    }
    
  };

  const handleWin = () => {
    try{
        sendMessage({ board: "win" });
    }
    catch (error) {
        console.error(error);
    }
    
  };

  const handleDraw = () => {
    try{
        sendMessage({ board: "draw" });
    }
    catch (error) {
        console.error(error);
    }
    
  };

  return (
    <div>
      <header>
      <nav className="header">
          <div className="header__logo">
            <Link to="/angryChess/">
                  <svg width="75" height="75" viewBox="0 0 312.5 308.60782283369844" className="title__logo">
                      <defs id="SvgjsDefs1015"></defs>
                      <g id="SvgjsG1017" transform="matrix(2.593106007732617,0,0,2.5293106007732617,33.14240198522162,23.18502043936323)" >
                          <g xmlns="http://www.w3.org/2000/svg">
                              <path d="M10.1,80.7c5.6,4.2,12.6,4.1,19.3,3.1c7.6-1.1,14.8-2.8,22.5-2.8c7.5,0,15.2,2,22.7,1c6.6-0.9,12.1-4.9,13.9-11.5   c1.7-6,0.1-12.7-4.6-16.9c-3.3-2.9-8.1,1.9-4.8,4.8c3,2.6,3.9,6.8,2.7,10.6c-1.6,4.9-6.4,6.3-11.1,6.3c-5.9,0-11.7-1.2-17.5-1.2   c-6.4,0-12.8,0.7-19.1,1.9c-5.2,1-11.1,2.6-16.3,1c-4.8-1.4-7.5-5.7-7.8-10.5c-0.6-11,10.2-18.7,19.2-22.4c5.7-2.3,11.9-3.5,18-3.7   c3.3-0.1,6.6,0.1,9.9,0.7c3,0.5,5.9,1.3,8.9,1.3c1.1,0,1.8-1.5,0.9-2.3c-4.9-4.4-12.5-5.3-18.8-5.6c-7-0.4-14.2,0.8-20.7,3.3   C15.8,42.3,3.7,51.4,3.1,64.8C2.8,70.8,5.2,77.1,10.1,80.7z"></path>
                              <path d="M76.6,46.7c-0.4-0.2-0.7-0.5-1.1-0.7c-0.5-0.3-1.3-0.4-1.9-0.2c-0.5,0.2-0.9,0.5-1.3,0.9c-0.8,1-0.6,2.3,0.2,3.2   c0.3,0.3,0.6,0.7,0.9,1c0.5,0.5,1.2,0.7,1.9,0.8c0.8,0,1.6-0.4,2.1-1c0.4-0.6,0.6-1.2,0.5-1.9C77.8,47.8,77.3,47.2,76.6,46.7z"></path><path d="M30.3,58.1c-2.3,1-4.2,2.5-5.8,4.3c-1.2,1.3-1.4,3.1-0.3,4.6c1,1.3,3,1.9,4.5,0.9c1.8-1.2,3.5-2.4,5.5-3.2   c1.8-0.8,2.4-3.6,1.4-5.2C34.3,57.6,32.3,57.2,30.3,58.1z"></path>
                              <path d="M59.6,58.1c-1.8-0.8-4.2-0.6-5.2,1.4c-0.9,1.6-0.6,4.4,1.4,5.2c1.9,0.8,3.7,2,5.5,3.2c1.4,1,3.5,0.4,4.5-0.9   c1.1-1.4,0.9-3.2-0.3-4.6C63.8,60.6,61.9,59.1,59.6,58.1z"></path>
                              <path d="M82.8,12c-1.3-2.1-4.5-3.4-6.8-1.8c-2.5,1.8-4.9,3.2-6.6,5.9c-1.1,1.8,0.1,3.6,1.7,4.3c3,1.2,6.9,0,9.8-1.7   C83.3,17.5,84.3,14.2,82.8,12z"></path>
                              <path d="M7,18.8c2.9,1.7,6.8,2.9,9.8,1.7c1.7-0.7,2.8-2.5,1.7-4.3c-1.7-2.8-4.1-4.1-6.6-5.9C9.9,8.7,6.4,9.8,5.2,12   C4,14.4,4.6,17.4,7,18.8z"></path>
                          </g>
                      </g>
                  </svg>
              </Link>
          </div>
          <Link to={"/angryChess/statistics/" + playerId}><div className="header__item item_1">Statistics</div></Link>
          <Link to="/angryChess/friends"><div className="header__item item_2">Friends</div></Link>
          <Link to="/angryChess/inventory"><div className="header__item item_3">Inventory</div></Link>
          <Link to="/angryChess/help"><div className="header__item item_4">Help</div></Link>
      </nav>
  </header>
  <main>
  <div className="toggle-container">
            <label className="switch">
              <input type="checkbox" id="themeToggle" checked={isDarkTheme} onChange={handleThemeChange} />
              <span className="slider round"></span>
            </label>
            <span id="themeIcon" className="theme-icon"></span>
        </div>
      <div className="main">
          <div className="main__info">
              <div className={`nickname ${nicnameClass}`}>{username}</div>
              <div className={`rating ${ratingClass}`}>{rating}</div>
              <div className="raiting">VS</div>
              <div className={`nickname ${enemyNicnameClass}`}>{enemyUsername}</div>
              <div className={`rating ${enemyRatingClass}`}>{enemyRating}</div>
          </div>
          <div className="game">
      <div>
        <LostFigures title={"White"} figures={board.lostWhiteFigures} />
      </div>
      <BoardOnlineComponent
        matchId={matchId}
        swapSides={true}
        spectator={false}
        board={board}
        setBoard={setBoard}
        currentPlayer={currentPlayer}
        swapPlayer={swapPlayer}
        onMove={handleMove}
        playerColor={playerColor}
        loose={loose}
        draw={draw}
        sendDraw={handleDraw}
        sendWin={handleWin}
      />
      <div>
        <LostFigures title={"Black"} figures={board.lostBlackFigures} />
      </div>
    </div>
    </div>
  </main>

  <footer className="footer">
      <div className="footer__item">
          <Link to="/angryChess/help" className="footer__link">Help</Link>
      </div>
      <div className="footer__item">
          <Link to="/angryChess/developers" className="footer__link">Developers</Link>
      </div>
      <div className="footer__item">
        AngryChess © 2024
      </div>
  </footer>
</div>
  );
};

export default GameOnlinePage;
