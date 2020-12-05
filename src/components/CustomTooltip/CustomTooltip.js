// recharts doesn't export the default tooltip,
// but it's located in the package lib so you can get to it anyways
import DefaultTooltipContent from 'recharts/lib/component/DefaultTooltipContent';
import React, { useState } from 'react';


const CustomTooltip = props => {

  const [tooltipDate, setTooltipDate] = useState([]);

  // payload[0] doesn't exist when tooltip isn't visible
  if (props.payload[0] != null) {
    if (tooltipDate.length === 0) {
        setTooltipDate([null,props.payload[0]])
    }
    if (tooltipDate.length === 1 && tooltipDate[0] !== props.payload[0]) {
        setTooltipDate([tooltipDate[1], props.payload[0]])
    }
    if (tooltipDate.length == 2 && tooltipDate[1] !== props.payload[0]) {
        setTooltipDate([tooltipDate[1], props.payload[0]]);
    }
    // mutating props directly is against react's conventions
    // so we create a new payload with the name and value fields set to what we want
    const newPayload = [
      {
        // all your data which created the tooltip is located in the .payload property
        value: props.payload[0].payload.name,
        // you can also add "unit" here if you need it
      },
      ...props.payload,
    ];

    // we render the default, but with our overridden payload
    const customTooltip = (
    <div style={{pointerEvents: 'auto'}}onClick={() => {
        props.customCallback(tooltipDate[0])
    }}
    >
        <DefaultTooltipContent {...props} payload={newPayload} />
    </div>
    )
    return customTooltip;
  }

  // we just render the default
  return <DefaultTooltipContent {...props} />;
};

export default CustomTooltip;
