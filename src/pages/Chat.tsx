import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import { MessageBubble } from "../components/MessageBubble";
import { t } from "../i18n";
import api from "../api/client";

interface Props {
  tgId: number;
  lang: string;
}

export const ChatPage: React.FC<Props> = ({ tgId, lang }) => {
  const { messages, connected, sendMessage, setMessages } = useChat(tgId);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Ескі хабарламаларды жүктеу
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data } = await api.get("/chat/messages?limit=50");
        setMessages(data.reverse());
      } catch (err) {
        console.error(err);
      }
    };
    loadMessages();
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    sendMessage(text, replyTo || undefined);
    setInput("");
    setReplyTo(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex justify-between items-center">
        <h1 className="font-bold text-lg">{t("chat", lang)}</h1>
        <span className="text-xs">
          {connected ? t("connected", lang) : t("disconnected", lang)}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-32">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            {t("no_messages", lang)}
          </p>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            id={msg.id}
            content={msg.content}
            createdAt={msg.created_at}
            replyToId={msg.reply_to_id}
            lang={lang}
            onReply={(id) => setReplyTo(id)}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Reply indicator */}
      {replyTo && (
        <div className="bg-blue-50 px-4 py-2 flex justify-between items-center">
          <span className="text-xs text-blue-600">
            ↩️ Reply to #{replyTo}
          </span>
          <button
            onClick={() => setReplyTo(null)}
            className="text-xs text-red-500"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input */}
      <div className="fixed bottom-14 left-0 right-0 bg-white border-t px-4 py-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t("type_message", lang)}
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            maxLength={2000}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !connected}
            className="bg-blue-500 text-white rounded-full px-5 py-2 text-sm font-medium disabled:opacity-50 hover:bg-blue-600"
          >
            {t("send", lang)}
          </button>
        </div>
      </div>
    </div>
  );
};