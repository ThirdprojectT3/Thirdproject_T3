import { useNavigate } from 'react-router-dom';
import "./Header.css";
import Cookies from "js-cookie";

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove('jwtToken');
    navigate('/', { replace: true });
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
