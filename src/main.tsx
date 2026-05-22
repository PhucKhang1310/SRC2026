import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Mentor from "./components/mentor/Mentor";
import NewsList from "./components/news/NewsList.tsx";
import NewsDetail from "./components/news/NewsDetail.tsx";
import PublicationDetail from "./components/publications/PublicationDetail.tsx";
import PublicationsList from "./components/publications/PublicationsList.tsx";
import SubmissionPage from "./components/submission/SubmissionPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<App />} />
        <Route path="/mentors" element={<Mentor />} />
        <Route path="/news-list" element={<NewsList />} />
        <Route path="/news-list/:id" element={<NewsDetail />} />
        <Route path="/publications" element={<PublicationsList />} />
        <Route path="/publications/:id" element={<PublicationDetail />} />
        <Route path="/submit" element={<SubmissionPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
