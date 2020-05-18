import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


import red from '@material-ui/core/colors/red';
import deepOrange from '@material-ui/core/colors/deepOrange';
import grey from '@material-ui/core/colors/grey';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import DoneAllIcon from '@material-ui/icons/DoneAll';

// Styles
const useStyles = makeStyles(theme => ({
    root: {
        // padding: theme.spacing(1),
        // paddingLeft: theme.spacing(8),
        // overflowX: "hidden",
        // overflowY: "hidden",
        width: '100%',
        overflowY: 'auto',
        maxHeight: '90vh',
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    majorAlarm: {
        background: red['800'],
        color: 'white',
        '&:hover': {
            color: red['500']
        }
    },
    majorAlarmSelected: {
        color: red['500']
    },
    majorAlarmAcked: {
        // red['800'] = #c62828 = rgb(198,40,40)
        background: 'rgba(198,40,40,0.3)',
        color: 'white',
        '&:hover': {
            color: 'rgba(244,67,54,0.8)'
        }
    },
    majorAlarmAckedSelected: {
        color: 'rgba(244,67,54,0.8)'
    },
    minorAlarm: {
        background: deepOrange['400'],
        color: 'white',
        '&:hover': {
            color: deepOrange['200']
        }
    },
    minorAlarmSelected: {
        color: deepOrange['200']
    },
    minorAlarmAcked: {
        // deepOrange['400'] = #ff7043 = rgb(255,112,67)
        background: 'rgba(255,112,67,0.3)',
        color: 'white',
        '&:hover': {
            color: 'rgba(255,171,145,0.8)'
        }
    },
    minorAlarmAckedSelected: {
        color: 'rgba(255,171,145,0.8)'
    },
    disabled: {
        background: 'grey',
        color: grey['400'],
        '&:hover': {
            color: grey['400'],
        }
    },
    disabledSelected: {
        color: grey['300'],
    }
}));

const AlarmList = props => {

    // console.log("AlarmList rendered")

    const classes = useStyles();

    return (
        <React.Fragment>
            <div id="test" >
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="stretch"
                    spacing={2}>
                    <Grid item xs={12}>
                        <List
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            className={classes.root}
                        >
                            {props.areaNames.map((area, areaIndex) => {
                                // console.log(`${area["area"]}`, props.areaPVDict[`${area["area"]}`])
                                return (

                                    < React.Fragment key={`${area["area"]}`
                                    }>
                                        <ListItem
                                            divider
                                            button
                                            selected={props.areaSelectedIndex === `${area["area"]}`}
                                            onClick={event => props.listItemClick(event, `${area["area"]}`)}
                                            onContextMenu={event => props.listItemRightClick(event, `${area["area"]}`)}

                                            // field(ZRST, "NO_ALARM")
                                            // field(ONST, "MINOR_ACKED")
                                            // field(TWST, "MINOR")
                                            // field(THST, "MAJOR_ACKED")
                                            // field(FRST, "MAJOR")
                                            // field(FVST, "INVALID_ACKED")
                                            // field(SXST, "INVALID")

                                            classes={(props.areaEnabled[`${area["area"]}`]
                                                ? props.areaPVDict[`${area["area"]}`] == 6 || props.areaPVDict[`${area["area"]}`] == 4
                                                    ? { root: classes.majorAlarm, selected: classes.majorAlarmSelected }
                                                    : props.areaPVDict[`${area["area"]}`] == 5 || props.areaPVDict[`${area["area"]}`] == 3
                                                        ? { root: classes.majorAlarmAcked, selected: classes.majorAlarmAckedSelected }
                                                        : props.areaPVDict[`${area["area"]}`] == 2
                                                            ? { root: classes.minorAlarm, selected: classes.minorAlarmSelected }
                                                            : props.areaPVDict[`${area["area"]}`] == 1
                                                                ? { root: classes.minorAlarmAcked, selected: classes.minorAlarmAckedSelected }
                                                                : {}    // noAlarm
                                                : { root: classes.disabled, selected: classes.disabledSelected }
                                            )}
                                        >
                                            <ListItemText primary={area["area"]} />
                                            {area["subAreas"] ?
                                                props.areaSubAreaOpen[`${area["area"]}`] ? <ExpandLess /> : <ExpandMore />
                                                : null}

                                        </ListItem>
                                        {
                                            props.areaContextOpen[`${area["area"]}`] ? <Menu
                                                keepMounted
                                                open={props.areaContextOpen[`${area["area"]}`]}
                                                onClose={event => props.listItemContextClose(event, `${area["area"]}`)}
                                                anchorReference="anchorPosition"
                                                anchorPosition={props.contextMouseY !== null && props.contextMouseX !== null ?
                                                    { top: props.contextMouseY, left: props.contextMouseX } : null}
                                            >
                                                <MenuItem disabled>{area["area"]}</MenuItem>
                                                <hr />
                                                {props.areaEnabled[`${area["area"]}`] ?
                                                    <MenuItem onClick={event => props.enableDisableArea(event, `${area["area"]}`, false)}>
                                                        <ListItemIcon >
                                                            <NotificationsOffIcon fontSize="small" />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit">Disable Area</Typography>
                                                    </MenuItem> :
                                                    <MenuItem onClick={event => props.enableDisableArea(event, `${area["area"]}`, true)}>
                                                        <ListItemIcon >
                                                            <NotificationsActiveIcon fontSize="small" />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit">Enable Area</Typography>
                                                    </MenuItem>
                                                }
                                                {props.areaEnabled[`${area["area"]}`] ?
                                                    <MenuItem onClick={event => props.ackAllAreaAlarms(event, `${area["area"]}`)}>
                                                        <ListItemIcon >
                                                            <DoneAllIcon fontSize="small" />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit">ACK all area alarms</Typography>
                                                    </MenuItem> : null}
                                            </Menu> : null
                                        }

                                        {
                                            area["subAreas"] ?
                                                <Collapse in={props.areaSubAreaOpen[`${area["area"]}`]} timeout="auto" unmountOnExit>
                                                    <List component="div" disablePadding>
                                                        {area["subAreas"].map((subArea, subAreaIndex) => {
                                                            return (
                                                                <React.Fragment key={`${area["area"]}=${subArea}`}>
                                                                    <ListItem

                                                                        button
                                                                        divider
                                                                        className={classes.nested}
                                                                        selected={props.areaSelectedIndex === `${area["area"]}=${subArea}`}
                                                                        onClick={event => props.listItemClick(event, `${area["area"]}=${subArea}`)}
                                                                        onContextMenu={event => props.listItemRightClick(event, `${area["area"]}=${subArea}`)}

                                                                        // classes={(props.areaEnabled[`${area["area"]}=${subArea}`]
                                                                        //     ? props.areaPVDict[`${area["area"]}=${subArea}`] == 0
                                                                        //         ? { root: classes.majorAlarm, selected: classes.majorAlarmSelected }
                                                                        //         : props.areaPVDict[`${area["area"]}=${subArea}`] == 1
                                                                        //             ? { root: classes.minorAlarm, selected: classes.minorAlarmSelected }
                                                                        //             : {}
                                                                        //     : { root: classes.disabled, selected: classes.disabledSelected }
                                                                        // )}

                                                                        classes={(props.areaEnabled[`${area["area"]}=${subArea}`]
                                                                            ? props.areaPVDict[`${area["area"]}=${subArea}`] == 6 || props.areaPVDict[`${area["area"]}=${subArea}`] == 4
                                                                                ? { root: classes.majorAlarm, selected: classes.majorAlarmSelected }
                                                                                : props.areaPVDict[`${area["area"]}=${subArea}`] == 5 || props.areaPVDict[`${area["area"]}=${subArea}`] == 3
                                                                                    ? { root: classes.majorAlarmAcked, selected: classes.majorAlarmAckedSelected }
                                                                                    : props.areaPVDict[`${area["area"]}=${subArea}`] == 2
                                                                                        ? { root: classes.minorAlarm, selected: classes.minorAlarmSelected }
                                                                                        : props.areaPVDict[`${area["area"]}=${subArea}`] == 1
                                                                                            ? { root: classes.minorAlarmAcked, selected: classes.minorAlarmAckedSelected }
                                                                                            : {}    // noAlarm
                                                                            : { root: classes.disabled, selected: classes.disabledSelected }
                                                                        )}
                                                                    >
                                                                        <ListItemText primary={`- ${subArea}`} />

                                                                    </ListItem>
                                                                    <Menu
                                                                        keepMounted
                                                                        open={props.areaContextOpen[`${area["area"]}=${subArea}`]}
                                                                        onClose={event => props.listItemContextClose(event, `${area["area"]}=${subArea}`)}
                                                                        anchorReference="anchorPosition"
                                                                        anchorPosition={props.contextMouseY !== null && props.contextMouseX !== null ?
                                                                            { top: props.contextMouseY, left: props.contextMouseX } : null}
                                                                    >

                                                                        {props.areaEnabled[`${area["area"]}`] ? <MenuItem disabled>{`${area["area"]} > ${subArea}`}</MenuItem> : null}
                                                                        {props.areaEnabled[`${area["area"]}`] ? <hr /> : null}

                                                                        {props.areaEnabled[`${area["area"]}`] ?
                                                                            props.areaEnabled[`${area["area"]}=${subArea}`] ?
                                                                                <div>
                                                                                    <MenuItem onClick={event => props.enableDisableArea(event, `${area["area"]}=${subArea}`, false)}>
                                                                                        <ListItemIcon >
                                                                                            <NotificationsOffIcon fontSize="small" />
                                                                                        </ListItemIcon>
                                                                                        <Typography variant="inherit">Disable Area</Typography>
                                                                                    </MenuItem>
                                                                                    <MenuItem onClick={event => props.ackAllAreaAlarms(event, `${area["area"]}=${subArea}`)}>
                                                                                        <ListItemIcon >
                                                                                            <DoneAllIcon fontSize="small" />
                                                                                        </ListItemIcon>
                                                                                        <Typography variant="inherit">ACK all area alarms</Typography>
                                                                                    </MenuItem>
                                                                                </div>
                                                                                :
                                                                                <MenuItem onClick={event => props.enableDisableArea(event, `${area["area"]}=${subArea}`, true)}>
                                                                                    <ListItemIcon >
                                                                                        <NotificationsActiveIcon fontSize="small" />
                                                                                    </ListItemIcon>
                                                                                    <Typography variant="inherit">Enable Area</Typography>
                                                                                </MenuItem>
                                                                            :
                                                                            <MenuItem >Enable Parent Area First!</MenuItem>
                                                                        }
                                                                    </Menu>
                                                                </React.Fragment>
                                                            )
                                                        })}
                                                    </List>
                                                </Collapse>
                                                : null
                                        }
                                    </React.Fragment >
                                )
                            })}

                        </List>
                    </Grid>
                </Grid>
            </div >
        </React.Fragment >
    )

}

export default React.memo(AlarmList);