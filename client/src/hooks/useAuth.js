import { useEffect, useState } from 'react';

export default function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('email');
    setIsLoggedIn(!!token);
    if (userEmail) setEmail(userEmail);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setIsLoggedIn(false);
  };

  return { isLoggedIn, email, logout };
}
