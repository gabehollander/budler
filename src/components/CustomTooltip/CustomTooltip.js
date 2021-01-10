// recharts doesn't export the default tooltip,
// but it's located in the package lib so you can get to it anyways
import DefaultTooltipContent from 'recharts/lib/component/DefaultTooltipContent';
import React, { useState } from 'react';

const criteria = [	
  {value:'open',label: 'open'},	
  {value:'high',label: 'high'},	
  {value:'low',label: 'low'},	
  {value:'close',label: 'close'},	
  {value:'trade_volume',label: 'volume'},
  {value:'bid_size_1545',label: 'bid size'},
  {value:'bid_1545',label: 'bid'},
  {value:'ask_size_1545',label: 'ask size'},
  {value:'ask_1545',label: 'ask'},
  {value:'underlying_bid_1545',label: 'underlying bid'},
  {value:'underlying_ask_1545',label: 'underlying ask'},
  {value:'implied_underlying_price_1545',label: 'imp. underlying price'},	
  {value:'active_underlying_price_1545',label: 'underlying price'},	
  {value:'implied_volatility_1545',label: 'IV'},
  {value:'delta_1545',label: 'delta'},
  {value:'gamma_1545',label: 'gamma'},	
  {value:'theta_1545',label: 'theta'},	
  {value:'vega_1545',label: 'vega'},	
  {value:'rho_1545',label: 'rho'},
  {value:'bid_size_eod',label: 'bid size eod'},
  {value:'bid_eod',label: 'bid eod'},	
  {value:'ask_size_eod',label: 'ask size eod'},	
  {value:'ask_eod',label: 'ask eod'},	
  {value:'underlying_bid_eod',label: 'underlying bid eod'},	
  {value:'underlying_ask_eod',label: 'underlying ask eod'},	
  {value:'vwap',label: 'vwap'},
  {value:'open_interest',label: 'OI'}
]

const moneyCriteria = [
  'open',
  'high',
  'low',
  'close',
  'bid_1545',
  'ask_1545',
  'underlying_bid_1545',
  'underlying_ask_1545',
  'bid_eod',
  'implied_underlying_price_1545',
  'ask_eod',
  'underlying_bid_eod',
  'underlying_ask_eod',
  'vwap'
]

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
    if (moneyCriteria.includes(props.y1) && props.payload[0].payload.y1.toString().indexOf('$') === -1){
      props.payload[0].payload.y1 = '$' + props.payload[0].payload.y1
    }
    if (moneyCriteria.includes(props.y2) && props.payload[1].payload.y2.toString().indexOf('$') === -1){
      props.payload[1].payload.y2 = '$' + props.payload[1].payload.y2
    }
    props.payload[0].name = criteria.find(x => x.value === props.y1).label;
    props.payload[1].name = criteria.find(x => x.value === props.y2).label;

    const newPayload = [
      {
        // all your data which created the tooltip is located in the .payload property
        // value: props.payload[0].payload.name,
        // you can also add "unit" here if you need it
      },
      ...props.payload,
    ];

    // we render the default, but with our overridden payload
    const customTooltip = (
    <div style={{
      pointerEvents: 'auto',
      lineHeight: '50%'
      }}
      onClick={() => {
        props.customCallback(tooltipDate[0])
      }}
    >
        <DefaultTooltipContent {...props} payload={newPayload}>
        </DefaultTooltipContent>
    </div>
    )
    return customTooltip;
  }

  // we just render the default
  return <DefaultTooltipContent {...props} />;
};

export default CustomTooltip;
