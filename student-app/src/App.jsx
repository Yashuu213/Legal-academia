import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import NoteDetails from './pages/NoteDetails';
import Mentorship from './pages/Mentorship';
import StudentChat from './pages/StudentChat';
import UnlockedNotes from './pages/UnlockedNotes';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/note/:id" element={<NoteDetails />} />
        <Route path="/mentorship" element={<Mentorship />} />
        <Route path="/chat" element={<StudentChat />} />
        <Route path="/unlocked" element={<UnlockedNotes />} />
      </Routes>
    </>
  );
};

export default App;
