'use client';

import React from 'react';

interface CheckboxProps {
  title: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  id: string;
  checked: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ title, onChange, value, id, checked }) => {
  return (
    <div className={'gugu-item'}>
      <input
        type="checkbox"
        id={id}
        value={value}
        name={title}
        onChange={onChange}
        checked={checked}
      />
      <label htmlFor={id}>{title}</label>
    </div>
  );
};

export default Checkbox;
