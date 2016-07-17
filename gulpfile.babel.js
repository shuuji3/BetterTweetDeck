// Gulp & utils
import path from 'path';
import gulp from 'gulp';
import runSequence from 'run-sequence';
import del from 'del';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import browserSync from 'browser-sync';

// JS
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import eslint from 'gulp-eslint';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import gutil from 'gulp-util';

// CSS
import postcss from 'gulp-postcss';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';

// Templates
import mustache from 'gulp-mustache';

const BS = browserSync.create();

const staticPaths = [
  'img/**/*'
].map(i => path.resolve('src/', i));

const isProduction = () => gutil.env.type === 'production';

const buildWithBrowserify = (entry) => {
  return browserify({
    entries: entry,
    debug: !isProduction(),
  })
  .transform('babelify')
  .bundle()
  .on('error', maybeNotifyErrors())
  .pipe(source(path.basename(entry)))
  .pipe(buffer())
  .pipe(isProduction() ? gutil.noop() : sourcemaps.init({ loadMaps: true }))
  .pipe(isProduction() ? uglify() : gutil.noop())
  .pipe(isProduction() ? gutil.noop() : sourcemaps.write('./'));
};

const maybeNotifyErrors = () => notify.onError({
  title: 'Compile Error',
  message: '<%= error.message %>',
});

gulp.task('templates', () => {
  return gulp.src('./src/*.html')
         .pipe(mustache())
         .pipe(gulp.dest('./dist'));
});

gulp.task('clean', () => {
  return del(['./dist']);
});

gulp.task('static', () => {
  return gulp.src(staticPaths, { base: './src/' }).pipe(gulp.dest('./dist'));
})

gulp.task('serve', ['build'], () => {
  BS.init({
    server: {
      baseDir: './dist'
    }
  });

  gulp.watch(['./dist/**/*.html', './dist/**/*.js']).on('change', BS.reload);
  gulp.watch('./src/**/*.html', ['templates']);
  gulp.watch('./src/**/*.js', ['js']);
  gulp.watch('./src/css/**/*.css', ['css']);
});

gulp.task('css', () => {
  return gulp.src('./src/css/**/*.css')
    .pipe(isProduction() ? gutil.noop() : sourcemaps.init({ loadMaps: true }))
    .pipe(postcss([
      require('postcss-import'),
      cssnext,
      require('postcss-url')({
        url: 'inline',
        from: './src/css/index.css'
      }),
      cssnano({ autoprefixer: false, zindex: false })
    ]))
    .pipe(plumber())
    .pipe(isProduction() ? gutil.noop() : sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(BS.stream());
});

gulp.task('js', () => {
  return buildWithBrowserify('src/js/app.js')
  .pipe(gulp.dest('./dist/js'));
});

gulp.task('build', (done) => {
  runSequence('clean', ['css', 'templates', 'static', 'js'], done);
});
