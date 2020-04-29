import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';


// Styles
const styles = theme => ({
    root: {
        // padding: theme.spacing(1),
        // paddingLeft: theme.spacing(8),
        // overflowX: "hidden",
        // overflowY: "hidden",
        width: '100%',
        overflowY: 'auto',

    },
});
class AlarmLog extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    shouldComponentUpdate(nextProps, nextState) {
        const update = this.props.height !== nextProps.height || this.props.alarmLogDisplayArray.length !== nextProps.alarmLogDisplayArray.length || this.props.alarmLogSelectedKey !== nextProps.alarmLogSelectedKey
        return update
    }

    render() {
        // console.log(this.props.alarmLogDisplayArray.length)
        const logData = this.props.alarmLogDisplayArray.map((entry) => {
            // console.log(entry)
            const date = new Date(entry.timestamp * 1000)
            return (
                <TableRow hover key={`${entry.timestamp}-${entry.entry}`}>
                    <TableCell>{`${date.toLocaleString()}: ${entry.entry}`}</TableCell>
                </TableRow>
            )
        })

        return (
            <TableContainer style={{ height: this.props.height, overflow: 'auto' }}>
                <Table aria-label="Log Table" size="small" >
                    <TableBody>
                        {logData}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

export default withStyles(styles, { withTheme: true })(AlarmLog);
