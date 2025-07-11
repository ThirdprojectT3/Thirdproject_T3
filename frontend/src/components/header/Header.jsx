import { useNavigate } from 'react-router-dom';
import "./Header.css";
import { logout } from '../../api/auth';
const Header = ({ triggerErrToast }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // ✅ 서버에 쿠키 삭제 요청
      navigate('/', { replace: true });
    } catch {
      if (triggerErrToast) triggerErrToast("로그아웃 실패");
    }
  };

  return (
    <div className="header-container">
      <div className="button-group">
        <button className="header-button" onClick={handleLogout}>
          <div className="shadow"></div>
          <div className="edge"></div>
          <div className="front">
            <span>로그아웃</span>
          </div>
        </button>
      </div>
      <div className="button-group">
        <button className="header-button-r" onClick={() => navigate('/graph')}>
          <div className="shadow"></div>
          <div className="edge"></div>
          <div className="front">
            <span>통계분석</span>
          </div>
        </button>
        <button className="header-button-r" onClick={() => navigate('/profile')}>
          <div className="shadow"></div>
          <div className="edge"></div>
          <div className="front">
            <span>내 정보</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Header;