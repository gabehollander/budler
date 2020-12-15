import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { format } from 'date-fns';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip} from 'recharts';
import CustomTooltip from '../CustomTooltip/CustomTooltip';
import Chip from '@material-ui/core/Chip';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import 'date-fns';
import MomentUtils from '@date-io/moment';
import { Typography } from '@material-ui/core';


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
      width: '80%',
      height: '67%',
      paddingTop: '1%',
      position: 'absolute',
      right: '0%',
      // backgroundColor: '#132c53'
    },
    criteriaContainer: {
      display: '-webkit-box',   /* OLD - iOS 6-, Safari 3.1-6, BB7 */
      display: '-ms-flexbox',  /* TWEENER - IE 10 */
      display: '-webkit-flex', /* NEW - Safari 6.1+. iOS 7.1+, BB10 */
      display: 'flex', 
      flexDirection: 'column',
      position: 'absolute',
      top: '1%',
      left: '1%',
      overflow: 'scroll',
      width: '20%',
      height: '75%',
      justifyContent: 'space-between',
      border: 'solid 1px #f2f2f2',
      borderRadius: '4px',
      paddingLeft: '1%',
      paddingTop: '1%',
      maxWidth: '238px',
    },
    criteriaItem:{
      height: 'max-content',
      width: '95%',
      color: '#f2f2f2'
    },
    searchButton: {
      position: 'absolute',
      bottom: '2%',
      left: '1%'
    },
    chartDisplayName: {
      textAlign: 'center',
      fontSize: '7vh',
      marginLeft: '7%',
      color: '#f2f2f2'
    },
    textInput: {
      fontSize: '3vh',
      "& .MuiIconButton-root": {
        paddingLeft: 0
      },
      color: '#f2f2f2'
    },
    labelPlacementTop: {
      alignItems: 'normal',
      margin: '4% 0'
    },
    bearInputLabel: {
      fontSize: '.75rem',
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
    const [symbolOpen, setSymbolOpen] = useState(false);
    const [from, setFrom] = useState(aWeekAgo());
    const [to, setTo] = useState(today());
    const [strike, setStrike] = useState(120);
    const [bear, setBear] = useState(false);
    const [exp, setExp] = useState(lastFriday());
    const [chartLoaded, setChartLoaded] = useState(false);
    const [searchCriteriaChanged, setSearchCriteriaChanged] = useState(false);
    const [chartDisplayName, setChartDisplayName] = useState('');
    const [oldSymbol, setOldSymbol] = useState('AAPL');
    const [oldFrom, setOldFrom] = useState(aWeekAgo());
    const [oldTo, setOldTo] = useState(today());
    const [oldExp, setOldExp] = useState(lastFriday());
    const [oldStrike, setOldStrike] = useState(120);
    const [oldBear, setOldBear] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [noData, setNoData] = useState(true);
    const [isAnimationActive, setIsAnimationActive] = useState(true);
    const [selectedCriteria, setSelectedCriteria] = useState('ask');

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
        let retY;
        if (selectedCriteria==='delta') retY = d['Item']['OptionGreeks'][selectedCriteria];
        if (selectedCriteria==='gamma') retY = d['Item']['OptionGreeks'][selectedCriteria];
        if (selectedCriteria==='theta') retY = d['Item']['OptionGreeks'][selectedCriteria];
        if (selectedCriteria==='rho') retY = d['Item']['OptionGreeks'][selectedCriteria];
        if (selectedCriteria==='vega') retY = d['Item']['OptionGreeks'][selectedCriteria];
        if (selectedCriteria==='iv') retY = d['Item']['OptionGreeks'][selectedCriteria];
        if (selectedCriteria==='ask') retY = d['Item'][selectedCriteria];
        if (selectedCriteria==='bid') retY = d['Item'][selectedCriteria];
        if (selectedCriteria==='oi') retY = d['Item']['openInterest'];
        if (selectedCriteria==='volume') retY = d['Item'][selectedCriteria];

        return {x:d['Item'].date, y:retY}
      })

      console.log(data)

      setCurrentData([...newLine]);

    },[data, selectedCriteria]);

    useEffect(() => {
      if (
         (symbol !== oldSymbol ||
         strike !== oldStrike ||
         from !== oldFrom ||
         to !== oldTo ||
         exp !== oldExp ||
         bear !== oldBear)
      ) {
        setSearchCriteriaChanged(true)
      } else {
        setSearchCriteriaChanged(false)
      }
    },[symbol,strike,from,to,exp,bear])

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
  
    const handleSymbolClose = () => {
      setSymbolOpen(false);
    };
  
    const handleSymbolOpen = () => {
      setSymbolOpen(true);
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

    const GreekElems = () => {
      const criteria = ['ask','bid','delta','gamma','theta','rho','vega','iv','oi','volume'];
      if(selectedItem && selectedItem.Item && selectedItem.Item.OptionGreeks) {
        const ret = []
        criteria.forEach(c => {
          ret.push(
            <div className={classes.greeksDataChipContainer}>
              <Chip 
                className={classes.greeksData}
                label={parseLabel(c)} 
                color= {selectedCriteria === c ? 'primary' : 'secondary'}
                onClick={() => {
                  setSelectedCriteria(c);
                  setIsAnimationActive(true);
                }}
              ></Chip>
              <p className={classes.greeksDataLabel}>{parseValue(c,selectedItem)}</p>
            </div>
          )
        })

        ret.unshift(
          <div className={classes.greeksDataChipContainer}>
            <Chip 
              className={classes.greeksData}
              label={selectedItem.Item.date} 
            ></Chip>
          </div>
        )

        return ret;
      }
      return []
    }

    function SymbolChart(props) {

      const onClick = (datum) => {
        if (datum && datum.payload && datum.payload.x) {
          setSelectedItem(data.find(x => x.Item.date === datum.payload.x));
        }
      }
    
     return (

      <div className={classes.chart}>
          <div className={classes.chartDisplayName}>
            {chartDisplayName}
          </div>
          
            {noData ? <div className={classes.noData}>No Data</div> :
          <ResponsiveContainer height='100%' width='100%'>
            <LineChart margin={{right: 40, top: 10}} data={currentData}>
              <Line type="monotone"
                dataKey= 'y'
                stroke="#ff9933" 
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
                width={'110%'}
                stroke='#f2f2f2'
              />
              <YAxis 
                stroke='#f2f2f2' 
                tick={{fontSize: '2vh'}}
                domain={[0, 'dataMax']}
              />
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
            <div className={classes.criteriaContainer}>
              <div className={classes.criteriaItem}>
                <InputLabel style={{fontSize: '.75rem',color:'#f2f2f2'}} id="label">Symbol</InputLabel>
                <Select labelId="label"
                  id="symbol-select"
                  open={symbolOpen}
                  onClose={handleSymbolClose}
                  onOpen={handleSymbolOpen}
                  value={symbol}
                  onChange={handleSymbolChange}
                  style={{fontSize: '3vh',color:'#f2f2f2'}}
                  MenuProps={{
                    classes: {
                      paper: classes.customSelect
                    }
                  }}
                >
                  <MenuItem style={{backgroundColor:'#262626','color':'#f2f2f2'}}value="VXX">VXX</MenuItem>
                  <MenuItem style={{backgroundColor:'#262626','color':'#f2f2f2'}}value="TSLA">TSLA</MenuItem>
                  <MenuItem style={{backgroundColor:'#262626','color':'#f2f2f2'}}value="T">T</MenuItem>
                  <MenuItem style={{backgroundColor:'#262626','color':'#f2f2f2'}}value="SPY">SPY</MenuItem>
                  <MenuItem style={{backgroundColor:'#262626','color':'#f2f2f2'}}value="AAPL">AAPL</MenuItem>
                </Select>
              </div>
              <div className={classes.criteriaItem}>
                {
                  // fromLoaded &&
                <KeyboardDatePicker
                  disableToolbar
                  variant="dialog"
                  format="yyyy/MM/DD"
                  margin="normal"
                  id="from-date-picker-inline"
                  label="From"
                  value={from}
                  autoOk
                  onChange={handleFromChange}
                  maxDate={today()}
                  minDate={'2018-12-27'}
                  allowKeyboardControl={true}
                  initialFocusedDate={from}
                  InputProps={{ className: classes.textInput }}
                />
                }
              </div>
              <div className={classes.criteriaItem}>
                {
                  // toLoaded &&
                <KeyboardDatePicker
                  disableToolbar
                  variant="dialog"
                  format="yyyy/MM/DD"
                  margin="normal"
                  id="from-date-picker-inline"
                  label="To"
                  value={to}
                  autoOk
                  onChange={handleToChange}
                  maxDate={today()}
                  minDate={from}
                  allowKeyboardControl={true}
                  initialFocusedDate={from}
                  InputProps={{ className: classes.textInput }}
                />
                }
              </div>
              <div className={classes.criteriaItem}>
                {
                  // expLoaded &&
                <KeyboardDatePicker
                  disableToolbar
                  variant="dialog"
                  format="yyyy/MM/DD"
                  margin="normal"
                  id="from-date-picker-inline"
                  label="Expiration"
                  value={exp}
                  autoOk
                  onChange={handleExpChange}
                  // maxDate={none}
                  minDate={from}
                  allowKeyboardControl={true}
                  initialFocusedDate={from}
                  InputProps={{ className: classes.textInput }}
                />
                }
              </div>
              <div className={classes.criteriaItem}>
              <form className={classes.root} noValidate autoComplete="off">
                <TextField id="standard-basic" 
                  label="Strike"
                  defaultValue={strike}
                  onBlur={handleStrikeChange}
                  InputProps={{ className: classes.textInput }}
                />
              </form>
              </div>
              <div className={classes.criteriaItem}>
              <FormControlLabel
                control={
                  <Switch
                    checked={bear}
                    onChange={() => {
                      setBear(!bear);
                    }}
                    name="bearSwitch"
                    color="primary"
                  />
                }
                label={<Typography className={classes.bearInputLabel}>Bear?</Typography>}
                labelPlacement="top"
                classes={{labelPlacementTop: classes.labelPlacementTop}}
              />
              </div>
            </div>
            <Button 
              variant="contained"
              onClick={search}
              className={classes.searchButton}
              disabled={!searchCriteriaChanged}
              color="primary"
            >Search
            </Button>
            <Paper
              className={classes.greeks}
            >
              <div className={classes.greeksGrid}>
                {noData ? null : <GreekElems></GreekElems>}
              </div> 
            </Paper>
          </Paper>
        </MuiPickersUtilsProvider>
        )
    )
}
// export default React.memo(ChartContainer)

