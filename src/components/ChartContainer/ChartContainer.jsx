import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper';
import { format } from 'date-fns';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceArea} from 'recharts';
import CustomTooltip from '../CustomTooltip/CustomTooltip';
import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import 'date-fns';
import MomentUtils from '@date-io/moment';
import CriteriaContainer from '../CriteriaContainer/CriteriaContainer';
import './ChartContainer.css';

const useStyles = makeStyles(theme => ({
    gridContainer: {
      width: '90vw',
      height: '90vh',
      marginTop: '3%',
      backgroundColor: '#f8f8ff',
      position: 'absolute',
      left: '5vw',
      overflow: 'hidden',
      backgroundColor: '#1a1a1a',
      color: '#f2f2f2'
    },
    chart: {
      width: '100%',
      height: '80%',
      paddingTop: '1%',
      position: 'absolute',
      // backgroundColor: '#132c53'
      // paddingLeft: '4%'
    },
    criteriaItem:{
      height: 'max-content',
      width: '95%',
      color: '#f2f2f2'
    },
    chartDisplayName: {
      textAlign: 'center',
      fontSize: '7vh',
      // marginLeft: '7%',
      color: '#f2f2f2'
    },
    textInput: {
      fontSize: '3vh',
      "& .MuiIconButton-root": {
        paddingLeft: 0
      },
      color: '#f2f2f2'
    },
    greeksGrid: {
      display: '-webkit-box',
      height: '18%',
      width: '70%',
      position: 'absolute',
      bottom: '1%',
      right: '5%',
      textAlign: 'center',
      overflow: 'scroll',
      alignItems: 'center',
      border: 'solid 1px #f2f2f2',
      borderRadius: '4px',
    },
    greeksData: {
      width: '100%',
      height: '10vh',
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: '2.5vh',
      margin: '0 2%'
    },
    noData: {
      textAlign: 'center',
      height: '100%',
      paddingTop: '20%'
    },
    pageLoading: {
      height: '100%',
      width: '100%',
      position: 'absolute',
      textAlign: 'center',
      top: '45%'
    },
    chartLoading: {
      height: '100%',
      width: '100%',
      position: 'absolute',
      textAlign: 'center',
      top: '45%',
      left: '10%'
    },
    customSelect: {
      "& ul": {
        backgroundColor: "#262626",
      }
    },
    greeksDataChipContainer: {
      width: '20%',
      margin: '0 1%',
      marginTop: '2%',
    },
    greeksDataLabel: {
      margin:'0',
      color: '#f2f2f2',
      fontSize: '2vh',
    },
    disabledButton: {
      backgroundColor: 'grey'
    },
    responsiveContainer: {
      margin: 'auto',
    }

}))

