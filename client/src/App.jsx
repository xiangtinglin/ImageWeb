import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Booking from './pages/Booking';
import PrivateRoute from './components/PrivateRoute';
import BookingList from './pages/BookingList';
import ResetPassword from './pages/ResetPassword';
import ForgetPassword from './pages/ForgetPassword';
import Layout from './components/Layout';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking"  element={ <PrivateRoute> <Booking /> </PrivateRoute> }/>
        <Route path="/bookinglist" element={<PrivateRoute> <BookingList /> </PrivateRoute> } />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/forgot" element={<ForgetPassword />} />
        {/* 其他路由 */}

        </Route>
      </Routes>
    </div>
  );
}

export default App;
