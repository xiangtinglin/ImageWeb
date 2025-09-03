import { useState, useEffect } from 'react';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Booking = () => {
  const [date, setDate] = useState('');
  const [service, setService] = useState('穿搭改造');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('green');
  const [disabled, setDisabled] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');

  const today = new Date();
  const minDate = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const maxDate = new Date(today.getTime() + 1 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!date) return;

    axios.get(`${API_BASE}/api/booking/slots`, {
      params: { date },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      console.log('📦 取得可預約時段:', res.data);  // ✅ DEBUG
      setAvailableSlots(res.data);  // 不要 filter，直接儲存全部 slot
    })
    .catch(err => {
      console.error('載入時段錯誤', err);
    });
  }, [date]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const [start_time, end_time] = selectedSlot.split('-');

    setDisabled(true);

    try {
      const res = await axios.post(`${API_BASE}/api/booking`, {
        date,
        service,
        start_time,
        end_time
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessageColor('green');
      setMessage(res.data.message || '預約成功！');
    } catch (err) {
      const msg = err.response?.data?.message || '預約失敗';
      setMessageColor('red');
      setMessage(msg);
    } finally {
      setTimeout(() => {
        setMessage('');
        setDisabled(false);
      }, 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">預約形象改造服務</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">選擇服務項目</span>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="穿搭改造">穿搭改造</option>
            <option value="妝造服務">妝造服務</option>
            <option value="溝通表達課程">溝通表達課程</option>
            <option value="面試課程">面試課程</option>
            <option value="體態訓練">體態訓練</option>
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700">選擇日期 <br/>（開放預約：{minDate}～{maxDate}）</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={minDate}
            max={maxDate}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </label>

        {availableSlots.length > 0 && (
          <label className="block">
            <span className="text-gray-700">選擇時段</span>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
              required
            >
              <option value="">請選擇時段</option>
              {availableSlots.map(slot => (
                <option
                  key={`${slot.start_time}-${slot.end_time}`}
                  value={`${slot.start_time}-${slot.end_time}`}
                  disabled={slot.remaining <= 0}
                >
                  {slot.start_time}–{slot.end_time}（{slot.remaining > 0 ? `剩 ${slot.remaining} 位` : '已滿'})
                </option>
              ))}
            </select>
          </label>
        )}



        <button
          type="submit"
          disabled={disabled}
          className={`w-full p-2 rounded ${disabled ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
        >
          提交預約
        </button>
      </form>

      {message && (
        <p className={`mt-4 text-center text-${messageColor}-600`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Booking;
