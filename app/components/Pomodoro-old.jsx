const React = require('react');

let formatSeconds = (sec) => {
  let seconds = ("0" + sec % 60).slice(-2);
  let minutes = Math.floor(sec / 60);
  return minutes + ":" + seconds;
}

let DEFAULT_START: 25,
    DEFAULT_BREAK: 5;

const Pomodoro = React.createClass({

  // Get initial state for compnents
  getInitialState: function() {
    return {
      isRunning: false,
      sessionStart: 1 * 10,
      breakStart: 1 * 10,
      initialStart: 0,
      session: 1,
      break: 1,
      clock: 0,
      secondsElapsed: 0,
      timer: null,
      mode: 'session',
      bgColor: {
        'session': 'tomato',
        'break': 'forestgreen'
      }
    };
  },
  // Countdown magic happens here
  countDown: function () {
    this.setState({
      isRunning: true
    });
    if (this.state.mode === 'session') {
      let timeRemaining = this.state.sessionStart - this.state.clock;
      this.setState({
        clock: this.state.sessionStart - this.state.secondsElapsed,
        initialStart: this.state.sessionStart
      });
      if (timeRemaining <= 0) {
        this.done();
      } else {
        this.setState({
          clock: this.state.clock - 1,
          secondsElapsed: this.state.secondsElapsed + 1
        });
        this.state.timer = setTimeout(this.countDown, 1000);
      }
    } else {
      let timeRemaining = this.state.breakStart - this.state.clock;
      this.setState({
        clock: this.state.breakStart - this.state.secondsElapsed,
        initialStart: this.state.breakStart
      });
      if (timeRemaining <= 0) {
        this.done();
      } else {
        this.setState({
          clock: this.state.clock - 1,
          secondsElapsed: this.state.secondsElapsed + 1
        });
        this.state.timer = setTimeout(this.countDown, 1000);
      }
    }
  },
  // Handle timer state and logic once time has run out for both session and break
  done: function() {
    if (this.state.mode === 'session') {
      console.log("Session done!");
      clearTimeout(this.state.timer);
      this.setState({
        isRunning: false,
        mode: 'break',
        clock: this.state.breakStart,
        secondsElapsed: 0
      });
      this.countDown();
    } else {
      console.log("Break done!");
      clearTimeout(this.state.timer);
      this.setState({
        isRunning: false,
        mode: 'session',
        clock: this.state.sessionStart,
        secondsElapsed: 0
      });
      this.countDown();
    }
  },
  // clearTimeout, reset the timer to initial session start and set mode to "session"
  resetTimer: function() {
    clearTimeout(this.state.timer);
    this.setState({
      isRunning: false,
      clock: this.state.sessionStart,
      mode: 'session',
      secondsElapsed: 0
    });
  },
  // Kick off countdown by calling ot countDown function
  handleStartClick: function () {
    this.countDown();
  },
  // Stop/pause timer
  handleStopClick: function () {
    this.setState({
      isRunning: false,
      clock: this.state.clock
    });
    clearTimeout(this.state.timer);
  },

  handleBreakChange: function(e) {
    this.state.break = parseInt(e.target.value);
  },

  handleSessionChange: function (e) {
    this.state.session = parseInt(e.target.value);
  },

  render: function() {
    return (
      <div>
        <ProgressBarComponent
          initialStart={this.state.initialStart}
          secondsElapsed={this.state.secondsElapsed}
          sessionStart={this.state.sessionStart}
          breakStart={this.state.breakStart}
          mode={this.state.mode}
          bgColor={this.state.bgColor} />

        <SessionClockComponent
          isRunning={this.state.isRunning}
          sessionStart={this.state.sessionStart}
          breakStart={this.state.breakStart}
          clock={this.state.clock}
          secondsElapsed={this.state.secondsElapsed}
          mode={this.state.mode}
          onStartClick={this.handleStartClick}
          onStopClick={this.handleStopClick}
          onBreakChange={this.handleBreakChange}
          onSessionChange={this.handleSessionChange} />
      </div>
    );
  }
});

const SessionClockComponent = React.createClass({
  render: function() {
    return (
      <div>
        <div className="container">
          <div className="pomodoro">
            <h1 className="uppercase title">Pomodoro Timer</h1>
            <div className="timer-options">
              <label htmlFor="Break">Break:</label>
              <input name="Break"
                     className="break"
                     type="number"
                     value={this.props.breakStart} min="1" max="60"
                     onChange={this.props.onBreakChange} />
                   <label htmlFor="Session">Session:</label>
              <input name="Session"
                     className="session"
                     type="number"
                     value={this.props.sessionStart} min="1" max="60"
                     onChange={this.props.onSessionChange} />
            </div>
            <h1 className="timer">{ formatSeconds(this.props.clock) }</h1>
            <p>Seconds elapsed: {this.props.secondsElapsed}</p>
            {(!this.props.isRunning)
              ? <button type="button" onClick={this.props.onStartClick}>Start</button>
              : <button type="button" onClick={this.props.onStopClick}>Stop</button>
            }
            </div>
        </div>
      </div>
    );
  }
});

const ProgressBarComponent = React.createClass({
  render: function() {
    let fill = {
      'width': (this.props.initialStart-this.props.secondsElapsed)*100/this.props.initialStart + '%',
      'backgroundColor': (this.props.mode == 'session' ? this.props.bgColor.session : this.props.bgColor.break)
    };

    return (
      <div className="progress-bar" style={fill}>
      </div>
    );
  }
});

module.exports = Pomodoro;
