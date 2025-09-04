import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const images = [
  '/images/image1.jpg',
  '/images/image2.jpg',
  '/images/image3.jpg'
];

const Home = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 自動切換圖片
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 800); // 每 0.8 秒切換
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    navigate('/booking');
  };

  return (
    <div className="pt-20 p-8 text-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold text-blue-800 mb-4">打造你的專屬形象</h1>
      <p className="text-lg text-gray-600 mb-8">穿搭、妝造、面試訓練，一站式形象升級！</p>

      {/* 圖片輪播區塊 */}
      <div className="relative w-full max-w-3xl mx-auto h-64 overflow-hidden rounded-lg shadow-lg mb-8">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`carousel-${idx}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              idx === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      <button
        onClick={handleClick}
        className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
      >
        預約諮詢
      </button>
    </div>
  );
};

export default Home;
