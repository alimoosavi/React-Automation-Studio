import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import { fade } from '@material-ui/core/styles';
import AutomationStudioContext from '../SystemComponents/AutomationStudioContext';
import RedirectToLogIn from '../SystemComponents/RedirectToLogin.js';
import SideBar from '../SystemComponents/SideBar';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import InputBase from '@material-ui/core/InputBase';


import DataConnection from '../SystemComponents/DataConnection';
import Typography from '@material-ui/core/Typography';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import AlarmList from './AlarmList';
import AlarmTable from './AlarmTable';
import AlarmLog from './AlarmLog';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import InputIcon from '@material-ui/icons/Input';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import DoneAllIcon from '@material-ui/icons/DoneAll';

import PublicIcon from '@material-ui/icons/Public';

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

// Styles
const styles = theme => ({
    root: {
        padding: theme.spacing(1),
        // paddingLeft: theme.spacing(8),
        overflowX: "hidden",
        overflowY: "hidden",
        paddingTop: 0
    },
    card: {
        padding: theme.spacing(2),
        height: "100%",
        overflowX: "default",
        overflowY: "default",
    },
    center: {
        margin: 'auto',
        width: '100%',
        height: '100%'

    },
    button: {
        marginTop: '10px',
        paddingTop: '10px',
        width: '100%',

    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '20ch',
            '&:focus': {
                width: '30ch',
            },
        },
    },

});
class AlarmHandler extends Component {
    constructor(props) {
        super(props);
        // to connect to all PVs before updating state
        this.alarmPVDict = {}
        this.areaPVDict = {}
        this.state = {
            enableAllAreas: true,
            enableAllAreasId: null,
            globalContextOpen: false,
            alarmLogSearchString: '',
            alarmLogSearchStringStore: '',
            alarmLogSearchTimer: null,
            alarmTableSearchString: '',
            alarmTableSearchStringStore: '',
            alarmTableSearchTimer: null,
            alarmLogSelectedKey: '',
            alarmLogDict: {},
            alarmLogDisplayArray: [],
            dbHistoryURL: '',
            dbPVsURL: '',
            dbConfigURL: '',
            dbGlobalURL: '',
            alarmLogExpand: true,
            alarmLogIsExpanded: true,
            alarmTableExpand: true,
            alarmTableIsExpanded: true,
            alarmLogSelectedName: '',
            moreVertMenuShow: false,
            moreVertAchorEl: null,
            alarmDebug: false,
            alarmAckField: [],
            // identifier 0 = area, 1 = subArea, 2 = area_pv, 3 = subArea_pv
            // area
            // subArea
            // pv
            // logged in username
            // value
            alarmAckFieldTrig: false,
            alarmIOCPVPrefix: null,
            alarmIOCPVSuffix: null,
            alarmPVDict: {},
            areaPVDict: {},
            alarmRowSelected: {},
            alarmContextOpen: {},
            areaAlarms: {},
            areaContextOpen: {},
            areaEnabled: {},
            areaMongoId: {},
            areaNames: [],
            areaSelectedIndex: '',
            areaSelectedName: '',
            areaSubAreaOpen: {},
            areaSubAreaMongoId: {},
            contextMouseX: null,
            contextMouseY: null,
            lastAlarm: null,
            loadAlarmTable: {
                alarmPV: false,
            },
            lastArea: null,
            loadAlarmList: {
                areaPV: false,
            }
        }

        this.logout = this.logout.bind(this);
    }

    logout() {
        localStorage.removeItem('jwt');

    }

    handleDoNothing = () => {

    }

    handleGlobalArea = () => {
        const areaSubAreaOpen = {
            ...this.state.areaSubAreaOpen,
        }
        areaSubAreaOpen[this.state.areaSelectedIndex.split('=')[0]] = false   // set previous area to false

        this.setState({ areaSelectedIndex: 'ALLAREAS', alarmLogSelectedKey: 'ALLAREAS', areaSelectedName: 'ALL AREAS', alarmLogSelectedName: 'ALL AREAS' })
        this.setState({ areaSubAreaOpen: areaSubAreaOpen })
        this.handleUpdateLogDisplayData('ALLAREAS')
    }

    handleDisableEnableGlobal = (value) => {
        // console.log(value)
        let socket = this.context.socket;
        let jwt = JSON.parse(localStorage.getItem('jwt'));
        if (jwt === null) {
            jwt = 'unauthenticated'
        }

        const ALARM_DATABASE = "ALARM_DATABASE"
        const dbName = "demoAlarmDatabase"
        const colName = "global"
        const dbURL = "mongodb://" + ALARM_DATABASE + ":" + dbName + ":" + colName

        const id = this.state.enableAllAreasId
        const newvalues = { '$set': { ["enableAllAreas"]: value } }

        // console.log(newvalues)

        socket.emit('databaseUpdateOne', { dbURL: dbURL, 'id': id, 'newvalues': newvalues, 'clientAuthorisation': jwt }, (data) => {
            //  console.log("ackdata", data);
            if (data == "OK") {
                socket.emit('databaseBroadcastRead', { dbURL: dbURL + ':Parameters:{}', 'clientAuthorisation': jwt }, (data) => {
                    if (data !== "OK") {
                        console.log("ackdata", data);
                    }
                })
            } else {
                console.log("Global var update unsuccessful")
            }
        })

        this.setState({ globalContextOpen: false })
    }

