import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { AppShell } from './components/layout/AppShell';
import { NotificationProvider } from './components/notifications/NotificationProvider';
import Dashboard from './pages/Dashboard';
import Budget from './pages/Budget';
import Contracts from './pages/Contracts';
import Items from './pages/Items';
import Payments from './pages/Payments';
import Calendar from './pages/calendar';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import Signature from './pages/Signature';
import AddWedding from './pages/AddWedding';
import { useState } from 'react';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppProvider>
              <NotificationProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<AppShell />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/budget" element={<Budget />} />
                      <Route path="/contracts" element={<Contracts />} />
                      <Route path="/items" element={<Items />} />
                      <Route path="/payments" element={<Payments />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/signature" element={<Signature />} />
                      <Route path="/add-wedding" element={<AddWedding />} />
                    </Route>
                  </Route>

                  {/* Fallback Routes */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </NotificationProvider>
            </AppProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
