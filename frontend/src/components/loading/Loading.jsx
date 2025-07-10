import "./Loading.css";

const Loading = ({ fullscreen = false, message = "AI 생성 중..." }) => (
  <div className={fullscreen ? "loading-overlay" : "loading-inline"}>
    <div className="loader" />
    <div className="loading-message">{message}</div>
  </div>
);

export default Loading;