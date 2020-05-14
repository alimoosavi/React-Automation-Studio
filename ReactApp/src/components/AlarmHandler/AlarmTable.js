import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import TextInput from '../BaseComponents/TextInput';
import TextUpdateAH from './TextUpdateAH';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Checkbox from '@material-ui/core/Checkbox';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import grey from '@material-ui/core/colors/grey';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import DoneAllIcon from '@material-ui/icons/DoneAll';

import Tooltip from '@material-ui/core/Tooltip';

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

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
    disabled: {
        background: 'grey',
        color: grey['400'],
        fontWeight: 'bold',
    },
    TextFieldSeverityDisabled: {
        borderRadius: 2,
        padding: 1,
        background: 'grey',
    }
});
class AlarmTable extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef()
        this.state = {}
    }

    shouldComponentUpdate(nextProps, nextState) {
        const update = this.props.alarmPVDict === nextProps.alarmPVDict
        // console.log("shouldComponentUpdate", update)
        return update
    }

    componentDidUpdate(prevProps) {
        if (prevProps.areaSelectedIndex !== this.props.areaSelectedIndex) {
            // reset scroll only if new area selected
            this.myRef.current.scrollTo(0, 0)
        }
    }

    render() {
        const { classes } = this.props;
        const areaSelectedIndex = this.props.areaSelectedIndex;
        const areaAlarms = this.props.areaAlarms;

        // console.log(this.props.alarmTableSearchString)

        // console.log('areaSelectedIndex', areaSelectedIndex)
        // console.log('areaAlarms', areaAlarms)

        const isTopArea = !areaSelectedIndex.includes("=")
        let currSubArea = ""
        let newSubArea = false
        let currTopArea = ""
        let newTopArea = false

        let textFieldClasses = {
            majorAlarm: classes.TextFieldSeverityDisabled,
            majorAlarmAcked: classes.TextFieldSeverityDisabled,
            minorAlarm: classes.TextFieldSeverityDisabled,
            minorAlarmAcked: classes.TextFieldSeverityDisabled
        };

        return (
            <TableContainer component={Paper} style={{ height: this.props.height }} ref={this.myRef}>
                <Table aria-label="Alarm Table" stickyHeader size="small">
                    <TableHead>
                        <TableRow
                            onClick={(event) => {
                                event.preventDefault()
                                event.stopPropagation()
                            }}
                        >
                            {this.props.debug
                                ? <TableCell>TEST ALM</TableCell>
                                : null}
                            <TableCell>PV NAME</TableCell>
                            <TableCell align="center">ALM STATUS</TableCell>
                            <TableCell align="left">LAST ALM VAL</TableCell>
                            <TableCell align="left">LAST ALM TIME</TableCell>
                            <TableCell align="left">LAST ALM ACK TIME</TableCell>
                            <TableCell align="center">ENABLE</TableCell>
                            <TableCell align="center">LATCH</TableCell>
                            <TableCell align="center">NOTIFY</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(areaAlarms).map((areaAlarmName, areaAlarmIndex) => {
                            // areaSelectedIndex is area | area=subArea
                            // areaAlarmName is area | area=subArea | area=subArea | area=subArea=pvd+
                            let areaKey = areaAlarmName.replace(/=pv\d+/, "")   // areaKey is area | area=subArea
                            if (isTopArea) {                                    // areaSelectedIndex is area
                                areaKey = areaKey.split('=')[0]                 // areaKey is area
                            }
                            if (areaKey == areaSelectedIndex || areaSelectedIndex === 'ALLAREAS') {
                                // console.log('pva://' + "alarmIOC:" + areaAlarms[areaAlarmName]["name"] + "V")
                                const areaAlarmNameArray = areaAlarmName.split('=')
                                let areaName = null
                                let alarm = null
                                if (areaAlarmNameArray.length > 2) {
                                    areaName = areaAlarmNameArray[0] + "=" + areaAlarmNameArray[1]
                                    alarm = areaAlarmNameArray[2]
                                    newTopArea = false
                                    newSubArea = currSubArea !== areaName
                                    currSubArea = areaName
                                }
                                else {
                                    areaName = areaAlarmNameArray[0]
                                    alarm = areaAlarmNameArray[1]
                                    newSubArea = false
                                    newTopArea = currTopArea !== areaName
                                    currTopArea = areaName
                                }
                                // console.log(areaName, newSubArea)
                                const visible = areaAlarms[areaAlarmName]["name"].toLowerCase().includes(this.props.alarmTableSearchString.toLowerCase())
                                return (
                                    visible
                                        ? <React.Fragment key={areaAlarmName}>
                                            {newTopArea && this.props.alarmTableSearchString.length === 0
                                                ? <TableRow>
                                                    <TableCell
                                                        align="left"
                                                        style={{
                                                            paddingTop: 20,
                                                            fontWeight: 'bold',
                                                            borderBottom: 'double'
                                                        }}
                                                    >
                                                        {`${areaName.split('=')[0]}`}
                                                    </TableCell>
                                                    <TableCell style={{ borderBottom: 'double' }}></TableCell>
                                                    <TableCell style={{ borderBottom: 'double' }}></TableCell>
                                                    <TableCell style={{ borderBottom: 'double' }}></TableCell>
                                                    <TableCell style={{ borderBottom: 'double' }}></TableCell>
                                                    <TableCell style={{ borderBottom: 'double' }}></TableCell>
                                                    <TableCell style={{ borderBottom: 'double' }}></TableCell>
                                                    <TableCell style={{ borderBottom: 'double' }}></TableCell>
                                                    {this.props.debug
                                                        ? <TableCell style={{ borderBottom: 'double' }}></TableCell>
                                                        : null}
                                                </TableRow>
                                                : null}
                                            {isTopArea && newSubArea && this.props.alarmTableSearchString.length === 0
                                                ? <TableRow
                                                    onClick={(event) => {
                                                        event.preventDefault()
                                                        event.stopPropagation()
                                                    }}
                                                >
                                                    <TableCell
                                                        align="left"
                                                        style={{
                                                            paddingTop: 20,
                                                            fontWeight: 'bold',
                                                            borderBottom: 'double'
                                                        }}
                                                    >
                                                        {`${areaName.split('=')[0]} > ${areaName.split('=')[1]}`}
                                                    </TableCell>
                                                    <TableCell style={{ borderBottom: 'double' }}></TableCell>
                                                    <TableCell style={{ borderBottom: 'double' }}></TableCell>
                                                    <TableCell style={{ borderBottom: 'double' }}></TableCell>
                                                    <TableCell style={{ borderBottom: 'double' }}></TableCell>
                                                    <TableCell style={{ borderBottom: 'double' }}></TableCell>
                                                    <TableCell style={{ borderBottom: 'double' }}></TableCell>
                                                    <TableCell style={{ borderBottom: 'double' }}></TableCell>
                                                    {this.props.debug
                                                        ? <TableCell style={{ borderBottom: 'double' }}></TableCell>
                                                        : null}
                                                </TableRow>
                                                : null}
                                            <TableRow
                                                // key={areaAlarmName}
                                                hover={this.props.areaEnabled[areaName]}
                                                onContextMenu={event => this.props.tableItemRightClick(event, areaAlarmName)}
                                                selected={this.props.alarmRowSelected[areaAlarmName]}
                                                onClick={event => this.props.tableRowClick(event, `${areaName}*${areaAlarms[areaAlarmName]["name"]}`)}
                                            >
                                                <Menu
                                                    keepMounted
                                                    open={this.props.alarmContextOpen[areaAlarmName]}
                                                    onClose={event => this.props.alarmContextClose(event, areaAlarmName)}
                                                    anchorReference="anchorPosition"
                                                    anchorPosition={this.props.contextMouseY !== null && this.props.contextMouseX !== null ?
                                                        { top: this.props.contextMouseY, left: this.props.contextMouseX } : null}
                                                >
                                                    <MenuItem
                                                        onClick={event => this.props.alarmAcknowledge(event, areaAlarmName)}
                                                    >
                                                        <ListItemIcon >
                                                            <DoneAllIcon fontSize="small" />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit">Acknowledge Alarm</Typography>

                                                    </MenuItem>

                                                </Menu>
                                                {this.props.debug
                                                    ? <TableCell>
                                                        <TextInput
                                                            pv={'pva://' + areaAlarms[areaAlarmName]["name"]}
                                                            usePvLabel={true}
                                                            usePrecision={true}
                                                            usePvUnits={true}
                                                            usePvMinMax={true}
                                                            alarmSensitive={true}
                                                            disableContextMenu={true}
                                                        />
                                                    </TableCell>
                                                    : null}
                                                <Tooltip
                                                    // title={this.props.pvDescDict[areaAlarms[areaAlarmName]["name"]]}
                                                    title={
                                                        <React.Fragment>
                                                            <Typography color="inherit">{areaAlarms[areaAlarmName]["name"]}</Typography>
                                                            <p>
                                                                <b>Description: </b> {this.props.alarmPVDict[areaAlarms[areaAlarmName]["name"]][1]}<br />
                                                                <b>Host: </b> {this.props.alarmPVDict[areaAlarms[areaAlarmName]["name"]][2]}<br />
                                                            </p>
                                                        </React.Fragment>
                                                    }
                                                    enterDelay={400}
                                                >

                                                    <TableCell align="left">
                                                        <TextUpdateAH
                                                            pv={'pva://' + areaAlarms[areaAlarmName]["name"] + ".NAME"}
                                                            disableContextMenu={true}

                                                        />

                                                    </TableCell>
                                                </Tooltip>

                                                <TableCell align="center">
                                                    {this.props.areaEnabled[areaName]
                                                        ? areaAlarms[areaAlarmName]["enable"]
                                                            ?
                                                            <TextUpdateAH
                                                                pv={'pva://' + "alarmIOC:" + areaAlarms[areaAlarmName]["name"] + "A"}
                                                                useStringValue={true}
                                                                alarmSensitive={true}
                                                                disableContextMenu={true}
                                                            />
                                                            : <div className={classes.disabled}>
                                                                <TextUpdateAH
                                                                    pv={'pva://' + "alarmIOC:" + areaAlarms[areaAlarmName]["name"] + "A"}
                                                                    useStringValue={true}
                                                                    alarmSensitive={true}
                                                                    disableContextMenu={true}
                                                                    classes={textFieldClasses}
                                                                />
                                                            </div>
                                                        : <div className={classes.disabled}>
                                                            <TextUpdateAH
                                                                pv={'pva://' + "alarmIOC:" + areaAlarms[areaAlarmName]["name"] + "A"}
                                                                useStringValue={true}
                                                                alarmSensitive={true}
                                                                disableContextMenu={true}
                                                                classes={textFieldClasses}
                                                            />
                                                        </div>
                                                    }
                                                </TableCell>
                                                <TableCell align="left">
                                                    <TextUpdateAH
                                                        pv={'pva://' + "alarmIOC:" + areaAlarms[areaAlarmName]["name"] + "V"}
                                                        disableContextMenu={true}
                                                    />
                                                </TableCell>
                                                <TableCell align="left">
                                                    <TextUpdateAH
                                                        pv={'pva://' + "alarmIOC:" + areaAlarms[areaAlarmName]["name"] + "T"}
                                                        disableContextMenu={true}
                                                    /></TableCell>
                                                <TableCell align="left">
                                                    <TextUpdateAH
                                                        pv={'pva://' + "alarmIOC:" + areaAlarms[areaAlarmName]["name"] + "K"}
                                                        disableContextMenu={true}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Checkbox
                                                        style={{ padding: 0, margin: 0 }}
                                                        disabled={!this.props.areaEnabled[areaName]}
                                                        value={areaAlarms[areaAlarmName]["enable"]}
                                                        color="primary"
                                                        checked={areaAlarms[areaAlarmName]["enable"]}
                                                        onClick={event => this.props.itemChecked(event, areaName, alarm, "enable", !areaAlarms[areaAlarmName]["enable"])}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Checkbox
                                                        style={{ padding: 0, margin: 0 }}
                                                        disabled={!this.props.areaEnabled[areaName]}
                                                        value={areaAlarms[areaAlarmName]["latch"]}
                                                        color="primary"
                                                        checked={areaAlarms[areaAlarmName]["latch"]}
                                                        onClick={event => this.props.itemChecked(event, areaName, alarm, "latch", !areaAlarms[areaAlarmName]["latch"])}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Checkbox
                                                        style={{ padding: 0, margin: 0 }}
                                                        disabled={!this.props.areaEnabled[areaName]}
                                                        value={areaAlarms[areaAlarmName]["notify"]}
                                                        color="primary"
                                                        checked={areaAlarms[areaAlarmName]["notify"]}
                                                        onClick={event => this.props.itemChecked(event, areaName, alarm, "notify", !areaAlarms[areaAlarmName]["notify"])}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                        : null
                                )
                            }
                        })}
                    </TableBody>
                </Table>
            </TableContainer >
        )
    }
}

export default withStyles(styles, { withTheme: true })(AlarmTable);
