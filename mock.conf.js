module.exports = {
  moduleName: 'httpBackendMock',
  files: [
    'sample/*.js',
    'sample/**/*.js',
  ],
  isDebug: process.env.NODE_ENV === 'development',
};