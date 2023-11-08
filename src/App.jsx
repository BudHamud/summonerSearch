import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Match from "./pages/Match";
import Summoner from "./pages/Summoner";

function App() {

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={ <Home /> } />
      <Route path="/summoner/:region/:summonerName" element={ <Summoner /> } />
      <Route path="/match/:matchId" element={ <Match /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
