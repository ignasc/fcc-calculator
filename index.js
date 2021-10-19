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
  /*Values for display*/
  history: "-", /*top digit (history) on calculator display*/
  displayCurrentValue: 0, /*bottom digit on calculator display*/
  displayOperatorSign: "",
  /*Values for calculation*/
  valueA: "",
  valueB: "",
  actionOperator: "",
  answer: "",
  firstDigitEntered: false,
  secondDigitEntered: false,
  equalOperator: false,
  negativeNumber: false,
  previousOperator: ""
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

  /*clear calculator*/
  clearCalc() {
    this.setState(INITIAL_STATE);
  }

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
      return true;
    } else {
      return false;
    };
  };

  /*SELECT OPERATOR*/
  actionSelector(actionID){
    console.log("actionSelector(" + actionID + ")");
    let firstValue;
    let secondValue;
    let operator;
    let firstDigitEntered;
    let secondDigitEntered;
    let negativeNumber;
    let immediateOperationFollows; /*in case we press operator other than =*/
    let previousOperator; /*first operator to execute before immediate next operator*/

    /*clear calculator*/
    if(actionID == OPERATOR_CLEAR) {
      this.clearCalc();
      return;
    };

    firstValue = this.state.valueA;
    secondValue = this.state.valueB;
    operator = this.state.actionOperator;
    firstDigitEntered = this.state.firstDigitEntered;
    secondDigitEntered = this.state.secondDigitEntered;
    negativeNumber = this.state.negativeNumber;
    immediateOperationFollows = false;
    previousOperator = this.state.actionOperator;

    switch(actionID){
      case OPERATOR_ADD:
        operator = OPERATOR_ADD;
        if(firstDigitEntered && this.state.valueB != ""){
          secondDigitEntered = true;
        };
        firstDigitEntered = true;
        break;
      case OPERATOR_SUBTRACT:
        operator = OPERATOR_SUBTRACT;
        if(firstDigitEntered && this.state.valueB != ""){
          secondDigitEntered = true;
        };
        firstDigitEntered = true;
        break;
      case OPERATOR_DIVIDE:
        operator = OPERATOR_DIVIDE;
        if(firstDigitEntered && this.state.valueB != ""){
          secondDigitEntered = true;
        };
        firstDigitEntered = true;
        break;
      case OPERATOR_MULTIPLY:
        operator = OPERATOR_MULTIPLY;
        if(firstDigitEntered && this.state.valueB != ""){
          secondDigitEntered = true;
        };
        firstDigitEntered = true;
        break;
      case OPERATOR_EQUALS:
        if(!this.state.firstDigitEntered || this.state.secondDigitEntered){
          break;
        };
        this.setState((state) => {
          return {
          equalOperator: true,
          firstDigitEntered: firstDigitEntered,
          secondDigitEntered: secondDigitEntered
          };
        });
        previousOperator = "";
        break;
      default:
        if(this.state.firstDigitEntered && this.checkNumber(secondValue, actionID)) {
          secondValue = secondValue.concat(this.convertToNumber(actionID));
        } else if (!this.state.firstDigitEntered && this.checkNumber(firstValue, actionID)) {
          firstValue = firstValue.concat(this.convertToNumber(actionID));
        };
        break;
    };

    /*queue current actions to be executed*/
    this.setState((state)=>{
      return {
        valueA: firstValue,
        valueB: secondValue,
        actionOperator: operator,
        firstDigitEntered: firstDigitEntered,
        secondDigitEntered: secondDigitEntered,
        previousOperator: previousOperator
      };
    });
    /*execute current actions (including one followed by another operator)*/
    /*first check if we already have operator pending and we pressed new operator*/
    if(this.state.previousOperator != ""){
      let saveCurrentOperator = this.state.actionOperator;
      this.setState((state) => {
        return {
        actionOperator: state.previousOperator
        }
      });

      this.executeActions(this.state);

      this.setState(
        {
        actionOperator: saveCurrentOperator
        }
      );
    };
    this.executeActions(this.state);
    /*display values on calculator*/
    this.displayValues();
    console.log(this.state);
  };

  /*EXECUTE ACTIONS*/
  executeActions(state){
    /*check if action execution is valid and possible*/
    let falseAction = true;

    if(state.equalOperator){
      falseAction = false;
    };

    if(state.valueA != "" && state.valueB != "" && state.equalOperator){
      falseAction = false;
    };

    if(state.valueA != "" && state.valueB != "" && !state.equalOperator && state.actionOperator != ""){
      falseAction = false;
    };

    if(falseAction){
      return;
    };
    /*END of checking action execution validity*/

    /*executing operations*/
    let digitA = parseFloat(state.valueA);
    let digitB = parseFloat(state.valueB);
    let finalAnswer;

    if(state.negativeNumber) {
      digitB *= -1;
    }

    switch(state.actionOperator){
      case OPERATOR_ADD:
        finalAnswer = digitA + digitB;
        break;
      case OPERATOR_SUBTRACT:
        finalAnswer = digitA - digitB;
        break;
      case OPERATOR_DIVIDE:
        finalAnswer = digitA / digitB;
        break;
      case OPERATOR_MULTIPLY:
        finalAnswer = digitA * digitB;
        break;
      default:
        console.log("WARNING: default case executed in actionExecution()");
        break;
    };
    
    /*final state update*/
    this.setState(
      {
        answer: finalAnswer,
        valueA: finalAnswer,
        valueB: "",
        firstDigitEntered: true,
        secondDigitEntered: false,
        equalOperator: false,
        negativeNumber: false,
        actionOperator: ""
      }
    );
  };

  /*DISPLAY VALUES*/
  displayValues(){
    this.setState((state) => {
      let firstNumber = state.valueA;
      let secondNumber = state.valueB;
      let actionOperator = state.actionOperator;
      let history = "";
      /*construct history value*/
      history = firstNumber + actionOperator + secondNumber;

      return {
        displayCurrentValue: state.valueA,
        history: history
      };
    });
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




/*OLD PROGRAM (BACKUP)*/


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
  displayValue: 0,
  history: "-",
  valueA: "",
  valueB: "",
  action: "",
  answer: "",
  firstDigitEntered: false,
  negativeNumber: false
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

  /*formating values for display and setting state*
  setDisplay(firstValue, secondValue, operator, firstDigitEntered, negativeNumber) {
    this.setState((state) => {
      let negativeSign = "";
      let frontBracket = "";
      let backBracket = "";
      if(state.negativeNumber){
        negativeSign = "-";
        frontBracket = "("
        backBracket = ")";
      }
      return {
      history: firstValue + this.convertToNumber(operator) + frontBracket + negativeSign + secondValue + backBracket,
      displayValue: state.answer != "" ? state.answer : firstDigitEntered ? negativeSign + secondValue : firstValue,
      valueA: firstValue,
      valueB: secondValue,
      action: operator,
      firstDigitEntered: firstDigitEntered,
      }
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
      console.log("Regex test passed");
      return true;
    } else {
      console.log("Regex test failed");
      return false;
    };
  };

  actionSelector(action) {
    let firstValue;
    let secondValue;
    let operator;
    let firstDigitEntered;
    let negativeNumber;

    /*clear calculator*
    if(action == OPERATOR_CLEAR) {
      this.clearCalc();
      return;
    };

    firstValue = this.state.valueA;
    secondValue = this.state.valueB;
    operator = this.state.action;
    firstDigitEntered = this.state.firstDigitEntered;
    negativeNumber = this.state.negativeNumber;
    

    switch(action){
      case OPERATOR_ADD:
        operator = OPERATOR_ADD;
        if(secondValue!=""){
          this.actionExecution(operator, this.state.valueA, this.state.valueB, this.state.negativeNumber);
          break;
        };
        firstDigitEntered = true;
        break;
      case OPERATOR_SUBTRACT:
        if(firstDigitEntered){/* for making negative number *
          this.setState({negativeNumber: true})
          break;
        }
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
        this.actionExecution(operator, this.state.valueA, this.state.valueB, this.state.negativeNumber);
        break;
      default:
        if(this.state.firstDigitEntered && this.checkNumber(secondValue, action)) {
          secondValue = secondValue.concat(this.convertToNumber(action));
        } else if (!this.state.firstDigitEntered && this.checkNumber(firstValue, action)) {
          firstValue = firstValue.concat(this.convertToNumber(action));
        };
        break;
    };


    this.setDisplay(firstValue, secondValue, operator, firstDigitEntered, negativeNumber);

    
    console.log(this.state);
  };

  actionExecution(action, valueA, valueB, negativeSign){
    let digitA = parseFloat(valueA);
    let digitB = parseFloat(valueB);

    if(negativeSign) {
      digitB *= -1;
    }

    switch(action){
      case OPERATOR_ADD:
        this.setState({answer: digitA + digitB});
        break;
      case OPERATOR_SUBTRACT:
        this.setState({answer: digitA - digitB});
        break;
      case OPERATOR_DIVIDE:
        this.setState({answer: digitA / digitB});
        break;
      case OPERATOR_MULTIPLY:
        this.setState({answer: digitA * digitB});
        break;
      default:
        console.log("WARNING: default case executed in actionExecution()");
        break;
    };

    /*after operation with digits is performed, clear calculator and asign answer to the first digit*/
    /*this function can be optimised, no need to have separate answer variable in state *
    
    this.setState((state) => {
      let answer = state.answer;
      console.log("before update:");
      console.log(state);
      return {
        displayValue: answer,
        valueA: answer,
        valueB: "",
        action: "",
        firstDigitEntered: false,
        TESTAS: "TESTAS"
      };
    });

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
  , document.getElementById('root'));
  */