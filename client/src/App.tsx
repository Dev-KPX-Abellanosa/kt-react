import { Route, Routes } from "react-router";
import LoginPage from "./apps/(pages)/login/Login";
import HomePage from "./apps/(pages)/home/HomePage";
import ContactsPage from "./apps/(pages)/contacts/ContactsPage";
import HomeLayout from "./apps/layouts/HomeLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/contacts" element={<ContactsPage />} />
      </Route>
    </Routes>
  )
}
