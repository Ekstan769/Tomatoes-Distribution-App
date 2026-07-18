import "./Input.css";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  name,
  className = "",
}) {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
}
