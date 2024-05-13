import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './LandingPage';
import Room from './Room';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
