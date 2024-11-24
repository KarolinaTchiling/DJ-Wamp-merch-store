const CartIcon: React.FC<{ count: number; onClick: () => void; className?: string }> = ({ count, onClick, className }) => (
    <svg
      width="36"
      height="36"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick} // Attach the click handler
      className={`cursor-pointer ${className}`} // Add dynamic classes
    >
      <g id="Property 1=Default">
        <rect id="Rectangle 6" x="7.25" y="26.25" width="3.5" height="3.5" fill="#D4A373" stroke="#D4A373" strokeWidth="1.0" />
        <rect id="Rectangle 7" x="24.25" y="26.25" width="3.5" height="3.5" fill="#D4A373" stroke="#D4A373" strokeWidth="1.0" />
        <line id="Line 9" y1="0.75" x2="4.5" y2="0.75" stroke="#D4A373" strokeWidth="1.0" />
        <line id="Line 10" x1="4.25" y1="1" x2="4.25" y2="23" stroke="#D4A373" strokeWidth="1.0" />
        <line id="Line 13" x1="30.25" y1="6" x2="30.25" y2="23.3827" stroke="#D4A373" strokeWidth="1.0" />
        <line id="Line 11" x1="30.5" y1="6.25" x2="4" y2="6.24999" stroke="#D4A373" strokeWidth="1.0" />
        <line id="Line 12" x1="30.5" y1="23.25" x2="4" y2="23.25" stroke="#D4A373" strokeWidth="1.0" />
      </g>
      <text
        x="16"
        y="19"
        textAnchor="middle"
        fill="#D4A373"
        fontSize="12"
        fontWeight="thin"
      >
        {count}
      </text>
    </svg>
  );

  export default CartIcon;