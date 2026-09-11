import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProblemsPage from './pages/ProblemsPage';
import PracticePage from './pages/PracticePage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import './app.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProblemsPage />} />
        <Route path="/practice/:problemId" element={<PracticePage />} />
        <Route path="/result/:attemptId" element={<ResultPage />} />
        <Route path="/history/:problemId" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;