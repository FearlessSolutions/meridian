/*global module:true*/
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

var yeomanConfig = {
  app: 'app',
  dist: 'dist'
};


module.exports = function (grunt) {

  'use strict';
  grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    yeoman: yeomanConfig,

    shell: {
        startElasticSearch: {
          command: 'data/bin/elasticsearch',
          options: {
            async: true,
            stdout: false,
            stderr: false,
            failOnError: false,
            execOptions: {
                cwd: '.'
            },
            node:{
              local: true
            }
          }
        },
        startElasticSearch4Win: {
          command: 'data/bin/elasticsearch.bat',
          options: {
            async: true,
            stdout: false,
            stderr: false,
            failOnError: false,
            execOptions: {
                cwd: '.'
            }
          }
        },
        startServer: {
          command: 'node app.js',
          options: {
            async: true,
            stdout: false,
            stderr: false,
            failOnError: true
          }
        },
        docs: {
          command: [
            "find app/. -type f | xargs grep -En 'context.sandbox.on[(](.*?)[)]' | sed -e 's/context.sandbox.on(//' -e 's/,.*//' -e 's/);//' >> app/docs/pubsub/subscribers.txt",
            "find app/. -type f | xargs grep -En 'context.sandbox.emit[(](.*?)[)]' | sed -e 's/context.sandbox.emit(//' -e 's/,.*//' -e 's/);//' >> app/docs/pubsub/publishers.txt"
          ].join('&&')
        }
    },

    open: {
      server: {
        url: 'https://localhost:<%= connect.livereload.options.port %>'
      },
      test: {
        url: 'http://localhost:<%= connect.test.options.port %>'
      }
    },

    // default watch configuration
    watch: {
      // aura_components_js: {
      //   files: ['app/components/**/*.js'],
      //   tasks: ['concat:component_js']
      // },
      // aura_components_css: {
      //   files: ['app/components/**/*.css'],
      //   tasks: ['concat:component_css']
      // },
      // handlebars: {
      //   files: ['app/components/**/*.hbs'],
      //   tasks: ['handlebars']
      // },
      livereload: {
        options: { livereload: true },
        files: [
          'app/components/**/*',
          'app/extensions/**/*',
          'app/bower_components/**/*',
          'app/libs/**/*',
          'app/styles/**/*',
          'app/*.html',
          'app/app.js'
        ]
      }
    },

    jshint: {
      all: [
        'app/scripts/[^templates].js',
        'app/components/**/*.js',
        '!app/components/**/libs/**/*.js',
        'app/extensions/**/*.js',
        '!app/extensions/**/libs/**/*.js'
      ]
    },

    handlebars: {
      compile: {
        files: {
          ".prebuild/scripts/templates.js" : ["app/components/**/*.hbs"]
        },
        options: {
          wrapped: true,
          namespace: "Handlebars.templates",
          processName: function (filename) {
            return filename.replace(/^app\/components\//, '').replace(/\.hbs$/, '');
          }
        }
      }
    },

    connect: {
      livereload: {
        options: {
          port: 3000,
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, 'app')
            ];
          }
        }
      },
      test: {
        options: {
          port: 3030,
          middleware: function (connect) {
            return [
              mountFolder(connect, 'tests/mocha')
            ];
          }
        }
      }
    },

    clean: {
      dist: ['.tmp', '.prebuild', 'dist/*'],
      glide: ['.tmp', '.prebuild', 'glide/*'],
      server: '.tmp',
      elasticsearch: ['data/data', 'data/logs'],
      postbuild: '.prebuild',
      docsPubsub: ['app/docs/pubsub/publishers.txt', 'app/docs/pubsub/subscribers.txt']
    },
    uglify: {
      options: {
        mangle: false,
        compress: {
          drop_console: true
        }
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: 'app/',
            src: ['**/*.js','!**/*.min.js'],
            dest: 'dist/app'
          }
        ]
      },
      bowerComponents: {
        files: [
          {
            expand: true,
            cwd: 'app',
            src: ['bower_components/aura/lib/**/*.js','!bower_components/aura/lib/**/*.min.js'],
            dest: 'dist'
          },
          {
            'dist/bower_components/eventemitter2/lib/eventemitter2.js': 'app/bower_components/eventemitter2/lib/eventemitter2.js'
          },
          {
            'dist/bower_components/handlebars/handlebars.js': 'app/bower_components/handlebars/handlebars.js'
          },
          {
            'dist/bower_components/jquery/dist/jquery.js': 'app/bower_components/jquery/dist/jquery.js'
          },
          {
            'dist/bower_components/requirejs/require.js': 'app/bower_components/requirejs/require.js'
          },
          {
            'dist/bower_components/requirejs-text/text.js': 'app/bower_components/requirejs-text/text.js'
          },
          {
            'dist/bower_components/underscore/underscore.js': 'app/bower_components/underscore/underscore.js'
          }
        ]
      }
    },
    useminPrepare: {
      html: 'index.html'
    },
    usemin: {
      html: ['dist/*.html'],
      css: ['dist/styles/*.css']
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/images',
          src: '*.{png,jpg,jpeg}',
          dest: 'dist/images'
        }]
      }
    },
    cssmin: {
      options:{
        keepSpecialComments: 0
      },
      dist: {
        files: [
          {
            'dist/styles/main.css': ['app/styles/*.css']
          },
          {
            expand: true,
            cwd: 'dist/libs',
            src: ['**/*.css', '!**/*.min.css'],
            dest: 'dist/libs'
          },
          {
            expand: true,
            cwd: 'dist/components',
            src: ['**/*.css', '!**/*.min.css'],
            dest: 'dist/components'
          }
        ]
      }
    },

    copy: {
      app_js: {
        files: [
          { cwd: 'app', dest: 'dist', src: ['app.js'], expand: true }
        ]
      },
      libs: {
        files: [
          { cwd: 'app', dest: 'dist', src: ['libs/**/*', '!libs/**/*.min.*'], expand: true }
        ]
      },
      extensions: {
        files: [
          { cwd: 'app', dest: 'dist', src: ['extensions/**/*'], expand: true }
        ]
      },
      components: {
        files: [
          { cwd: 'app', dest: 'dist', src: ['components/**/*'], expand: true }
        ]
      },
      glide:{
        files: [
          { cwd: 'app',
            dest: 'glide/app',
            src: ['**/*', '!bower_components/**/*'],
            expand: true
          },
          {
            expand: true,
            cwd: 'app',
            src: ['bower_components/aura/lib/**/*.js','!bower_components/aura/lib/**/*.min.js'],
            dest: 'glide/app'
          },
          { cwd: './',
            dest: 'glide/',
            src: ['.bowerrc', '.gitignore', 'bower.json', 'Gruntfile.js', 'LICENSE-MIT', 'package.json', 'README.md', 'app.js'],
            expand: true
          },
          { cwd: 'extra',
            dest: 'glide/extra',
            src: ['**/*'],
            expand: true
          },
          { cwd: 'server',
            dest: 'glide/server',
            src: ['**/*'],
            expand: true
          },
          { cwd: 'tests',
            dest: 'glide/tests',
            src: ['**/*'],
            expand: true
          },
          { cwd: 'node_modules', // bring over all local node modules
            dest: 'glide/node_modules',
            src: ['**/*'],
            expand: true
          },
          // { cwd: 'node_modules/elasticsearch', // bring over Sean's modified version of the elastic search module
          //   dest: 'glide/node_modules/elasticsearch',
          //   src: ['**/*'],
          //   expand: true
          // },
          {
            'glide/app/bower_components/eventemitter2/lib/eventemitter2.js': 'app/bower_components/eventemitter2/lib/eventemitter2.js'
          },
          {
            'glide/app/bower_components/handlebars/handlebars.js': 'app/bower_components/handlebars/handlebars.js'
          },
          {
            'glide/app/bower_components/jquery/dist/jquery.js': 'app/bower_components/jquery/dist/jquery.js'
          },
          {
            'glide/app/bower_components/requirejs/require.js': 'app/bower_components/requirejs/require.js'
          },
          {
            'glide/app/bower_components/requirejs-text/text.js': 'app/bower_components/requirejs-text/text.js'
          },
          {
            'glide/app/bower_components/underscore/underscore.js': 'app/bower_components/underscore/underscore.js'
          }
        ]
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: false,
          removeCommentsFromCDATA: true,
          collapseWhitespace: false,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: false,
          removeRedundantAttributes: false,
          useShortDoctype: true,
          removeEmptyAttributes: false,
          removeOptionalTags: false
        },
        files: [{
          expand: true,
          cwd: 'app',
          src: '*.html',
          dest: 'dist'
        }]
      }
    },

    concat: {
      options: {
        separator: "\n\n\n\n//--------\n\n\n"
      }
      // component_css: {
      //   src: ['app/styles/*.css', 'app/components/**/*.css'],
      //   dest: '.prebuild/styles/components.css'
      // },
      // component_js: {
      //   src: ['app/components/**/*.js'],
      //   dest: '.prebuild/scripts/components.js'
      // },
      // extension_js: {
      //   src: ['app/extensions/**/*.js'],
      //   dest:'.prebuild/scripts/extensions.js'
      // }
    }

  });

  grunt.registerTask('server', [
    'clean:server',
    'shell:startElasticSearch',
    'shell:startElasticSearch4Win',
    'shell:startServer',
    'open:server',
    'watch'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'shell:startElasticSearch',
    'shell:sleep5',
    'shell:startServer',
    'open:test',
    'watch'
  ]);

  grunt.registerTask('docs', [
    'clean:docsPubsub',
    'shell:docs'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'concat',
    'jshint',
    'copy',
    // 'handlebars',
    'useminPrepare',
    'imagemin',
    'htmlmin',
    'cssmin',
    'usemin',
    'uglify',
    // 'clean:postbuild'
  ]);

  grunt.registerTask('glide', [
    'clean:glide',
    'jshint',
    'copy:glide'
  ]);

  grunt.registerTask('default', ['build']);

};
