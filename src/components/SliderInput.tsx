import React, { useState, useEffect } from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  accentColor?: 'orange' | 'blue' | 'purple';
  subLabel?: React.ReactNode;
}

export const SliderInput: React.FC<SliderInputProps> = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 1260,
  step = 1,
  accentColor = 'orange',
  subLabel
}) => {
  const [localValue, setLocalValue] = useState(value.toString());

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const colorMap = {
    orange: 'focus:border-orange-500 accent-orange-500 text-orange-200',
    blue: 'focus:border-blue-500 accent-blue-500 text-blue-200',
    purple: 'focus:border-purple-500 accent-purple-500 text-purple-200',
  };

  const activeColor = colorMap[accentColor];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setLocalValue(rawValue);
    const num = parseInt(rawValue, 10);
    if (!isNaN(num)) {
      onChange(num);
    } else {
      onChange(0);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    setLocalValue(num.toString());
    onChange(num);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${activeColor.split(' ')[2]}`}>{label}</span>
        <input 
          type="text"
          inputMode="numeric"
          className={`bg-transparent border-b border-gray-700/50 hover:border-gray-500 px-1 py-0.5 outline-none text-white text-xs w-12 text-right transition-colors font-mono font-bold ${activeColor.split(' ')[0]}`}
          value={localValue}
          onChange={handleInputChange}
          onBlur={() => setLocalValue(value.toString())}
        />
      </div>
      <div className="relative pt-1 pb-1">
        <input 
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className={`w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer ${activeColor.split(' ')[1]}`}
        />
        {subLabel && (
          <div className="text-center w-full mt-1">
            {subLabel}
          </div>
        )}
      </div>
    </div>
  );
};
