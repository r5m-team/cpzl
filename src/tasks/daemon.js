const Rx = require('rx');
const chok = require('chokidar');
const bs = require('browser-sync').create();
var gulp = require('gulp');
var timeout = 2500;

module.exports = function() {
    // gulp.watch('styles/**/*.css', ['css']);
    // gulp.watch('public/**/*', ['assets']);
    // // gulp.watch('bower_components/**/*.css', ['css-watch']);
    // gulp.watch('js/**/*', ['js']);

    /**
     * Start Browsersync as normal, without files option
     */
    bs.init({
        server: './dist',
        open: false
    });


    Rx.Observable.create(function(observer) {
            const watcher = chok
                .watch(['js/**/*.js', 'bower_components/**/*.js'], {
                    ignoreInitial: true
                })
                .on('all', function(event, file) {
                    observer.onNext({
                        event,
                        file
                    });
                });
            return function() {
                watcher.close();
            }
        })
        .debounce(timeout)
        .filter(function(x) {
            return x.event === 'add' || x.event === 'change';
        })
        .subscribe(function(x) {
            gulp.run('js');
        })

    Rx.Observable.create(function(observer) {
            const watcher = chok
                .watch(['css/**/*.css', 'bower_components/**/*.css'], {
                    ignoreInitial: true
                })
                .on('all', function(event, file) {
                    observer.onNext({
                        event,
                        file
                    });
                });
            return function() {
                watcher.close();
            }
        })
        .debounce(timeout)
        .filter(function(x) {
            return x.event === 'add' || x.event === 'change';
        })
        .subscribe(function(x) {
            gulp.run('css');
        })
        
    
     Rx.Observable.create(function(observer) {
            const watcher = chok
                .watch(['package.json', 'tpl/**/*.ejs', 'bower_components/r5m-cms/**/*.ejs'], {
                    ignoreInitial: true
                })
                .on('all', function(event, file) {
                    observer.onNext({
                        event,
                        file
                    });
                });
            return function() {
                watcher.close();
            }
        })
        .debounce(timeout)
        .filter(function(x) {
            return x.event === 'add' || x.event === 'change';
        })
        .subscribe(function(x) {
            gulp.run('html');
        })

    /**
     * Create a stream of file-change events
     */
    Rx.Observable.create(function(observer) {
            const watcher = chok
                .watch(['dist/**/*'], {
                    ignoreInitial: true
                })
                .on('all', function(event, file) {
                    observer.onNext({
                        event,
                        file
                    });
                });
            return function() {
                watcher.close();
            }
        })
        /**
         * Wait for 2 seconds of event silence before emitting
         */
        .debounce(timeout)
        /**
         * Only look at add/change events
         */
        .filter(function(x) {
            return x.event === 'add' || x.event === 'change';
        })
        /**
         * Finally reload the browser
         */
        .subscribe(function(x) {
            bs.reload();
        });
};
