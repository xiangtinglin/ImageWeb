import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('verified') === 'true') {
      alert('✅ 信箱驗證成功，請登入');
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', email);

      setMessage('登入成功！');
      window.location.href = '/';
    } catch (err) {
      setMessage(err.response?.data?.message || '登入失敗');
    }
  };

  const handleResend = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/auth/resend`, { email });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || '重送失敗');
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">登入</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="密碼"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          登入
        </button>
      </form>

      {/* 顯示訊息 */}
      {message && (
        <div className="mt-4 text-center">
          <p className="text-red-600">{message}</p>

          {message === '請先完成 Email 驗證' && (
            <button
              onClick={handleResend}
              className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              重新寄送驗證信
            </button>
          )}
        </div>
      )}

      <div className="mt-6 space-y-2 text-center">
        <button
          onClick={() => navigate('/forgot')}
          className="text-blue-600 underline hover:text-blue-800"
        >
          忘記密碼？
        </button>
        <br />
        <button
          onClick={() => navigate('/reset')}
          className="text-blue-600 underline hover:text-blue-800"
        >
          我有重設密碼連結
        </button>
      </div>
    </div>
  );
};

export default Login;
