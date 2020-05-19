import React from 'react'
import AutomationStudioContext from '../SystemComponents/AutomationStudioContext';
import DataConnection from '../SystemComponents/DataConnection';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import red from '@material-ui/core/colors/red';
import deepOrange from '@material-ui/core/colors/deepOrange';
import grey from '@material-ui/core/colors/grey';
import ContextMenu from '../SystemComponents/ContextMenu';
import { LanDisconnect } from 'mdi-material-ui/';
import { create, all } from 'mathjs';
const config = {}
const math = create(all, config)



const styles = theme => ({

  body1: theme.typography.body1,
  root: {

    display: 'flex',
    flexWrap: 'wrap',
  },
  TextField: {
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingBottom: 0,
    marginTop: 0,
    fontWeight: 500,
    borderRadius: 4
  },
  majorAlarm: {
    background: red['800'],
    borderRadius: 2,
    padding: 1,
  },
  majorAlarmAcked: {
    // red['800'] = #c62828 = rgb(198,40,40)
    background: 'rgba(198,40,40,0.3)',
    borderRadius: 2,
    padding: 1,
  },
  majorAlarmWarn: {
    borderRadius: 2,
    padding: 1,
    borderStyle: "dotted",
    borderWidth:"thin",
    borderColor: red['800']
  },
  minorAlarm: {
    background: deepOrange['400'],
    borderRadius: 2,
    padding: 1,
  },
  minorAlarmAcked: {
    // deepOrange['400'] = #ff7043 = rgb(255,112,67)
    background: 'rgba(255,112,67,0.3)',
    borderRadius: 2,
    padding: 1,
  },
  minorAlarmWarn: {
    borderRadius: 2,
    padding: 1,
    borderStyle: "dotted",
    borderWidth:"thin",
    borderColor: deepOrange['400']
  },
  noAlarm: {
  },
});

