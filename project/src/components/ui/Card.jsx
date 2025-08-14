import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, onClick, ...props }) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200';
  const hoverClasses = hover ? 'hover:shadow-md hover:border-gray-300 cursor-pointer transition-all duration-200' : '';

  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;