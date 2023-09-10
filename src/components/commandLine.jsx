import React, { Component } from 'react';

class CommandLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: ''
    };
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { inputValue } = this.state;
    // Remove all whitespaces, send the command to the parent component and clear the command line
    this.props.setCommand(inputValue.replace(/\s/g, ""));
    this.setState({ inputValue: '' });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Enter command..."
          value={this.state.inputValue}
          onChange={this.handleInputChange}
        />
        <button type="submit" disabled={!(this.state.inputValue.length > 0)}>Execute</button>
      </form>
    );
  }
}

export default CommandLine;