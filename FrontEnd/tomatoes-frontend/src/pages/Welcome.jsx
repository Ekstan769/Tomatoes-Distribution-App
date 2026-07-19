import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import "./Welcome.css";

export default function Welcome() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/signup?role=${role}`);
  };

  return (
    <div className="welcome-page">
      <div className="welcome-hero">
        <div className="welcome-logo">
          <svg width="32" height="24" viewBox="0 0 40 28" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 2 C10 2 4 10 4 16 C4 22 10 26 20 26 C30 26 36 22 36 16 C36 10 30 2 20 2 Z"
              fill="#1b4332"
            />
            <path d="M20 2 C20 10 20 18 20 26" stroke="#ffffff" strokeWidth="1.5" fill="none" />
          </svg>
          <span className="welcome-logo-text">ZeroSpoil</span>
        </div>
        <p className="welcome-tagline">Preserve it. Keep it fresh. Earn more.</p>
      </div>

      <div className="welcome-body">
        <ul className="welcome-features">
          <li>🌱 Track your produce from farm to market</li>
          <li>💰 Get paid faster with instant escrow</li>
          <li>📉 Cut spoilage with smart logistics alerts</li>
        </ul>

        <div className="welcome-role-section">
          <h2 className="welcome-select-role">SELECT ROLE TO CONTINUE</h2>
          <div className="welcome-role-buttons">
            <Button
              variant="primary"
              className="welcome-role-btn"
              onClick={() => handleRoleSelect("farmer")}
            >
              FARMER
            </Button>
            <Button
              variant="buyer"
              className="welcome-role-btn"
              onClick={() => handleRoleSelect("buyer")}
            >
              BUYER
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}