export default function ChartContainer(props) {

  const today = () => {
    const formatYmd = date => date.toISOString().slice(0, 10);
    return formatYmd(new Date());
  }

  const aWeekAgo = () => {
    const formatYmd = date => date.toISOString().slice(0, 10);
    let d = new Date()
    d.setDate(d.getDate() - 21)
    return formatYmd(d);
  }

  const parseDate = (d) => {
    const months = {
      "Jan": '01' ,
      "Feb": '02',
      'Mar': "03",
      'Apr': "04",
      'May': "05",
      'Jun': "06",
      'Jul': "07",
      'Aug': "08",
      'Sep': "09",
      'Oct': "10",
      'Nov': "11",
      'Dec': "12"
  }
    //Fri Dec 04 2020 19:09:15 GMT-0500 (Eastern Standard Time)
    const split = d.split(' ');
    return split[3]+'-'+months[split[1]]+'-'+split[2]

  }

  const lastFriday = () => {
    for (let i=0;i<8;i++) {
      let d = new Date();
      const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      const nd = new Date(utc + (3600000*-4));
      nd.setDate(nd.getDate() - i)
      if ((nd.getDay() === 5) && i!==0) {
        return parseDate(nd.toString());
      }
    };
  }

    const classes = useStyles();
    const [data, setData] = useState([]);
    const [currentData, setCurrentData] = useState([]);
    const [symbol, setSymbol] = useState('AAPL');
    const [from, setFrom] = useState('2018-12-28'); //useState(aWeekAgo())
    const [to, setTo] = useState(today());
    const [strike, setStrike] = useState(120);
    const [bear, setBear] = useState(false);
    const [exp, setExp] = useState(lastFriday());
    const [chartLoaded, setChartLoaded] = useState(false);
    const [searchCriteriaChanged, setSearchCriteriaChanged] = useState(false);
    const [chartDisplayName, setChartDisplayName] = useState('');
    const [oldSymbol, setOldSymbol] = useState('AAPL');
    const [oldFrom, setOldFrom] = useState('2018-12-28');
    const [oldTo, setOldTo] = useState(today());
    const [oldExp, setOldExp] = useState(lastFriday());
    const [oldStrike, setOldStrike] = useState(120);
    const [oldBear, setOldBear] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [noData, setNoData] = useState(true);
    const [isAnimationActive, setIsAnimationActive] = useState(true);
    const [selectedCriteria1, setSelectedCriteria1] = useState('ask');
    const [selectedCriteria2, setSelectedCriteria2] = useState('bid');

    const [left, setLeft] = useState('dataMin');
    const [right, setRight] = useState('dataMin');
    const [refAreaLeft, setRefAreaLeft] = useState('dataMin');
    const [refAreaRight, setRefAreaRight] = useState('dataMin');
    const [top, setTop] = useState('dataMax+1');
    const [bottom, setBottom] = useState('dataMin-1');
    const [top2, setTop2] = useState('dataMax+1');
    const [bottom2, setBottom2] = useState('dataMin-1');

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };

    useEffect(() => {
        fetch('https://diamondhands-express.herokuapp.com/chain', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ 
                "symbol": symbol,
                "callOrPut": bear ? 'Put' : 'Call',
                "strike":strike,
                "from": from,
                "to": to,
                "date": exp
            }),
        }).then(res => res.json())
        .then(json => {
            json = json.filter((siv) => {
              return siv['Item'] ? true : false
            })
            json.length === 0 ? setNoData(true) : setNoData(false);
            setData(json)
            setChartLoaded(true);
            setChartDisplayName(formatSymbolDisplayName(symbol,strike,exp,bear));
            setOldSymbol(symbol);
            setOldBear(bear);
            setOldStrike(strike);
            setOldFrom(from);
            setOldTo(to);
            setOldExp(exp);
            if (json.length !== 0) {
              setSelectedItem(Object.keys(json[json.length-1]).length === 0 ? json[json.length-2] : json[json.length-1]);
            }
            setIsAnimationActive(true)
          });
    }, []);

    useEffect(() => {

      const newLine = data.filter((siv) => {
        return siv['Item'] ? true : false
      })
      .map((d, index) => {
        let retY1;
        let retY2;
        if (selectedCriteria1==='delta') retY1 = d['Item']['OptionGreeks'][selectedCriteria1];
        if (selectedCriteria1==='gamma') retY1 = d['Item']['OptionGreeks'][selectedCriteria1];
        if (selectedCriteria1==='theta') retY1 = d['Item']['OptionGreeks'][selectedCriteria1];
        if (selectedCriteria1==='rho') retY1 = d['Item']['OptionGreeks'][selectedCriteria1];
        if (selectedCriteria1==='vega') retY1 = d['Item']['OptionGreeks'][selectedCriteria1];
        if (selectedCriteria1==='iv') retY1 = d['Item']['OptionGreeks'][selectedCriteria1];
        if (selectedCriteria1==='ask') retY1 = d['Item'][selectedCriteria1];
        if (selectedCriteria1==='bid') retY1 = d['Item'][selectedCriteria1];
        if (selectedCriteria1==='oi') retY1 = d['Item']['openInterest'];
        if (selectedCriteria1==='volume') retY1 = d['Item'][selectedCriteria1];

        if (selectedCriteria2==='delta') retY2 = d['Item']['OptionGreeks'][selectedCriteria2];
        if (selectedCriteria2==='gamma') retY2 = d['Item']['OptionGreeks'][selectedCriteria2];
        if (selectedCriteria2==='theta') retY2 = d['Item']['OptionGreeks'][selectedCriteria2];
        if (selectedCriteria2==='rho') retY2 = d['Item']['OptionGreeks'][selectedCriteria2];
        if (selectedCriteria2==='vega') retY2 = d['Item']['OptionGreeks'][selectedCriteria2];
        if (selectedCriteria2==='iv') retY2 = d['Item']['OptionGreeks'][selectedCriteria2];
        if (selectedCriteria2==='ask') retY2 = d['Item'][selectedCriteria2];
        if (selectedCriteria2==='bid') retY2 = d['Item'][selectedCriteria2];
        if (selectedCriteria2==='oi') retY2 = d['Item']['openInterest'];
        if (selectedCriteria2==='volume') retY2 = d['Item'][selectedCriteria2];

        return {x:d['Item'].date, y1:retY1, y2:retY2}
      })

      setCurrentData(newLine);

    },[data, selectedCriteria1, selectedCriteria2]);

    useEffect(() => {
      if (
         (symbol !== oldSymbol ||
         strike !== oldStrike ||
         exp !== oldExp ||
         bear !== oldBear)
      ) {
        setSearchCriteriaChanged(true)
      } else {
        setSearchCriteriaChanged(false)
      }
    },[symbol,strike,exp,bear])

    useEffect(() => {
      if (
        (oldFrom && (oldFrom !== from)) ||
        (oldTo && (oldTo !== to))
        ) {
        search()
      } 
    },[from,to])

    const search = () => {
      setSearchCriteriaChanged(false);
      setChartLoaded(false);
      fetch('https://diamondhands-express.herokuapp.com/chain', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ 
            "symbol": symbol,
            "callOrPut": bear ? 'Put' : 'Call',
            "strike": strike,
            "from": from,
            "to": to,
            "date": exp
        }),
      }).then(res => res.json())
      .then(json => {
        json = json.filter((siv) => {
          return siv['Item'] ? true : false
        })
        json.length === 0 ? setNoData(true) : setNoData(false);
        setData(json)
        setChartLoaded(true);
        setChartDisplayName(formatSymbolDisplayName(symbol,strike,exp,bear));
        setOldSymbol(symbol);
        setOldBear(bear);
        setOldStrike(strike);
        setOldFrom(from);
        setOldTo(to);
        //because options expiring that day will have {}
        if (json.length !== 0) {
          setSelectedItem(Object.keys(json[json.length-1]).length === 0 ? json[json.length-2] : json[json.length-1]);
        }
        setOldExp(exp);
        setIsAnimationActive(true)
      });
    }

    const handleSymbolChange = event => {
      if (symbol !== event.target.value) {
        setSymbol(event.target.value);
      }
    };

    const handleFromChange = event => {
      if (format(event._d, "yyyy-MM-dd") !== from) {
        setFrom(format(event._d, "yyyy-MM-dd"));
      }
    }

    const handleToChange = event => {
      if (format(event._d, "yyyy-MM-dd") !== to) {
        setTo(format(event._d, "yyyy-MM-dd"));
      }
    }

    const handleExpChange = event => {
      if (format(event._d, "yyyy-MM-dd") !== exp) {
        setExp(format(event._d, "yyyy-MM-dd"));
      }
    }

    const handleStrikeChange = event => {
      if (strike.toString() !== event.target.value) {
        setStrike(event.target.value);
      }
    }

    const formatSymbolDisplayName = (symbol,strike,exp,bear) => {
      const months = {
        '01': "Jan",
        '02': "Feb",
        '03': "Mar",
        '04': "Apr",
        '05': "May",
        '06': "Jun",
        '07': "Jul",
        '08': "Aug",
        '09': "Sep",
        '10': "Oct",
        '11': "Nov",
        '12': "Dec"
    }
      const split = exp.split('-');
      return (symbol 
      + ' ' + months[split[1]] 
      + ' ' + split[2] 
      + ' ' + ' \''+split[0].slice(2) 
      + ' ' + '$' + strike
      + ' ' + (bear ? 'Put' : 'Call')
      );
    }

    const parseLabel = (l) => {
      switch(l) {
        case 'delta':
            return '\u0394'
        case 'gamma':
          return '\u0393'
        case 'theta':
          return '\u0398'
        case 'rho':
          return '\u03A1'
        case 'vega':
          return '♥️'
        case 'volume':
          return 'vol'
        default:
          return l
      }
    }

    const parseValue = (l,i) => {
      switch(l) {
        case 'delta':
        case 'gamma':
        case 'theta':
        case 'rho':
        case 'vega':
        case 'iv':
          return i.Item.OptionGreeks[l]
        case 'volume':
        case 'ask':
        case 'bid':
          return i.Item[l]
        case 'oi':
          return i.Item.openInterest
      }
    }

    function SymbolChart(props) {

      const onClick = (datum) => {
        if (datum && datum.payload && datum.payload.x) {
          setSelectedItem(data.find(x => x.Item.date === datum.payload.x));
        }
      }

      const getAxisYDomain = (from, to, ref, offset) => {
        const fromIdx = currentData.findIndex(e => {return e.x === from});
        const toIdx = currentData.findIndex(e => {return e.x === to});
        const refData = currentData.slice(fromIdx, toIdx);
        let [ bottom, top ] = [ refData[0][ref], refData[0][ref] ];
        refData.forEach( d => {
          if ( d[ref] > top ) top = d[ref];
          if ( d[ref] < bottom ) bottom = d[ref];
        });
        
        return [ (bottom|0) - offset, (top|0) + offset ]
      };

      const zoom = () => {     
        if ( refAreaLeft === refAreaRight || refAreaRight === '' ) {
          setRefAreaLeft('');
          setRefAreaRight('');
          return;
        }
    
        // xAxis domain
        if ( refAreaLeft > refAreaRight ) {
          const tempLeft = refAreaLeft.slice();
          const tempRight = refAreaRight.slice();
          setRefAreaLeft(tempRight);
          setRefAreaRight(tempLeft);
        }    

        // yAxis domain
        const [ tempBottom, tempTop ] = getAxisYDomain( refAreaLeft, refAreaRight, 'y1', 1 );
        const [ tempBottom2, tempTop2 ] = getAxisYDomain( refAreaLeft, refAreaRight, 'y2', 1 );
        
        setRefAreaLeft('');
        setRefAreaRight('');
        setFrom(refAreaLeft);
        setOldFrom(from);
        setTo(refAreaRight);
        setOldTo(to);
        setBottom(tempBottom);
        setTop(tempTop);
        setBottom2(tempBottom2);
        setTop2(tempTop2);
      };

      const zoomOut = () => {
        setRefAreaLeft('');
        setRefAreaRight('');
        setFrom('dataMin');
        setOldFrom(from);
        setTo('dataMax');
        setOldTo(to);
        setBottom('dataMin');
        setTop('dataMax');
        setBottom2('dataMin');
        setTop2('dataMax');
      }
    
     return (

      <div className={classes.chart}>
          <div className={classes.chartDisplayName}>
            {chartDisplayName}
          </div>
          
            {noData ? <div className={classes.noData}>No Data</div> :
          <ResponsiveContainer className={classes.responsiveContainer} height='100%' width='95%'>
            <LineChart  
              data={currentData}
              onMouseDown = { (e) => {if (e && e.activeLabel) setRefAreaLeft(e.activeLabel)} }
              onMouseMove = { (e) => refAreaLeft && setRefAreaRight(e.activeLabel) }
              onMouseUp = { zoom }
            >
              <Line type="monotone"
                dataKey= 'y1'
                yAxisId= 'y1'
                stroke="#ff9933" 
                isAnimationActive={isAnimationActive}
                onAnimationEnd={() => { setIsAnimationActive(false) }}
              />
              <Line type="monotone"
                dataKey= 'y2'
                yAxisId= 'y2'
                stroke="#392bff" 
                isAnimationActive={isAnimationActive}
                onAnimationEnd={() => { setIsAnimationActive(false) }}
              />
              <XAxis 
                tick={{fontSize: '2vh'}}
                dataKey="x" 
                tickFormatter={(d) => {
                  const split = d.split('-');
                  return split[1] + '-' + split[2]
                }}
                stroke='#f2f2f2'
                domain={[from, to]}
              />
              <YAxis 
                yAxisId= "y1"
                orientation="left"
                stroke='#f2f2f2' 
                tick={{fontSize: '2vh', fill: '#ff9933'}}
                domain={[0, 'dataMax']}
                angle={-45}
                tickFormatter={(d) => {
                  // if (d === 0) return '';
                  return d.toString().slice(0,7)
                }}
                domain={[bottom, top]}
              />
              <YAxis
                yAxisId= "y2"
                orientation="right"
                stroke='#f2f2f2' 
                tick={{fontSize: '2vh', fill: '#392bff'}}
                domain={[0, 'dataMax']}
                angle={45}
                tickFormatter={(d) => {
                  if (d === 0) return '';
                  return d.toString().slice(0,7)
                }}
                domain={[bottom2, top2]}
              />
              {(refAreaLeft && refAreaRight) ? (
              <ReferenceArea yAxisId="y1" x1={refAreaLeft} x2={refAreaRight}  strokeOpacity={0.3} /> ) : null
              }
              <Tooltip 
                customCallback={onClick}
                content={<CustomTooltip/>} 
                position={{ x: 'auto', y: 0 }}
                offset={0}
                contentStyle={{ backgroundColor: '#666666', color: '#f2f2f2'}}
              />
              </LineChart>
          </ResponsiveContainer>}
      </div>
      )
    }

    return (
        (data.length === 0 && !noData ?
        <div className={classes.pageLoading}>Loading...</div> :
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Paper className={classes.gridContainer} elevation={3}>
                {chartLoaded ?
                  <SymbolChart
                    chartDisplayName={chartDisplayName}
                    data={data}
                  ></SymbolChart>:
                  <div className={classes.chartLoading}>Loading...</div>
                }
                <CriteriaContainer
                  symbol = {symbol}
                  handleSymbolChange = {handleSymbolChange}
                  exp = {exp}
                  handleExpChange = {handleExpChange}
                  from = {from}
                  strike = {strike}
                  handleStrikeChange = {handleStrikeChange}
                  bear = {bear}
                  setBear = {setBear}
                  selectedCriteria1 = {selectedCriteria1}
                  selectedCriteria2 = {selectedCriteria2}
                  setSelectedCriteria1 = {setSelectedCriteria1}
                  setSelectedCriteria2 = {setSelectedCriteria2}
                  search = {search}
                  searchCriteriaChanged = {searchCriteriaChanged}
                ></CriteriaContainer>
            </Paper>
          </MuiPickersUtilsProvider>
        )
    )
}
