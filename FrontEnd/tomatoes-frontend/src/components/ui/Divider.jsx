import "./Divider.css";

export default function Divider({ text = "OR" }) {
  return (
    <div className="divider">
      <span className="divider-line" />
      <span className="divider-text">{text}</span>
      <span className="divider-line" />
    </div>
  );
}
