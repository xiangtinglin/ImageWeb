import { Link, useNavigate } from 'react-router-dom';


const Navbar = () => {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email'); // 👈 取得 email
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email'); // 👈 一併清掉
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-5 bg-white/20 border-b border-white/30 shadow p-4 h-16 flex justify-between items-center">


      {/* 圖片 + 標題 Link */}
      <Link to="/" className="flex items-center space-x-2"> 
        {/* 小圖示 */}
        <img src="/images/logo.png" alt="Logo" className="w-8 h-8" />
        {/* 文字標題 */}
        <span className="text-xl font-bold text-blue-700">形象改造</span>
      </Link>

      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-500">首頁</Link>
        <Link to="/register" className="text-gray-700 hover:text-blue-500">註冊</Link>
        {token && (
          <Link to="/bookinglist" className="text-gray-700 hover:text-blue-500">我的預約</Link>
        )}

        {token ? (
          <>
            <span className="text-gray-600 mr-2">您好，{email}</span>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-800">登出</button>
          </>
        ) : (
          <Link to="/login" className="text-gray-700 hover:text-blue-500">會員登入</Link>
          
        )}

      </div>
    </nav>
  );
};

export default Navbar;
