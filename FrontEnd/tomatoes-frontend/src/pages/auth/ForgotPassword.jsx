import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import "./AuthForm.css";

export default function ForgotPassword() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber) {
      setError("Please enter your phone number.");
      return;
    }

    // TODO: Replace with real API call once backend endpoint is ready
    // e.g. await api.post("/auth/forgot-password", { phoneNumber });
    setSubmitted(true);
  };

  return (
    <div className="auth-card">
      <h1 className="auth-title">FORGOT PASSWORD</h1>

      {submitted ? (
        <p className="auth-switch">
          If an account exists for that number, reset instructions have been sent.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="PHONE NUMBER:"
            name="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          {error && <p className="auth-error">{error}</p>}

          <Button type="submit" className="auth-submit-btn">
            SEND RESET LINK
          </Button>
        </form>
      )}

      <p className="auth-switch">
        Remembered it? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}