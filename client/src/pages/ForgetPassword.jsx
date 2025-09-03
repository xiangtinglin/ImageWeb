import { useState } from 'react';
import axios from 'axios';
import LoadingButton from '../components/LoadingButton';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(`${API_BASE}/api/auth/forgot`, { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || '發送失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">忘記密碼</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="輸入註冊信箱"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <LoadingButton type="submit" loading={loading}>
          寄送重設連結
        </LoadingButton>
      </form>
      {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
    </div>
  );
};

export default ForgetPassword;
