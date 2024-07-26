import { useEffect, useState, useRef, MutableRefObject } from 'react';

interface Message {
  board?: string;
  id?: number
}

const useSpectatorWebSocket = (token: string, matchId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const websocket: MutableRefObject<WebSocket | null> = useRef(null);

  useEffect(() => {
    websocket.current = new WebSocket(`wss://angrycheess-backend.onrender.com/match/ws/${token}/${matchId}`);

    websocket.current.onmessage = (event: MessageEvent) => {
      setMessages((prev) => [...prev, JSON.parse(event.data)]);
    };

    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, [token]);
  return { messages };
};

export default useSpectatorWebSocket;