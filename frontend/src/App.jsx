import { Routes, Route } from 'react-router-dom';
import Showcase from './pages/Showcase.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Profile from './pages/Profile.jsx';
import Scanner from './pages/Scanner.jsx';
import Discover from './pages/Discover.jsx';
import VenueDetail from './pages/VenueDetail.jsx';
import Chat from './pages/Chat.jsx';
import Reveal from './pages/Reveal.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Showcase />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/scan" element={<Scanner />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/venue" element={<VenueDetail />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/reveal" element={<Reveal />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
