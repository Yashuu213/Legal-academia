import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/Users';
import NotesPage from './pages/Notes';
import RequestsPage from './pages/Requests';
import ChatPage from './pages/Chat';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Route>
    </Routes>
  );
};

export default App;
