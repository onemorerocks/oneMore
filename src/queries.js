import Relay from 'react-relay';

export const homeQuery = {
  login: (Component) => Relay.QL`
      query LoginQuery {
        login { ${Component.getFragment('login')} },
      }
    `
};
