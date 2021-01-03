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
import ListIcon from '@material-ui/icons/List';

const CriteriaContainer = props => {

    const criteria = [	
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
        criteriaContainer: {
            backgroundColor: '#262626',
            display: '-webkit-box',   /* OLD - iOS 6-, Safari 3.1-6, BB7 */
            display: '-ms-flexbox',  /* TWEENER - IE 10 */
            display: '-webkit-flex', /* NEW - Safari 6.1+. iOS 7.1+, BB10 */
            display: 'flex', 
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
          bearInputLabel: {
            fontSize: '.75rem',
            color: '#f2f2f2'
          },
          labelPlacementTop: {
            alignItems: 'normal',
            margin: '4% 0'
          },
          criteriaTab: {
            // border: '1px solid',
            backgroundColor: '#262626',
            borderRadius: '8px',
            height: '18%',
            width: '22%',
            position: 'absolute',
            left: '98%',
            top: '1%',
            borderLeftStyle: 'none',
            clipPath: 'inset(0px 0px 0px .6vw)',
          },
          fixedContainer: {
              position: 'fixed',
              height: '95%',
              width: '30%',
              left: '0%',
              transition: 'left .5s',
              top: '1%',
          },
          listIcon: {
            color: '#f2f2f2',
            display: 'flex',
            margin: 'auto',
            height: '100%',
            width: '75%',
          },
          fixedContainerClosed:{
            left: '-30%',
          },
          criteriaItem: {
              margin: '2%',
          }
    }))

    const classes = useStyles();

    const [symbolOpen, setSymbolOpen] = useState(false);
    const [leftAxisOpen, setLeftAxisOpen] = useState(false);
    const [rightAxisOpen, setRightAxisOpen] = useState(false);
    const [barOpen, setBarOpen] = useState(false);

    const handleBarToggle = () => {
        setBarOpen(!barOpen)
    }

    const handleSymbolClose = () => {
        setSymbolOpen(false);
    };

    const handleSymbolOpen = () => {
        setSymbolOpen(true);
    };

    const handleLeftAxisChange = event => {
        if (props.selectedCriteria1 !== event.target.value) {
          props.setSelectedCriteria1(event.target.value);
        }
    }
  
    const handleRightAxisChange = event => {
        if (props.selectedCriteria2 !== event.target.value) {
            props.setSelectedCriteria2(event.target.value);
        }
    }

    const handleLeftAxisClose = () => {
        setLeftAxisOpen(false);
    };

    const handleRightAxisClose = () => {
    setRightAxisOpen(false);
    };

    const handleLeftAxisOpen = () => {
    setLeftAxisOpen(true);
    };
    
    const handleRightAxisOpen = () => {
    setRightAxisOpen(true);
    };

    const menuItems = criteria.map(c => {
        return <MenuItem style={{backgroundColor:'#262626','color':'#f2f2f2'}}value={c}>{c}</MenuItem>
    })

    return (
    <div className = {`${classes.fixedContainer} ${barOpen ? '' : classes.fixedContainerClosed}`}>
        <Paper className={classes.criteriaTab} 
            onClick={handleBarToggle}
            elevation={4}
        > <ListIcon className={classes.listIcon} /></Paper>
        <Paper className={classes.criteriaContainer} elevation={4}>
            <div className={classes.criteriaItem}>
                <form className={classes.root} noValidate autoComplete="off">
                    <TextField id="standard-basic" 
                        label="Symbol"
                        defaultValue={props.symbol}
                        onBlur={props.handleSymbolChange}
                        InputProps={{ className: classes.textInput }}
                    />
                </form>
            {/* <InputLabel style={{fontSize: '.75rem',color:'#f2f2f2'}} id="label">Symbol</InputLabel>
            <Select labelId="label"
                id="symbol-select"
                open={symbolOpen}
                onClose={handleSymbolClose}
                onOpen={handleSymbolOpen}
                value={props.symbol}
                onChange={props.handleSymbolChange}
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
            </Select> */}
            </div>
            <div className={classes.criteriaItem}>
            {
            <KeyboardDatePicker
                disableToolbar
                variant="dialog"
                format="yyyy/MM/DD"
                margin="normal"
                id="from-date-picker-inline"
                label="Expiration"
                value={props.exp}
                autoOk
                onChange={props.handleExpChange}
                // maxDate={none}
                minDate={props.from}
                allowKeyboardControl={true}
                initialFocusedDate={props.from}
                InputProps={{ className: classes.textInput }}
            />
            }
            </div>
            <div className={classes.criteriaItem}>
            <form className={classes.root} noValidate autoComplete="off">
            <TextField id="standard-basic" 
                label="Strike"
                defaultValue={props.strike}
                onBlur={props.handleStrikeChange}
                InputProps={{ className: classes.textInput }}
            />
            </form>
            </div>
            <div className={classes.criteriaItem}>
            <FormControlLabel
            control={
                <Switch
                checked={props.bear}
                onChange={() => {
                    props.setBear(!props.bear);
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
            <div className={classes.criteriaItem}>
            <InputLabel style={{fontSize: '.75rem',color:'#f2f2f2'}} id="left-axis-id">Left Axis</InputLabel>
            <Select labelId="left-axis-id"
                id="left-axis-select"
                open={leftAxisOpen}
                onClose={handleLeftAxisClose}
                onOpen={handleLeftAxisOpen}
                value={props.selectedCriteria1}
                onChange={handleLeftAxisChange}
                style={{fontSize: '3vh',color:'#f2f2f2'}}
                MenuProps={{
                classes: {
                    paper: classes.customSelect
                }
                }}
            >
                {menuItems}        
            </Select>
            </div>
            <div className={classes.criteriaItem}>
            <InputLabel style={{fontSize: '.75rem',color:'#f2f2f2'}} id="left-axis-id">Right Axis</InputLabel>
            <Select labelId="left-axis-id"
                id="left-axis-select"
                open={rightAxisOpen}
                onClose={handleRightAxisClose}
                onOpen={handleRightAxisOpen}
                value={props.selectedCriteria2}
                onChange={handleRightAxisChange}
                style={{fontSize: '3vh',color:'#f2f2f2'}}
                MenuProps={{
                classes: {
                    paper: classes.customSelect
                }
                }}
            >
                {menuItems}        

            </Select>
            </div>
            <div className={classes.criteriaItem}>
            <Button 
            variant="contained"
            onClick={props.search}
            className={classes.searchButton}
            disabled={!props.searchCriteriaChanged}
            color="primary"
            >Search
            </Button>
            </div>
        </Paper>
    </div>
    )
}

export default CriteriaContainer;
