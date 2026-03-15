import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { t } from "../i18n";

interface Props {
  lang: string;
  isAdmin: boolean;
}

export const Navigation: React.FC<Props> = ({ lang, isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: "/", label: t("chat", lang) },
    { path: "/qa", label: t("qa", lang) },
    { path: "/lost-found", label: t("lost_found", lang) },
    { path: "/dm", label: t("dm", lang) },
  ];

  if (isAdmin) {
    tabs.push({ path: "/admin", label: t("admin", lang) });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-50">
      {tabs.map((tab) => (
        <button
          key={tab.path}
          onClick={() => navigate(tab.path)}
          className={`flex flex-col items-center px-3 py-1 text-xs ${
            location.pathname === tab.path
              ? "text-blue-600 font-bold"
              : "text-gray-500"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};