import React, { useState, useEffect } from "react";
import { t } from "../i18n";
import api from "../api/client";

interface LFItem {
  id: number;
  type: "lost" | "found";
  description: string;
  location: string;
  photo_url: string | null;
  is_resolved: boolean;
  created_at: string;
}

interface Props {
  lang: string;
}

export const LostFoundPage: React.FC<Props> = ({ lang }) => {
  const [items, setItems] = useState<LFItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<"lost" | "found">("lost");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const { data } = await api.get("/lost-found/items");
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim() || !location.trim()) return;
    try {
      await api.post("/lost-found/items", {
        type,
        description: description.trim(),
        location: location.trim(),
      });
      setDescription("");
      setLocation("");
      setShowForm(false);
      loadItems();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Error");
    }
  };

  const handleResolve = async (itemId: number) => {
    try {
      await api.post(`/lost-found/items/${itemId}/resolve`);
      loadItems();
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
        <h1 className="font-bold text-lg">{t("lost_found", lang)}</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
        >
          + Post
        </button>
      </div>

      {showForm && (
        <div className="bg-white m-4 p-4 rounded-lg shadow">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setType("lost")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                type === "lost"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {t("lost", lang)}
            </button>
            <button
              onClick={() => setType("found")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                type === "found"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {t("found", lang)}
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("description", lang)}
            className="w-full border rounded-lg p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t("location", lang)}
            className="w-full border rounded-lg p-2 mt-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm mt-3"
          >
            {t("send", lang)}
          </button>
        </div>
      )}

      <div className="px-4 py-3 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  item.type === "lost"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {item.type === "lost" ? t("lost", lang) : t("found", lang)}
              </span>
              {!item.is_resolved && (
                <button
                  onClick={() => handleResolve(item.id)}
                  className="text-xs text-green-500"
                >
                  {t("resolved", lang)}
                </button>
              )}
            </div>
            <p className="text-sm text-gray-800 mt-2">{item.description}</p>
            <p className="text-xs text-gray-400 mt-1">📍 {item.location}</p>
            <p className="text-xs text-gray-300 mt-1">
              {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};