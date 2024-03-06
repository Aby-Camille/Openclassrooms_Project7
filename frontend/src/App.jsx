import React, { useEffect, useState } from 'react';
import {
  BrowserRouter, Route, Routes,
} from 'react-router-dom';
import SignIn from './pages/SignIn/SignIn';
import Home from './pages/Home/Home';
import Book from './pages/Book/Book';
import { APP_ROUTES } from './utils/constants';
import AddBook from './pages/AddBook/AddBook';
import UpdateBook from './pages/updateBook/UpdateBook';
import { useUser } from './lib/customHooks';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import PageLayout from './components/PageLayout/PageLayout';

function App() {
  const [user, setUser] = useState(null);
  const { connectedUser } = useUser();

  useEffect(() => {
    setUser(connectedUser);
  }, [connectedUser]);
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path={APP_ROUTES.SIGN_IN} element={<SignIn setUser={setUser} />} />
        <Route element={<PageLayout user={user} setUser={setUser} />}>
          <Route index element={<Home />} />
          <Route path={APP_ROUTES.BOOK} element={<Book />} />
          <Route path={APP_ROUTES.UPDATE_BOOK} element={<UpdateBook />} />
          <Route path={APP_ROUTES.ADD_BOOK} element={<AddBook />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
