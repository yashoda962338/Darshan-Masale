// 🔵 FRONTEND: src/components/auth/OTPInput.jsx
import React, { useRef, useEffect } from 'react';

const OTPInput = ({ value, onChange, length = 6 }) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;

    const newValue = value.split('');
    newValue[index] = val.slice(-1);
    onChange(newValue.join(''));

    if (val && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, length);
    if (/^\d+$/.test(pasted)) {
      onChange(pasted);
      inputRefs.current[Math.min(pasted.length, length - 1)].focus();
    }
  };

  return (
    <div className="flex justify-center gap-3" onPaste={handlePaste}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-14 text-center font-heading text-2xl font-bold bg-background-cream border-2 border-secondary-gold/20 focus:border-primary-maroon rounded-xl outline-none transition-colors"
        />
      ))}
    </div>
  );
};

export default OTPInput;