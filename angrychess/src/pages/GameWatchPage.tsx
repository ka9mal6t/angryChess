import React, { useEffect, useState } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import BoardOnlineComponent from "../components/chess-elements/BoardOnlineComponent";
import HeaderComponent from "../components/elements/HeaderComponent";
import FooterComponent from "../components/elements/FooterComponent";
import ThemeTogglerComponent from '../components/elements/ThemeTogglerComponent'
import {updateRating} from '../functional/raiting'

import { Board } from "../models/Board";
import { Player } from "../models/Player";
import { Colors } from "../models/Colors";
import LostFigures from "../components/chess-elements/LostFigures";
import {getInfo, gameDetails, gameResult, getInfoAboutUser, InfoMatchResponse} from '../api/auth'

import './css/Game.css';
import Cookies from 'js-cookie';

const GameWatchPage: React.FC = () => {
  const { match_id } = useParams<{ match_id: string }>();
  const matchIdNumber = match_id ? Number(match_id) : 0;

  const token = Cookies.get('accessToken');
  const [myUserId, setMyUserId] = useState<number>();

  const navigate = useNavigate();

  const [board, setBoard] = useState<Board>(new Board());

  const[len, setLen] = useState<number>(0);
  const[counter, setCounter] = useState<number>(0);
  const[boards, setBoards] = useState<InfoMatchResponse[]>([]);

  const [playerColor, setplayerColor] = useState<Colors>(Colors.WHITE);

  const whitePlayer = new Player(Colors.WHITE);
  const blackPlayer = new Player(Colors.BLACK);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const [ratingClass, setRatingClass] = useState<string>('');
  const [nicnameClass, setNicnameClass] = useState<string>('');
  const [enemyRatingClass, setEnemyRatingClass] = useState<string>('');
  const [enemyNicnameClass, setEnemyNicnameClass] = useState<string>('');

  const [username, setUsername] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [enemyUsername, setEnemyUsername] = useState<string | null>(null);
  const [enemyRating, setEnemyRating] = useState<number | null>(null);


  const checkColor = async () => {
    if (token) {
      try {
        Cookies.remove('OnOneDevice');
        if (matchIdNumber){
          const {id} = await getInfo(token);
          setMyUserId(id);

          const match = await gameResult(token, matchIdNumber);
          if (!match.end)
            navigate('/matchOnline/' + matchIdNumber);

          const white = await getInfoAboutUser(token, match.white_id)
          const black = await getInfoAboutUser(token, match.black_id)

          setUsername(white.username);
          setRating(white.rating);
          setEnemyUsername(black.username);
          setEnemyRating(black.rating);
          
          updateRating(setNicnameClass, setRatingClass, white.rating);
          updateRating(setEnemyNicnameClass, setEnemyRatingClass ,black.rating);
          
          const details = await gameDetails(token, matchIdNumber);

          if(details.length > 0){
            setLen(details.length);
            setBoards(details);
              
          }
          else
            navigate('/');
        }
        else
          navigate('/');
        
      } catch (error) {
        console.error('Failed to search game', error);
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
    setplayerColor(Colors.WHITE === playerColor ? Colors.BLACK : Colors.WHITE);    
  };

    

  const nextEvent = () => {
    if (counter >= 0 && counter < len  && boards){
      const nextCounter = counter + 1;
      if (nextCounter <= boards.length) {
        setCounter(nextCounter);
        const move = boards.find(board => board.move_number === nextCounter);
        if (move){
          const newBoard = new Board();
          const boardState = JSON.parse(move.board.board);
          newBoard.setBoardFromState(boardState);
          setBoard(newBoard);

          nextCounter % 2 === 0 ? setCurrentPlayer(whitePlayer) : setCurrentPlayer(blackPlayer);
          nextCounter % 2 === 0 ? setplayerColor(Colors.WHITE) : setplayerColor(Colors.BLACK);    
      }
      else
          setCounter(counter);
    }
  }};

  
  const previousEvent = () => {
    
    if (counter > 1 && counter <= len && boards){
      
      const prevCounter = counter - 1;
      if (prevCounter >= 0) {
        setCounter(prevCounter);
        const move = boards.find(board => board.move_number === prevCounter);
        if (move){
          const newBoard = new Board();
          const boardState = JSON.parse(move.board.board);
          newBoard.setBoardFromState(boardState);
          setBoard(newBoard);
  
          prevCounter % 2 === 0 ? setCurrentPlayer(whitePlayer) : setCurrentPlayer(blackPlayer);
          prevCounter % 2 === 0 ? setplayerColor(Colors.WHITE) : setplayerColor(Colors.BLACK);    
        }
        else
          setCounter(counter);
      }
    }
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
        spectator={false}
        board={board}
        setBoard={setBoard}
        currentPlayer={currentPlayer}
        swapPlayer={swapPlayer}
        onMove={handleMove}
        playerColor={playerColor}
        loose={false}
        draw={false}
        sendDraw={()=>null}
        sendWin={()=>null}
      />
      <div>
        <LostFigures title={"Black"} figures={board.lostBlackFigures} />
      </div>
    </div>
      <div className="main__info" style={{textAlign: 'center'}}>
        <button className='btn_search' id='previous' style={{width: '40px'}} onClick={previousEvent}>{'<'}</button>
        <span className='nickname' style={{ padding: '20px'}}>{`${counter} / ${len}`}</span>
        <button className='btn_search' id='next' style={{width: '40px'}} onClick={nextEvent}>{'>'}</button>
      </div>
    </div>
  </main>

  <FooterComponent/>
</div>
  );
};

export default GameWatchPage;
