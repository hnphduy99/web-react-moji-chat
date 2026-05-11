import { BrowserRouter, Route, Routes } from 'react-router';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ChatAppPage from './pages/ChatAppPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

function App() {
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
      <Toaster richColors />
    </>
  );
}

export default App;
