const NUMBER_ZERO = "zero";
const NUMBER_ONE = "one";
const NUMBER_TWO = "two";
const NUMBER_THREE = "three";
const NUMBER_FOUR = "four";
const NUMBER_FIVE = "five";
const NUMBER_SIX = "six";
const NUMBER_SEVEN = "seven";
const NUMBER_EIGHT = "eight";
const NUMBER_NINE = "nine";
const NUMBER_DECIMAL = "decimal";

const OPERATOR_CLEAR = "clear";
const OPERATOR_DIVIDE = "divide";
const OPERATOR_MULTIPLY = "multiply";
const OPERATOR_SUBTRACT = "subtract";
const OPERATOR_ADD = "add";
const OPERATOR_EQUALS = "equals";

/*app initial state as constant as it is used in clearing calculator*/
const INITIAL_STATE = {
  firstDigit: 0,
  secondDigit: null,
  digitToAppend: null,
  decimalPoint: false,
  finalAnswer: null,
  firstDigitEntered: false,
  secondDigitEntered: false,
  negativeSign: false,
  operatorSelected: "",
  displayCurrentValue: 0,
  history: ""
};

/*---------- REACT  ----------*/
class ManoApp extends React.Component {
  constructor(props) {
    super(props);   
  };
  render() {
    return (
      <Calculator />
    );
  };
};
/*---------- CALCULATOR MAIN COMPONENT  ----------*/
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.actionSelector=this.actionSelector.bind(this);
  };
  /*converting constants to digital numbers*/
  convertToNumber(number) {
    switch(number){
      case NUMBER_ZERO:
        return 0;
      case NUMBER_ONE:
        return 1;
      case NUMBER_TWO:
        return 2;
      case NUMBER_THREE:
        return 3;
      case NUMBER_FOUR:
        return 4;
      case NUMBER_FIVE:
        return 5;
      case NUMBER_SIX:
        return 6;
      case NUMBER_SEVEN:
        return 7;
      case NUMBER_EIGHT:
        return 8;
      case NUMBER_NINE:
        return 9;
      case OPERATOR_DIVIDE:
        return "/";
      case OPERATOR_MULTIPLY:
        return "*";
      case OPERATOR_SUBTRACT:
        return "-";
      case OPERATOR_ADD:
        return "+";
      case OPERATOR_EQUALS:
        return "=";
      case NUMBER_DECIMAL:
        return ".";
      default:
        console.log("WARNING: default switch executed in converToNumber() function with variable: " + number);
        return "";
    };
  };

  actionSelector(actionID){

    if(actionID == OPERATOR_CLEAR){
      this.clearCalc();
      return;
    };

    switch(actionID){
      case OPERATOR_DIVIDE:
        this.updateOperator(actionID);
        break;
      case OPERATOR_MULTIPLY:
        this.updateOperator(actionID);
        break;
      case OPERATOR_SUBTRACT:
        this.updateOperator(actionID);
        break;
      case OPERATOR_ADD:
        this.updateOperator(actionID);
        break;
      case OPERATOR_EQUALS:
        this.updateOperator(actionID);
        break;
      case NUMBER_DECIMAL:
        if(!this.state.decimalPoint){
          this.setState({decimalPoint: true});
        };
        break;
      default:
        this.updateDigit(this.convertToNumber(actionID));
        break;
    };
    console.log(this.state);
    this.updateDisplay();
  };

  /*clear calculator*/
  clearCalc() {
    this.setState(INITIAL_STATE);
  };

  /*set digit to negative number*/
  negativeSign(){
  };

  /*update digit with new pressed number*/
  updateDigit(digit){
    /*check if first digit is already entered*/
    if(this.state.firstDigitEntered){
      console.log("update second digit with " + digit);
      return;
    } else {
      console.log("update first digit with " + digit);
      this.validateDigit(this.state.firstDigit, digit);
    };
  };

  /*check is the new number would be valid*/
  validateDigit(currentNumber, digitToAppend){
    console.log("Check to append " + digitToAppend + " to number " + currentNumber);
  };

  /*check if decimal point is needed*/
  decimalPoint(){
    console.log("decimalPoint() called");
  };

  updateOperator(actionID){
    let currentOperator = actionID;
  };

  executeOperation(){
    let answer;
    switch(this.state.operatorSelected){
      case OPERATOR_DIVIDE:
        answer = this.state.firstDigit / this.state.secondDigit;
        break;
      case OPERATOR_MULTIPLY:
        answer = this.state.firstDigit * this.state.secondDigit;
        break;
      case OPERATOR_SUBTRACT:
        answer = this.state.firstDigit - this.state.secondDigit;
        break;
      case OPERATOR_ADD:
        answer = this.state.firstDigit + this.state.secondDigit;
        break;
      case OPERATOR_EQUALS:
        console.log("WARNING: equals switch reached in executeOperation()");
        break;
    };
    this.setState(INITIAL_STATE);
    this.setState({
      firstDigit: answer
    });
  };

  updateDisplay(){
  };

  render() {
    return (
    <div id="calculator">
      <Display displayValue={this.state.displayCurrentValue} displayHistory={this.state.history}/>
      <div id="keypad">
        <Button id={OPERATOR_CLEAR} display="AC" action={this.actionSelector}/>
        <Button id={OPERATOR_DIVIDE} display="/" action={this.actionSelector}/>
        <Button id={OPERATOR_MULTIPLY} display="*" action={this.actionSelector}/>
        <Button id={OPERATOR_SUBTRACT} display="-" action={this.actionSelector}/>
        <Button id={OPERATOR_ADD} display="+" action={this.actionSelector}/>
        <Button id={OPERATOR_EQUALS} display="=" action={this.actionSelector}/>
        <Button id={NUMBER_DECIMAL} display="." action={this.actionSelector}/>
        <Button id={NUMBER_ONE} display="1" action={this.actionSelector}/>
        <Button id={NUMBER_TWO} display="2" action={this.actionSelector}/>
        <Button id={NUMBER_THREE} display="3" action={this.actionSelector}/>
        <Button id={NUMBER_FOUR} display="4" action={this.actionSelector}/>
        <Button id={NUMBER_FIVE} display="5" action={this.actionSelector}/>
        <Button id={NUMBER_SIX} display="6" action={this.actionSelector}/>
        <Button id={NUMBER_SEVEN} display="7" action={this.actionSelector}/>
        <Button id={NUMBER_EIGHT} display="8" action={this.actionSelector}/>
        <Button id={NUMBER_NINE} display="9" action={this.actionSelector}/>
        <Button id={NUMBER_ZERO} display="0" action={this.actionSelector}/>
      </div>
    </div>
    )
  };
};
/*---------- DISPLAY COMPONENT  ----------*/
class Display extends React.Component {
  constructor(props) {
    super(props);
  };
  render() {
    return(
      <div>
        <div id="displayHistory">{this.props.displayHistory}</div>
        <div id="display">{this.props.displayValue}</div>
      </div>
    );
  };
};
/*---------- BUTTON COMPONENT  ----------*/
class Button extends React.Component {
  constructor(props) {
    super(props);
  };
  render() {
    const styling = {
      gridArea: this.props.id,
      minWidth: "4ch",
      minHeight: "4ch"
    };
    return(
      <button id={this.props.id} onClick={() => this.props.action(this.props.id)} style={styling}>{this.props.display}</button>
    );
  };
};
/*---------------------------------*/
ReactDOM.render(
    <ManoApp />
  , document.getElementById('root'));


