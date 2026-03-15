import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useUserStore } from "./stores/userStore";
import { Navigation } from "./components/Navigation";
import { ChatPage } from "./pages/Chat";
import { QAPage } from "./pages/QA";
import { LostFoundPage } from "./pages/LostFound";

const App: React.FC = () => {
  const { user, loading, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
          <p className="mt-3 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-6">
          <p className="text-xl">🎓</p>
          <p className="text-gray-600 mt-2">
            Алдымен ботта тіркеліңіз
          </p>
        </div>
      </div>
    );
  }

  const lang = user.lang || "kz";
  const isAdmin = user.is_admin;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route
            path="/"
            element={<ChatPage tgId={user.tg_id} lang={lang} />}
          />
          <Route path="/qa" element={<QAPage lang={lang} />} />
          <Route
            path="/lost-found"
            element={<LostFoundPage lang={lang} />}
          />
          <Route
            path="/dm"
            element={
              <div className="p-4 text-center text-gray-400 mt-20">
                💌 DM — coming soon
              </div>
            }
          />
          {isAdmin && (
            <Route
              path="/admin"
              element={
                <div className="p-4 text-center text-gray-400 mt-20">
                  🛡️ Admin Panel — coming soon
                </div>
              }
            />
          )}
        </Routes>
        <Navigation lang={lang} isAdmin={isAdmin} />
      </div>
    </BrowserRouter>
  );
};

export default App;