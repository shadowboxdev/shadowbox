const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'http://localhost:3333',
    secure: true,
    changeOrigin: true
  }
];

module.exports = PROXY_CONFIG;
