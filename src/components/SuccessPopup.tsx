// src/components/SuccessPopup.tsx
import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessPopupProps {
  message: string;
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ message, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose();
    }, 3000); 

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-100 text-green-800 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 z-50">
      <CheckCircle className="w-6 h-6 text-green-600" />
      <span className="text-sm font-medium">{message}</span>
      <button
        className="ml-4 text-green-800 hover:text-green-900 font-bold"
        onClick={() => {
          setShow(false);
          onClose();
        }}
      >
        ×
      </button>
    </div>
  );
};

export default SuccessPopup;
