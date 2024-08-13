import axios from 'axios';

// render.com Java Spring
// const API_URL = 'https://chess-online-1.onrender.com'; 
// ngrok
// const API_URL = 'https://9ee2-91-102-179-156.ngrok-free.app'; 
// localhost
// const API_URL = 'http://localhost:8000'; 

const API_URL = 'https://angrycheess-backend.onrender.com';


interface LoginResponse {
  accessToken: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}



export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, credentials);
  return response.data;
};


interface RegisterResponse {
  message: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface StatisticResponces{
  id: number;
  user: InfoUserResponses;
  totalGamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  rating: number;
}

 interface StatisticUserResponces{
  id: number;
  username: string;
  totalGamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  rating: number;
}

interface InfoUserResponses {
  id: number;
  email: string;
  username: string;
  inGame: boolean;
  createdAt: Date;
  roles: string[];
}

export const register = async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
  const response = await axios.post<RegisterResponse>(`${API_URL}/auth/register`, credentials);
  return response.data;
};

export const getInfo = async (token: string): Promise<StatisticResponces> => {
  const response = await axios.get<StatisticResponces>(`${API_URL}/stats/showMyStatistic`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getInfoAboutUser = async (token: string, id: number): Promise<StatisticUserResponces> => {
  const response = await axios.get<StatisticUserResponces>(`${API_URL}/stats/info/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

interface ForgotResponse {
  message: string;
}

interface ForgotCredentials {
  email: string;
}

export const sendRecoverLink = async (credentials: ForgotCredentials): Promise<ForgotResponse> => {
  const response = await axios.post(`${API_URL}/forgotPassword/sendRecoverlinkToEmail`, credentials);
  return response.data;
};

export const checkRecoverToken = async (token: string | undefined) => {
  const response = await axios.post(`${API_URL}/forgotPassword/checkToken`, { token });
  return response;
};

export const changePassword = async (token: string | undefined, newPassword: string) => {
  const response = await axios.post(`${API_URL}/forgotPassword/changePassword`, { token, newPassword });
  return response;
};

export const startSearchGame = async (token: string) => {
  const response = await axios.post(`${API_URL}/requests/search`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const stopSearchGame = async (token: string) => {
  const response = await axios.post(`${API_URL}/requests/stopSearching`, {}, { 
    headers: {
      Authorization: `Bearer ${token}`,
    },});
  return response.data;
};


interface InfoGameResponse {
  match: number;
  nickname: string;
  rating: number;
  enemy_nickname: string;
  enemy_rating: number;
  user_id: number;
  color: number;
}

export const checkStatusGame = async (token: string): Promise<InfoGameResponse> => {
  const response = await axios.get(`${API_URL}/requests/checkStatusGame`, { 
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export interface InfoBoard {
  board: string;
}


export interface  InfoMatchResponse {
  match_id: number;
  move_number: number;
  board: InfoBoard;
}



export const gameOnlineDetails = async (token: string, matchId: number): Promise<InfoMatchResponse[]> => {
  const response = await axios.get(`${API_URL}/matchInfo/gameOnlineDetails/${matchId}`, { 
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const gameDetails = async (token: string, matchId: number): Promise<InfoMatchResponse[]> => {
  const response = await axios.get(`${API_URL}/matchInfo/gameDetails/${matchId}`, { 
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const gameResult = async (token: string, matchId: number): Promise<InfoMatchReponse> => {
  const response = await axios.get(`${API_URL}/matchInfo/gameResults/${matchId}`, { 
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

interface InfoMatchReponse{
  id: number;
  winner_id: number;
  end: boolean;
  white_id: number;
  black_id: number;
  time_start: Date;
  time_end: Date;
}

export const getMatchesUser = async (token: string, id: number): Promise<InfoMatchReponse[]> => {
  const response = await axios.get(`${API_URL}/stats/matches/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};