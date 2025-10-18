import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import DrinkList from "./pages/DrinkList.jsx";
import DrinkDetail from "./pages/DrinkDetail.jsx";
import NotFound from "./pages/NotFound.jsx";
import NewDrink from "./pages/NewDrink.jsx";
import Login from "./pages/Login.jsx";
import "./App.css";
import { useAuth } from "./auth/useAuth";

function App() {
  const { isAdmin, logout } = useAuth();

  return (
    <BrowserRouter>
      <div className="App">
        <h1>The Stone Flagon</h1>
        <NavBar isAdmin={isAdmin} logout={logout} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/drinks" element={<DrinkList />} />
          <Route path="/drinks/:id" element={<DrinkDetail />} />

          <Route
            path="/drinks/new"
            element={isAdmin ? <NewDrink /> : <Navigate to="/login" />}
          />

          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
