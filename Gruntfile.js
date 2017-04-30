module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsonlint: {
      files: ['scene_exceptions/scene_exceptions.json']
    },
    jshint: {
      files: ['Gruntfile.js']
    },
    watch: {
      files: ['<%= jsonlint.files %>', '<%=jshint.files %>', 'sb_network_timezones/network_timezones.txt'],
      tasks: ['jshint', 'jsonlint', 'tzlint']
    },
    exec: {
        updateNetworks: {cmd: 'python sb_network_timezones/update_networks_list.py'}
    }
  });

  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('test', ['jshint', 'jsonlint', 'tzlint']);

  grunt.registerTask('default', ['jshint', 'jsonlint', 'tzlint']);
  
  grunt.registerTask('tzlint', function() {
    missing = 0;
    buf = grunt.file.read('sb_network_timezones/network_timezones.txt');
    if (! /$\n/gm.test(buf)) {
      grunt.fatal('Linefeed has to be \\n');
    }
    lines = buf.trim().split('\n');
    lines.forEach(function(line) {
      if (! /^.+:[\w/]*$/.test(line)) {
        grunt.fatal('Syntax error: [ ' + line + ' ]');
      }

      sep = line.lastIndexOf(':');
      network = line.slice(0, sep);
      timezone = line.slice(sep + 1);

      if (!timezone) {
        missing += 1;
      }
    });
    
    grunt.log.ok('Network timezones file successfully verified.');
    grunt.log.ok('Total networks: ' + lines.length);
    grunt.log.warn('Missing time zones: ' + missing);
  });
  
  grunt.registerTask('update-networks', ['exec:updateNetworks']);
};
