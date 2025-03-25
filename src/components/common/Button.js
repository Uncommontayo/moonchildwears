import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button',
  className = '',
  disabled = false
}) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors";
  
  const variantClasses = {
    primary: "bg-custom-orange text-white hover:bg-custom-orange/90",
    secondary: "bg-white text-custom-orange border border-custom-orange hover:bg-gray-50",
    outline: "bg-transparent text-custom-orange border border-custom-orange hover:bg-custom-orange/10",
    text: "bg-transparent text-custom-orange hover:underline"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

export default Button;