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


import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import 'date-fns';
import MomentUtils from '@date-io/moment';
import { Chart } from 'react-charts'
import { Typography } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    gridContainer: {
      width: '90vw',
      height: '90vh',
      marginTop: '3%',
      backgroundColor: '#f8f8ff',
      position: 'absolute',
      left: '5vw',
      overflow: 'hidden'
    },
    chart: {
      width: '75%',
      height: '50%',
      paddingTop: '1%',
      position: 'absolute',
      right: '3%'
    },
    criteriaContainer: {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: '5%',
      left: '1%',
      overflow: 'auto',
      width: '18%',
      height: '80%',
      justifyContent: 'space-between'
    },
    searchButton: {
      position: 'absolute',
      bottom: '2%',
      left: '1%'
    },
    chartDisplayName: {
      textAlign: 'center',
      fontSize: '200%'
    },
    dateInput: {
      fontSize: '90%'
    },
    labelPlacementTop: {
      alignItems: 'normal',
      margin: '4% 0'
    },
    bearInputLabel: {
      color: 'rgba(0, 0, 0, 0.54)',
      fontSize: '.75rem'
    },
    greeksGrid: {
      display: 'block',
      height: '28%',
      width: '80%',
      position: 'absolute',
      bottom: '0',
      right: '0',
      textAlign: 'center'
    },
    greeksData: {
      width: 'fit-content',
      height: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: '4vh',
      margin: '0 2%'
    }
}))


function SymbolChart(props) {

    const dataMemo = React.useMemo(
      () => [
        {
          label: 'Series 1',
          data: props.data.filter((siv) => {
            return siv['Item'] ? true : false
          })
          .map((d, index) => {
            return {x:d['Item'].date, y:d['Item'].bid}
          }),
        },
      ],
      [...props.data]
    )
   
    const axes = React.useMemo(
      () => [
        { primary: true, type: 'ordinal', position: 'bottom'},
        { type: 'linear', position: 'left' }
      ],
      [...props.data]
    )
  
   return (
      // A react-chart hyper-responsively and continuously fills the available
      // space of its parent element automatically
      <div
        className={props.classes.chart}
      >
        <div className={props.classes.chartDisplayName}>
          {props.chartDisplayName}
        </div>
        <Chart 
          data={dataMemo}
          axes={axes} 
          // options={options}
        />
      </div>
    )
  }


