export default (str) => {
  const parser = new DOMParser();
  return parser.parseFromString(str, 'text/html');
};
