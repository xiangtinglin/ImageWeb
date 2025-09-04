// client/src/components/Layout.jsx
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="pt-80 px-16">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
