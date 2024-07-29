import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { getInfo } from '../api/auth';
import Cookies from 'js-cookie';
import {updateRating} from '../functional/raiting'
import BoardComponent from "../components/chess-elements/BoardComponent";
import HeaderComponent from "../components/elements/HeaderComponent";
import FooterComponent from "../components/elements/FooterComponent";
import ThemeTogglerComponent from '../components/elements/ThemeTogglerComponent'
import {Board} from "../models/Board";
import {Player} from "../models/Player";
import {Colors} from "../models/Colors";
import LostFigures from "../components/chess-elements/LostFigures";
import './css/Game.css'

const GameOnDevicePage: React.FC = () => {

    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null);
    const [rating, setRating] = useState<number | null>(null);
    const token = Cookies.get('accessToken');
    const [myUserId, setMyUserId] = useState<number>();
    const onDevice = Cookies.get('OnOneDevice');

    const [ratingClass, setRatingClass] = useState<string>('');
    const [nicnameClass, setNicnameClass] = useState<string>('');


    const [board, setBoard] = useState(new Board());
    const whitePlayer = new Player(Colors.WHITE);
    const blackPlayer = new Player(Colors.BLACK);
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);



    useEffect(() => {
        restart();
        setCurrentPlayer(whitePlayer);
    }, []);

    function restart(){
        const newBoard = new Board();
        newBoard.initCells();
        newBoard.addFigures();
        setBoard(newBoard);
        setCurrentPlayer(whitePlayer);
    }

    function swapPlayer(): Colors{
        setCurrentPlayer(currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer);
        return currentPlayer?.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
    }

  useEffect(() => {
    const fetchUsername = async () => {
      if (token) {
        try {
          if (onDevice){
            Cookies.remove('OnOneDevice');
            const {id, user, rating} = await getInfo(token);
            setMyUserId(id);
            setUsername(user.username);
            setRating(rating);
            updateRating(setNicnameClass, setRatingClass, rating);
          }
          else{
            navigate('/');
          }
        } catch (error) {
          console.error('Failed to fetch username', error);
          navigate('/login');
        }
      }
    };

    fetchUsername();
  }, [token]);

  return (
    <div>
      <HeaderComponent userId={myUserId}/>
  <main>
      <ThemeTogglerComponent/>
      <div className="main">
          <div className="main__info">
              <div className={`nickname ${nicnameClass}`}>{username}</div>
              <div className={`rating ${ratingClass}`}>{rating}</div>
          </div>
          <div className="game">
            <div>
            <LostFigures
                    title={"White"}
                    figures={board.lostWhiteFigures}/>
            </div>
            <BoardComponent
                board={board}
                setBoard={setBoard}
                currentPlayer={currentPlayer}
                swapPlayer={swapPlayer}
            />
            <div>
            <LostFigures
                    title={"Black"}
                    figures={board.lostBlackFigures}/>
            </div>
          </div>
      </div>
  </main>

  <FooterComponent/>
</div>
  );
};

export default GameOnDevicePage;
