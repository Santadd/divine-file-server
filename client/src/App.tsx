import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BusFilesPage from "./pages/BusFilesPage";
import LoginPage from "./pages/LoginPage";
import FilePage from "./pages/FilePage";
import ApiProvider from "./contexts/ApiProvider";
import RegistrationPage from "./pages/RegistrationPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, RequireAuth } from "react-auth-kit";
import UploadFilePage from "./pages/UploadFilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

export default function App() {
  return (
    <Container fluid className="App">
      <AuthProvider authType={"localstorage"} authName={"_auth"}>
        <BrowserRouter>
          <ToastContainer />
          <ApiProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <RequireAuth loginPath="/login">
                    <BusFilesPage />
                  </RequireAuth>
                }
              />
              <Route path="/files" element={<BusFilesPage />} />
              <Route path="/upload" element={<UploadFilePage />} />
              <Route path="/files/:id/all/details" element={<FilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
              <Route path="/reset_password_request/:token" element={<ResetPasswordPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </ApiProvider>
        </BrowserRouter>
      </AuthProvider>
    </Container>
  );
}
