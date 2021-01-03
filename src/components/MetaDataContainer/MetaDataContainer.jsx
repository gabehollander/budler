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
        'date',	
        'open',	
        'high',	
        'low',	
        'close',	
        'trade_volume',
        'bid_size_1545',
        'bid_1545',
        'ask_size_1545',
        'ask_1545',
        'underlying_bid_1545',
        'underlying_ask_1545',
        'implied_underlying_price_1545',	
        'active_underlying_price_1545',	
        'implied_volatility_1545',
        'delta_1545',
        'gamma_1545',	
        'theta_1545',	
        'vega_1545',	
        'rho_1545',
        'bid_size_eod',
        'bid_eod',	
        'ask_size_eod',	
        'ask_eod',	
        'underlying_bid_eod',	
        'underlying_ask_eod',	
        'vwap',
        'open_interest'
    ]

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
            width: '75%',
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
            return <div className={classes.dataItem}>{c}: <b>{props.selectedItem['Item'][c]}</b></div>
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
