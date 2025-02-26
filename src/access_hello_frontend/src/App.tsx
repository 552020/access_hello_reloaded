import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/index";
import Profile from "@/pages/profile";
import Admin from "@/pages/admin";
import InternetIdentityDemo from "@/pages/demo";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<Admin />} />
          <Route path="demo" element={<InternetIdentityDemo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
