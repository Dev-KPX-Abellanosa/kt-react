import { Route, Routes } from "react-router";
import LoginPage from "./apps/(pages)/login/Login";
import RegisterPage from "./apps/(pages)/login/Register";
import HomePage from "./apps/(pages)/home/HomePage";
import ContactsPage from "./apps/(pages)/contacts/ContactsPage";
import HomeLayout from "./apps/layouts/HomeLayout";
import ProtectedRoute from "./apps/components/protected-route";

export default function App() {

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<ProtectedRoute><HomeLayout /></ProtectedRoute>}>
        <Route path="/" element={<HomePage />} />
        <Route path="/contacts" element={<ContactsPage />} />
      </Route>
    </Routes>
  )
}
