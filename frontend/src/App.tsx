import { Navigate, Route, Routes } from "react-router-dom";
import WorkspaceLayout from "./components/workspace/WorkspaceLayout";
import SelectProjectPage from "./pages/SelectProjectPage";
import ChatPage from "./pages/ChatPage";
import HttpHistoryPage from "./pages/HttpHistoryPage";
import RequestInspectorPage from "./pages/RequestInspectorPage";
import JsAnalysisPage from "./pages/JsAnalysisPage";
import NotesPage from "./pages/NotesPage";
import ReconPage from "./pages/ReconPage";
import BinaryAnalysisPage from "./pages/BinaryAnalysisPage";
import ReportsPage from "./pages/ReportsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WorkspaceLayout />}>
        <Route index element={<SelectProjectPage />} />
      </Route>

      <Route path="/projects/:projectId" element={<WorkspaceLayout />}>
        <Route index element={<Navigate to="chat" replace />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="http-history" element={<HttpHistoryPage />} />
        <Route path="http-history/:requestId" element={<RequestInspectorPage />} />
        <Route path="js-analysis" element={<JsAnalysisPage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="recon" element={<ReconPage />} />
        <Route path="binary" element={<BinaryAnalysisPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}