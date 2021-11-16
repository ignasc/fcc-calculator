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

const NEGATIVE_REGEX = new RegExp('^[-/*+]\-$');/*two operators, second is minus sign*/
const NOT_NEGATIVE_REGEX = new RegExp('^[-/*+]{2,}\-$');/*more than two any kind of operators*/
const OPERATOR_REGEX = new RegExp('^[-/*+=]$');/*any single operator*/
const ONE_OR_TWO_REGEX = new RegExp("^[/*+-]|^[/*+-]{2}$");/*no more than two operators entered*/
const MORE_THAN_TWO_REGEX = new RegExp("^[/*+-]{3,}$");/*more than two operators entered*/

/*app initial state as constant as it is used in clearing calculator*/
const INITIAL_STATE = {
  firstDigit: 0,
  secondDigit: "",
  digitToAppend: null,
  decimalPoint: false,
  digitMultiplier: 10,
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
        return number;
    };
  };

  /*MAIN FUNCTION TRIGGER BY BUTTONS*/
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
        this.updateDigit(actionID);
        break;
      default:
        this.updateDigit(this.convertToNumber(actionID));
        break;
    };
    /*DEBUG: console.log in a setState callback to force state update before outputing into console*/
    this.setState({},()=>{console.log(this.state)});
    this.updateDisplay(actionID);
  };

  /*clear calculator*/
  clearCalc() {
    this.setState(INITIAL_STATE);
  };

  /*set digit to negative number*/
  negativeSign(){
    /*only call this setState once as all consequtive sign handling is done in updateDigit()*/
    if(this.state.negativeSign){
      return;
    }else{
      this.setState((state)=>{
	return{
	  negativeSign: true,
	  secondDigit: state.secondDigit * (-1)
	};
      });
    };
    
  };

  /*update digit with new pressed number*/
  updateDigit(digit){

    /*check if decimal point was pressed*/
    if(digit == NUMBER_DECIMAL){
      /*check if it is already initialised to avoid reseting multiplier*/
      if(this.state.decimalPoint){
        return;
      } else {
        this.setState({
          decimalPoint: true,
          digitMultiplier: 0.1
        });
      };
      return;
      /*and finish updateDigit() call, no need to do anything else*/
    };

    /*Math.abs is used to remove negative sign if it is present*/
    let currentDigit = this.state.firstDigitEntered ? Math.abs(this.state.secondDigit) : Math.abs(this.state.firstDigit);
    let negativeSign = this.state.negativeSign ? true : false;

    /*check if first digit is already entered*/
    if(this.state.firstDigitEntered){

      console.log("update second digit with " + digit);
      currentDigit = this.state.decimalPoint ? currentDigit + digit*this.state.digitMultiplier : currentDigit*10 + digit;

      /*set multiplier to next decimal place if decimalPoint flag is true*/
      if(this.state.decimalPoint){
        this.setState((state)=>{
          return {digitMultiplier: state.digitMultiplier * 0.1};
        });
      };

    } else {
      console.log("update first digit with " + digit);
      currentDigit = this.state.decimalPoint ? currentDigit + digit*this.state.digitMultiplier : currentDigit*10 + digit;

      /*set multiplier to next number if it is decimal point*/
      if(this.state.decimalPoint){
        this.setState((state)=>{
          return {digitMultiplier: state.digitMultiplier * 0.1};
        });
      };
    };

    /*update state with a new number (also check if negative sign is needed)*/
    if(this.state.firstDigitEntered){
      this.setState({secondDigit: negativeSign ? currentDigit * (-1) : currentDigit});
    }
    else {
      this.setState({firstDigit: negativeSign ? currentDigit * (-1) : currentDigit});
    };
  };

  /*check if the new number would be valid*/
  validateDigit(currentNumber, digitToAppend){
    console.log("Check to append " + digitToAppend + " to number " + currentNumber);

  };

  /*check if decimal point is needed*/
  decimalPoint(){
    console.log("decimalPoint() called");
    if(this.state.decimalPoint){
      return true;
    } else {
      return false;
    };
  };

  updateOperator(actionID){

    /*check for negative sign for second digit*/
    let NEGATIVE_REGEX = new RegExp('^[-/*+]\-$');
    if(this.state.firstDigitEntered && this.state.operatorSelected != "" && NEGATIVE_REGEX.test(this.state.operatorSelected.concat(this.convertToNumber(actionID)))){
      console.log("convert to negative number");
      this.negativeSign();
    };
    /*if more than two operators, remove negative sign from second digit*/
    let NOT_NEGATIVE_REGEX = new RegExp('^[-/*+]{2,}\-$');
    if(this.state.firstDigitEntered && NOT_NEGATIVE_REGEX.test(this.state.operatorSelected.concat(this.convertToNumber(actionID)))){
      console.log("convert back to positive number");
      this.setState({negativeSign: false});
    };

    /*execute actions if conditions are met*/
    let OPERATOR_REGEX = new RegExp('^[-/*+=]$');
    if(this.state.firstDigitEntered && this.state.secondDigit != "" && OPERATOR_REGEX.test(this.convertToNumber(actionID))){
      this.executeOperation(actionID);
      return;
    };

    /*to prevent adding equal to operators*/
    if(actionID == OPERATOR_EQUALS){console.log("updateOperator() called with EQUAL parameter");return;};

    /*first digit entered (set it only once)*/
    if(!this.state.firstDigitEntered){
      this.setState({
        firstDigitEntered: true,
        decimalPoint: false,
        digitMultiplier: 10
      });
    };

    this.setState((state)=>{
      return{operatorSelected: state.operatorSelected.concat(this.convertToNumber(actionID))};
      }, ()=>{console.log("Operator check: " + this.state.operatorSelected)
    });
  };

  executeOperation(actionID){
    let answer;
    let operator = this.state.operatorSelected;
    let newOperator = "";

    let ONE_OR_TWO_REGEX = new RegExp("^[/*+-]|^[/*+-]{2}$");/*no more than two operators entered*/
    let MORE_THAN_TWO_REGEX = new RegExp("^[/*+-]{3,}$");/*more than two operators entered*/

    /*DEBUG*/
    console.log("updateDigit() executed with the following settings:");
    console.log("First Digit: " + this.state.firstDigit);
    console.log("Second Digit: " + this.state.secondDigit);
    console.log("Operator: " + this.state.operatorSelected);
    console.log("New operator: " + actionID);

    /*filter out correct operator*/
    if(ONE_OR_TWO_REGEX.test(operator)){
      console.log("Two operators and select first one: " + operator[0]);
      operator = operator[0];
    } else if(MORE_THAN_TWO_REGEX.test(operator)){
      console.log("More than two operators, select last one: " + operator[operator.length-1]);
      operator = operator[operator.length-1];
    } else{
      console.log("WARNING: executeOperation() called with unknown operator: " + operator);
    };


    switch(operator){
      case "/":
        answer = this.state.firstDigit / this.state.secondDigit;
        break;
      case "*":
        answer = this.state.firstDigit * this.state.secondDigit;
        break;
      case "-":
        answer = this.state.firstDigit - this.state.secondDigit;
        break;
      case "+":
        answer = this.state.firstDigit + this.state.secondDigit;
        break;
      case "=":
        console.log("WARNING: equals switch reached in executeOperation()");
        break;
    };
    console.log("updateDigit() executed: " + this.state.firstDigit + " " + actionID + " " + this.state.secondDigit + " and the answer is " + answer);

    
    this.setState(INITIAL_STATE);
    this.setState({
      firstDigit: answer,
      firstDigitEntered: true
    }, ()=>{console.log(this.state)});

    if(actionID != OPERATOR_EQUALS){
       this.setState({
         operatorSelected: this.convertToNumber(actionID)
       }, ()=>{console.log("New operator set to: " + this.state.operatorSelected)});
    };
  };

  updateDisplay(actionID){
  /*Available parameters to use:

  firstDigit: 0,
  secondDigit: "",
  digitToAppend: null,
  decimalPoint: false,
  digitMultiplier: 10,
  finalAnswer: null,
  firstDigitEntered: false,
  secondDigitEntered: false,
  negativeSign: false,
  operatorSelected: "",
  displayCurrentValue: 0,
  history: ""

  */

  let firstDisplayDigit = this.formatForDisplay(this.state.firstDigit,1);
  let secondDisplayDigit = this.formatForDisplay(this.state.secondDigit,2);
  let operatorDisplay = this.formatForDisplay(this.state.operatorSelected,3);

  console.log("Formated display: " firstDisplayDigit + operatorDisplay + secondDisplayDigit);

  /*If equal is pressed, clear the history, otherwise keep adding to it.*/
  };

  formatForDisplay(digit, selector){/*Selector: 1-first digit, 2-second digit, 3-operator*/

  let formatedDigit = "";
  let formatedOperator = "";
  let minusSign = "-";
  let singleDigitRegex = new RegExp('^\d$');

    switch(selector){
      case 1:
      case 2:

        /*if not entered, skip*/
        if(digit == ""){
          return "";
        };

        digit = Math.abs(digit);
        formatedDigit = digit;

        /*single round digit with decimalPoint activated - add .0 at the end*/
        if(singleDigitRegex.test(digit) && this.state.decimalPoint){
          formatedDigit = digit.concat(".0");
        } else{
          formatedDigit = digit;
        };

        /*check if negative sign is needed*/
        if(this.state.negativeSign && this.state.firstDigitEntered){
          formatedDigit = minusSign.concat(formatedDigit);
        };

        return formatedDigit;

      break;
      case 3:
	console.log("formatForDisplay() called to format operator");
	if(ONE_OR_TWO_REGEX.test(digit)){
	  formatedOperator = digit[0];
	} else if(MORE_THAN_TWO_REGEX.test(operator)){
	  formatedOperator = digit[digit.length-1];
	} else {formatedOperator = digit};

	return formatedOperator;

      break;
      default:
	console.log("WARNING: formatForDisplay() reached default switch state with " + selector);
      break;
    };
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
