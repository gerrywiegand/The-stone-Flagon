import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import DrinkList from "./pages/DrinkList.jsx";
import DrinkDetail from "./pages/DrinkDetail.jsx";
import NotFound from "./pages/NotFound.jsx";
import NewDrink from "./pages/NewDrink.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <h1>The Stone Flagon</h1>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/drinks" element={<DrinkList />}>
            <Route path=":id" element={<DrinkDetail />} />
          </Route>

          <Route path="new" element={<NewDrink />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
