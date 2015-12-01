'use strict';

module.exports = function (grunt) {
  var localConfig;
  try {
    localConfig = require('./server/config/local.env');
  } catch(e) {
    localConfig = {};
  }

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn',
    injector: 'grunt-asset-injector',
    buildcontrol: 'grunt-build-control'
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    pkg: grunt.file.readJSON('package.json'),
    settings: {
      // configurable paths
      client: require('./bower.json').appPath || 'client',
      dist: 'dist'
    },
    express: {
      options: {
        port: process.env.PORT || 8080
      },
      dev: {
        options: {
          script: 'server/server.js',
          debug: true
        }
      },
      prod: {
        options: {
          script: 'dist/server/server.js'
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },
    watch: {
      injectJS: {
        files: [
          '!<%= settings.client %>/app/mesh_app.js',
          '<%= settings.client %>/{app,components}/**/*.js'
          ],
        tasks: ['injector:scripts']
      },
      injectCss: {
        files: [
          '<%= settings.client %>/{app,components}/**/*.css'
        ],
        tasks: ['injector:css']
      },
      // injectSass: {
      //   files: [
      //     '<%= settings.client %>/{app,components}/**/*.{scss,sass}'],
      //   tasks: ['injector:sass']
      // },
      sass: {
        files: [
          '<%= settings.client %>/{app,components}/**/*.{scss,sass}'],
        tasks: ['sass', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '{.tmp,<%= settings.client %>}/{app,components}/**/*.css',
          '{.tmp,<%= settings.client %>}/{app,components}/**/*.html',
          '{.tmp,<%= settings.client %>}/{app,components}/**/*.js',
          '<%= settings.client %>/app/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: [
          'server/*.{js,json}', 'server/**/*.{js,json}'
        ],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '<%= settings.client %>/.jshintrc',
        reporter: require('jshint-stylish')
      },
      server: {
        options: {
          jshintrc: 'server/.jshintrc'
        },
        src: [
          'server/*.js', 'server/**/*.js',
        ]
      },
      all: [
        '<%= settings.client %>/{app,components}/**/*.js',
        'server/*.js', 'server/**/*.js'
      ]
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= settings.dist %>/*',
            '!<%= settings.dist %>/.git*',
            '!<%= settings.dist %>/.openshift',
            '!<%= settings.dist %>/Procfile'
          ]
        }]
      },
      server: '.tmp',
      sass: '.sass-cache',
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/',
          src: '{,*/}*.css',
          dest: '.tmp/'
        }]
      }
    },

    // Debugging with node inspector
    'node-inspector': {
      custom: {
        options: {
          'web-host': 'localhost'
        }
      }
    },

    // Use nodemon to run server in debug mode with an initial breakpoint
    nodemon: {
      debug: {
        script: 'server/server.js',
        options: {
          nodeArgs: ['--debug-brk'],
          env: {
            PORT: process.env.PORT || 8080
          },
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function () {
              setTimeout(function () {
                require('open')('http://localhost:8080/debug?port=5858');
              }, 500);
            });
          }
        }
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      target: {
        src: '<%= settings.client %>/index.html',
        ignorePath: '<%= settings.client %>/',
        exclude: []
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= settings.dist %>/public/{,*/}*.js',
            '<%= settings.dist %>/public/{,*/}*.css',
            '<%= settings.dist %>/public/app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= settings.dist %>/public/app/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['<%= settings.client %>/index.html'],
      options: {
        dest: '<%= settings.dist %>/public'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= settings.dist %>/public/{,*/}*.html'],
      css: ['<%= settings.dist %>/public/{,*/}*.css'],
      js: ['<%= settings.dist %>/public/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= settings.dist %>/public',
          '<%= settings.dist %>/public/app/images'
        ],
        // This is so we update image references in our ng-templates
        patterns: {
          js: [
            [/(app\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        }
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= settings.client %>/app/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= settings.dist %>/public/app/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= settings.client %>/app/images',
          src: '{,*/}*.svg',
          dest: '<%= settings.dist %>/public/app/images'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat',
          src: '*/**.js',
          dest: '.tmp/concat'
        }]
      }
    },

    // Package all the html partials into a single javascript payload
    ngtemplates: {
      options: {
        // This should be the name of your apps angular module
        module: 'meshApp',
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        usemin: 'app/mesh_app.js'
      },
      main: {
        cwd: '<%= settings.client %>',
        src: ['{app,components}/**/*.html'],
        dest: '.tmp/templates.js'
      },
      tmp: {
        cwd: '.tmp',
        src: ['{app,components}/**/*.html'],
        dest: '.tmp/tmp-templates.js'
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= settings.dist %>/public/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= settings.client %>',
          dest: '<%= settings.dist %>/public',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/**/*',
            'app/images/{,*/}*.{webp}',
            'app/fonts/**/*',
            'index.html'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= settings.dist %>/public/app/images',
          src: ['generated/*']
        }, {
          expand: true,
          dest: '<%= settings.dist %>',
          src: [
            'package.json',
            'server/**/*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= settings.client %>',
        dest: '.tmp/',
        src: ['{app,components}/**/*.css']
      }
    },

    buildcontrol: {
      options: {
        dir: 'dist',
        commit: true,
        push: true,
        connectCommits: false,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      heroku: {
        options: {
          remote: 'heroku',
          branch: 'master'
        }
      },
      openshift: {
        options: {
          remote: 'openshift',
          branch: 'master'
        }
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'sass',
      ],
      test: [
        'sass',
      ],
      debug: {
        tasks: [
          'nodemon',
          'node-inspector'
        ],
        options: {
          logConcurrentOutput: true
        }
      },
      dist: [
        'sass',
        'imagemin',
        'svgmin'
      ]
    },

    env: {
      test: {
        NODE_ENV: 'test'
      },
      prod: {
        NODE_ENV: 'production'
      },
      all: localConfig
    },

    // Compiles Sass to CSS
    sass: {
      server: {
        options: {
          loadPath: [
            '<%= settings.client %>/bower_components',
            '<%= settings.client %>/app',
            '<%= settings.client %>/components'
          ],
          compass: false
        },
        files: {
          '.tmp/app/mesh_app.css' : '<%= settings.client %>/app/mesh_app.scss',
          'client/app/mesh_app.css' : '<%= settings.client %>/app/mesh_app.scss'
        }
      }
    },

    injector: {
      options: {

      },
      // Inject application script files into index.html (doesn't include bower)
      scripts: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/client/', '/static/');
            filePath = filePath.replace('/.tmp/', '/static/');
            return '<script src="' + filePath + '"></script>';
          },
          starttag: '<!-- injector:js -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%= settings.client %>/index.html': [
            '{.tmp,<%= settings.client %>}/{app,components}/*.js',
            '{.tmp,<%= settings.client %>}/{app,components}/**/*.js'
          ]
        }
      },

      // Inject component scss into mesh_app.scss
      // sass: {
      //   options: {
      //     transform: function(filePath) {
      //       filePath = filePath.replace('/client/app/', '/static/');
      //       filePath = filePath.replace('/client/components/', '/static/');
      //       return '@import \'' + filePath + '\';';
      //     },
      //     starttag: '// injector',
      //     endtag: '// endinjector'
      //   },
      //   files: {
      //     '<%= settings.client %>/app/mesh_app.scss': [
      //       '<%= settings.client %>/app/mesh_app.{scss,sass}',
      //       '<%= settings.client %>/{app,components}/**/*.{scss,sass}'
      //     ]
      //   }
      // },

      // Inject component css into index.html
      css: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/client/', '/static/');
            filePath = filePath.replace('/.tmp/', '/static/');
            return '<link rel="stylesheet" href="' + filePath + '">';
          },
          starttag: '<!-- injector:css -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%= settings.client %>/index.html': [
            '<%= settings.client %>/{app,components}/*.css',
            '<%= settings.client %>/{app,components}/**/*.css'
          ]
        }
      }
    },
  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run([
        'build',
        'env:all',
        'env:prod',
        'express:prod',
        'wait',
        'open',
        'express-keepalive'
      ]);
    }

    if (target === 'debug') {
      return grunt.task.run([
        'clean:server',
        'env:all',
        // 'injector:sass',
        'concurrent:server',
        'injector',
        'wiredep',
        'autoprefixer',
        'concurrent:debug'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'env:all',
      // 'injector:sass',
      'concurrent:server',
      'injector',
      'wiredep',
      'autoprefixer',
      'express:dev',
      'wait',
      'open',
      'watch'
    ]);
  });

  grunt.loadNpmTasks('grunt-linter');


  grunt.registerTask('build', [
    'clean:dist',
    // 'injector:sass',
    'concurrent:dist',
    'injector',
    'wiredep',
    'useminPrepare',
    'autoprefixer',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    // 'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'build'
  ]);
};
