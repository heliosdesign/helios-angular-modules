var gulp     = require('gulp'),
    gutil    = require('gulp-util'),
    bump     = require('gulp-bump'),
    fs       = require('fs'),
    git      = require('gulp-git'),
    notify   = require('gulp-notify')
    prompt   = require('gulp-prompt'),
    replace  = require('gulp-replace'),
    rename   = require('gulp-rename'),
    semver   = require('semver'),
    sequence = require('gulp-run-sequence'),
    uglify   = require('gulp-uglify');
    
var pkg      = require('./package.json');

var basename = 'helios-directives',
    basefile = basename + '.js',
    source   = 'source/';

var version = {
  latest: pkg.version
}

var config = {
    semverType: 'patch'
}

gulp.task('prompt-increment-release', function(cb) {
    var message, type;
    type = config.semverType;

    message = 'The current version is ' + gutil.colors.green(version.latest);
    message += '\n    Select an increment ';
    message += gutil.colors.grey('(default is ' + type + ')') + ':\n\n';
    message += '    ';
    message += 'a: Patch to ';
    message += gutil.colors.green(semver.inc(version.latest, 'patch'));
    message += '\n    ';
    message += 'b: Minor to ';
    message += gutil.colors.green(semver.inc(version.latest, 'minor'));
    message += '\n    ';
    message += 'c: Major to ';
    message += gutil.colors.green(semver.inc(version.latest, 'major'));
    message += '\n    ';
    message += '> ';

    gulp.src('./')
        .pipe(prompt.prompt({type: 'input', name:'increment', message: message}, function(val) {

            switch (val.increment) {
                case 'a':
                    type = 'patch';
                    break;
                case 'b':
                    type = 'minor';
                    break;
                case 'c':
                    type = 'major';
                    break;
            }

            config.semverType = type;
            console.log(val.increment);
            version.latest = semver.inc(version.latest, type);
            //gutil.log(gutil.colors.red(ship.pkgPath));

            console.log('');
            gutil.log('Version ' + gutil.colors.yellow(type) + ' will be incremented to ' + gutil.colors.green(version.latest));
            console.log('');

            return cb();
        }));
});

gulp.task('increment-release', function(cb) {
    return gulp.src(['./bower.json', './package.json'])
        .pipe(bump({type: config.semverType}))
        .pipe(gulp.dest('./'))

        //gulp.src(['./deploy/content/site.txt']).pipe(replace(/(\d+\.)?(\d+\.)?(\d+.*)/, version.latest)).pipe(gulp.dest('./deploy/content'));
        // gutil.log('Version incremented to ' + gutil.colors.green(version.latest));
});

gulp.task('build', function(){
    return gulp.src(['source/' + basefile])
        //.pipe(replace('%%% REPLACE %%%', content))
        .pipe(rename({ basename: basename }))
        .pipe(gulp.dest('.'))
        .pipe(uglify({ mangle: false }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('.'))
});

gulp.task('watch', function(){
    gulp.watch(source + basefile, ['build']);
});

gulp.task('update-bower', function(cb) {
    return sequence('prompt-increment-release', 'increment-release', function() {
            gulp.src('./')
                .pipe(notify({
                    title: 'Release Complete',
                    message: 'Updated Bower to ' + version.latest
                }));
            return cb();
        }
    );
});