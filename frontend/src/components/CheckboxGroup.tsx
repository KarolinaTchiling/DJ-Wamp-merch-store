import React from 'react';

interface CheckboxGroupProps {
    items: { [key: string]: { checked: boolean; displayText: string } }; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  groupName: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ items, onChange, groupName }) => {
  return (
    <div>
      <h3 className="mb-2">{groupName}</h3>
      <ul>
        {Object.keys(items).map((key) => (
          <li className="flex items-center mb-.5" key={key}>
            <input
              type="checkbox"
              id={key}
              name={key}
              checked={items[key].checked}
              onChange={onChange}
              className="mr-3 ml-5 appearance-none h-4 w-4 border border-tea border-2 checked:bg-tea checked:border-transparent focus:outline-none transition duration-200 ease-in-out relative cursor-pointer"

            />
              <label htmlFor={key} className="text-black">{items[key].displayText}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CheckboxGroup;