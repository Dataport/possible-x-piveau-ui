function decode(token) {
  const base64Url = token.split('.')[1];
  return JSON.parse(window.atob(base64Url));
}

function encode() {
  return true;
}
export {
  decode,
  encode,
};
