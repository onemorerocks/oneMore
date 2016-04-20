import cssModules from 'react-css-modules';

export default (component, styles) => {
  return cssModules(component, styles, { allowMultiple: true });
};
