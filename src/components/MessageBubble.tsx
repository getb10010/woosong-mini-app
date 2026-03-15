import React, { useState } from "react";
import { t } from "../i18n";
import api from "../api/client";

interface Props {
  id: number;
  content: string;
  createdAt: string;
  replyToId?: number | null;
  lang: string;
  onReply: (id: number) => void;
}

export const MessageBubble: React.FC<Props> = ({
  id, content, createdAt, replyToId, lang, onReply,
}) => {
  const [showReport, setShowReport] = useState(false);
  const [reported, setReported] = useState(false);

  const time = new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleReport = async (category: string) => {
    try {
      await api.post("/chat/report", { message_id: id, category });
      setReported(true);
      setShowReport(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg p-3 mb-2 shadow-sm">
      {replyToId && (
        <div className="text-xs text-gray-400 mb-1 border-l-2 border-blue-300 pl-2">
          ↩️ Reply to #{replyToId}
        </div>
      )}
      <p className="text-sm text-gray-800">{content}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-400">{time}</span>
        <div className="flex gap-2">
          <button
            onClick={() => onReply(id)}
            className="text-xs text-blue-500 hover:text-blue-700"
          >
            {t("reply", lang)}
          </button>
          {!reported ? (
            <button
              onClick={() => setShowReport(!showReport)}
              className="text-xs text-red-400 hover:text-red-600"
            >
              {t("report", lang)}
            </button>
          ) : (
            <span className="text-xs text-green-500">
              {t("reported", lang)}
            </span>
          )}
        </div>
      </div>

      {showReport && (
        <div className="mt-2 flex flex-wrap gap-1">
          {["spam", "harassment", "inappropriate", "other"].map((cat) => (
            <button
              key={cat}
              onClick={() => handleReport(cat)}
              className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100"
            >
              {t(`report_${cat}`, lang)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};