    handleIconClick = (event) => {
        // console.log("right click")
        event.preventDefault();

        const contextMouseX = event.clientX - 2
        const contextMouseY = event.clientY - 2

        this.setState({ globalContextOpen: true, contextMouseX: contextMouseX, contextMouseY: contextMouseY })
    }

    handleAlarmGlobalContextClose = () => {
        this.setState({ globalContextOpen: false })
    }

    handleSearchAlarmTable = (event) => {
        if (this.state.alarmTableSearchTimer) {
            clearTimeout(this.state.alarmTableSearchTimer)
        }
        this.setState({
            alarmTableSearchStringStore: event.target.value,
            alarmTableSearchTimer: setTimeout(() => {
                this.setState({ alarmTableSearchString: this.state.alarmTableSearchStringStore })
            }, 300)
        })
    }

    handleSearchAlarmLog = (event) => {
        if (this.state.alarmLogSearchTimer) {
            clearTimeout(this.state.alarmLogSearchTimer)
        }
        this.setState({
            alarmLogSearchStringStore: event.target.value,
            alarmLogSearchTimer: setTimeout(() => {
                this.setState({ alarmLogSearchString: this.state.alarmLogSearchStringStore })
            }, 300)
        })
    }

    handleUpdateLogDisplayData = (alarmLogSelectedKey = null) => {
        // console.log('alarmLogSelectedKey', alarmLogSelectedKey)
        if (!alarmLogSelectedKey) {
            // no selector passed
            // console.log('no selector passed')
            alarmLogSelectedKey = this.state.alarmLogSelectedKey
        }
        else {
            this.setState({ alarmLogSelectedKey: alarmLogSelectedKey })
        }
        // console.log("update log for:", alarmLogSelectedKey)
        let alarmLogDisplayArray = []
        const alarmLogDict = this.state.alarmLogDict
        // console.log(alarmLogSelectedKey)
        // console.log(alarmLogDict)

        const isPV = alarmLogSelectedKey.includes('*')
        const isSubArea = alarmLogSelectedKey.includes('=') && !isPV

        // console.log(alarmLogSelectedKey)

        // Map alarmLogDict
        Object.keys(alarmLogDict).map(key => {
            // console.log(key)
            if (alarmLogSelectedKey === 'ALLAREAS') {
                alarmLogDisplayArray = alarmLogDisplayArray.concat(alarmLogDict[key])
            }
            else if (isPV) {
                if (key === alarmLogSelectedKey) {
                    alarmLogDisplayArray = alarmLogDisplayArray.concat(alarmLogDict[key])
                }
            }
            else if (isSubArea) {
                const areaKey = key.split('*')[0]
                if (areaKey === alarmLogSelectedKey) {
                    alarmLogDisplayArray = alarmLogDisplayArray.concat(alarmLogDict[key])
                }
            }
            else {
                let areaKey = key.split('*')[0]
                areaKey = areaKey.split('=')[0]
                if (areaKey === alarmLogSelectedKey) {
                    alarmLogDisplayArray = alarmLogDisplayArray.concat(alarmLogDict[key])
                }

            }
        })

        alarmLogDisplayArray = alarmLogDisplayArray.sort(function (a, b) {
            return b.timestamp - a.timestamp
        })

        // console.log(alarmLogDisplayArray)

        this.setState({ alarmLogDisplayArray: alarmLogDisplayArray })

    }

    handleExpansionComplete = (panelName, isExpanded) => {
        if (panelName === 'alarmTable') {
            this.setState({ alarmTableIsExpanded: isExpanded })
        }
        else if (panelName === 'alarmLog') {
            this.setState({ alarmLogIsExpanded: isExpanded })
        }
    }

    handleExpandPanel = (panelName) => {
        const alarmTableExpand = this.state.alarmTableExpand
        const alarmLogExpand = this.state.alarmLogExpand
        if (panelName === 'alarmTable') {
            this.setState({ alarmTableExpand: alarmTableExpand ? false : true })
        }
        else if (panelName === 'alarmLog') {
            this.setState({ alarmLogExpand: alarmLogExpand ? false : true })
        }
        // if (alarmLogExpand) this.setState({ alarmLogSearchString: '' })
        // if (alarmTableExpand) this.setState({ alarmTableSearchString: '' })
    }

    handleMoreVertClick = (event) => {
        this.setState({ moreVertAchorEl: event.currentTarget })
    }

    handleMoreVertClose = (event) => {
        this.setState({ moreVertAchorEl: null })
    }

    handleAlarmTesting = (event) => {
        this.setState(prevState => {
            return {
                ...prevState,
                alarmDebug: !prevState.alarmDebug
            }
        })
        this.handleMoreVertClose()
    }

    handleSimplePrint = (value, pvname) => {
        // console.log(pvname, value)
    }

    handleAreaPVChange = (value, pvname) => {
        let areaName = pvname.replace("pva://", "")
        areaName = areaName.replace(this.state.alarmIOCPVPrefix, "")

        // console.log(areaName)

        // still connecting to pvs
        if (!this.state.loadAlarmList.areaPV) {
            this.areaPVDict[areaName] = value
            if (this.state.lastArea === areaName) {
                const loadAlarmList = { ...this.state.loadAlarmList }
                loadAlarmList.areaPV = true
                this.setState({ loadAlarmList: loadAlarmList })
                this.setState({ areaPVDict: this.areaPVDict })
            }
        }
        // all pvs connected
        else {
            const areaPVDict = { ...this.state.areaPVDict }
            areaPVDict[areaName] = value
            this.setState({ areaPVDict: areaPVDict })
        }
    }

