import { useNavigate } from 'react-router-dom';
import "./Header.css";
import { logout } from '../../api/auth';
const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // ✅ 서버에 쿠키 삭제 요청
      navigate('/', { replace: true });
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <div className="header-container">
      <button className="header-button" onClick={handleLogout}>
        <div className="shadow"></div>
        <div className="edge"></div>
        <div className="front">
          <span>로그아웃</span>
        </div>
      </button>
      <button className="header-button" onClick={() => navigate('/graph')}>
        <div className="shadow"></div>
        <div className="edge"></div>
        <div className="front">
          <span>통계분석</span>
        </div>
      </button>
      <button className="header-button" onClick={() => navigate('/profile')}>
        <div className="shadow"></div>
        <div className="edge"></div>
        <div className="front">
          <span>내 정보</span>
        </div>
      </button>
    </div>
  );
};

export default Header;