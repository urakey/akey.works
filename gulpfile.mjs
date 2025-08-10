import gulp from 'gulp'
import { deleteAsync } from 'del'
import autoprefixer from 'gulp-autoprefixer'
import cleanCss from 'gulp-clean-css'
import dartSass from 'gulp-dart-sass'
import htmlBeautify from 'gulp-html-beautify'
import imagemin from 'gulp-imagemin'
import plumber from 'gulp-plumber'
import rename from 'gulp-rename'
import replace from 'gulp-replace'
import jpegoptim from 'imagemin-jpegoptim'

var DOMAIN = 'https://akey.works';
var PATHS = {
  src:  './assets',
  dest: './static/assets',
  publishdir: './docs',
};

var AUTOPREFIXER_BROWSERS = [
  'last 2 versions',
  'ie >= 11',
  'android >= 4'
];

// -----------------------------------------------------------------------------
// Stylesheet
export function buildCss() {
  return gulp.src(PATHS.src + '/**/*.scss')
    .pipe(plumber())
    .pipe(dartSass({
      bundleExec: true,
      errLogToConsole: true,
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest(PATHS.dest));
}

export function minifyCss() {
  return gulp.src(PATHS.dest + '/**/*.css')
    .pipe(plumber())
    .pipe(cleanCss())
    .pipe(gulp.dest(PATHS.dest));
}

// -----------------------------------------------------------------------------
// HTML
export function replaceHtml() {
  return gulp.src([PATHS.publishdir + '/**/*.html'])
    .pipe(replace('<p></p>', ''))
    .pipe(replace('<p><section', '<section'))
    .pipe(replace('</section></p>', '</section>'))
    .pipe(gulp.dest(PATHS.publishdir));
}

export function beautifyHtml() {
  return gulp.src(PATHS.publishdir + '/**/*.html')
    .pipe(htmlBeautify({ 
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 0,
      preserve_newlines: false,
     }))
    .pipe(gulp.dest(PATHS.publishdir));
}

// -----------------------------------------------------------------------------
// RSS
export function replaceRss() {
  return gulp.src(PATHS.publishdir + '/index.xml')
    .pipe(replace('src="/assets/images/', 'src="' + DOMAIN + '/assets/images/'))
    .pipe(gulp.dest(PATHS.publishdir));
}

export function copyRss() {
  return gulp.src(PATHS.publishdir + '/index.xml')
    .pipe(rename('feed.rss'))
    .pipe(gulp.dest(PATHS.publishdir));
}

// -----------------------------------------------------------------------------
// Images
export function minifyImages() {
  return gulp.src(PATHS.src + '/images/**/*.{png,svg,webp}', { encoding: false })
    .pipe(imagemin())
    .pipe(gulp.dest(PATHS.dest + '/images'));
}

export function minifyImagesJpegoptim() {
  return gulp.src(PATHS.src + '/images/**/*.jpg', { encoding: false })
    .pipe(imagemin(function() {
      jpegoptim({
        stripIptc: false
      })
    }))
    .pipe(gulp.dest(PATHS.dest + '/images'));
}

// -----------------------------------------------------------------------------
// Utility
export function copyFiles() {
  return gulp.src(PATHS.src + '/files/**')
    .pipe(gulp.dest(PATHS.dest + '/files'));
}

export function clean(done) {
  deleteAsync([PATHS.publishdir + '/**/index.xml', '!' + PATHS.publishdir + '/index.xml']);
  done();
}
