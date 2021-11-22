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

const SINGLE_DIGIT_REGEX = new RegExp('^\d$');/*single digit only*/
const NEGATIVE_REGEX = new RegExp('^[-/*+]\-$');/*two operators, second is minus sign*/
const NOT_NEGATIVE_REGEX = new RegExp('^[-/*+]{2,}\-$');/*more than two any kind of operators*/
const OPERATOR_REGEX = new RegExp('^[-/*+=]$');/*any single operator*/
const ONE_OR_TWO_REGEX = new RegExp("^[/*+-]|^[/*+-]{2}$");/*no more than two operators entered*/
const MORE_THAN_TWO_REGEX = new RegExp("^[/*+-]{3,}$");/*more than two operators entered*/

/*app initial state as constant as it is used in clearing calculator*/
const INITIAL_STATE = {
  firstDigit: 0,
  secondDigit: 0,
  digitToAppend: null,
  decimalPoint: false,
  digitMultiplier: 10,
  finalAnswer: null,
  firstDigitEntered: false,
  secondDigitEntered: false,
  negativeSign: false,
  operatorSelected: "",
  resetFirstDigit: false,
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
      case OPERATOR_CLEAR:
        return "C";
      default:
        console.log("WARNING: default switch executed in converToNumber() function with variable: " + number);
        return number;
    };
  };

  /*MAIN FUNCTION TRIGGER BY BUTTONS*/
  actionSelector(actionID){

    /*clear calculator*/
    if(actionID == OPERATOR_CLEAR){
      this.clearCalc();
      return;
    };

    let anyDigitRegex = new RegExp('^[0-9]$');/*any digit*/
    let anyMathOperator = new RegExp('^[-/*+]$');/*any single math operator except equal*/
    let button = this.convertToNumber(actionID);
    let digit = false;
    let selectOperation = 0;

    /*Digit or operator?*/
    if(anyDigitRegex.test(button)){digit=true};

    switch(digit){
      case true:
        if(!this.state.firstDigitEntered){selectOperation = 1}else{selectOperation = 3};
        break;
      case false:
        if(anyMathOperator.test(button)){selectOperation = 2}else if(button == "="){selectOperation = 5} else {selectOperation = 4};
        break;
    };

    /*should first digit be replaced if next button is a digit after previous operation*/
    if(this.state.resetFirstDigit && digit){
      selectOperation = 1;
      this.setState(INITIAL_STATE);
    };

    /*operator follows second digit (execute operation immediately)*/
    if(this.state.secondDigitEntered && anyMathOperator.test(button)){
      let tempOperator = button;
      this.executeMathOperation(this.state.firstDigit, this.state.secondDigit, this.state.operatorSelected);
      this.setState({
        operatorSelected: button,
        firstDigitEntered: true,
        resetFirstDigit: false,
      });
      return;
    };

    /*operator follows after previous operation with equal was complete*/
    if(this.state.resetFirstDigit && anyMathOperator.test(button)){
      let tempDigitStore = this.state.firstDigit;
      this.clearCalc();
      this.setState({
        firstDigit: tempDigitStore,
        firstDigitEntered: true,
        resetFirstDigit: false,
      });
    };


    /*
    1-first digit
    2-math operator
    3-second digit
    4-decimal point
    5-equal operator
    6-clear calculator
    */
    switch(selectOperation){
      case 1:
        this.setState((state)=>{
          return {firstDigit: this.updateDigit(state.firstDigit, button)}
        });
        break;
      case 2:
        this.updateMathOperator(this.state.operatorSelected, button);
        break;
      case 3:
        this.setState((state)=>{
          return {secondDigit: this.updateDigit(state.secondDigit, button)}
        });
        break;
      case 4:
        this.decimalPoint();
        break;
      case 5:
        this.executeMathOperation(this.state.firstDigit, this.state.secondDigit, this.state.operatorSelected);
        break;
      default:
        console.log("WARNING: actionSelector() called with default switch() case, using variable selectOperation=" + selectOperation);
        return;
    };

    /*Seems a bit dodgy way to ensure that updateDisplay() is called after all math operations are saved to state. But it works...*/
    this.setState({},()=>{this.updateDisplay(); console.log(this.state)});
    
    

  };

  /*EXECUTE OPERATION*/
  executeMathOperation(firstDigit, secondDigit, operator){
    let answer;

    switch(operator){
      case "/":
        answer = firstDigit / secondDigit;
        break;
      case "*":
        answer = firstDigit * secondDigit;
        break;
      case "-":
        answer = firstDigit - secondDigit;
        break;
      case "+":
        answer = firstDigit + secondDigit;
        break;
      default:
        console.log("WARNING: default switch case for executeMathOperation() called with: " + firstDigit + operator + secondDigit);
    };
    console.log("Math: " + firstDigit + operator + secondDigit + "=" + answer);

    /*update state with answer*/
    this.setState(INITIAL_STATE);
    this.setState({firstDigit: answer, resetFirstDigit: true});
  };

  /*CLEAR CALCULATOR*/
  clearCalc() {
    this.setState(INITIAL_STATE);
  };

  /*ADD NEW DIGIT TO THE NUMBER*/
  updateDigit(number, digit){

    /*special case for negativeSign() call*/
    if(digit == "negative"){
      this.setState((state)=>{
        return{secondDigit: state.secondDigit * (-1)};
      });
      return;
    };

    /*set second digit flag to true if first is entered*/
    if(this.state.firstDigitEntered){
      this.setState({secondDigitEntered: true});
    };

    let currentDigit = Math.abs(number);
    let multiplier = this.state.digitMultiplier;
    let finalNumber = 0;

    if(!this.state.decimalPoint) {
      finalNumber = currentDigit * multiplier + digit;
    } else {
      finalNumber = currentDigit + digit * multiplier;
      this.setState({digitMultiplier: multiplier / 10});
    };

    /*check for negative sign*/
    if(this.state.negativeSign){finalNumber = finalNumber * (-1)};

    return finalNumber;
  };

  /*ADD OR UPDATE MATH OPERATOR*/
  updateMathOperator(existingOperator, addOperator){
    let negativeSignRegex = new RegExp('^[-/\*+]-$');/*to test if negative sign is needed*/
    let positiveSignRegex = new RegExp('^[-/\*+][/\*+]$');/*to test if negative sign is NOT needed*/
    let currentOperator = existingOperator;
    let newOperator = addOperator;

    /*set first digit as complete (this is called only once)*/
    if(!this.state.firstDigitEntered){
      this.setState({
        firstDigitEntered: true,
        decimalPoint: false,
        digitMultiplier: 10});
    };

    /*test for negative sign*/
    if(negativeSignRegex.test(currentOperator.concat(newOperator)) && !this.state.negativeSign){
      this.negativeSign();
      console.log("Enable negative sign");
      return;
    } else if(!negativeSignRegex.test(currentOperator.concat(newOperator)) && this.state.negativeSign) {
      this.negativeSign();
      console.log("Disable negative sign");
    };
    
    this.setState({operatorSelected: newOperator});
  };

  /*ADD OR UPDATE DECIMAL POINT*/
  decimalPoint(){
    /*enable decimal point (this is called only once)*/
    if(!this.state.decimalPoint){
      this.setState({
        decimalPoint: true,
        digitMultiplier: 0.1
      });
    };
  };

  /*SET NEGATIVE SIGN FLAG*/
  negativeSign(){
    this.setState((state)=>{
      return {negativeSign: state.negativeSign ? false : true};
    }, this.updateDigit(this.state.secondDigit,"negative"));/*immediately update digit with negative sign*/
  };

  /*UPDATE CALCULATOR DISPLAY*/
  updateDisplay(){
    console.log("updateDisplay() called");

    let displayValue = this.state.displayCurrentValue.toString();
    let displayHistory = this.state.history.toString();

    /*display current digit being entered*/
    if(!this.state.firstDigitEntered){
      displayValue = this.state.firstDigit;
    } else {
      displayValue = this.state.secondDigit;
    };

    /*if round digit with decimal point activated, add .0 to the end*/
    let firstDecimalPoint = new RegExp('^[0-9]{1,}\.?0?$');
    if(firstDecimalPoint.test(displayValue) && this.state.decimalPoint){
      displayValue = displayValue.toString().concat(".0");
    };

    this.setState({
      displayCurrentValue: displayValue,
      history: displayHistory
    }, console.log("updateDisplay() finished executing"));    
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
  
