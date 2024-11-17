import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value: number) {
  return `${value}°C`;
}

const minDistance = 10;

interface MinimumDistanceSliderProps {
  onChange: (values: number[]) => void; // Callback to export values
}

export default function MinimumDistanceSlider({ onChange }: MinimumDistanceSliderProps) {

  const [value, setValue] = React.useState<number[]>([0, 100]);

  const handleChange = (event: Event, newValue: number | number[], activeThumb: number) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      const updatedValue = [Math.min(newValue[0], value[1] - minDistance), value[1]];
      setValue(updatedValue);
      onChange(updatedValue); // Export updated values
    } else {
      const updatedValue = [value[0], Math.max(newValue[1], value[0] + minDistance)];
      setValue(updatedValue);
      onChange(updatedValue); // Export updated values
    }
  };

  return (
    <Box sx={{ width: 190 }}>
      <h3 className="text-black font-normal text-sm">Set Price Range</h3>
      <Slider
        sx={{
          color: '#CCD5AE',
          '& .MuiSlider-thumb': {
            backgroundColor: '#7F6145', 
            borderRadius: '0px', 
            width: 14,
            height: 14,
            '&::after': {
              display: 'none', 
            },
            '&:hover': {
              backgroundColor: '#7F6145', 
              boxShadow: 'none', 
            },
            '&:focus, &:focus-visible': {
              outline: 'none', 
              boxShadow: 'none', 
            },
            '&.Mui-active': {
              boxShadow: 'none', 
            },
            '&:not(:hover):not(:active)': {
              boxShadow: 'none', 
            },
          },
          '& .MuiSlider-track': {
            backgroundColor: '#CCD5AE', 
            height: 8
          },
          '& .MuiSlider-rail': {
            opacity: 0.7,
            height: 8,
            backgroundColor: '#D4A373', 
          },
        }}
        getAriaLabel={() => 'Minimum distance'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="off"
        getAriaValueText={valuetext}
        disableSwap
      />

      <div className="flex justify-between mt-0 -mt-2 -mx-2 text-black font-normal text-sm">
        <span>${value[0]}</span>
        <span>${value[1]}</span>
      </div>

      
    </Box>
  );
}
