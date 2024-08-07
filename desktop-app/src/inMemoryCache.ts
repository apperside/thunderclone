let password = "";
let _isServiceRunning = false;

const getPassword = () => {
  return password;
};
const setPassword = (p: string) => {
  password = p;
};

const isServiceRunning = () => {
  return _isServiceRunning;
};
const setServiceRunning = (p: boolean) => {
  _isServiceRunning = p;
};

const cacheUtils = {
  getPassword,
  setPassword,
  isServiceRunning,
  setServiceRunning,
};
export default cacheUtils;
