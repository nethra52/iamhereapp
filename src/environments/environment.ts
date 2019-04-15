const env = {
  'prod': {
    production: true,
    apiUrl: 'http://192.168.0.30:3000/',
  },
  'dev': {
    production: false,
    apiUrl: 'https://iamhereapi.herokuapp.com/',
  },
  'local': {
    production: false,
    apiUrl: 'http://localhost:3000/',
  }
};

// tslint:disable-next-line: no-use-before-declare
const ENVIRONMENT = env[environments.TESTING];
export default ENVIRONMENT;

const enum environments {
  PRODUCTION = 'prod',
  TESTING = 'dev',
  LOCAL = 'local'
}