    handleAlarmPVChange = (value, pvname) => {
        // console.log(pvname)
        let epicsPVName = pvname.replace("pva://", "")
        epicsPVName = epicsPVName.replace(this.state.alarmIOCPVPrefix, "")
        epicsPVName = epicsPVName.replace(this.state.alarmIOCPVSuffix, "")

        // console.log(epicsPVName, value)

        // still connecting to pvs
        if (!this.state.loadAlarmTable.alarmPV) {
            this.alarmPVDict[epicsPVName] = value
            if (this.state.lastAlarm === epicsPVName) {
                const loadAlarmTable = { ...this.state.loadAlarmTable }
                loadAlarmTable.alarmPV = true
                this.setState({ loadAlarmTable: loadAlarmTable })
                this.setState({ alarmPVDict: this.alarmPVDict })
            }
        }
        // all pvs connected
        else {
            const alarmPVDict = { ...this.state.alarmPVDict }
            alarmPVDict[epicsPVName] = value
            this.setState({ alarmPVDict: alarmPVDict })
        }
    }

    handleAckAllAreaAlarms = (event, index) => {
        // console.log('Ack all alarms for', index)
        let username = JSON.parse(localStorage.getItem('user'))

        let alarmAckField = null
        if (index.includes("=")) {
            alarmAckField = ['1', index.split("=")[0], index.split("=")[1], null, username, 'True']
        }
        else {
            alarmAckField = ['0', index, null, null, username, 'True']
        }
        const alarmAckFieldTrig = !this.state.alarmAckFieldTrig
        this.handleListItemContextClose(event, index)
        this.setState({ alarmAckField: alarmAckField, alarmAckFieldTrig: alarmAckFieldTrig })
    }

    handleTableItemCheck = (event, index, alarm, field, value) => {
        // console.log(index, alarm, field, value)

        // to prevent re render of alarm log table?
        // not really necessary from a performance point of view
        // event.preventDefault()
        // event.stopPropagation()

        let socket = this.context.socket;
        let jwt = JSON.parse(localStorage.getItem('jwt'));
        if (jwt === null) {
            jwt = 'unauthenticated'
        }

        const ALARM_DATABASE = "ALARM_DATABASE"
        const dbName = "demoAlarmDatabase"
        const colName = "pvs"
        const dbURL = "mongodb://" + ALARM_DATABASE + ":" + dbName + ":" + colName

        const id = this.state.areaMongoId[index]
        let newvalues = null

        // Check if it is a subArea
        // console.log(index)
        if (index.includes("=")) {
            const subAreaId = this.state.areaSubAreaMongoId[index] + ".pvs." + alarm + "." + field
            newvalues = { '$set': { [subAreaId]: value } }
        }
        else {
            const subAreaId = "pvs." + alarm + "." + field
            newvalues = { '$set': { [subAreaId]: value } }
        }

        // console.log(newvalues)

        socket.emit('databaseUpdateOne', { dbURL: dbURL, 'id': id, 'newvalues': newvalues, 'clientAuthorisation': jwt }, (data) => {
            //  console.log("ackdata", data);
            if (data == "OK") {
                socket.emit('databaseBroadcastRead', { dbURL: dbURL + ':Parameters:{}', 'clientAuthorisation': jwt }, (data) => {
                    if (data !== "OK") {
                        console.log("ackdata", data);
                    }
                })
            } else {
                console.log("TableItemCheck unsuccessful")
            }
        })

    }

    handleTableRowClick = (event, alarmName) => {
        this.setState({ alarmLogSelectedName: alarmName.replace(/[=*]/g, " > ") })
        this.handleUpdateLogDisplayData(alarmName)
    }

    handleTableItemRightClick = (event, index) => {
        event.preventDefault();
        const areaAlarmNameArray = index.split('=')
        let areaName = null
        if (areaAlarmNameArray.length > 2) {
            areaName = areaAlarmNameArray[0] + "=" + areaAlarmNameArray[1]
        }
        else {
            areaName = areaAlarmNameArray[0]
        }
        if (this.state.areaEnabled[areaName] && this.state.areaAlarms[index]["enable"]) {
            const alarmContextOpen = { ...this.state.alarmContextOpen }
            alarmContextOpen[index] = true

            const alarmRowSelected = { ...this.state.alarmRowSelected }
            alarmRowSelected[index] = true

            const contextMouseX = event.clientX - 2
            const contextMouseY = event.clientY - 2

            this.setState({ alarmContextOpen: alarmContextOpen, alarmRowSelected: alarmRowSelected, contextMouseX: contextMouseX, contextMouseY: contextMouseY })
        }
    }

    handleAlarmContextClose = (event, index) => {
        const alarmContextOpen = { ...this.state.alarmContextOpen }
        alarmContextOpen[index] = false

        const alarmRowSelected = { ...this.state.alarmRowSelected }
        alarmRowSelected[index] = false

        this.setState({ alarmRowSelected: alarmRowSelected, alarmContextOpen: alarmContextOpen })
    }

    handleAlarmAcknowledge = (event, index) => {
        // console.log("Ack alarm:", index)

        let username = JSON.parse(localStorage.getItem('user'))

        const equalsLength = index.match(/=/g).length
        let alarmAckField = null
        if (equalsLength === 2) {
            alarmAckField = ['3', index.split("=")[0], index.split("=")[1], index.split("=")[2], username, 'True']
        }
        else {
            alarmAckField = ['2', index.split("=")[0], null, index.split("=")[1], username, 'True']
        }

        // console.log(alarmAckField)

        const alarmAckFieldTrig = !this.state.alarmAckFieldTrig
        this.handleAlarmContextClose(event, index)
        this.setState({ alarmAckField: alarmAckField, alarmAckFieldTrig: alarmAckFieldTrig })
    }

