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
  displayValue: 0,
  history: "-",
  valueA: "",
  valueB: "",
  action: "",
  answer: "",
  firstDigitEntered: false
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
        return number;
    };
  };

  /*formating values for display and setting state*/
  setDisplay(firstValue, secondValue, operator, firstDigitEntered) {
    this.setState({
      history: firstValue + this.convertToNumber(operator) + secondValue,
      displayValue: firstDigitEntered ? secondValue : firstValue,
      valueA: firstValue,
      valueB: secondValue,
      action: operator,
      firstDigitEntered: firstDigitEntered
    });
    
  };

  actionSelector(action) {

    if(action == OPERATOR_CLEAR) {
      this.setState(INITIAL_STATE);
      return;
    };

    let firstValue = this.state.valueA;
    let secondValue = this.state.valueB;
    let operator = this.state.action;
    let firstDigitEntered = this.state.firstDigitEntered;
    

    switch(action){
      case OPERATOR_ADD:
        operator = OPERATOR_ADD;
        firstDigitEntered = true;
        break;
      case OPERATOR_SUBTRACT:
        operator = OPERATOR_SUBTRACT;
        firstDigitEntered = true;
        break;
      case OPERATOR_DIVIDE:
        operator = OPERATOR_DIVIDE;
        firstDigitEntered = true;
        break;
      case OPERATOR_MULTIPLY:
        operator = OPERATOR_MULTIPLY;
        firstDigitEntered = true;
        break;
      case OPERATOR_EQUALS:
        console.log("Answer calculation to be implemented");
        break;
      default:
        if(this.state.firstDigitEntered) {
          secondValue = secondValue.concat(this.convertToNumber(action));
        } else {
          firstValue = firstValue.concat(this.convertToNumber(action));
        };
        break;
    };

    this.setDisplay(firstValue, secondValue, operator, firstDigitEntered);

    
    console.log(this.state);
  };

  render() {
    return (
    <div id="calculator">
      <Display displayValue={this.state.displayValue} displayHistory={this.state.history}/>
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