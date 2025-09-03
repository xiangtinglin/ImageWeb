import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment-timezone"; // ✅ 用來處理台北時區
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchBookings = () => {
    const token = localStorage.getItem('token');

    axios.get(`${API_BASE}/api/booking`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => setBookings(res.data))
      .catch((err) => {
        console.error(err);
        setError('載入失敗，請重新登入');
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const confirm = window.confirm('確定要刪除這筆預約嗎？');

    if (!confirm) return;

    try {
      await axios.delete(`${API_BASE}/api/booking/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchBookings();
      setMessage('刪除成功！');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert('刪除失敗，請再試一次');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">我的預約紀錄</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}

      {bookings.length === 0 ? (
        <p>尚無預約紀錄。</p>
      ) : (
        Object.entries(
          bookings.reduce((acc, item) => {
            // ✅ 用 moment 轉台北時區後分組
            const localDate = moment.tz(item.date, 'Asia/Taipei').format('YYYY-MM-DD');
            if (!acc[localDate]) acc[localDate] = [];
            acc[localDate].push(item);
            return acc;
          }, {})
        ).map(([date, items]) => (
          <div key={date} className="border rounded p-4 mb-4">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">📋【行程日】 {date}</h3>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <div>
                    <p>
                      <strong>時段：</strong>{item.start_time}～{item.end_time}｜
                      <strong> 服務：</strong>{item.service}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    cancel
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default BookingList;
