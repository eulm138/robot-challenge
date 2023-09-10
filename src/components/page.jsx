import React, { Component } from 'react';
import Robot from './robot.jsx';
import CommandLine from './commandLine.jsx';

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      command: null,
      log: '',
    };
    this.textareaRef = React.createRef(); // Create a ref for the textarea
  }

  // ************ Lifecycle Methods ************ //
  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate(prevProps, prevState) {
    // Whenever the log is updated, scroll to the bottom
    if (prevState.log !== this.state.log) {
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    if (this.textareaRef.current) {
      this.textareaRef.current.scrollTop = this.textareaRef.current.scrollHeight;
    }
  }

  addToLog = (logEntry) => {
    this.setState({ log: '' + this.state.log + logEntry });
  }

  // ************ Command Methods ************ //
  setCommand = (command) => {
    this.setState({ command });
  }

  clearCommand = () => {
    this.setState({ command: null });
  }

  render() {
    return (
      <div className='content'>
        <h1>Robot challenge</h1>
        <div className='flex-wrapper'>
          <Robot
            command={this.state.command}
            clearCommand={this.clearCommand}
            addToLog={this.addToLog}
          />
          <br />
          <CommandLine setCommand={this.setCommand} />
          <br />
          <textarea
            ref={this.textareaRef}
            disabled={true}
            rows={10}
            cols={60}
            value={this.state.log}>
          </textarea>
        </div>
      </div>
    );
  }
}

export default Page;