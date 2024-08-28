const dotenv = require('dotenv').config();

let nodeArgs = ['--max-old-space-size=4096'];
if (dotenv.parsed.DEBUG === 'true') nodeArgs.push('--inspect-brk=0.0.0.0:9229');

module.exports = {
  apps: [
    {
      name: dotenv.parsed.PROJECT_NAME,
      script: './dist/index.js',
      node_args: nodeArgs,
      instances: dotenv.parsed.CLUSTER_INSTANCES || 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: dotenv.parsed.NODE_ENV,
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
