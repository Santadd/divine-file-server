import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BusFilesPage from "./pages/BusFilesPage";
import LoginPage from "./pages/LoginPage";
import FilePage from "./pages/FilePage";
import ApiProvider from "./contexts/ApiProvider";
import RegistrationPage from "./pages/RegistrationPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <Container fluid className="App">
      <BrowserRouter>
        <ToastContainer />
        <ApiProvider>
          <Routes>
            <Route path="/" element={<BusFilesPage />} />
            <Route path="/files" element={<BusFilesPage />} />
            <Route path="/files/:id/all/details" element={<FilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ApiProvider>
      </BrowserRouter>
    </Container>
  );
}
