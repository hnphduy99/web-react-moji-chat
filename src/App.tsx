import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuthStore } from './stores/useAuthStore';
import { useSocketStore } from './stores/useSocketStore';
import { useThemeStore } from './stores/useThemeStore';

const ChatAppPage = lazy(() => import('./pages/ChatAppPage'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));

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
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public route */}
            <Route path='/signin' element={<SignInPage />} />
            <Route path='/signup' element={<SignUpPage />} />

            {/* Protected route */}
            <Route element={<ProtectedRoute />}>
              <Route path='/' element={<ChatAppPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster richColors theme={isDark ? 'dark' : 'light'} />
    </>
  );
}

export default App;
