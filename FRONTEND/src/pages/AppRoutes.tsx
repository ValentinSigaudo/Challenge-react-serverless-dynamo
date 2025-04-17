import { Routes, Route } from "react-router-dom";
import SignUpForm from "../components/SignUpForm";
import LoginForm from "../components/LoginForm";
import UserProfile from "../components/UserProfile";
import ConfirmSignUpForm from "../components/ConfirmSignUpForm";
import { ProtectedRoute } from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/register" element={<SignUpForm />} />
      <Route path="/confirm" element={<ConfirmSignUpForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="*" element={<LoginForm />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
