import { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingButton from '../components/LoadingButton';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!token) {
      setMessage('連結無效，請重新申請重設連結');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/auth/reset`, { token, password });
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      setMessage(err.response?.data?.message || '密碼重設失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">重設密碼</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="輸入新密碼"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <LoadingButton type="submit" loading={loading}>
          確認重設
        </LoadingButton>
      </form>

      {message && <p className="mt-4 text-red-600 text-center">{message}</p>}
    </div>
  );
};

export default ResetPassword;
