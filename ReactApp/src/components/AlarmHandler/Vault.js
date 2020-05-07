import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';

import SideBar from '../SystemComponents/SideBar';
import Door from './SVG Components/Door'
import Floor from './SVG Components/Floor'

// Styles
const styles = theme => ({
    root: {
        padding: theme.spacing(1),
        // paddingLeft: theme.spacing(8),
        overflowX: "hidden",
        overflowY: "hidden",
        paddingTop: 0,
        width: '100%'
    },
    card: {
        padding: theme.spacing(2),
        height: "100%",
        overflowX: "default",
        overflowY: "default",
    },
})


class Vault extends Component {
    state = {
    }

    logout = () => {
        localStorage.removeItem('jwt');
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <SideBar />
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="stretch"
                    spacing={2}
                    className={classes.root}
                >
                    <Grid item xs={6} style={{ textAlign: 'center' }}>
                        <svg
                            width='100%'
                            height='100%'
                            viewBox='0 0 1100 900'
                        >
                            <Floor />
                        </svg>
                    </Grid>
                    <Grid item xs={6}>
                        
                    </Grid>
                </Grid>

            </React.Fragment>

        );
    }
}

export default withStyles(styles, { withTheme: true })(Vault);