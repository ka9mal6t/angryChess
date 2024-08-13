import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams} from 'react-router-dom';
import {updateRating} from '../functional/raiting'
import { getInfoAboutUser, getMatchesUser} from '../api/auth';
import { useAuth } from './../context/AuthContext';

import HeaderComponent from "../components/elements/HeaderComponent";
import FooterComponent from "../components/elements/FooterComponent";
import ThemeTogglerComponent from '../components/elements/ThemeTogglerComponent'

import Cookies from 'js-cookie';

import './css/Stats.css'

interface InfoMatchReponse{
  id: number;
  winner_id: number;
  end: boolean;
  white_id: number;
  black_id: number;
  time_start: Date;
  time_end: Date;
}
const StatsPage: React.FC = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const userIdNumber = user_id ? Number(user_id) : null;

  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);

  const token = Cookies.get('accessToken');
  const [myUserId, setMyUserId] = useState<number>();

  const [matches, setMatches] = useState<InfoMatchReponse[]>();

  const [ratingClass, setRatingClass] = useState<string>('');
  const [nicnameClass, setNicnameClass] = useState<string>('');

  const { user } = useAuth();

  const formatDateTime = (isoString: string) => {
    let dateObj = new Date(isoString);

    let formattedDate = dateObj.toLocaleString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return formattedDate;
}
  

  useEffect(() => {
    const fetchUsername = async () => {
      if (token && user) {
        try {
          Cookies.remove('OnOneDevice');
          setMyUserId(user.id);
          
        } catch (error) {
          console.error('Failed to fetch username', error);
          navigate('/login');
        }


        try{
          if (userIdNumber){
            const {username, rating} = await getInfoAboutUser(token, userIdNumber);
            setUsername(username);
            setRating(rating);
            updateRating(setNicnameClass, setRatingClass, rating);

            const matches = await getMatchesUser(token, userIdNumber)
            setMatches(matches);
          }
          else{
            navigate('/');
          }
        }catch(error){
          console.error('User not found', error);
          navigate('/');
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
         
          <div className="main__info">
              <div className={`nickname ${nicnameClass}`}>{username}</div>
              <div className={`rating ${ratingClass}`}>{rating}</div>

          </div>
          
          <div className="main__history">
              <table className="history__table">
                  <thead>
                      <tr>
                            <th>Type</th>
                            <th>Time Start</th>
                            <th>Time End</th>
                            <th>Result</th>
                            <th>Watch</th>
                      </tr>
                  </thead>
                  <tbody>

                      
                          {matches?.slice().reverse().map((match, index) =>
                          <React.Fragment key={index}>
                          <tr>
                            <td>{match.white_id === userIdNumber ? 'White' : 'Black'}</td>
                            <td >{formatDateTime('' + match.time_start)}</td>
                            <td>{match.end ? formatDateTime('' + match.time_end) : '-'}</td>
                            <td className={match.end ? (match.winner_id ? (match.winner_id === userIdNumber ? 'win': 'loss') : 'draw'): ''}>
                              {match.end ? (match.winner_id ? (match.winner_id === userIdNumber ? 'Win': 'Lose') : 'Draw'): ''}
                            </td>
                            <td>
                                {match.end ? 
                                <Link style={{textDecoration: 'none', color: 'inherit'}} to={"/match/" + match.id}>
                                  <svg width="40" height="40" viewBox="0 0 20 20" id="Dsad2312421" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3.25909 11.6021C3.94254 8.32689 6.79437 6 10 6C13.2057 6 16.0574 8.32688 16.7409 11.6021C16.7974 11.8725 17.0622 12.0459 17.3325 11.9895C17.6029 11.933 17.7763 11.6682 17.7199 11.3979C16.9425 7.67312 13.6934 5 10 5C6.3066 5 3.05742 7.67311 2.28017 11.3979C2.22377 11.6682 2.39718 11.933 2.6675 11.9895C2.93782 12.0459 3.20268 11.8725 3.25909 11.6021Z"/>
                                  <path d="M10 8C8.067 8 6.5 9.567 6.5 11.5C6.5 13.433 8.067 15 10 15C11.933 15 13.5 13.433 13.5 11.5C13.5 9.567 11.933 8 10 8ZM7.5 11.5C7.5 10.1193 8.61929 9 10 9C11.3807 9 12.5 10.1193 12.5 11.5C12.5 12.8807 11.3807 14 10 14C8.61929 14 7.5 12.8807 7.5 11.5Z"/>
                                  </svg>
                                </Link>
                                : 
                                <Link style={{textDecoration: 'none', color: 'inherit'}} to={"/matchOnline/" + match.id}>

                                
                                <svg id="Dsad2312422" version="1.1" xmlns="http://www.w3.org/2000/svg" 
                                        width="40px" height="40px" viewBox="0 0 72.611 72.611">
                                    <g>
                                        <path d="M67.128,30.823C67.128,13.828,53.305,0,36.307,0c-2.862,0-5.617,0.423-8.247,1.157l-0.062-0.042
                                            c-0.014,0.021-0.025,0.044-0.04,0.065C15.013,4.831,5.484,16.723,5.484,30.821c0,6.211,1.862,11.991,5.033,16.831H6.934v24.96
                                            h58.748v-24.96h-3.581C65.275,42.816,67.128,37.034,67.128,30.823z M64.062,29.332H52.953c-0.109-3.312-0.483-6.568-1.149-9.729
                                            h9.952C63.086,22.601,63.882,25.886,64.062,29.332z M60.191,16.605h-9.125c-1.115-4.104-2.68-8.033-4.724-11.715
                                            C52.159,7.155,57.022,11.31,60.191,16.605z M37.805,3.069c1.45,0.078,2.876,0.238,4.264,0.533c2.586,4.01,4.575,8.378,5.912,13.005
                                            H37.805V3.069L37.805,3.069z M37.805,19.603h10.946c0.708,3.156,1.1,6.409,1.219,9.729H37.807v-9.729H37.805z M37.805,32.318
                                            h12.189c-0.062,3.312-0.405,6.569-1.062,9.731H37.805V32.318z M37.805,45.042h10.406c-0.244,0.881-0.522,1.747-0.81,2.614h-9.597
                                            V45.042z M29.902,3.763c1.589-0.373,3.229-0.606,4.91-0.695v13.538H24.406C25.635,12.062,27.48,7.743,29.902,3.763z M22.62,29.332
                                            c0.062-3.31,0.408-6.568,1.063-9.729h11.129v9.729H22.62z M34.812,32.318v9.731H23.864c-0.705-3.157-1.097-6.413-1.215-9.731
                                            H34.812z M25.705,5.106c-1.899,3.627-3.359,7.486-4.379,11.503h-8.904C15.488,11.483,20.134,7.407,25.705,5.106z M10.858,19.603
                                            h9.787c-0.619,3.169-0.958,6.423-1.021,9.729H8.549C8.735,25.886,9.53,22.601,10.858,19.603z M8.551,32.318H19.66
                                            c0.11,3.314,0.484,6.569,1.152,9.731H10.86C9.53,39.048,8.735,35.769,8.551,32.318z M21.55,45.042
                                            c0.241,0.881,0.509,1.747,0.792,2.614h-8.12c-0.64-0.84-1.252-1.704-1.798-2.614H21.55z M25,66.822v1.455H13.5V51.988h1.696h1.705
                                            v13.388H25V66.822z M24.635,45.042H34.81v2.614h-9.317C25.191,46.789,24.889,45.928,24.635,45.042z M29.801,68.277h-1.696H26.4
                                            V51.988h1.696h1.705V68.277z M39.757,68.277h-1.616h-1.617l-5.517-16.289h1.806h1.808l3.579,12.427l3.567-12.427h1.747h1.762
                                            L39.757,68.277z M59.114,66.822v1.455H46.756V51.988H58.74v1.437v1.456h-8.586v3.455h7.963v1.396v1.405h-7.963v4.242h8.965v1.442
                                            H59.114z M58.396,47.656h-7.849c0.262-0.867,0.516-1.733,0.741-2.614h8.903C59.646,45.955,59.034,46.816,58.396,47.656z
                                            M51.968,42.05c0.618-3.167,0.956-6.424,1.02-9.731h11.074c-0.18,3.448-0.976,6.727-2.306,9.731H51.968z"/>
                                    </g>
                                </svg>
                                </Link>
                                }
                                </td>
                              
                          </tr>
                          </React.Fragment>
                          )}
                  </tbody>
              </table>
          </div>
      </div>
  </main>

  <FooterComponent/>
</div>
  );
};

export default StatsPage;
