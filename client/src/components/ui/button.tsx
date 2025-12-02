import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="w-full bg-blue-500 text-white font-bold py-2.5 px-5 rounded-lg
                 transform transition-all duration-300
                 hover:bg-blue-600 hover:scale-105 hover:shadow-lg hover:shadow-blue-400/50
                 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;