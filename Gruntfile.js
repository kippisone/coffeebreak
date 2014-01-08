module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      jshintrc: '.jshintrc',
      files: {
        src: ['modules/**/*.js', 'routes/**/*.js', 'tests/**/*.js', 'example/**/*.js', '*.js', '*.json']
      }
    },
    mochacli: {
      options: {

      },
      files: ['tests/**/*.spec.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-cli');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('test', ['mochacli']);

};