    handleEnableDisableArea = (event, index, value) => {
        // console.log('Enable/Disable area', index)

        let socket = this.context.socket;
        let jwt = JSON.parse(localStorage.getItem('jwt'));
        if (jwt === null) {
            jwt = 'unauthenticated'
        }

        const ALARM_DATABASE = "ALARM_DATABASE"
        const dbName = "demoAlarmDatabase"
        const colName = "pvs"
        const dbURL = "mongodb://" + ALARM_DATABASE + ":" + dbName + ":" + colName

        const id = this.state.areaMongoId[index]
        let newvalues = null

        // Check if it is a subArea
        // console.log(index)
        if (index.includes("=")) {
            const subAreaId = this.state.areaSubAreaMongoId[index] + ".enable"
            newvalues = { '$set': { [subAreaId]: value } }
        }
        else {
            newvalues = { '$set': { "enable": value } }
        }

        // console.log(newvalues)


        socket.emit('databaseUpdateOne', { dbURL: dbURL, 'id': id, 'newvalues': newvalues, 'clientAuthorisation': jwt }, (data) => {
            // console.log("ackdata", data);
            if (data == "OK") {
                socket.emit('databaseBroadcastRead', { dbURL: dbURL + ':Parameters:{}', 'clientAuthorisation': jwt }, (data) => {
                    if (data !== "OK") {
                        console.log("ackdata", data);
                    }
                })
            } else {
                console.log("Enable/Disable area unsuccessful")
            }
        })

        this.handleListItemContextClose(event, index)

    }

    handleListItemContextClose = (event, index) => {
        // console.log("close context")
        const areaContextOpen = { ...this.state.areaContextOpen }
        areaContextOpen[index] = false
        this.setState({ areaContextOpen: areaContextOpen })
    }

    handleListItemRightClick = (event, index) => {
        // console.log("right click")
        event.preventDefault();

        const areaContextOpen = { ...this.state.areaContextOpen }
        areaContextOpen[index] = true

        const contextMouseX = event.clientX - 2
        const contextMouseY = event.clientY - 2

        this.setState({ areaContextOpen: areaContextOpen, contextMouseX: contextMouseX, contextMouseY: contextMouseY })
    }

    handleListItemClick = (event, index) => {
        const areaSubAreaOpen = {
            ...this.state.areaSubAreaOpen,
        }

        let areaSelectedName = index.split('=')
        // console.log('areaSelectedName', areaSelectedName)
        // console.log('index', index)
        // console.log('this.state.areaSelectedIndex', this.state.areaSelectedIndex)
        if (areaSelectedName.length > 1) {                  // selected area is a subArea
            areaSelectedName = areaSelectedName[0] + " > " + areaSelectedName[1]
        }
        else {                                              // selected area is an area
            if (index === this.state.areaSelectedIndex) {   // selected same area twice
                areaSubAreaOpen[index] = !this.state.areaSubAreaOpen[index]
            }
            else {                                           // selected a different area
                areaSubAreaOpen[this.state.areaSelectedIndex.split('=')[0]] = false   // set previous area to false
                areaSubAreaOpen[index] = true                           // set current area to true
            }
        }

        // console.log(this.state.areaSubAreaOpen)
        this.setState({ areaSelectedIndex: index, areaSelectedName: areaSelectedName, alarmLogSelectedName: areaSelectedName })
        this.setState({ areaSubAreaOpen: areaSubAreaOpen })

        // console.log(index)
        this.handleUpdateLogDisplayData(index)
    };

