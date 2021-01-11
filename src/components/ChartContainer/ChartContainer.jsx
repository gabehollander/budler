import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper';
import { format } from 'date-fns';
import {
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import 'date-fns';
import MomentUtils from '@date-io/moment';
import CriteriaContainer from '../CriteriaContainer/CriteriaContainer';
import MetaDataContainer from '../MetaDataContainer/MetaDataContainer';
import SymbolChart from '../SymbolChart/SymbolChart'
import './ChartContainer.scss';
import { useLocation } from "react-router-dom";
import history from '../DiamondHands/history';
import firebase from '../DiamondHands/firebase'

const analytics = firebase.analytics()

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
    },
}))

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ChartContainer(props) {

  // query parameters
  const query = useQuery();

  const today = () => {
    const formatYmd = date => date.toISOString().slice(0, 10);
    return formatYmd(new Date());
  }

  // first day of data
  const minDate = '2020-12-28'

  const classes = useStyles();

  // data that comes in via api, then currently viewed data (can be zoomed).
  const [data, setData] = useState([]);
  const [currentData, setCurrentData] = useState([]);

  // core search params
  const [symbol, setSymbol] = useState(query.get("symbol") ? query.get("symbol").toUpperCase() : 'AAPL');
  const [from, setFrom] = useState(minDate); //useState(aWeekAgo())
  const [to, setTo] = useState(today());
  const [strike, setStrike] = useState(query.get('strike') || '120');
  const [bear, setBear] = useState(query.get('bear') === 'true');
  const [exp, setExp] = useState(query.get('exp') || '2021-01-08'); //lastFriday()

  // criteria state
  const [chartLoaded, setChartLoaded] = useState(false);
  const [searchCriteriaChanged, setSearchCriteriaChanged] = useState(false);
  const [chartDisplayName, setChartDisplayName] = useState('');
  const [oldSymbol, setOldSymbol] = useState(query.get("symbol") ? query.get("symbol").toUpperCase() : 'AAPL');
  const [oldFrom, setOldFrom] = useState(minDate);
  const [oldTo, setOldTo] = useState(today());
  const [oldExp, setOldExp] = useState(query.get('exp') || '2021-01-08'); //lastFriday()
  const [oldStrike, setOldStrike] = useState(120);
  const [oldBear, setOldBear] = useState(query.get('bear') === 'true');
  
  // chart state
  const [selectedItem, setSelectedItem] = useState({});
  const [noData, setNoData] = useState(true);
  const [selectedCriteria1, setSelectedCriteria1] = useState('ask_1545');
  const [selectedCriteria2, setSelectedCriteria2] = useState('bid_1545');

  const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Accept: 'application/json',
  };

  // first query, apple call by default
  useEffect(() => {
      fetch('https://diamondhands-express.herokuapp.com/chain', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ 
              "symbol": symbol,
              "callOrPut": bear ? 'Put' : 'Call',
              "strike": Number(strike).toFixed(3).toString(),
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
          analytics.logEvent(formatSymbolDisplayName(symbol,strike,exp,bear));
          setOldSymbol(symbol);
          setOldBear(bear);
          setOldStrike(strike);
          setOldFrom(from);
          setOldTo(to);
          setOldExp(exp);
          if (json.length !== 0) {
            setSelectedItem(Object.keys(json[json.length-1]).length === 0 ? json[json.length-2] : json[json.length-1]);
          }
        });
  }, []);

  // for updating chart state, on searches and selectedCriteria changes.
  useEffect(() => {

    const newLine = data.filter((siv) => {
      return siv['Item'] ? true : false
    })
    .map((d, index) => {
      let retY1 = d['Item'][selectedCriteria1];
      let retY2 = d['Item'][selectedCriteria2];
      return {x:d['Item'].date, y1:Number(retY1), y2:Number(retY2)}
    })

    setCurrentData(newLine);

  },[data, selectedCriteria1, selectedCriteria2]);

  // for updating criteria state
  useEffect(() => {
    if (
        (symbol !== oldSymbol ||
        strike.toString() !== oldStrike.toString() ||
        exp !== oldExp ||
        bear !== oldBear)
    ) {
      setSearchCriteriaChanged(true)
    } else {
      setSearchCriteriaChanged(false)
    }
  },[symbol,strike,exp,bear])

  // for updating zoom state
  useEffect(() => {
    if (
      (oldFrom && (oldFrom !== from)) ||
      (oldTo && (oldTo !== to))
      ) {
      search()
    } 
  },[from,to])

  const setQueryParams = (sym, str, ex, b) => {
    history.push({
      pathname: '/',
      search: '?symbol='+sym+'&strike='+str+'&exp='+ex+'&bear='+b
    })
  }

  // core search
  const search = () => {
    setSearchCriteriaChanged(false);
    setChartLoaded(false);
    fetch('https://diamondhands-express.herokuapp.com/chain', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ 
          "symbol": symbol,
          "callOrPut": bear ? 'Put' : 'Call',
          "strike": Number(strike).toFixed(3).toString(),
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
      analytics.logEvent(formatSymbolDisplayName(symbol,strike,exp,bear));
      setOldSymbol(symbol);
      setOldBear(bear);
      setOldStrike(strike);
      setOldFrom(from);
      setOldTo(to);
      if (json.length !== 0) {
        setSelectedItem(Object.keys(json[json.length-1]).length === 0 ? json[json.length-2] : json[json.length-1]);
      }
      setOldExp(exp);
      setQueryParams(symbol,strike,exp,bear);
    });
  }

  const handleSymbolChange = event => {
    if (symbol !== event.target.value) {
      setSymbol(event.target.value.toUpperCase());
    }
  };

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

  return (
      (data.length === 0 && !noData ?
      <div className={classes.pageLoading}>Loading...</div> :
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Paper className={classes.gridContainer} elevation={3}>
              {chartLoaded ?
                <SymbolChart
                  chartDisplayName = {chartDisplayName}
                  data = {data}
                  currentData = {currentData}
                  from = {from}
                  to = {to}
                  setFrom = {setFrom}
                  setOldFrom = {setOldFrom}
                  setTo = {setTo}
                  setOldTo = {setOldTo}
                  noData = {noData}
                  selectedCriteria1 = {selectedCriteria1}
                  selectedCriteria2 = {selectedCriteria2}
                  selectedItem = {selectedItem}
                  setSelectedItem = {setSelectedItem}
                  minDate = {minDate}
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
              <MetaDataContainer selectedItem = {selectedItem}>
              </MetaDataContainer>
          </Paper>
        </MuiPickersUtilsProvider>
      )
  )
}
