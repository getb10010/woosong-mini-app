import React, { useState, useEffect } from "react";
import { t } from "../i18n";
import api from "../api/client";

interface QAPost {
  id: number;
  question: string;
  subject_tag: string | null;
  is_anonymous: boolean;
  is_resolved: boolean;
  username: string | null;
  created_at: string;
  answer_count: number;
}

interface Props {
  lang: string;
}

export const QAPage: React.FC<Props> = ({ lang }) => {
  const [posts, setPosts] = useState<QAPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [tag, setTag] = useState("");
  const [isAnon, setIsAnon] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data } = await api.get("/qa/posts");
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;
    try {
      await api.post("/qa/posts", {
        question: question.trim(),
        subject_tag: tag || null,
        is_anonymous: isAnon,
      });
      setQuestion("");
      setTag("");
      setShowForm(false);
      loadPosts();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">{t("loading", lang)}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b px-4 py-3 flex justify-between items-center">
        <h1 className="font-bold text-lg">{t("qa", lang)}</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
        >
          + {t("ask_question", lang)}
        </button>
      </div>

      {showForm && (
        <div className="bg-white m-4 p-4 rounded-lg shadow">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t("ask_question", lang)}
            className="w-full border rounded-lg p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-300"
            maxLength={3000}
          />
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Tag: math, physics, english..."
            className="w-full border rounded-lg p-2 mt-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <div className="flex justify-between items-center mt-3">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={isAnon}
                onChange={(e) => setIsAnon(e.target.checked)}
              />
              {t("anonymous", lang)}
            </label>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
            >
              {t("send", lang)}
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-3 space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {post.subject_tag && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    #{post.subject_tag}
                  </span>
                )}
                <p className="text-sm text-gray-800 mt-1">{post.question}</p>
              </div>
              {post.is_resolved && (
                <span className="text-green-500 text-sm ml-2">✅</span>
              )}
            </div>
            <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
              <span>
                {post.is_anonymous
                  ? t("anonymous", lang)
                  : post.username || "User"}
              </span>
              <div className="flex gap-3">
                <span>💬 {post.answer_count}</span>
                <span>
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};