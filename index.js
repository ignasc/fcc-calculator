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

  /*
  Persidaryti programa:
  - Regex, aprašantis skaičių(priekyje minusas arba nulis tik vienas, vienas taškas etc.)
  - Pradinėje sąlygoje pirmas skaičius visada nulis
  - Kai įvedamas operatorius, tada pradedamas vesti sekantis skaičius
  - Antro skaičiaus pradinė vertė automatiškai yra pirmas skaičius po to, kai įvedamas operatorius,
  tačiau, jei bus vedamas naujas skaičius - overwrite originalą. O kablelio ar minuso atveju nedaryti
  overwrite.
  - Kai įvedamas operatorius antro skaičiaus metu, automatiškai atliekamas prieš tai įvestas matematinis veiksmas,
  ir gautas atsakymas automatiškai priskiriamas prie pirmo skaičiaus, plius įvedamas iš karto operatorius ir
  tuomet vedamas antras skaičius.

  Bonus points: skaičius su minuso ženklu automatiškai apskliaudžiamas.
  PSEUDOKODAS:
  Paspaudus betkurį mygtuką, tikrinama esama skaičiaus vertė su paspaustu simboliu per regex.
    Jei regex tenkina, tuomet ta skaičiu priskiriame prie displayValue.
    Jei netenkina - ignoruojam mygtuko paspaudimą ir atšaukiam visą likusią operaciją.
  Paspaudus operatoriaus mygtuką:
    Pirmiausia tikriname, ar jau yra įvestas pirmas skaičius, ar dar ne
      Jei įvestas, pirmiausia patikriname, ar operatorius paspaustas "-", tokiu atveju antras skaičius padauginamas iš -1, kad pakeisto jo ženklą.
      Tuomet pirmiausia atliekame operaciją su skaičiais, gautą atsakymą priskiriame prie pirmojo kintamojo ir prie action priskiriame operatorių, kurį paspaudėme antrąkart.
      Jei pirmas skaičius nebuvo įvestas, tuomet esama displayValue vertė priskiriama prie valueA.
      Atitinkamas operatorius priskiriamas prie action
  
      regex:
      Pirmas simbolis gali būti belekoks skaičius.
      Jei pirmas simbolis 0: antras simbolis tik taškas.
      Jei pirmas simbolis kitas skaičius: toliau gali būti belekiek skaičių.
      Skaičiuje gali egzistuoti tik vienas taškas.

  */

  /*check if number format is correct with regex*/
  checkNumber(currentNumber, pressedNumber) {
    /*NOTE: these regex variables are made so that they will accept correct order in
    which numbers are constructed, either 0.x or x.x, where x is any number.
    So first will pass with 0 -> 0. -> 0.x, but will not accept 00. or 0x etc.
    Second one will pass with any digit except 0 at start, followed by any numbers, dot and numbers again.
    */
    let zeroNumberRegex = /^0$|^0[.]$|^0[.]\d+$/; /*0.xxxxxx*/
    let anyNumberRegex = /^[1-9]\d*$|^[1-9]\d*[.]?$|^[1-9]\d*[.]?\d+$/; /*any other number*/
    let testNumber = "";

    /*construct number with a pressed symbol for testing it, before approving*/
    testNumber = currentNumber.concat(this.convertToNumber(pressedNumber));
    /*check if the number passes regex tests and return true or false*/
    if (zeroNumberRegex.test(testNumber)||anyNumberRegex.test(testNumber)) {
      console.log("Regex test passed");
      return true;
    } else {
      console.log("Regex test failed");
      return false;
    };
  };

  /*clear calculator*/
  clearCalc() {
    this.setState(INITIAL_STATE);
  }

  actionSelector(action) {
    /*clear calculator*/
    if(action == OPERATOR_CLEAR) {
      this.clearCalc();
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
        this.actionExecution(operator, this.state.valueA, this.state.valueB);
        break;
      default:
        if(this.state.firstDigitEntered && this.checkNumber(secondValue, action)) {
          secondValue = secondValue.concat(this.convertToNumber(action));
        } else if (!this.state.firstDigitEntered && this.checkNumber(firstValue, action)) {
          firstValue = firstValue.concat(this.convertToNumber(action));
        };
        break;
    };

    this.setDisplay(firstValue, secondValue, operator, firstDigitEntered);

    
    console.log(this.state);
  };

  actionExecution(action, valueA, valueB){
    let digitA = parseFloat(valueA);
    let digitB = parseFloat(valueB);
    switch(action){
      case OPERATOR_ADD:
        console.log("add up numbers: " + (digitA + digitB));
        this.setState({displayValue: digitA + digitB});/* NEVEIKIA */
        break;
      case OPERATOR_SUBTRACT:
        console.log("subtract numbers: " + (digitA - digitB));
        break;
      case OPERATOR_DIVIDE:
        console.log("divide numbers: " + (digitA / digitB));
        break;
      case OPERATOR_MULTIPLY:
        console.log("multiply numbers: " + (digitA * digitB));
        break;
      default:
        console.log("WARNING: default case executed in actionExecution()");
        break;
    };
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