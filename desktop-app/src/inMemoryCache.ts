let token = "";
let _isServiceRunning = false;

const getToken = () => {
  return token;
};
const setToken = (t: string) => {
  token = t;
};

const isServiceRunning = () => {
  return _isServiceRunning;
};
const setServiceRunning = (p: boolean) => {
  _isServiceRunning = p;
};

const cacheUtils = {
  getToken,
  setToken,
  isServiceRunning,
  setServiceRunning,
};
export default cacheUtils;
