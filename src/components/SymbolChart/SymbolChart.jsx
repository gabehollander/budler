import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceArea} from 'recharts';
import CustomTooltip from '../CustomTooltip/CustomTooltip';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    chart: {
      width: '100%',
      height: '80%',
      paddingTop: '1%',
      position: 'absolute',
    },
    chartDisplayName: {
      textAlign: 'center',
      fontSize: '7vh',
      color: '#f2f2f2'
    },
    noData: {
      textAlign: 'center',
      height: '100%',
      paddingTop: '20%'
    },
    responsiveContainer: {
      margin: 'auto',
    },
    zoomOutButton: {
      width: '5%',
      whiteSpace: 'nowrap',
      fontSize: '10px',
      marginRight: '3%',
    },
    zoomInButton: {
      width: '5%',
      whiteSpace: 'nowrap',
      fontSize: '10px',
      marginLeft: '3%',
      backgroundColor: '#4de1ff',
      color: 'rgba(0, 0, 0, 0.87)',
    },
}))

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

export default function SymbolChart(props) {

    const today = () => {
        const formatYmd = date => date.toISOString().slice(0, 10);
        return formatYmd(new Date());
    }

    const classes = useStyles();

    // chart state

    // for adjusting y axis on search and zoom.
    const getAxisYDomain = (from, to, ref, offset) => {
      if (props.currentData.length === 0) {
        return [null,null];
      }
      let fromIdx = props.currentData.findIndex(e => {return e.x === from});
      if (fromIdx === -1) fromIdx = 0;
      let toIdx = props.currentData.findIndex(e => {return e.x === to});
      if (toIdx === -1) toIdx = props.currentData.length - 1;
      const refData = props.currentData.slice(fromIdx, toIdx);
      console.log(props.currentData);
      let [ bottom, top ] = [ refData[0][ref], refData[0][ref] ];
      refData.forEach( d => {
        if ( d[ref] > top ) top = d[ref];
        if ( d[ref] < bottom ) bottom = d[ref];
      });
      return [ (bottom|0) - offset, (top|0) + offset ]
    };

    const [refAreaLeft, setRefAreaLeft] = useState('');
    const [refAreaRight, setRefAreaRight] = useState('');
    const [top, setTop] = useState('');
    const [bottom, setBottom] = useState('');
    const [top2, setTop2] = useState('');
    const [bottom2, setBottom2] = useState('');

    useEffect(() => {
      // yAxis domain
      let [ tempBottom, tempTop ] = getAxisYDomain( props.from, props.to, 'y1', 1 );
      let [ tempBottom2, tempTop2 ] = getAxisYDomain( props.from, props.to, 'y2', 1 );

      tempBottom < tempBottom2 ? setBottom(tempBottom) : setBottom(tempBottom2);
      tempTop > tempTop2 ? setTop(tempTop) : setTop(tempTop2);
    },[props.selectedCriteria1,props.selectedCriteria2,props.currentData])

    // for setting the selectedItem, for the bottom menu, and zoom button
    const onClick = (datum) => {
      if (datum && datum.payload && datum.payload.x) {
        props.setSelectedItem(props.data.find(x => x.Item.date === datum.payload.x));
      }
    }

    // for zooming from a selectedItem. 
    // Chooses indexes to the left and right of the selectedItem.

    const fixedZoom = (date) => {
      const idx = props.data.findIndex(x => x.Item.date === date);

      const refLeft = props.data[idx-1].Item.date;

      let refRight = ''
      if (idx === props.data.length-2) {
        refRight = props.data[idx+1].Item.date
      } else {
        refRight = props.data[idx+2].Item.date
      }
  
      // yAxis domain
      let [ tempBottom, tempTop ] = getAxisYDomain( refLeft, refRight, 'y1', 1 );
      let [ tempBottom2, tempTop2 ] = getAxisYDomain( refLeft, refRight, 'y2', 1 );
      
      setRefAreaLeft('');
      setRefAreaRight('');
      props.setFrom(refLeft);
      props.setOldFrom(props.from);
      props.setTo(refRight);
      props.setOldTo(props.to);
      setBottom(tempBottom);
      setTop(tempTop);
      setBottom2(tempBottom2);
      setTop2(tempTop2);
    }

    
    // core zoom. 
    // Based on refArea determined by click and drag gesture.
  
    const zoom = () => {  
      let refRight = refAreaRight.slice();
      let refLeft = refAreaLeft.slice();
      if ( refAreaLeft === refAreaRight || refAreaRight === '' ) {
        setRefAreaLeft('');
        setRefAreaRight('');
        return;
      }
  
      // xAxis domain
      if ( new Date(refLeft) > new Date(refRight) ) {
        const tempLeft = refLeft.slice();
        const tempRight = refRight.slice();
        refRight = tempLeft;
        refLeft = tempRight;
      }

      // yAxis domain
      let [ tempBottom, tempTop ] = getAxisYDomain( refLeft, refRight, 'y1', 1 );
      let [ tempBottom2, tempTop2 ] = getAxisYDomain( refLeft, refRight, 'y2', 1 );

      const idx = props.data.findIndex(x => x.Item.date === refRight);
    
      if (idx === props.data.length-1) {
        refRight = props.data[idx].Item.date
      } else {
        refRight = props.data[idx+1].Item.date
      }

      setRefAreaLeft('');
      setRefAreaRight('');
      props.setFrom(refLeft);
      props.setOldFrom(props.from);
      props.setTo(refRight);
      props.setOldTo(props.to);
      setBottom(tempBottom);
      setTop(tempTop);
      setBottom2(tempBottom2);
      setTop2(tempTop2);
    };

    const zoomOut = () => {
      setRefAreaLeft('');
      setRefAreaRight('');
      props.setFrom(props.minDate);
      props.setOldFrom(props.from);
      props.setTo(today());
      props.setOldTo(props.to);
      setBottom('dataMin');
      setTop('dataMax');
      setBottom2('dataMin');
      setTop2('dataMax');
    }

    // for handling click and drag gesture
    const handleMouseDown = (e) => {
      if (e && e.activeLabel) {
        props.setSelectedItem(props.data.find(x => x.Item.date === e.activeLabel));
        if (window.screen.width > 800) {
          setRefAreaLeft(e.activeLabel)
        }
      }
    }

    // no zooming on edge indexes (start and end)
    const canZoomIn = () => {
      if (props.data && props.selectedItem.Item) {
        const idx = props.data.findIndex(x => x.Item.date === props.selectedItem.Item.date);
        if (idx === 0 || idx === props.data.length-1) {
          return true;
        }
        return false;
      }
    }

    const getTicks = (b,t,numTicks,axisKey) => {
      const range = t - b;
      const interval = range / numTicks;
      const ticks = []
      for ( let i = 0; i < numTicks - 1; i++ ) {
        ticks.push(b+(interval*i));
      }
      ticks.push(t);
      return ticks;
    }
  
    return (

    <div className={classes.chart}>

        <div className={classes.chartDisplayName}>
        <Button 
          variant="contained"
          onClick={zoomOut}
          className={classes.zoomOutButton}
          color="primary"
          >Zoom Out
        </Button>
          {props.chartDisplayName}
        <Button 
          variant="contained"
          onClick={() => {fixedZoom(props.selectedItem.Item.date)}}
          className={classes.zoomInButton}
          disabled={canZoomIn()}
          color="secondary"
          >Zoom In
        </Button>
        </div>
    
          {props.noData ? <div className={classes.noData}>No Data</div> :
        <ResponsiveContainer className={classes.responsiveContainer} height='100%' width='95%'>
          <LineChart  
            data={props.currentData}
            onMouseDown = { (e) => handleMouseDown(e) }
            onMouseMove = { (e) => refAreaLeft && setRefAreaRight(e.activeLabel) }
            onMouseUp = { zoom }
            margin={{ top: 25, right: 20, bottom: 0, left: 20 }}
          >
            <Tooltip 
              y1={props.selectedCriteria1}
              y2={props.selectedCriteria2}
              customCallback={onClick}
              zoom={zoom}
              content={<CustomTooltip/>} 
              position={{ x: 'auto', y: -35 }}
              offset={0}
              contentStyle={{ backgroundColor: '#333333', color: '#f2f2f2'}}
            />
            {(refAreaLeft && refAreaRight) ? (
              <ReferenceArea yAxisId="y1" x1={refAreaLeft} x2={refAreaRight}  strokeOpacity={0.3} /> ) : null
            }

            <Line type="monotone"
              dataKey= 'y1'
              yAxisId= 'y1'
              stroke="#ff9933" 
              isAnimationActive={true}
            />
            <Line type="monotone"
              dataKey= 'y2'
              yAxisId= 'y2'
              stroke="#4de1ff" 
              isAnimationActive={true}
              //#4de1ff
            />
            <XAxis 
              tick={{fontSize: '2vh'}}
              dataKey="x" 
              tickFormatter={(d) => {
                const split = d.split('-');
                return split[1] + '-' + split[2]
              }}
              stroke='#f2f2f2'
              allowDataOverflow={true}
              domain={[props.from, props.to]}
            />
            <YAxis 
              yAxisId= "y1"
              orientation="left"
              stroke='#f2f2f2' 
              tick={{fontSize: '2vh', fill: '#ff9933', dy:-10}}
              tickFormatter={(d) => {
                  if (moneyCriteria.includes(props.selectedCriteria1)) {
                      return '$' + d.toString().slice(0,7)
                  } else {
                      return d.toString().slice(0,7)
                  } 
              }}
              domain={[bottom, top]}
              ticks={getTicks(bottom, top, 4)}
              reversed={false}
              padding={{ top: 10, bottom: 10 }}
            />
            <YAxis
              yAxisId= "y2"
              orientation="right"
              stroke='#f2f2f2' 
              tick={{fontSize: '2vh', fill: '#4de1ff',dy:-10}}
              tickFormatter={(d) => {
                if (moneyCriteria.includes(props.selectedCriteria2)) {
                    return '$' + d.toString().slice(0,7)
                } else {
                    return d.toString().slice(0,7)
                } 
              }}
              domain={[bottom, top]}
              ticks={getTicks(bottom, top, 4)}
              reversed={false}
              padding={{ top: 10, bottom: 10 }}
            />
            </LineChart>
        </ResponsiveContainer>}
    </div>
    )
  }