import { useState, useEffect, useRef, useCallback } from "react";

interface ChatMessage {
  id: number;
  content: string;
  reply_to_id: number | null;
  created_at: string;
}

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000";

export function useChat(tgId: number | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<number>();

  const connect = useCallback(() => {
    if (!tgId) return;

    const ws = new WebSocket(`${WS_URL}/ws/chat/${tgId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "new_message") {
        setMessages((prev) => [...prev, data.data]);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      // Reconnect after 3 seconds
      reconnectTimer.current = window.setTimeout(connect, 3000);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      ws.close();
    };
  }, [tgId]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
    };
  }, [connect]);

  const sendMessage = useCallback(
    (content: string, replyToId?: number) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "message",
            content,
            reply_to_id: replyToId || null,
          })
        );
      }
    },
    []
  );

  return { messages, connected, sendMessage, setMessages };
}