import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ChatAppPage from './pages/ChatAppPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { useAuthStore } from './stores/useAuthStore';
import { useSocketStore } from './stores/useSocketStore';
import { useThemeStore } from './stores/useThemeStore';

function App() {
  const { isDark, setTheme } = useThemeStore();
  const { accessToken } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    setTheme(isDark);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark]);

  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }

    return () => disconnectSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/signup' element={<SignUpPage />} />

          {/* Protected route */}
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<ChatAppPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors theme={isDark ? 'dark' : 'light'} />
    </>
  );
}

export default App;
