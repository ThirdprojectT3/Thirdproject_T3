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
      <button className="header-button" onClick={handleLogout}>로그아웃</button>
      <div className="button-group">
        <button className="header-button" onClick={() => navigate('/graph')}>통계분석</button>
        <button className="header-button" onClick={() => navigate('/profile')}>내 정보</button>
      </div>
    </div>
  );
};

export default Header;