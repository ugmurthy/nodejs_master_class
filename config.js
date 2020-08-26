/* 
Configuration file
 */

const env = require("process")

// create an empty object 
var environments = {};


// Staging object
environments.staging = {
    'httpPort': 3000,
    'httpsPort':3001,
    'envName': 'staging'
};

environments.production = {
    'httpPort':5000,
    'httpsPort':5001,
    'envName': 'production'
};

// determine which env was passed as a command line arg
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
// check that curr env is one of the keys in environments
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;

