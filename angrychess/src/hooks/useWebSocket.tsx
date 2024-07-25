import { useEffect, useState, useRef, MutableRefObject } from 'react';

interface Message {
  board?: string;
  id?: number
  // другие поля сообщения
}

const useWebSocket = (token: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const websocket: MutableRefObject<WebSocket | null> = useRef(null);

  useEffect(() => {
    websocket.current = new WebSocket(`wss://angrycheess-backend.onrender.com/match/ws/${token}`);

    websocket.current.onmessage = (event: MessageEvent) => {
      setMessages((prev) => [...prev, JSON.parse(event.data)]);
    };

    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, [token]);

  const sendMessage = (message: Message) => {
    if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
      websocket.current.send(JSON.stringify(message));
    }
  };

  return { messages, sendMessage };
};

export default useWebSocket;
