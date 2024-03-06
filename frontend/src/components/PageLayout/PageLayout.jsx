import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

/* eslint-disable react/prop-types */
export default function PageLayout({ user, setUser }) {
  return (
    <>
      <Header user={user} setUser={setUser} />
      <Outlet />
      <Footer />
    </>
  );
}
