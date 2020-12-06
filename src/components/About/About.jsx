import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';


export default function About(props) {

    const useStyles = makeStyles(theme => ({
        p:{
            maxWidth: '500px',    
            marginLeft: '1%'        
        },
        container:{
            top:'0',
            bottom:'0',
            left:'0',
            right:'0',
            margin:'auto',
            width: 'fit-content',
            height: '90vh',
            backgroundColor: '#f8f8ff',
            position: 'absolute',
            overflow: 'auto',
            backgroundColor: '#1a1a1a',
            color: '#f2f2f2',
            paddingLeft: '2%',
            paddingRight: '2%',
            maxWidth: '90vw'
        }
    }))

    const classes = useStyles();

    return (
        <Paper className={classes.container} elevation={3}>

            <h1>Welcome to diamondhands.trade! 💎🙌</h1>
            <p className={classes.p}>
            This website charts historical data for <a href="https://en.wikipedia.org/wiki/Option_(finance)">stock options</a>.
            <br/><br/>
            My name is Gabe Hollander, I am a developer in Boston.
            This is a project seeking to make options data more accesible on the web.
            I recently stumbled upon <a href="https://drive.google.com/drive/folders/1a7afPF3k-I0kjA3aybJWR1-rIQTNK_ef">this</a> drive, where a kind soul has been scraping EOD quotes for the past 2 years or so.
            Now, the data isn't perfect, but christ all mighty it's free, no login, no nothing.
            <br/><br/>
            If you're looking for the prime rib, <a href="https://www.cboe.com/">CBOE</a> runs the data racket.
            Needless to say, it is very expensive, depending on what you want.
            For example, a <a href="https://datashop.cboe.com/option-trades-subscription">subscription</a> to a daily dump of tick level options data, on all symbols, it's 6K billed annually.
            For <a href="https://datashop.cboe.com/option-trades">all</a> tick level data since 2005, on all symbols, is a <i>measly</i> 30K one time charge.
            <br/><br/>
            Right now, this website costs like 3 bucks a month to run, a couple grandmas on internet explorer could probably take it down.
            It is certainly not even in beta, it's just a website.
            I hope to scale this platform up with some juicy CBOE data in the future, so stay tuned.
            </p>

        </Paper>
    )
}
