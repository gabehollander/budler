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
      backgroundColor: '#392bff',
    },
}))

export default function SymbolChart(props) {

    const today = () => {
        const formatYmd = date => date.toISOString().slice(0, 10);
        return formatYmd(new Date());
    }

    // first default date, when I bought the subscription.
    const minDate = '2020-12-28'

    const classes = useStyles();

    // chart state
    const [refAreaLeft, setRefAreaLeft] = useState('');
    const [refAreaRight, setRefAreaRight] = useState('');
    const [top, setTop] = useState('dataMax+1');
    const [bottom, setBottom] = useState('dataMin-1');
    const [top2, setTop2] = useState('dataMax+1');
    const [bottom2, setBottom2] = useState('dataMin-1');

    // for setting the selectedItem, for the bottom menu, and zoom button
    const onClick = (datum) => {
      if (datum && datum.payload && datum.payload.x) {
        props.setSelectedItem(props.data.find(x => x.Item.date === datum.payload.x));
      }
    }

    // for adjusting y axis on search and zoom.
    const getAxisYDomain = (from, to, ref, offset) => {
      const fromIdx = props.currentData.findIndex(e => {return e.x === from});
      const toIdx = props.currentData.findIndex(e => {return e.x === to});
      const refData = props.currentData.slice(fromIdx, toIdx);
      let [ bottom, top ] = [ refData[0][ref], refData[0][ref] ];
      refData.forEach( d => {
        if ( d[ref] > top ) top = d[ref];
        if ( d[ref] < bottom ) bottom = d[ref];
      });
      return [ (bottom|0) - offset, (top|0) + offset ]
    };

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
      const [ tempBottom, tempTop ] = getAxisYDomain( refLeft, refRight, 'y1', 1 );
      const [ tempBottom2, tempTop2 ] = getAxisYDomain( refLeft, refRight, 'y2', 1 );
      
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
      const [ tempBottom, tempTop ] = getAxisYDomain( refLeft, refRight, 'y1', 1 );
      const [ tempBottom2, tempTop2 ] = getAxisYDomain( refLeft, refRight, 'y2', 1 );

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
      props.setFrom(minDate);
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
              stroke="#392bff" 
              isAnimationActive={true}
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
                  return d.toString().slice(0,7)
                }}
                domain={[bottom, top]}
                reversed={false}
              />
            <YAxis
              yAxisId= "y2"
              orientation="right"
              stroke='#f2f2f2' 
              tick={{fontSize: '2vh', fill: '#392bff',dy:-10}}
              tickFormatter={(d) => {
                return d.toString().slice(0,7)
              }}
              domain={[bottom2, top2]}
              reversed={false}
            />
            </LineChart>
        </ResponsiveContainer>}
    </div>
    )
  }