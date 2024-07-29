import React, { useEffect, useState } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import useSpectatorWebSocket from '../hooks/useSpectatorWebSocket';

import BoardOnlineComponent from "../components/chess-elements/BoardOnlineComponent";
import HeaderComponent from "../components/elements/HeaderComponent";
import FooterComponent from "../components/elements/FooterComponent";
import ThemeTogglerComponent from '../components/elements/ThemeTogglerComponent'
import {updateRating} from '../functional/raiting'

import { Board } from "../models/Board";
import { Player } from "../models/Player";
import { Colors } from "../models/Colors";
import LostFigures from "../components/chess-elements/LostFigures";
import {gameResult, gameOnlineDetails, getInfo, getInfoAboutUser} from '../api/auth'

import './css/Game.css';
import Cookies from 'js-cookie';

const GameWatchOnlinePage: React.FC = () => {
  const token = Cookies.get('accessToken');
  const [myUserId, setMyUserId] = useState<number>();

  const { match_id } = useParams<{ match_id: string }>();
  const matchIdNumber = match_id ? Number(match_id) : 0;

  const {messages}  = useSpectatorWebSocket('' + token, '' + match_id);
  const navigate = useNavigate();

  const [board, setBoard] = useState<Board>(new Board());
  const whitePlayer = new Player(Colors.WHITE);
  const blackPlayer = new Player(Colors.BLACK);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const playerColor = Colors.WHITE;


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
 


  const checkColor = async () => {
    if (token) {
      try {
        Cookies.remove('OnOneDevice');
        const {id} = await getInfo(token);
        setMyUserId(id);

        const match = await gameResult(token, matchIdNumber);
        if (match.end)
            navigate('/match/' + matchIdNumber);
        
        const white = await getInfoAboutUser(token, match.white_id)
        const black = await getInfoAboutUser(token, match.black_id)
        
        setUsername(white.username);
        setRating(white.rating);
        setEnemyUsername(black.username);
        setEnemyRating(black.rating);
        
        updateRating(setNicnameClass, setRatingClass, white.rating);
        updateRating(setEnemyNicnameClass, setEnemyRatingClass, black.rating);

        const moves = await gameOnlineDetails(token, matchIdNumber);

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
        navigate('/');
      }
    }
    else{
      navigate('/login');
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
          swapPlayer();
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


  const swapPlayer = () => {
    setCurrentPlayer(currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer);
    return currentPlayer?.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
  };

  return (
    <div>
      <HeaderComponent userId={myUserId}/>
  <main>
    <ThemeTogglerComponent/>
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
        matchId={matchIdNumber}
        swapSides={false}
        spectator={true}
        board={board}
        setBoard={setBoard}
        currentPlayer={currentPlayer}
        swapPlayer={swapPlayer}
        onMove={()=>null}
        playerColor={playerColor}
        loose={loose}
        draw={draw}
        sendDraw={()=>null}
        sendWin={()=>null}
      />
      <div>
        <LostFigures title={"Black"} figures={board.lostBlackFigures} />
      </div>
    </div>
    </div>
  </main>

 <FooterComponent/>
</div>
  );
};

export default GameWatchOnlinePage;
