export default (messageOrNestedError, optionalNestedError) => {

  let message = messageOrNestedError;
  let nestedError = optionalNestedError;
  if (messageOrNestedError.message && messageOrNestedError.stack) {
    nestedError = messageOrNestedError;
    message = null;
  }

  if (message && typeof message === 'object') {
    message = JSON.stringify(message);
  }

  if (!nestedError) {
    return new Error(message);
  } else if (message) {
    return new Error(message + '\ncaused by:\n' + nestedError.stack);
  } else {
    return nestedError;
  }

};
