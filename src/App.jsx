
import PageLayout from './Layouts/PageLayout/PageLayout';
import AuthPage from './pages/AuthPage/AuthPage';
import HomePage from './pages/HomePage/HomePage';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/firebase';

function App() {
  
  const [authUser]= useAuthState(auth);  // we r relying on fire base not on local browser storage


  return ( 
  <PageLayout>
    <Routes>
      <Route path='/' element={ authUser ? <HomePage /> : <Navigate to='/auth' /> } />
      <Route path='/auth' element={!authUser ? <AuthPage /> : <Navigate to='/' /> } />
      <Route path='/:username' element={<ProfilePage />} />
    </Routes>
  </PageLayout>
  );
}

export default App;