/**
* The TextUpdateAH Component is a wrapper on the JavaScript <b>div</b> container tag. The component is implemented with zero margins and enabled to grow to the width of its parent container.<br/><br/>
* The margins and spacing must be controlled from the parent component.<br/><br/>
* More information on JavaScript <b>div</b> tag:
* https://www.w3schools.com/tags/tag_div.asp<br/><br/>

*/
class TextUpdateAH extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ['value']: "",
      ['inputValue']: "",
      ['outputValue']: "",
      ['hasFocus']: false,
      ['label']: "Undefined",
      ['pvname']: "Undefined",
      ['intialized']: false,
      ['metadata']: {},
      ['severity']: '',
      openContextMenu: false,
      'open': false, x0: 0, y0: 0
    }
    this.handleInputValue = this.handleInputValue.bind(this);
    this.handleInputValueLabel = this.handleInputValueLabel.bind(this);
    this.handleMetadata = this.handleMetadata.bind(this);

  }

  handleInputValue(inputValue, pvname, initialized, severity) {
    //console.log("severity: ",severity);
    if (this.state['hasFocus'] === false) {
      this.setState({
        ['value']: inputValue,
        ['inputValue']: inputValue,
        ['pvname']: pvname,
        ['initialized']: initialized,
        ['severity']: severity
      });
    }
    else {
      this.setState({
        ['inputValue']: inputValue,
        ['pvname']: pvname,
        ['initialized']: initialized,
        ['severity']: severity
      });
    }
  }

  handleMetadata(metadata) {

    if (this.state['hasFocus'] === false) {
      this.setState({
        ['metadata']: metadata,
        ['newMetadata']: metadata
      });
    }
    else {
      this.setState({ ['newMetadata']: metadata });

    }
  }

  handleInputValueLabel(inputValue) {
    this.setState({ ['label']: inputValue });
  }

  handleContextMenuClose = (event) => {
    this.setState({ openContextMenu: false });
  };

  handleToggleContextMenu = (event) => {
    //   console.log(event.type)
    event.persist()
    this.setState(state => ({ openContextMenu: !state.openContextMenu, x0: event.pageX, y0: event.pageY }));

    event.preventDefault();
  }


  handleOnFocus = event => {
    this.setState({ ['hasFocus']: true });
  }

  catchReturn = stateVar => event => {
    if (event.key === 'Enter') {
      this.setState({ ['outputValue']: this.state['value'] });
    }
  }

  handleOnBlur = event => {
    this.setState({
      ['hasFocus']: false,
      ['value']: this.state['inputValue'],
      ['metadata']: this.state['newMetadata']
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  test() {
  }

  render() {
    //console.log(this.props)
    const { classes } = this.props;
    const pv = this.props.pv;
    const macros = this.props.macros;
    const usePvLabel = this.props.usePvLabel;
    const mylabel = this.props.label;
    const usePrecision = this.props.prec;
    const useStringValue = this.props.useStringValue;
    const { isNormalPV } = this.props;
    const severity = this.state.severity;
    let units = "";
    const initialized = this.state.initialized;
    let value = this.state.value;
    if (initialized) {
      if (this.props.usePvUnits === true) {
        if (this.state.metadata) {
          if (this.state.metadata.units) {
            units = " " + this.state.metadata.units;
          }
          else {
            units = "";
          }
        }
        else {
          units = "";
        }

      }
      else {
        if (typeof this.props.units !== 'undefined') {
          units = " " + this.props.units;

        } else {
          units = "";
        }
      }


      if (this.props.usePrecision !== 'undefined') {
        if (this.props.usePrecision) {
          if (typeof this.props.prec !== 'undefined') {
            value = parseFloat(value).toFixed(this.props.prec);
          }
          else
            if (!isNaN(value)) {
              value = parseFloat(value).toFixed(parseInt(this.state.metadata.precision));
            }
        }
      }

      if (typeof this.props.numberFormat !== 'undefined') {
        value = math.format(parseFloat(value), this.props.numberFormat)

      }
    }

    // field(ZRST, "NO_ALARM")
    // field(ONST, "MINOR_ACKED")
    // field(TWST, "MINOR")
    // field(THST, "MAJOR_ACKED")
    // field(FRST, "MAJOR")
    // field(FVST, "INVALID_ACKED")
    // field(SXST, "INVALID")

    let textFieldClassName;
    if (typeof this.props.alarmSensitive !== 'undefined') {
      if (this.props.alarmSensitive) {
        if (isNormalPV) {
          if (severity == 1) {
            textFieldClassName = classes.minorAlarmWarn;
          }
          else if (severity == 2) {
            textFieldClassName = classes.majorAlarmWarn;
          }
          else {
            textFieldClassName = classes.noAlarm;
          }
        }
        else {
          if (value == "NO_ALARM") {
            textFieldClassName = classes.noAlarm;
          }
          else if (value == "MINOR_ACKED") {
            textFieldClassName = classes.minorAlarmAcked;
          }
          else if (value == "MINOR_ALARM") {
            textFieldClassName = classes.minorAlarm;
          }
          else if (value == "MAJOR_ACKED" || value == "INVALID_ACKED") {
            textFieldClassName = classes.majorAlarmAcked;
          }
          else if (value == "MAJOR_ALARM" || value == "INVALID") {
            textFieldClassName = classes.majorAlarm;
          }
        }
      }
    }

    return (
      <div onContextMenu={this.props.disableContextMenu === true ? undefined : this.handleToggleContextMenu}>
        <DataConnection
          pv={pv}
          macros={macros}
          usePvLabel={usePvLabel}
          usePrecision={usePrecision}
          handleInputValue={this.handleInputValue}
          handleMetadata={this.handleMetadata}
          outputValue={this.state.outputValue}
          useStringValue={useStringValue}
          debug={this.props.debug}
          handleInputValueLabel={this.handleInputValueLabel}
          intialLocalVariableValue={this.props.intialLocalVariableValue}
        />
        <React.Fragment>
          <ContextMenu
            disableProbe={this.props.disableProbe}
            open={this.state.openContextMenu}
            anchorReference="anchorPosition"
            anchorPosition={{ top: +this.state.y0, left: +this.state.x0 }}
            probeType={'readOnly'}
            pvs={[{ pvname: this.state.pvname, initialized: initialized }]}
            handleClose={this.handleContextMenuClose}

            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          />
          {initialized === true &&
            <span className={textFieldClassName} style={{ margin: 0, padding: 0 }}>
              {usePvLabel === true ? this.state['label'] + ': ' : this.props.label}
              {value} {units}
            </span>
          }
          {((initialized === false) || (initialized === 'undefined')) &&
            <div className={classes.body1}>
              {<span> <LanDisconnect style={{ color: this.props.theme.palette.error.main, verticalAlign: "middle" }} fontSize='small' /> {this.state['pvname']} </span>}
            </div>
          }
        </React.Fragment>
      </div>
    )
  }
}
TextUpdateAH.propTypes = {
  /** Name of the process variable, NB must contain correct prefix ie: pva://  eg. 'pva://$(device):test$(id)'*/
  pv: PropTypes.string.isRequired,
  /** Values of macros that will be substituted in the pv name eg. {{'$(device)':'testIOC','$(id)':'2'}}*/
  macros: PropTypes.object,
  /** Directive to fill the label with the value contained in the  EPICS pv's DESC field. */
  usePvLabel: PropTypes.bool,
  /** Directive to use the units contained in the  EPICS pv's EGU field. */
  usePvUnits: PropTypes.bool,
  /** Directive to round the value. */
  usePrecision: PropTypes.bool,
  /** Custom precision to round the value too, if not defined then the EPICS PREC field will be used, if `usePrecision` is defined. */
  prec: PropTypes.number,
  /** Custom units to be used, if `usePvUnits` is not defined. */
  units: PropTypes.string,
  /** Directive to use the EPICS alarm severity status to alter the fields backgorund color  */
  alarmSensitive: PropTypes.bool,
  /** Custom label to be used, if  `usePvLabel` is not defined. */
  label: PropTypes.string,
  /** If defined, then the DataConnection debugging information will be displayed*/
  debug: PropTypes.bool,
  /** If defined, then the string representaion of the number can be formatted using the mathjs format function eg.  numberFormat={{notation: 'engineering',precision: 3}}. See https://mathjs.org/docs/reference/functions/format.html for more examples*/
  numberFormat: PropTypes.object,
  /** local variable intialization value*/
  intialLocalVariableValue: PropTypes.string,
  /** Disable the context menu*/
  disableContextMenu: PropTypes.bool,
  /** If defined, then the string value of the EPICS enumerator type will be forced to be used, if not defined the the enumerator index is used */
  useStringValue: PropTypes.bool


};

TextUpdateAH.defaultProps = {
  debug: false,
  alarmSensitive: false,
  usePrecision: false,
  usePvLabel: false,
  usePvUnits: false,
  disableContextMenu: false,
};

TextUpdateAH.contextType = AutomationStudioContext;
export default withStyles(styles, { withTheme: true })(TextUpdateAH)
