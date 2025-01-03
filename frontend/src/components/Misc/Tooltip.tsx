import * as React from 'react';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 180,
  },
});

interface BasicTooltipProps {
    title: string; // Tooltip title
  }

  export default function BasicTooltip({ title }: BasicTooltipProps) {
  return (
    <CustomWidthTooltip title={title} placement="right">
      <IconButton >
        <InfoIcon />
      </IconButton>
    </CustomWidthTooltip>
  );
}
