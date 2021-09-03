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

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  };

  render() {
    return (
    <div id="calculator">
      <Display />
      <div id="keypad">
        <Button id="clear" display="AC"/>
        <Button id="divide" display="/"/>
        <Button id="multiply" display="*"/>
        <Button id="subtract" display="-"/>
        <Button id="add" display="+"/>
        <Button id="equals" display="="/>
        <Button id="decimal" display="."/>

        <Button id="one" display="1"/>
        <Button id="two" display="2"/>
        <Button id="three" display="3"/>
        <Button id="four" display="4"/>
        <Button id="five" display="5"/>
        <Button id="six" display="6"/>
        <Button id="seven" display="7"/>
        <Button id="eight" display="8"/>
        <Button id="nine" display="9"/>
        <Button id="zero" display="0"/>
      </div>
    </div>
    )
  };

};

class Display extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    return(
      <div id="display">
        <div>Formula</div>
        <div>Answer</div>
      </div>
    );
  };
};

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
      <button id={this.props.id} style={styling}>{this.props.display}</button>
    );
  };
};

/*---------------------------------*/
ReactDOM.render(
    <ManoApp />
  , document.getElementById('root'));