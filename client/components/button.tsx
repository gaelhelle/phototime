import React, { MouseEventHandler } from "react";

interface ButtonProps {
  type?: "button" | "submit";
  color?: "primary" | "secondary";
  loading?: boolean;
  disabled?: boolean;
  onClick?: any;
  children?: React.ReactNode;
  className?: string;
}

export default function Button(props: ButtonProps) {
  const { type = "button", color = "primary", loading = false, onClick = null, children, className = "", disabled = false } = props;

  const buttonClasses = `px-10 py-4 rounded justify-center font-semibold disabled:bg-gray-500 disabled:cursor-default hover:opacity-80 active:scale-95 transition-all flex items-center gap-2 ${color === "primary" ? "bg-primary" : "bg-secondary"} ${className}`;

  return (
    <button onClick={onClick} className={buttonClasses} type={type} disabled={disabled || loading}>
      {loading ? (
        <>
          <span>
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="spinner_ajPY--parent">
              <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" fill="currentColor" />
              <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" fill="currentColor" className="spinner_ajPY" />
            </svg>
          </span>

          <span>Loading</span>
        </>
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
}
