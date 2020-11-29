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
      width: '70%',
      height: '60%',
      paddingTop: '1%',
      position: 'absolute',
      right: '6%'
    },
    criteriaContainer: {
      display: '-webkit-box',   /* OLD - iOS 6-, Safari 3.1-6, BB7 */
      display: '-ms-flexbox',  /* TWEENER - IE 10 */
      display: '-webkit-flex', /* NEW - Safari 6.1+. iOS 7.1+, BB10 */
      display: 'flex', 
      flexDirection: 'column',
      position: 'absolute',
      top: '5%',
      left: '1%',
      overflow: 'scroll',
      width: '18%',
      height: '80%',
      justifyContent: 'space-between'
    },
    criteriaItem:{
      height: 'max-content',
    },
    searchButton: {
      position: 'absolute',
      bottom: '2%',
      left: '1%'
    },
    chartDisplayName: {
      textAlign: 'center',
      fontSize: '7vh',
      marginLeft: '7%'
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
      textAlign: 'center',
      overflow: 'auto'
    },
    greeksData: {
      width: 'fit-content',
      height: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: '4vh',
      margin: '0 2%'
    },
    noData: {
      textAlign: 'center',
      height: '100%',
      paddingTop: '20%'
    }
}))

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
    const [selectedItem, setSelectedItem] = useState({});
    const [noData, setNoData] = useState(true);

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

    useEffect(() => {
      if (fromLoaded, toLoaded, expLoaded) {
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
            json.filter((siv) => {
              return siv['Item'] ? true : false
            }).length === 0 ? setNoData(true) : setNoData(false);
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
      fetch('https://diamondhands-express.herokuapp.com/valid_dates', {
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
            // sometimes getDay is zero indexed, sometimes its not, fuck me right?
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
        json.filter((siv) => {
          return siv['Item'] ? true : false
        }).length === 0 ? setNoData(true) : setNoData(false);
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
        const ret = [
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
        return ret
      }
      return []
    }


    function SymbolChart(props) {

      // const dataMemo = React.useMemo(
      //   () => [
      //     {
      //       label: 'Series 1',
      //       data: props.data.filter((siv) => {
      //         return siv['Item'] ? true : false
      //       })
      //       .map((d, index) => {
      //         return {x:d['Item'].date, y:d['Item'].bid}
      //       }),
      //     },
      //   ],
      //   [...props.data]
      // )

      const dataMemo = React.useMemo(
        () => 
          
            props.data.filter((siv) => {
              return siv['Item'] ? true : false
            })
            .map((d, index) => {
              return {x:d['Item'].date, $:d['Item'].bid}
            })

        ,
        [...props.data]
      )
     
      const axes = React.useMemo(
        () => [
          { primary: true, type: 'ordinal', position: 'bottom', format: (d) => {
            return d
            },
            maxLabelRotation: 70
          },
          { type: 'linear', position: 'left' }
        ],
        [...props.data]
      )
  
      const primaryCursor = React.useMemo(
        () => ({
          render: props => (
            <span style={{ fontSize: "1rem" }}>
              <span role="img" aria-label="icon">
              </span>{" "}
              {(props.formattedValue || "").toString()}
            </span>
          )
        }),
        []
      );
      const secondaryCursor = React.useMemo(
        () => ({
          render: props => (
            <span style={{ fontSize: "1rem" }}>
              <span role="img" aria-label="icon">
                $
              </span>{" "}
              {(props.value || "").toString()}
            </span>
          ),
          showLine: false
        }),
        []
      );

      const onClick = (datum) => {
          if (datum) {
            console.log(datum);
            setSelectedItem(data.find(x => x.Item.date === datum.payload.x));
          }
      }
      const onFocus = (datum) => {
        if (datum) {
          if (window.screen.width <= 813) {
            setSelectedItem(data.find(x => x.Item.date === datum.primary));
          }
        }
      }
    
     return (
        // A react-chart hyper-responsively and continuously fills the available
        // space of its parent element automatically

        // <div
        //   className={classes.chart}
        // >
        //   <div className={classes.chartDisplayName}>
        //     {chartDisplayName}
        //   </div>

        //   {noData ? <div className={classes.noData}>No Data</div> :
        //   <Chart 
        //     data={dataMemo}
        //     axes={axes} 
        //     primaryCursor={primaryCursor}
        //     secondaryCursor={secondaryCursor}
        //     onClick={onClick}
        //     onFocus={onFocus}
        //   />
        //   }
        // </div>

        //activeDot={{ onClick: onClick }}

      <div className={classes.chart}>
          <div className={classes.chartDisplayName}>
            {chartDisplayName}
          </div>
          
            {noData ? <div className={classes.noData}>No Data</div> :
          <ResponsiveContainer height='100%' width='100%'>
            <LineChart data={dataMemo}>
              <Line type="monotone" dataKey="$" stroke="#8884d8" isAnimationActive={false} activeDot={{ onClick: onClick }}/>
              <CartesianGrid stroke="#ccc" />
              <XAxis tick={{fontSize: '3vh'}} dataKey="x" />
              <YAxis />
              <Tooltip customCallback={onClick} content={<CustomTooltip />} />
            </LineChart>
          </ResponsiveContainer>}


      </div>
            
      )
    }

    return (
        (data.length === 0 ?
        <div>Loading...</div> :
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Paper className={classes.gridContainer} elevation={3}>
              {chartLoaded ?
                <SymbolChart
                  chartDisplayName={chartDisplayName}
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
              <div className={classes.criteriaItem}>
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
              </div>
              <div className={classes.criteriaItem}>
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
              </div>
              <div className={classes.criteriaItem}>
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
              </div>
              <div className={classes.criteriaItem}>
              <form className={classes.root} noValidate autoComplete="off">
                <TextField id="standard-basic" 
                  label="Strike"
                  defaultValue={strike}
                  onBlur={handleStrikeChange}
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
