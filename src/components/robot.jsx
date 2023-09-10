import React, { Component } from 'react';
import { Facing } from '../constants/facing.ts'
class Robot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: Number(null),
      y: Number(null),
      facing: null,
      robotIcon: null
    };
  }

  // ************ Helper methods ************ //
  faceNorth() {
    this.setState((prevState) => {
      prevState.facing = Facing.NORTH;
      prevState.robotIcon = "↑";
    });
  }

  faceEast() {
    this.setState((prevState) => {
      prevState.facing = Facing.EAST;
      prevState.robotIcon = "→";
    });
  }

  faceSouth() {
    this.setState((prevState) => {
      prevState.facing = Facing.SOUTH;
      prevState.robotIcon = "↓";
    });
  }

  faceWest() {
    this.setState((prevState) => {
      prevState.facing = Facing.WEST;
      prevState.robotIcon = "←";
    });
  }

  // Helper method to get the robot icon based on facing direction
  getRobotIconForFacing(facing) {
    switch (facing) {
      case Facing.EAST:
        return '→';
      case Facing.SOUTH:
        return '↓';
      case Facing.WEST:
        return '←';
      default:
        return '↑';
    }
  }

  robotNotPlacedYet() {
    this.props.addToLog('Robot has not been placed on the board yet.\n');
  }


  // ************ Lifecycle Methods ************ //
  componentDidMount() {
    if (this.props.command) {
      this.executeCommand(this.props.command);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.command !== prevProps.command) {
      this.executeCommand(this.props.command);

      // Clear the command after execution to allow multiple executions (e.g. move() -> move() -> left() -> left())
      this.props.clearCommand();
    }
  }

  // ************ robot functions ************ //
  // Function to execute a command received from the commandLine compont through the page component
  executeCommand = (command) => {
    if (command === null) {
      // Handle the case where command is null (e.g. initial state)
      return;
    }
    // facing-value can be put into single, double or non quotes at all
    const validCommandRegex = /^(move\(\)|left\(\)|right\(\)|report\(\)|place\(\d,\d,['"]?(NORTH|EAST|SOUTH|WEST)['"]?\))$/
    if (validCommandRegex.test(command)) { // check the validity of the command using the regex
      if (command === 'move()') {
        this.move();
      } else if (command === 'left()') {
        this.left();
      } else if (command === 'right()') {
        this.right();
      } else if (command === 'report()') {
        this.report();
      } else if (command.startsWith('place(') && command.endsWith(')')) {
        const matchingRegex = /^place\((\d+),\s*(\d+),\s*['"]?(\w+)['"]?\)$/; // Regex for extracting parameters
        const match = command.match(matchingRegex);

        if (match) {
          const x = parseInt(match[1], 10); // Parse x as an integer
          const y = parseInt(match[2], 10); // Parse y as an integer
          const facing = match[3].toUpperCase(); // Extract facing as a string

          // Call the place function with the extracted parameters
          this.place(x, y, facing);
        } else {
          this.props.addToLog('Invalid place command format.\n');
        }
      }
    } else {
      this.props.addToLog("The command '" + command + "' is invalid. Please enter a valid command like the following: \n"+
                          "move(), left(), right(), report(), place(x, y, facing)\n");
    }
  };

  move() {
    if (this.state.x == null || this.state.y == null || this.state.facing == null) {
      this.robotNotPlacedYet();
    } else {
      if (this.state.facing === Facing.NORTH && this.state.y < 4) {
        this.setState((prevState) => ({ y: prevState.y + 1 }));
      } else if (this.state.facing === Facing.EAST && this.state.x < 4) {
        this.setState((prevState) => ({ x: prevState.x + 1 }));
      } else if (this.state.facing === Facing.SOUTH && this.state.y > 0) {
        this.setState((prevState) => ({ y: prevState.y - 1 }));
      } else if (this.state.facing === Facing.WEST && this.state.x > 0) {
        this.setState((prevState) => ({ x: prevState.x - 1 }));
      } else {
        this.props.addToLog("Robot can't be moved out of bounds\n");
      }
    }
  }

  left() {
    if (this.state.x == null || this.state.y == null || this.state.facing == null) {
      this.robotNotPlacedYet();
    } else {
      switch (this.state.facing) {
        case (Facing.NORTH): {
          this.faceWest();
          break;
        }
        case (Facing.EAST): {
          this.faceNorth();
          break;
        }
        case (Facing.SOUTH): {
          this.faceEast();
          break;
        }
        default: {
          this.faceSouth();
          break;
        }
      }
    }
  }

  right() {
    if (this.state.x == null || this.state.y == null || this.state.facing == null) {
      this.robotNotPlacedYet();
    } else {
      switch (this.state.facing) {
        case (Facing.NORTH): {
          this.faceEast();
          break;
        }
        case (Facing.EAST): {
          this.faceSouth();
          break;
        }
        case (Facing.SOUTH): {
          this.faceWest();
          break;
        }
        default: {
          this.faceNorth();
          break;
        }
      }
    }
  }

  report() {
    if (this.state.x == null || this.state.y == null || this.state.facing == null) {
      this.robotNotPlacedYet();
    } else {
      this.props.addToLog(this.state.x +', ' + this.state.y + ', ' + this.state.facing + '\n');
    }
  }

  place(xpos, ypos, facing) {
    // Remove single quotes and double quotes from the facing string
    const cleanedFacing = facing.replace(/['"]+/g, '');
    if(xpos > 4 || ypos > 4 || xpos < 0 || ypos < 0) {
      this.props.addToLog("Can't place the robot outside the board\n");
    } else if (Object.values(Facing).includes(cleanedFacing)) { // Check if the cleanedFacing is a valid value in the Facing enum
      // Set state if it's a valid facing value
      this.setState({
        x: xpos,
        y: ypos,
        facing: cleanedFacing,
        robotIcon: this.getRobotIconForFacing(cleanedFacing)
      });
    }
  }

  /**
   * For the sake of simplicity, the robot and the playing field are not seperated into different components.
   * There could be made a further modularization between object logic and visualization
   * */ 
  render() {
    return (
      /* Iterate through rows and cells to create divs and spans. Set span as robot position if coordinates match values in the state */
        <div className='playing-board'>
          {Array.from({ length: 5 }, (_, row) => (
            <div key={row} className='row'>
              {Array.from({ length: 5 }, (_, col) => (
                <span key={col} xpos={col} ypos={row}>
                  {this.state.x === col && this.state.y === row ? (
                    <span className="robot-icon">
                      {this.state.robotIcon}
                    </span>
                  ) : null}
                </span>
              ))}
            </div>
          ))}
        </div>
    );
  }
}

export default Robot;