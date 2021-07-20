const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const svgSprite = require('gulp-svg-sprite');
const replace = require('gulp-replace');
const cheerio = require('gulp-cheerio');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');

function fonts() {
    src('app/fonts/*.*')
        .pipe(ttf2woff())
        .pipe(dest('dist/fonts'))
        .pipe(dest('app/fonts/convert'));
    return src('app/fonts/*.*')
        .pipe(ttf2woff2())
        .pipe(dest('dist/fonts'))
        .pipe(dest('app/fonts/convert'));
}

function svgSprites() {
    return src(['app/img/icons/**.svg'])
    .pipe(cheerio({
        run: function($) {
            $('[fill]').removeAttr('fill');
            $('[stroke]').removeAttr('stroke');
            $('[style]').removeAttr('style');
        },
        parserOptions: {xmlMode: true}
    }))

    .pipe(replace('&gt;', '>'))

    .pipe(svgSprite({
        mode: {
            stack: {
                sprite: "../sprite.svg"
            }
        },
    }))

    .pipe(dest('app/img'));
}

function htmlInclude() {
    return src(['app/html/*.html'])
        .pipe(fileInclude({
            prefix: '@',
            basepath: '@file',
        }))
        .pipe(dest('app'))
        .pipe(browserSync.stream());
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        },
        notify: false
    })
}

function styles() {
    return src('app/scss/style.scss')
        .pipe(scss({
            outputStyle: 'compressed'
        }))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src([
            /*'node_modules/jquery/dist/jquery.js',
            'node_modules/slick-carousel/slick/slick.js',
            'node_modules/mixitup/dist/mixitup.min.js',
            'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
            'node_modules/rateyo/src/jquery.rateyo.js',
            'node_modules/ion-rangeslider/js/ion.rangeSlider.js',
            'node_modules/jquery-form-styler/dist/jquery.formstyler.js',*/
            'app/js/main.js'
        ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function images() {
    return src('app/img/**/*.*')
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true
            }),
            imagemin.mozjpeg({
                quality: 75,
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 5
            }),
            imagemin.svgo({
                plugins: [{
                        removeViewBox: true
                    },
                    {
                        cleanupIDs: false
                    }
                ]
                
            })
        ]))
        .pipe(dest('dist/img'))
}

function build() {
    return src([
        'app/**/*.html',
        'app/css/style.min.css',
        'app/js/main.min.js'
    ], {base: 'app'})
    .pipe(dest('dist'))
}

function cleanDist() {
    return del('dist')
}

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
    watch(['app/**/*.html']).on('change', browserSync.reload);
    watch(['app/html/**/*.html'], htmlInclude);
    watch(['app/img/icons/**.svg'], svgSprites);
}

exports.fonts = fonts;
exports.svgSprites = svgSprites;
exports.htmlInclude = htmlInclude;
exports.styles = styles;
exports.scripts = scripts
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.cleanDist = cleanDist;
exports.build = build;
exports.build = series(cleanDist, images, build, fonts)

exports.default = parallel(styles, svgSprites, htmlInclude, scripts, browsersync, watching)