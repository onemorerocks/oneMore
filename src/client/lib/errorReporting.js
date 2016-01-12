export default () => {

  if (process.env.NODE_ENV === 'production') {
    const AirbrakeClient = require('airbrake-js');
    const airbrake = new AirbrakeClient();
    airbrake.setHost('http://192.168.99.100:5000');
    airbrake.setProject('105cd6c8fb856a26f8ab0fa2f866337a', '105cd6c8fb856a26f8ab0fa2f866337a');

    airbrake.addFilter((notice) => {
      notice.context.version = '1.0.0';
      return notice;
    });

    window.onerror = (errorMsg, url, lineNumber, column, errorObj) => {
      if (errorObj) {
        airbrake.notify(errorObj);
      } else {
        airbrake.notify('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
      }
    };
  }

};