/*OLD PROGRAM (BACKUP)*
  /*
const NUMBER_ZERO = "zero";
const NUMBER_ONE = "one";
const NUMBER_TWO = "two";
const NUMBER_THREE = "three";
const NUMBER_FOUR = "four";
const NUMBER_FIVE = "five";
const NUMBER_SIX = "six";
const NUMBER_SEVEN = "seven";
const NUMBER_EIGHT = "eight";
const NUMBER_NINE = "nine";
const NUMBER_DECIMAL = "decimal";
const OPERATOR_CLEAR = "clear";
const OPERATOR_DIVIDE = "divide";
const OPERATOR_MULTIPLY = "multiply";
const OPERATOR_SUBTRACT = "subtract";
const OPERATOR_ADD = "add";
const OPERATOR_EQUALS = "equals";
/*app initial state as constant as it is used in clearing calculator*
const INITIAL_STATE = {
  firstDigit: "1",
  secondDigit: "",
  digitToAppend: "",
  firstDigitEntered: false,
  secondDigitEntered: false,
  negativeSign: false,
  operatorSelected: ""
};
/*---------- REACT  ----------*
class ManoApp extends React.Component {
  constructor(props) {
    super(props);   
  };
  render() {
    return (
      <Calculator />
    );
  };
};
/*---------- CALCULATOR MAIN COMPONENT  ----------*
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.actionSelector=this.actionSelector.bind(this);
  };
  /*converting constants to digital numbers*
  convertToNumber(number) {
    switch(number){
      case NUMBER_ZERO:
        return 0;
      case NUMBER_ONE:
        return 1;
      case NUMBER_TWO:
        return 2;
      case NUMBER_THREE:
        return 3;
      case NUMBER_FOUR:
        return 4;
      case NUMBER_FIVE:
        return 5;
      case NUMBER_SIX:
        return 6;
      case NUMBER_SEVEN:
        return 7;
      case NUMBER_EIGHT:
        return 8;
      case NUMBER_NINE:
        return 9;
      case OPERATOR_DIVIDE:
        return "/";
      case OPERATOR_MULTIPLY:
        return "*";
      case OPERATOR_SUBTRACT:
        return "-";
      case OPERATOR_ADD:
        return "+";
      case OPERATOR_EQUALS:
        return "=";
      case NUMBER_DECIMAL:
        return ".";
      default:
        return number;
    };
  };
  /*clear calculator*
  clearCalc() {
    this.setState(INITIAL_STATE);
  }
  /*check if number format is correct with regex*
  checkNumber(currentNumber, pressedNumber) {
    /*NOTE: these regex variables are made so that they will accept correct order in
    which numbers are constructed, either 0.x or x.x, where x is any number.
    So first will pass with 0 -> 0. -> 0.x, but will not accept 00. or 0x etc.
    Second one will pass with any digit except 0 at start, followed by any numbers, dot and numbers again.
    *
    let zeroNumberRegex = /^0$|^0[.]$|^0[.]\d+$/; /*0.xxxxxx*
    let anyNumberRegex = /^[1-9]\d*$|^[1-9]\d*[.]?$|^[1-9]\d*[.]?\d+$/; /*any other number*
    let testNumber = "";
    /*construct number with a pressed symbol for testing it, before approving*
    testNumber = currentNumber.concat(this.convertToNumber(pressedNumber));
    /*check if the number passes regex tests and return true or false*
    if (zeroNumberRegex.test(testNumber)||anyNumberRegex.test(testNumber)) {
      return true;
    } else {
      return false;
    };
  };
  /*SELECT OPERATOR AND QUEUE ACTIONS*
  actionSelector(actionID){
    /*clear calculator*
    if(actionID == OPERATOR_CLEAR) {
      this.clearCalc();
      return;
    };
    switch(actionID){
      case OPERATOR_ADD:
        if(this.state.firstDigitEntered){
          this.setState({secondDigitEntered: true});
        } else {
          this.setState({firstDigitEntered: true});
        };
       this.setState({operatorSelected: actionID});
        break;
      case OPERATOR_SUBTRACT:
        if(this.state.firstDigitEntered){
          this.setState({secondDigitEntered: true});
        } else {
          this.setState({firstDigitEntered: true});
        };
        this.setState({operatorSelected: actionID});
        break;
      case OPERATOR_DIVIDE:
        if(this.state.firstDigitEntered){
          this.setState({secondDigitEntered: true});
        } else {
          this.setState({firstDigitEntered: true});
        };
        this.setState({operatorSelected: actionID});
        break;
      case OPERATOR_MULTIPLY:
        if(this.state.firstDigitEntered){
          this.setState({secondDigitEntered: true});
        } else {
          this.setState({firstDigitEntered: true});
        };
        this.setState({operatorSelected: actionID});
        break;
      case OPERATOR_EQUALS:
        this.setState({operatorSelected: actionID});
        break;
      default:
        this.setState((state) => {
          return {digitToAppend: state.digitToAppend.concat(actionID)}
        });
        break;
    };
    /*Setting first and second digit flags is done.*
  /*call action validator here*
  this.actionValidate();
  console.log("state in actionSelector:"); /*DEBUG*
  console.log(this.state); /*DEBUG*
  };
  /*CHECK, VALIDATE AND EXECUTE QUEUED ACTIONS*
  actionValidate(){
    let numberValid = this.checkNumber(this.state.firstDigit, this.convertToNumber(this.digitToAppend));
    console.log(numberValid);
    if(numberValid){
      console.log("number was valid");
      this.setState((state) => {
        let newNumber;
        newNumber = state.firstDigit.concat(state.digitToAppend);
        return {firstDigit: newNumber};
      });
    };
    console.log("actionValidate() called");
    /*NOTE: this function could be action validator, that calls another function called actionExecute()*
    /*if digit/dot has been passed, check if it is valid to be appended*
                /*if not, break out of this function*
                /*if valid, update digit and break out*
  if(this.digitToAppend == NUMBER_ZERO ||
    this.digitToAppend == NUMBER_ONE ||
    this.digitToAppend == NUMBER_TWO ||
    this.digitToAppend == NUMBER_THREE ||
    this.digitToAppend == NUMBER_FOUR ||
    this.digitToAppend == NUMBER_FIVE ||
    this.digitToAppend == NUMBER_SIX ||
    this.digitToAppend == NUMBER_SEVEN ||
    this.digitToAppend == NUMBER_EIGHT ||
    this.digitToAppend == NUMBER_NINE ||
    this.digitToAppend == NUMBER_DECIMAL) {
    };
    /*check if minus sign was pressed, there is already an operator assigned and second digit exists/entered*
                /*if true, then multiply second digit by -1 to change it's sign to opposite and break out*
    /*check if both digits are entered and operator assigned in state*
                /*if true, then execute the queued actions and do the following:
                  assign the new operator immediately
                  assign answer to first digit
                  set firstDigitEntered to true
                  break out*
    /*check if both digits are entered, operator assigned in state and equal sign was pressed*
                /*if true, then execute the queued actions and set the answer to first digit, rest set to initial state*
  /*if an action is valid, execute it*
  this.actionExecute;
  };
  actionExecute(){
  };
  render() {
    return (
    <div id="calculator">
      <Display displayValue={this.state.displayCurrentValue} displayHistory={this.state.history}/>
      <div id="keypad">
        <Button id={OPERATOR_CLEAR} display="AC" action={this.actionSelector}/>
        <Button id={OPERATOR_DIVIDE} display="/" action={this.actionSelector}/>
        <Button id={OPERATOR_MULTIPLY} display="*" action={this.actionSelector}/>
        <Button id={OPERATOR_SUBTRACT} display="-" action={this.actionSelector}/>
        <Button id={OPERATOR_ADD} display="+" action={this.actionSelector}/>
        <Button id={OPERATOR_EQUALS} display="=" action={this.actionSelector}/>
        <Button id={NUMBER_DECIMAL} display="." action={this.actionSelector}/>
        <Button id={NUMBER_ONE} display="1" action={this.actionSelector}/>
        <Button id={NUMBER_TWO} display="2" action={this.actionSelector}/>
        <Button id={NUMBER_THREE} display="3" action={this.actionSelector}/>
        <Button id={NUMBER_FOUR} display="4" action={this.actionSelector}/>
        <Button id={NUMBER_FIVE} display="5" action={this.actionSelector}/>
        <Button id={NUMBER_SIX} display="6" action={this.actionSelector}/>
        <Button id={NUMBER_SEVEN} display="7" action={this.actionSelector}/>
        <Button id={NUMBER_EIGHT} display="8" action={this.actionSelector}/>
        <Button id={NUMBER_NINE} display="9" action={this.actionSelector}/>
        <Button id={NUMBER_ZERO} display="0" action={this.actionSelector}/>
      </div>
    </div>
    )
  };
};
/*---------- DISPLAY COMPONENT  ----------*
class Display extends React.Component {
  constructor(props) {
    super(props);
  };
  render() {
    return(
      <div>
        <div id="displayHistory">{this.props.displayHistory}</div>
        <div id="display">{this.props.displayValue}</div>
      </div>
    );
  };
};
/*---------- BUTTON COMPONENT  ----------*
class Button extends React.Component {
  constructor(props) {
    super(props);
  };
  render() {
    const styling = {
      gridArea: this.props.id,
      minWidth: "4ch",
      minHeight: "4ch"
    };
    return(
      <button id={this.props.id} onClick={() => this.props.action(this.props.id)} style={styling}>{this.props.display}</button>
    );
  };
};
/*---------------------------------*
ReactDOM.render(
    <ManoApp />
  , document.getElementById('root'));*/