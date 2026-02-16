import { BrowserRouter, Routes, Route } from 'react-router-dom';

import GoalSetup from '../pages/GoalSetup';
import Hero from '../pages/Hero';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/goal-setup" element={<GoalSetup />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
