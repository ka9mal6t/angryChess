import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWebSocket from '../hooks/useWebSocket';
import BoardOnlineComponent from "../components/chess-elements/BoardOnlineComponent";
import HeaderComponent from "../components/elements/HeaderComponent";
import FooterComponent from "../components/elements/FooterComponent";
import ThemeTogglerComponent from '../components/elements/ThemeTogglerComponent'
import {updateRating} from '../functional/raiting'
import { Board } from "../models/Board";
import { Player } from "../models/Player";
import { Colors } from "../models/Colors";
import LostFigures from "../components/chess-elements/LostFigures";
import {checkStatusGame, gameOnlineDetails} from '../api/auth'

import './css/Game.css';
import Cookies from 'js-cookie';

const GameOnlinePage: React.FC = () => {
  const token = Cookies.get('accessToken');

  const { messages, sendMessage } = useWebSocket('' + token);
  const navigate = useNavigate();

  const [board, setBoard] = useState<Board>(new Board());
  const whitePlayer = new Player(Colors.WHITE);
  const blackPlayer = new Player(Colors.BLACK);
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
          
          updateRating(setNicnameClass, setRatingClass, rating);
          updateRating(setEnemyNicnameClass, setEnemyRatingClass, enemy_rating);
        }
        else if(color === 1){
          setplayerColor(Colors.BLACK);
          setplayerId(user_id);

          setUsername(nickname);
          setRating(rating);
          setEnemyUsername(enemy_nickname);
          setEnemyRating(enemy_rating);

          updateRating(setNicnameClass, setRatingClass, rating);
          updateRating(setEnemyNicnameClass, setEnemyRatingClass, enemy_rating);
        }
        else{
          navigate('/');
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
      <HeaderComponent userId={playerId}/>
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

  <FooterComponent/>
</div>
  );
};

export default GameOnlinePage;