    handleNewDbPVsList = (msg) => {
        // console.log('handleNewDbPVsList')
        const data = JSON.parse(msg.data);
        // console.log(data)
        const areaNames = []
        if (isEmpty(this.state.alarmRowSelected)) {
            // console.log('Only once OR for local UI vars')
            let lastAlarm = ""
            const areaContextOpen = {}
            const alarmContextOpen = {}
            const alarmRowSelected = {}
            const areaMongoId = {}
            const areaSubAreaMongoId = {}
            const areaSubAreaOpen = {
                ...this.state.areaSubAreaOpen,
            }

            data.map((area, index) => {
                areaContextOpen[area["area"]] = false
                // if (index === 0) {
                //     // Open first area on start up or refresh page
                //     areaSubAreaOpen[area["area"]] = true
                // }
                // else {
                areaSubAreaOpen[area["area"]] = false
                // }
                areaMongoId[area["area"]] = area["_id"]["$oid"]
                // Map alarms in area
                Object.keys(area["pvs"]).map(alarmKey => {
                    alarmContextOpen[`${area["area"]}=${alarmKey}`] = false
                    alarmRowSelected[`${area["area"]}=${alarmKey}`] = false
                    lastAlarm = area["pvs"][alarmKey]["name"]
                })
                Object.keys(area).map(areaKey => {
                    if (areaKey === "area") {
                        areaNames.push({ "area": area[areaKey] })
                    }
                    else if (areaKey.includes("subArea")) {
                        areaContextOpen[`${area["area"]}=${area[areaKey]["name"]}`] = false
                        areaSubAreaMongoId[`${area["area"]}=${area[areaKey]["name"]}`] = areaKey
                        areaMongoId[`${area["area"]}=${area[areaKey]["name"]}`] = area["_id"]["$oid"]
                        // Map alarms in subarea
                        Object.keys(area[areaKey]["pvs"]).map(alarmKey => {
                            alarmContextOpen[`${area["area"]}=${area[areaKey]["name"]}=${alarmKey}`] = false
                            alarmRowSelected[`${area["area"]}=${area[areaKey]["name"]}=${alarmKey}`] = false
                            lastAlarm = area[areaKey]["pvs"][alarmKey]["name"]
                        })
                        if (areaNames[index]["subAreas"]) {
                            areaNames[index]["subAreas"].push(area[areaKey]["name"])
                        }
                        else {
                            // console.log(areaNames[index])
                            areaNames[index]["subAreas"] = [area[areaKey]["name"]]
                        }
                    }
                })
            })
            if (!this.state.areaSelectedIndex) {
                // console.log("First mount update selection")
                // const areaSelectedIndex = areaNames[0]["area"]
                // const areaSelectedName = areaNames[0]["area"]
                const areaSelectedIndex = 'ALLAREAS'
                const areaSelectedName = 'ALL AREAS'
                this.setState({ areaSubAreaOpen: areaSubAreaOpen, areaSelectedIndex: areaSelectedIndex, areaSelectedName: areaSelectedName, alarmLogSelectedName: areaSelectedName })
                this.setState({ alarmLogSelectedKey: 'ALLAREAS' })
            }
            // console.log(lastAlarm)
            this.setState({ lastAlarm })
            this.setState({ alarmRowSelected: alarmRowSelected, alarmContextOpen: alarmContextOpen })
            this.setState({ areaMongoId: areaMongoId, areaSubAreaMongoId: areaSubAreaMongoId })
            this.setState({ areaNames: areaNames, areaContextOpen: areaContextOpen })
        }

        const areaAlarms = {}
        const areaEnabled = {}
        let lastArea = ""

        data.map((area, index) => {
            // map all alarms in area
            Object.keys(area).map(areaKey => {
                if (areaKey === "pvs") {
                    Object.keys(area[areaKey]).map(alarm => {
                        areaAlarms[`${area["area"]}=${alarm}`] = area[areaKey][alarm]
                    })
                }
            })
            areaEnabled[area["area"]] = area["enable"]
            lastArea = area["area"]
            Object.keys(area).map(areaKey => {
                if (areaKey.includes("subArea")) {
                    // Area enabled for subArea includes parent area
                    areaEnabled[`${area["area"]}=${area[areaKey]["name"]}`] = area[areaKey]["enable"] && areaEnabled[area["area"]]
                    lastArea = `${area["area"]}=${area[areaKey]["name"]}`
                    // map all alarms in subArea
                    Object.keys(area[areaKey]).map(subAreaKey => {
                        if (subAreaKey === "pvs") {
                            Object.keys(area[areaKey][subAreaKey]).map(alarm => {
                                areaAlarms[`${area["area"]}=${area[areaKey]["name"]}=${alarm}`] = area[areaKey][subAreaKey][alarm]
                            })
                        }
                    })
                }
            })
        })

        // console.log(lastArea)

        this.setState({ areaAlarms: areaAlarms, areaEnabled: areaEnabled, lastArea: lastArea })

        let displayAlarmTable = true
        for (const [key, value] of Object.entries(this.state.loadAlarmTable)) {
            // console.log(key, value)
            displayAlarmTable = displayAlarmTable && value
        }
        if (!displayAlarmTable) {
            this.loadAlarmTable()
        }

        let displayAlarmList = true
        for (const [key, value] of Object.entries(this.state.loadAlarmList)) {
            // console.log(key, value)
            displayAlarmList = displayAlarmList && value
        }
        if (!displayAlarmList) {
            this.loadAlarmList()
        }
    }

    handleDatabaseReadWatchAndBroadcastAck = (msg) => {
        // console.log(msg)
        if (typeof msg !== 'undefined') {
            // console.log("dbWatchId: ", msg.dbWatchId)
            this.setState({ dbWatchId: msg.dbWatchId })
        }
    }

    handleNewDbLogReadWatchBroadcast = (msg) => {
        const data = JSON.parse(msg.data);
        // console.log(data)
        const alarmLogDict = {}
        data.map((area, index) => {
            alarmLogDict[area["identifier"]] = area["history"]
        })
        // console.log("history watch")
        this.setState({ alarmLogDict: alarmLogDict })
        this.handleUpdateLogDisplayData()
    }

    handleDbConfig = (msg) => {
        const data = JSON.parse(msg.data)[0];
        this.setState({ alarmIOCPVPrefix: data["alarmIOCPVPrefix"], alarmIOCPVSuffix: data['alarmIOCPVSuffix'] })
    }

    handleDbGlobal = (msg) => {
        // console.log(JSON.parse(msg.data)[0])
        // ["_id"]["$oid"]
        const data = JSON.parse(msg.data)[0];
        this.setState({ enableAllAreas: data["enableAllAreas"], enableAllAreasId: data["_id"]["$oid"] })
    }

