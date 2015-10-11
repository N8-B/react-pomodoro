let React = require('react');
let Pomodoro = require('./Pomodoro.jsx');

let App = React.createClass ({
  render: function () {
    return (
      <Pomodoro />
    );
  }
});

module.exports = App;
