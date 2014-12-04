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
            dist: ['.tmp', '.prebuild', 'dist/*', '!dist/data/*'],
            glide: ['.tmp', '.prebuild', 'glide/*'],
            server: '.tmp',
            elasticsearch: ['data/data', 'data/logs'],
            postbuild: '.prebuild',
            docsPubsub: ['app/docs/pubsub/publishers.txt', 'app/docs/pubsub/subscribers.txt']
        },

        uglify: {
            options: {
                mangle: true, //TODO try with mangle
                compress: {
                    drop_console: true
                }
            },
            dist: {
                files: [ //Uglifying the server breaks stuff
                    {
                        expand: true,
                        cwd: 'app/',
                        src: ['**/*.js', '!**/*.min.js'],
                        dest: 'dist/app/'
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
                    cwd: 'app/',
                    src: '**/*.{png,jpg,jpeg}',
                    dest: 'dist/app'
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
                        expand: true,
                        cwd: 'dist/app',
                        src: ['**/*.css', '!**/*.min.css'],
                        dest: 'dist/app'
                    }
                ]
            }
        },

        copy: {
            glide:{
                files: [
                    {
                        cwd: 'app',
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
                    {
                        cwd: './',
                        dest: 'glide/',
                        src: ['.bowerrc', '.gitignore', 'bower.json', 'Gruntfile.js', 'LICENSE-MIT', 'package.json', 'README.md', 'app.js'],
                        expand: true
                    },
                    {
                        cwd: 'server',
                        dest: 'glide/server',
                        src: ['**/*'],
                        expand: true
                    },
                    {
                        cwd: 'tests',
                        dest: 'glide/tests',
                        src: ['**/*'],
                        expand: true
                    },
                    {
                        cwd: 'node_modules', // bring over all local node modules
                        dest: 'glide/node_modules',
                        src: ['**/*'],
                        expand: true
                    },
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
            },
            dist:{ // Copy everything; Minify later
                files: [
                    {
                        cwd: './',
                        dest: 'dist/',
                        src: [
                            '.bowerrc',
                            '.gitignore',
                            'app.js',
                            'bower.json',
                            'COPYWRITE.txt',
                            'Gruntfile.js',
                            'LICENSE-MIT',
                            'package.json',
                            'README.md',
                            'user.p12'
                        ],
                        expand: true
                    },
                    {
                        cwd: 'app',
                        dest: 'dist/app',
                        src: ['**/*'],
                        expand: true
                    },
                    {
                        cwd: 'node_modules',
                        dest: 'dist/node_modules',
                        src: ['**/*'],
                        expand: true
                    },

                    {
                        cwd: 'server',
                        dest: 'dist/server',
                        src: ['**/*'],
                        expand: true
                    },
                    {
                        cwd: 'tests',
                        dest: 'dist/tests',
                        src: ['**/*'],
                        expand: true
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
                    cwd: 'app/',
                    src: '**/*.html',
                    dest: 'dist/app'
                }]
            }
        },

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
        'jshint',
        'copy:dist',
        'useminPrepare',
        'imagemin:dist',
        'htmlmin:dist',
        'cssmin:dist',
        'usemin',
        'uglify:dist'
    ]);

    grunt.registerTask('glide', [
        'clean:glide',
        'jshint',
        'copy:glide'
    ]);

    grunt.registerTask('default', ['build']);

};
