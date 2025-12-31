import LandingPage from './pages/LandingPage';
import JoinRoomPage from './pages/JoinRoomPage';
import ChatRoomPage from './pages/ChatRoomPage';
import ExtendTimePage from './pages/ExtendTimePage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateRoomPage from './pages/admin/CreateRoomPage';
import SelectPlanPage from './pages/SelectPlanPage';
import PublicWallPage from './pages/PublicWallPage';
import NotFound from './pages/NotFound';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Landing',
    path: '/',
    element: <LandingPage />
  },
  {
    name: 'Global Wall',
    path: '/wall',
    element: <PublicWallPage />
  },
  {
    name: 'Join Room',
    path: '/join/:code',
    element: <JoinRoomPage />
  },
  {
    name: 'Chat Room',
    path: '/room/:roomId',
    element: <ChatRoomPage />
  },
  {
    name: 'Extend Time',
    path: '/extend/:roomId',
    element: <ExtendTimePage />
  },
  {
    name: 'Payment Success',
    path: '/payment-success',
    element: <PaymentSuccessPage />
  },
  {
    name: 'Admin Dashboard',
    path: '/admin',
    element: <AdminDashboard />
  },
  {
    name: 'Create Room',
    path: '/admin/create-room',
    element: <CreateRoomPage />
  },
  {
    name: 'Select Plan',
    path: '/select-plan',
    element: <SelectPlanPage />
  },
  {
    name: 'Not Found',
    path: '*',
    element: <NotFound />
  }
];

export default routes;
