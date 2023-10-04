/**
 * Gruntfile for e2e
 *
 * This repository builds the JavaScript crypto code from Google's end-to-end
 * project to provide the built library for other projects, so that it can be
 * easily depended on without having to rebuild the final project.
 **/

module.exports = function(grunt) {
  grunt.initConfig({
    gitclone: {
      e2e: {
        options: {
          repository: 'https://github.com/google/end-to-end.git'
        }
      }
    },

    gitpull: {
      e2e: {
        options: {
          cwd: 'end-to-end/'
        }
      }
    },

    // These shell commands execute/depend on do.sh in the e2e repo
    // Dependencies: unzip, svn, Python 2.X, Java >= 1.7
    shell: {
      doDeps: {
        command: 'bash ./end-to-end/do.sh install_deps'
      },
      doLib: {
        command: 'bash ./end-to-end/do.sh build_library_ctx1'
      }
    },

    copy: {
      dist: {
        files: [ {
          src: ['end-to-end/build/library/end-to-end-ctx1.compiled.js'],
          dest: 'end-to-end.compiled.js',
          onlyIf: 'modified'
        } ]
      }
    },

    bump: {
      options: {
        files: ['package.json'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin'
      }
    },

    'npm-publish': {
      options: {
        // list of tasks that are required before publishing
        requires: [],
        // if the workspace is dirty, abort publishing (to avoid publishing local changes)
        abortIfDirty: true
      }
    },

    prompt: {
      tagMessage: {
        options: {
          questions: [
            {
              config: 'bump.options.tagMessage',
              type: 'input',
              message: 'Enter a git tag message:',
            default: 'v%VERSION%'
            }
          ]
        }
      }
    },

    clean: ['end-to-end/', 'end-to-end.build/']
  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-force');
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-npm');
  grunt.loadNpmTasks('grunt-prompt');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('build', [
    'force:on',  // clone will fail if already exists, want to continue anyway
    'gitclone:e2e',
    'force:off',
    'gitpull:e2e',
    'shell:doDeps',
    'shell:doLib',
    'copy:dist'
  ]);
  
  grunt.registerTask('release', function (arg) {
    if (arguments.length === 0) {
      arg = 'patch';
    }
    grunt.task.run([
      'prompt:tagMessage',
      'bump:' + arg,
      'npm-publish'
    ]);
  });

  grunt.registerTask('default', ['build']);
}