export default function ChartContainer(props) {

    const classes = useStyles();
    const [data, setData] = useState([]);
    const [symbol, setSymbol] = useState('AAPL');
    const [symbolOpen, setSymbolOpen] = useState(false);
    const [validDates, setValidDates] = useState([]);
    const [from, setFrom] = useState('2018-12-27');
    const [to, setTo] = useState('2019-01-31');
    const [strike, setStrike] = useState(120);
    const [bear, setBear] = useState(false);
    const [exp, setExp] = useState('2019-02-22');
    const [fromLoaded, setFromLoaded] = useState(false);
    const [toLoaded, setToLoaded] = useState(false);
    const [expLoaded, setExpLoaded] = useState(false);
    const [chartLoaded, setChartLoaded] = useState(false);
    const [searchCriteriaChanged, setSearchCriteriaChanged] = useState(false);
    const [chartDisplayName, setChartDisplayName] = useState('');
    const [oldSymbol, setOldSymbol] = useState('AAPL');
    const [oldFrom, setOldFrom] = useState('2018-12-27');
    const [oldTo, setOldTo] = useState('2019-01-31');
    const [oldExp, setOldExp] = useState('2019-02-22');
    const [oldStrike, setOldStrike] = useState(120);
    const [oldBear, setOldBear] = useState(false);
    const [greeks, setGreeks] = useState({});
    const [selectedItem, setSelectedItem] = useState({});

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };


    useEffect(() => {
      if (fromLoaded, toLoaded, expLoaded) {
        fetch('http://localhost:8888/chain', {
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
            setData(json)
            setChartLoaded(true);
            setChartDisplayName(formatSymbolDisplayName(symbol,strike,exp,bear));
            setOldSymbol(symbol);
            setOldBear(bear);
            setOldStrike(strike);
            setOldFrom(from);
            setOldTo(to);
            setOldExp(exp);
            setSelectedItem(Object.keys(json[json.length-1]).length === 0 ? json[json.length-2] : json[json.length-1]);
          });
      }
    }, [fromLoaded, toLoaded, expLoaded]);

    useEffect(() => {
      if (fromLoaded && toLoaded && expLoaded &&
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

    useEffect(() => {
      fetch('http://localhost:8888/valid_dates', {
        method: 'POST',
        headers: headers,
      }).then(res => res.json())
      .then(json => {
          setValidDates(json);
          setFrom(json[json.length-8]);
          setOldFrom(json[json.length-8]);
          setFromLoaded(true);
          setTo(json[json.length-1]);
          setOldTo(json[json.length-1]);
          setToLoaded(true);
          let fridayIndex = 1;
          for (let i=1;i<9;i++) {
            if (new Date(json[json.length-i]).getDay() === 4) {
              fridayIndex = i;
              break;
            }
          };
          setExp(json[json.length-fridayIndex]);
          setOldExp(json[json.length-fridayIndex]);
          setExpLoaded(true);
      });
    }, []);

    // useEffect(() => {
    //   setGreeks()
    // },[selectedItem])

    const search = () => {
      setSearchCriteriaChanged(false);
      setChartLoaded(false);
      fetch('http://localhost:8888/chain', {
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
        console.log(json[json.length-2]);
        setData(json)
        setChartLoaded(true);
        setChartDisplayName(formatSymbolDisplayName(symbol,strike,exp,bear));
        setOldSymbol(symbol);
        setOldBear(bear);
        setOldStrike(strike);
        setOldFrom(from);
        setOldTo(to);
        //because options expiring that day will have {}
        setSelectedItem(Object.keys(json[json.length-1]).length === 0 ? json[json.length-2] : json[json.length-1]);
        setOldExp(exp);
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

    const GreekElems = () => {
      if(selectedItem && selectedItem.Item && selectedItem.Item.OptionGreeks) {
        return [
          <span className={classes.greeksData} ><b>&Delta;</b>: {selectedItem.Item.OptionGreeks.delta}</span>,
          <span className={classes.greeksData}><b>&Gamma;</b>: {selectedItem.Item.OptionGreeks.gamma}</span>,
          <span className={classes.greeksData}><b>&Theta;</b>: {selectedItem.Item.OptionGreeks.theta}</span>,
          <span className={classes.greeksData}><b>&Rho;</b>: {selectedItem.Item.OptionGreeks.rho}</span>,
          <span className={classes.greeksData}><b>Vega</b>: {selectedItem.Item.OptionGreeks.vega}</span>,
          <span className={classes.greeksData}><b>IV</b>: {selectedItem.Item.OptionGreeks.iv}</span>,
          <span className={classes.greeksData}><b>Date</b>: {selectedItem.Item.date}</span>,
          <span className={classes.greeksData}><b>Ask</b>: {selectedItem.Item.ask}</span>,
          <span className={classes.greeksData}><b>Bid</b>: {selectedItem.Item.bid}</span>,
          <span className={classes.greeksData}><b>OI</b>: {selectedItem.Item.openInterest}</span>,
          <span className={classes.greeksData}><b>Volume</b>: {selectedItem.Item.volume}</span>,
        ] 
      }
      return []
    }

    return (
        (data.length === 0 ?
        <div>Loading...</div> :
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Paper className={classes.gridContainer} elevation={3}>
            {chartLoaded ?
              <SymbolChart
                chartDisplayName={chartDisplayName}
                classes={classes}
                data={data}
              ></SymbolChart>:
              <div className={classes.chart}>Loading...</div>
            }
            <div className={classes.criteriaContainer}>
              <div className={classes.criteriaItem}>
                <InputLabel style={{fontSize: '.75rem'}} id="label">Symbol</InputLabel>
                <Select labelId="label"
                  id="symbol-select"
                  open={symbolOpen}
                  onClose={handleSymbolClose}
                  onOpen={handleSymbolOpen}
                  value={symbol}
                  onChange={handleSymbolChange}
                >
                  <MenuItem value="AAPL">AAPL</MenuItem>
                </Select>
              </div>
                {fromLoaded &&
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
                  maxDate={validDates[validDates.length-1]}
                  minDate={validDates[0]}
                  allowKeyboardControl={true}
                  initialFocusedDate={from}
                  InputProps={{ className: classes.dateInput }}
                />
                }
                {toLoaded &&
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
                  maxDate={validDates[validDates.length-1]}
                  minDate={from}
                  allowKeyboardControl={true}
                  initialFocusedDate={from}
                  InputProps={{ className: classes.dateInput }}
                />
                }
                {expLoaded &&
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
                  InputProps={{ className: classes.dateInput }}
                />
                }
              <form className={classes.root} noValidate autoComplete="off">
                <TextField id="standard-basic" 
                  label="Strike"
                  defaultValue={strike}
                  onBlur={handleStrikeChange}
                />
              </form>
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
            <Button 
              variant="contained"
              onClick={search}
              className={classes.searchButton}
              disabled={!searchCriteriaChanged}
            >Search
            </Button>
            <Paper
              className={classes.greeks}
            >
              <div className={classes.greeksGrid}>
                <GreekElems></GreekElems>
              </div> 
            </Paper>
          </Paper>
        </MuiPickersUtilsProvider>
        )
    )
    
}
