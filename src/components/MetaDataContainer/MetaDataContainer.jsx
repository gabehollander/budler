import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import AssessmentIcon from '@material-ui/icons/Assessment';

const MetaDataContainer = props => {

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
    ];

    const useStyles = makeStyles(theme => ({
        metaDataContainer: {
            backgroundColor: '#262626',
            display: 'inline',
            flexDirection: 'column',
            position: 'absolute',
            top: '1%',
            left: '1%',
            overflow: 'scroll',
            width: '100%',
            height: '100%',
            justifyContent: 'space-between',
            // border: 'solid 1px #f2f2f2',
            borderRadius: '4px',
            paddingLeft: '1%',
            paddingTop: '1%',
            paddingBottom: '1%',
            // clipPath: 'inset(0px 0px 0px 0px)',
            // maxWidth: '238px',

          },
          metaDataTab: {
            // border: '1px solid',
            backgroundColor: '#262626',
            borderRadius: '8px',
            height: '38%',
            width: '10%',
            position: 'absolute',
            // left: '2%',
            right: '-2%',
            top: '-32%',
            borderLeftStyle: 'none',
            // clipPath: 'inset(0px 0px 0px .6vw)'
          },
          fixedContainer: {
              position: 'fixed',
              height: '30%',
              width: '95%',
              left: '2%',
              transition: 'bottom .5s',
              bottom: '1%',
          },
          metaDataIcon: {
            color: '#f2f2f2',
            display: 'flex',
            margin: 'auto',
            height: '100%',
            width: '100%',
          },
          fixedContainerClosed:{
            bottom: '-29%',
          },
          dataItem:{
              color: '#f2f2f2',
              paddingLeft: '3%',
              paddingRight: '3%',
              width: 'fit-content',
              display: 'inline-flex',
              border: 'solid 1px',
              borderRadius: '8px',
              backgroundColor: '#333333',
              margin: '.5%'
          },
          dataContainer:{
            paddingRight: '5%',
            paddingLeft: '5%',
            paddingBottom: '2%',
          }
    }))

    const classes = useStyles();

    const [barOpen, setBarOpen] = useState(false);

    const handleBarToggle = () => {
        setBarOpen(!barOpen)
    }

    const dataItems = criteria.map(c => {
        if (props.selectedItem['Item']) {
            return <div className={classes.dataItem}>{c.label}: <b>{moneyCriteria.includes(c.value)? '$' : ''}{props.selectedItem['Item'][c.value]}</b></div>
        }
    })

    return (
    <div className = {`${classes.fixedContainer} ${barOpen ? '' : classes.fixedContainerClosed}`}>
        <Paper className={classes.metaDataTab} 
            onClick={handleBarToggle}
            elevation={4}
        > <AssessmentIcon className={classes.metaDataIcon} /></Paper>
        <Paper className={classes.metaDataContainer} elevation={4}>
            <div className={classes.dataContainer}>
                {dataItems}
            </div>
        </Paper>
    </div>
    )
}

export default MetaDataContainer;
