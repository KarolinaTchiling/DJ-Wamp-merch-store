import React from 'react';

interface CheckboxGroupProps {
    items: { [key: string]: { checked: boolean; displayText: string } }; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  groupName: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ items, onChange, groupName }) => {
  return (
    <div>
      <h3 className="mb-1">{groupName}</h3>
      <ul>
        {Object.keys(items).map((key) => (
          <li className="flex items-center" key={key}>
            <input
              type="checkbox"
              id={key}
              name={key}
              checked={items[key].checked}
              onChange={onChange}
              className="mr-2 ml-5"

            />
              <label htmlFor={key} className="text-black">{items[key].displayText}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CheckboxGroup;