    componentDidMount() {
        // console.log('[AlarmHander] componentDidMount')
        let socket = this.context.socket;
        let jwt = JSON.parse(localStorage.getItem('jwt'));

        if (jwt === null) {
            jwt = 'unauthenticated'
        }

        const ALARM_DATABASE = "ALARM_DATABASE"
        const dbName = "demoAlarmDatabase"
        let colName = "pvs"
        const dbPVsURL = "mongodb://" + ALARM_DATABASE + ":" + dbName + ":" + colName + ":Parameters:{}"
        this.setState({ dbPVsURL: dbPVsURL })

        socket.emit('databaseBroadcastRead', { dbURL: dbPVsURL, 'clientAuthorisation': jwt }, (data) => {
            if (data !== "OK") {
                console.log("ackdata", data);
            }
        });
        socket.on('databaseData:' + dbPVsURL, this.handleNewDbPVsList);

        colName = "history"
        const dbHistoryURL = "mongodb://" + ALARM_DATABASE + ":" + dbName + ":" + colName + ":Parameters:{}"
        this.setState({ dbHistoryURL: dbHistoryURL })

        socket.emit('databaseReadWatchAndBroadcast', { dbURL: dbHistoryURL, 'clientAuthorisation': jwt }, this.handleDatabaseReadWatchAndBroadcastAck)
        socket.on('databaseWatchData:' + dbHistoryURL, this.handleNewDbLogReadWatchBroadcast);

        colName = "config"
        const dbConfigURL = "mongodb://" + ALARM_DATABASE + ":" + dbName + ":" + colName + ":Parameters:{}"
        this.setState({ dbConfigURL: dbConfigURL })

        socket.emit('databaseBroadcastRead', { dbURL: dbConfigURL, 'clientAuthorisation': jwt }, (data) => {
            if (data !== "OK") {
                console.log("ackdata", data);
            }
        });
        socket.on('databaseData:' + dbConfigURL, this.handleDbConfig);

        colName = "global"
        const dbGlobalURL = "mongodb://" + ALARM_DATABASE + ":" + dbName + ":" + colName + ":Parameters:{}"
        this.setState({ dbGlobalURL: dbGlobalURL })

        socket.emit('databaseBroadcastRead', { dbURL: dbGlobalURL, 'clientAuthorisation': jwt }, (data) => {
            if (data !== "OK") {
                console.log("ackdata", data);
            }
        });
        socket.on('databaseData:' + dbGlobalURL, this.handleDbGlobal);

    }

    componentWillUnmount() {
        let jwt = JSON.parse(localStorage.getItem('jwt'));
        if (jwt === null) {
            jwt = 'unauthenticated'
        }
        let socket = this.context.socket;
        if (typeof (this.state.dbWatchId) !== 'undefined') {
            socket.emit('remove_dbWatch', { dbURL: this.state.dbHistoryURL, dbWatchId: this.state.dbWatchId, 'clientAuthorisation': jwt });
        }
        socket.removeListener('databaseWatchData:' + this.state.dbHistoryURL, this.handleNewDbLogReadWatchBroadcast);
        socket.removeListener('databaseData:' + this.state.dbPVsURL, this.handleNewDbPVsList);
        socket.removeListener('databaseData:' + this.state.dbConfigURL, this.handleDbConfig);
        socket.removeListener('databaseData:' + this.state.dbGlobalURL, this.handleDbGlobal);
    }

    loadAlarmTable = () => {
        const timer = setTimeout(() => {
            if (!this.state.loadAlarmTable) {
                console.log('Warning: Auto load alarm table')
            }
            const loadAlarmTable = this.state.loadAlarmTable
            for (const [key, value] of Object.entries(loadAlarmTable)) {
                loadAlarmTable[key] = true
            }
            this.setState({ loadAlarmTable: loadAlarmTable })
        }, 10000);
        return () => clearTimeout(timer);
    }

    loadAlarmList = () => {
        const timer = setTimeout(() => {
            if (!this.state.loadAlarmList) {
                console.log('Warning: Auto load alarm list')
            }
            const loadAlarmList = this.state.loadAlarmList
            for (const [key, value] of Object.entries(loadAlarmList)) {
                loadAlarmList[key] = true
            }
            this.setState({ loadAlarmList: loadAlarmList })
        }, 10000);
        return () => clearTimeout(timer);
    }

