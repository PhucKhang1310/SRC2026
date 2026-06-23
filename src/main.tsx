
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Mentor from "./pages/mentor/Mentor.tsx";
import MentorSubmission from "./pages/mentor/MentorSubmission.tsx";
import NewsList from "./pages/news/NewsList.tsx";
import NewsDetail from "./pages/news/NewsDetail.tsx";
import PostNews from "./pages/news/postNews.tsx";
import PublicationDetail from "./pages/publications/PublicationDetail.tsx";
import PublicationSubmission from "./pages/publications/PublicationSubmission.tsx";
import PublicationsList from "./pages/publications/PublicationsList.tsx";
import SubmissionPage from "./pages/submission/SubmissionPage.tsx";
import AdminPage from "./pages/admin/AdminPage.tsx";
import NewsAdminPage from "./pages/admin/NewsAdminPage.tsx";
import NewsEditAdminPage from "./pages/admin/NewsEditAdminPage.tsx";
import NewsUploadAdminPage from "./pages/admin/NewsUploadAdminPage.tsx";
import SubmissionReviewAdminPage from "./pages/admin/SubmissionReviewAdminPage.tsx";
import RegistrationPage from "./components/registration/RegistrationPage.tsx";
import LoginPage from "./pages/authentication/Login.tsx";
import SignUp from "./pages/authentication/Signup.tsx";
import { PageContentProvider } from "./context/PageContentContext.tsx";
import { UserProvider } from "./hook/useUser.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <PageContentProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<App />} />
            <Route path="/mentors" element={<Mentor />} />
            <Route path="/news-list" element={<NewsList />} />
            <Route path="/news-list/:id" element={<NewsDetail />} />
            <Route path="/post-news" element={<PostNews />} />
            <Route path="/publications" element={<PublicationsList />} />
            <Route path="/publications/:id" element={<PublicationDetail />} />
            <Route path="/submit" element={<SubmissionPage />} />
            <Route path="/submit/publication" element={<PublicationSubmission />} />
            <Route path="/submit/mentor" element={<MentorSubmission />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/news" element={<NewsAdminPage />} />
            <Route path="/admin/news/upload" element={<NewsUploadAdminPage />} />
            <Route path="/admin/news/:id/edit" element={<NewsEditAdminPage />} />
            <Route path="/admin/submissions" element={<SubmissionReviewAdminPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signupabc" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageContentProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
