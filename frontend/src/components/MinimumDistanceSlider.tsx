import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const minDistance = 20;

interface MinimumDistanceSliderProps {
  onPriceChange: (priceRange: number[]) => void; // Callback for price range changes
  priceRange: number[]; // Initial price range
}

export default function MinimumDistanceSlider({
  onPriceChange,
  priceRange,
}: MinimumDistanceSliderProps) {
  const [value, setValue] = React.useState<number[]>(priceRange);

  const handleChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    // Update the state while maintaining the minimum distance
    if (activeThumb === 0) {
      const updatedValue = [
        Math.min(newValue[0], value[1] - minDistance),
        value[1],
      ];
      setValue(updatedValue);
      onPriceChange(updatedValue); // Call the callback with updated values
    } else {
      const updatedValue = [
        value[0],
        Math.max(newValue[1], value[0] + minDistance),
      ];
      setValue(updatedValue);
      onPriceChange(updatedValue); // Call the callback with updated values
    }
  };

  return (
    <Box sx={{ width: 200 }}>
      <h3 className="text-black font-normal text-sm">Set Price Range</h3>
      <Slider
        sx={{
          color: "#CCD5AE",
          "& .MuiSlider-thumb": {
            backgroundColor: "#7F6145",
            borderRadius: "0px",
            width: 14,
            height: 14,
            "&::after": { display: "none" },
            "&:hover": { backgroundColor: "#7F6145", boxShadow: "none" },
            "&:focus, &:focus-visible": { outline: "none", boxShadow: "none" },
            "&.Mui-active": { boxShadow: "none" },
            "&:not(:hover):not(:active)": { boxShadow: "none" },
          },
          "& .MuiSlider-track": { backgroundColor: "#CCD5AE", height: 8 },
          "& .MuiSlider-rail": {
            opacity: 0.7,
            height: 8,
            backgroundColor: "#D4A373",
          },
        }}
        value={value} // Controlled value from state
        min={0}
        max={150}
        step={10}
        onChange={handleChange} // Call handleChange for updates
        valueLabelDisplay="off"
        disableSwap
      />
      <div className="flex justify-between mt-0 -mt-2 -mx-2 text-black font-normal text-sm">
        <span>${value[0]}</span>
        {value[1] === 150 ? `$${value[1]}+` : `$${value[1]}`}
      </div>
    </Box>
  );
}