    render() {
        const { classes } = this.props;
        const { areaSelectedName } = this.state;

        let alarmPVs = null
        if (this.state.alarmIOCPVPrefix !== null) {
            alarmPVs = Object.keys(this.state.areaAlarms).map(alarmKey => (
                <DataConnection
                    key={alarmKey}
                    pv={'pva://' + this.state.alarmIOCPVPrefix + this.state.areaAlarms[alarmKey]["name"] + this.state.alarmIOCPVSuffix}
                    handleInputValue={this.handleAlarmPVChange}
                />
            ))
        }

        let ackPV = null
        if (this.state.alarmIOCPVPrefix !== null) {
            ackPV = (
                <DataConnection
                    pv={'pva://' + this.state.alarmIOCPVPrefix + "ACK_PV"}
                    handleInputValue={this.handleDoNothing}
                    outputValue={this.state.alarmAckField}
                    debug={false}
                    newValueTrigger={this.state.alarmAckFieldTrig}
                />
            )
        }

        let areaPVs = null
        if (this.state.alarmIOCPVPrefix !== null) {
            areaPVs = Object.keys(this.state.areaEnabled).map(areaName => (
                <DataConnection
                    key={areaName}
                    pv={'pva://' + this.state.alarmIOCPVPrefix + areaName}
                    handleInputValue={this.handleAreaPVChange}
                />
            ))
        }

        let displayAlarmTable = true
        for (const [key, value] of Object.entries(this.state.loadAlarmTable)) {
            // console.log(key, value)
            displayAlarmTable = displayAlarmTable && value
        }

        let displayAlarmList = true
        for (const [key, value] of Object.entries(this.state.loadAlarmList)) {
            // console.log(key, value)
            displayAlarmList = displayAlarmList && value
        }

        let alarmTableHeight = '40vh'
        let alarmLogHeight = '29vh'
        if (this.state.alarmTableExpand && !this.state.alarmLogExpand && !this.state.alarmLogIsExpanded) {
            alarmTableHeight = '75vh'
        }
        else if (!this.state.alarmTableExpand && !this.state.alarmTableIsExpanded && this.state.alarmLogExpand) {
            alarmLogHeight = '75vh'
        }

        // console.log(this.state.alarmIOCPVPrefix)

        return (
            <React.Fragment>
                {alarmPVs}
                {areaPVs}
                {ackPV}
                <div id="test" className={classes.root}>
                    <div
                        style={{
                            display: 'flex',
                            paddingTop: 20,
                        }}
                    >
                        <SideBar />
                        <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', flexGrow: 1 }}>ALARM HANDLER</div>
                        <IconButton aria-label="display more actions" color="inherit" onClick={event => this.handleMoreVertClick(event)}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="simple-menu"
                            anchorEl={this.state.moreVertAchorEl}
                            keepMounted
                            open={Boolean(this.state.moreVertAchorEl)}
                            onClose={this.handleMoreVertClose}
                        >
                            <MenuItem onClick={this.handleDoNothing}>
                                <ListItemIcon >
                                    <ContactPhoneIcon fontSize="small" />
                                </ListItemIcon>
                                <Typography variant="inherit">Configure user notification</Typography>
                            </MenuItem>
                            <MenuItem onClick={this.handleAlarmTesting}>
                                <ListItemIcon >
                                    {this.state.alarmDebug
                                        ? <NotInterestedIcon fontSize="small" />
                                        : <InputIcon fontSize="small" />
                                    }
                                </ListItemIcon>
                                <Typography variant="inherit">
                                    {this.state.alarmDebug
                                        ? "Disable alarm testing/debug"
                                        : "Enable alarm testing/debug"
                                    }</Typography>

                            </MenuItem>
                        </Menu>
                    </div>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="stretch"
                        spacing={2}
                        style={{ paddingLeft: 50 }}
                    >
                        {displayAlarmList
                            ? <Grid item xs={2}>
                                <Card className={classes.card}>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="center"
                                        alignItems="center"
                                        spacing={2}
                                    >
                                        <Grid item xs={2} style={{ textAlign: 'right' }}>
                                            <IconButton
                                                aria-label="global_alarms"
                                                style={{ padding: 0 }}
                                                onClick={() => this.handleGlobalArea()}
                                                onContextMenu={(event) => this.handleIconClick(event)}
                                            >
                                                {this.state.areaSelectedIndex === 'ALLAREAS'
                                                    ? <PublicIcon color="primary" />
                                                    : <PublicIcon />}
                                            </IconButton>
                                            <Menu
                                                keepMounted
                                                open={this.state.globalContextOpen}
                                                onClose={() => this.handleAlarmGlobalContextClose()}
                                                anchorReference="anchorPosition"
                                                anchorPosition={this.state.contextMouseY !== null && this.state.contextMouseX !== null ?
                                                    { top: this.state.contextMouseY, left: this.state.contextMouseX } : null}
                                            >
                                                <MenuItem disabled>GLOBAL</MenuItem>
                                                <hr />
                                                {this.state.enableAllAreas ?
                                                    <MenuItem
                                                        onClick={() => this.handleDisableEnableGlobal(false)}
                                                    >
                                                        <ListItemIcon >
                                                            <NotificationsOffIcon fontSize="small" />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit">Disable ALLAREAS</Typography>
                                                    </MenuItem> :
                                                    <MenuItem
                                                        onClick={() => this.handleDisableEnableGlobal(true)}
                                                    >
                                                        <ListItemIcon >
                                                            <NotificationsActiveIcon fontSize="small" />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit">Enable ALLAREAS</Typography>
                                                    </MenuItem>
                                                }
                                                <MenuItem
                                                // onClick={event => this.props.ackAllAreaAlarms(event, `${area["area"]}`)}
                                                >
                                                    <ListItemIcon >
                                                        <DoneAllIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <Typography variant="inherit">ACK ALLAREAS' alarms</Typography>
                                                </MenuItem>

                                            </Menu>
                                        </Grid>
                                        <Grid item xs={10}>
                                            <div style={{ paddingTop: 0, fontSize: 16, fontWeight: 'bold' }}>ALARM AREAS</div>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {this.state.areaNames ?
                                                <AlarmList
                                                    areaPVDict={this.state.areaPVDict}
                                                    ackAllAreaAlarms={this.handleAckAllAreaAlarms}
                                                    areaContextOpen={this.state.areaContextOpen}
                                                    areaEnabled={this.state.areaEnabled}
                                                    areaNames={this.state.areaNames}
                                                    areaSubAreaOpen={this.state.areaSubAreaOpen}
                                                    areaSelectedIndex={this.state.areaSelectedIndex}
                                                    contextMouseX={this.state.contextMouseX}
                                                    contextMouseY={this.state.contextMouseY}
                                                    enableDisableArea={this.handleEnableDisableArea}
                                                    listItemClick={this.handleListItemClick}
                                                    listItemRightClick={this.handleListItemRightClick}
                                                    listItemContextClose={this.handleListItemContextClose}
                                                />
                                                : "No data from database"}
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>
                            : <Grid item xs={2}>
                                <Card className={classes.card}>
                                    <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                                        CONNECTING TO PVs...
                                    </div>
                                </Card>
                            </Grid>}
                        {displayAlarmTable ?
                            <Grid item xs={10} style={{ paddingRight: 32 }}>
                                <ExpansionPanel
                                    expanded={this.state.alarmTableExpand}
                                    onChange={() => this.handleExpandPanel('alarmTable')}
                                    TransitionProps={{
                                        onEntered: () => this.handleExpansionComplete('alarmTable', true),
                                        onExited: () => this.handleExpansionComplete('alarmTable', false)
                                    }}
                                >
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header"
                                    >
                                        <div style={{ display: 'flex', width: '100%' }}>
                                            <div style={{ fontSize: 16, fontWeight: 'bold', flexGrow: 20 }}>{`ALARM TABLE: ${areaSelectedName}`}</div>
                                            <div style={{ fontSize: 16, fontWeight: 'bold', flexGrow: 1 }}>{
                                                this.state.alarmTableExpand
                                                    ? <div className={classes.search}>
                                                        <div className={classes.searchIcon}>
                                                            <SearchIcon />
                                                        </div>
                                                        <InputBase
                                                            placeholder="Search alarm table…"
                                                            classes={{
                                                                root: classes.inputRoot,
                                                                input: classes.inputInput,
                                                            }}
                                                            inputProps={{ 'aria-label': 'search' }}
                                                            onClick={event => event.stopPropagation()}
                                                            onFocus={event => event.stopPropagation()}
                                                            onChange={event => this.handleSearchAlarmTable(event)}
                                                            onBlur={() => this.setState({
                                                                alarmTableSearchStringStore: '',
                                                                alarmTableSearchString: ''
                                                            })}
                                                            value={this.state.alarmTableSearchStringStore}
                                                        />
                                                    </div>
                                                    : '[click to show]'
                                            }</div>
                                        </div>

                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        {this.state.areaNames
                                            ? <AlarmTable
                                                debug={this.state.alarmDebug}
                                                alarmPVDict={this.state.alarmPVDict}
                                                alarmRowSelected={this.state.alarmRowSelected}
                                                alarmAcknowledge={this.handleAlarmAcknowledge}
                                                alarmContextClose={this.handleAlarmContextClose}
                                                alarmContextOpen={this.state.alarmContextOpen}
                                                areaSelectedIndex={this.state.areaSelectedIndex}
                                                areaAlarms={this.state.areaAlarms}
                                                contextMouseX={this.state.contextMouseX}
                                                contextMouseY={this.state.contextMouseY}
                                                itemChecked={this.handleTableItemCheck}
                                                areaEnabled={this.state.areaEnabled}
                                                tableItemRightClick={this.handleTableItemRightClick}
                                                height={alarmTableHeight}
                                                tableRowClick={this.handleTableRowClick}
                                                alarmTableSearchString={this.state.alarmTableSearchString}
                                            />
                                            : "No data from database"}
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                                <ExpansionPanel
                                    expanded={this.state.alarmLogExpand}
                                    onChange={() => this.handleExpandPanel('alarmLog')}
                                    TransitionProps={{
                                        onEntered: () => this.handleExpansionComplete('alarmLog', true),
                                        onExited: () => this.handleExpansionComplete('alarmLog', false)
                                    }}
                                >
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header"
                                    >
                                        <div style={{ display: 'flex', width: '100%' }}>
                                            <div style={{ fontSize: 16, fontWeight: 'bold', flexGrow: 20 }}>{`ALARM LOG: ${this.state.alarmLogSelectedName}`}</div>
                                            <div style={{ fontSize: 16, fontWeight: 'bold', flexGrow: 1 }}>{
                                                this.state.alarmLogExpand
                                                    ? <div className={classes.search}>
                                                        <div className={classes.searchIcon}>
                                                            <SearchIcon />
                                                        </div>
                                                        <InputBase
                                                            placeholder="Search alarm log…"
                                                            classes={{
                                                                root: classes.inputRoot,
                                                                input: classes.inputInput,
                                                            }}
                                                            inputProps={{ 'aria-label': 'search' }}
                                                            onClick={event => event.stopPropagation()}
                                                            onFocus={event => event.stopPropagation()}
                                                            onChange={event => this.handleSearchAlarmLog(event)}
                                                            onBlur={() => this.setState({
                                                                alarmLogSearchStringStore: '',
                                                                alarmLogSearchString: ''
                                                            })}
                                                            value={this.state.alarmLogSearchStringStore}
                                                        />
                                                    </div>
                                                    : '[click to show]'
                                            }
                                            </div>
                                        </div>

                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <AlarmLog
                                            height={alarmLogHeight}
                                            alarmLogDisplayArray={this.state.alarmLogDisplayArray}
                                            alarmLogSelectedKey={this.state.alarmLogSelectedKey}
                                            alarmLogSearchString={this.state.alarmLogSearchString}
                                        />
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                                {/* <Slide direction="left" in={true} mountOnEnter unmountOnExit>
                                    <Paper elevation={4} style={{ zIndex: 1, position: 'relative' }}>
                                        Hello
                                    </Paper>
                                </Slide> */}
                            </Grid>
                            :
                            <Grid item xs={10} style={{ paddingRight: 32 }}>
                                <Card className={classes.card}>
                                    <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                                        CONNECTING TO PVs...
                                    </div>
                                </Card>
                            </Grid>
                        }

                    </Grid>
                    <RedirectToLogIn />
                </div>
            </React.Fragment >
        )
    }
}

AlarmHandler.contextType = AutomationStudioContext;

export default withStyles(styles, { withTheme: true })(AlarmHandler);
