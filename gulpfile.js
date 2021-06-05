const gulp = require("gulp");
const sass = require("gulp-sass");
const runSequence = require('gulp4-run-sequence');
const babel = require('gulp-babel');
const njRender = require("gulp-nunjucks-render");
const plumber = require("gulp-plumber");
const autoprefixer = require("gulp-autoprefixer");
const beautify = require("gulp-beautify");
const imagemin = require("gulp-imagemin");
const del	= require('del');
const useref	= require('gulp-useref');
const gulpIf	= require('gulp-if');
const cssnano	= require('gulp-cssnano');
const htmlmin	= require('gulp-htmlmin');
const prettify	= require('gulp-prettify');
const browserSync = require("browser-sync");
const reload = browserSync.reload;


const config = {
  build: 'build/',
  dist: 'dist/',
  src: 'src/',

  styles: 'src/styles',
  stylesIn: 'src/styles/**/*.scss',
  stylesOut: 'dist/styles',

  scripts: 'src/scripts',
  scriptsIn: 'src/scripts/**/*.js',
  scriptsOut: 'dist/scripts',

  imageIn: 'src/images/**/*',
  imageOut: 'dist/images',

  templatePath: 'src/tpl',
  pagesPath: 'src/tpl/pages/**/*.html',
  layoutsPath: 'src/tpl/layouts',
  componentsPath: 'src/tpl/components'
};

gulp.task('styles', function () {
  return gulp.src( config.stylesIn )
    .pipe(plumber())
    .pipe(sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', sass.logError))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 100 versions'] }))
    .pipe(gulp.dest( config.stylesOut ))
    .pipe(reload({ stream: true }));
});


gulp.task('scripts', function () {

  return gulp.src( config.scriptsIn )
    .pipe(plumber())
    .pipe(babel({
      "presets": ["es2015"]
    }))
    .pipe(beautify({indentSize: 4}))
    .pipe(gulp.dest( config.scriptsOut ))
    .pipe(reload({ stream: true, once: true }));

});

gulp.task('image-min', function () {

  return gulp.src( config.imageIn )
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5,
      svgoPlugins: [{removeViewBox: true}]
    }))
    .pipe(gulp.dest( config.imageOut ));

});

gulp.task('nunjucks', function () {

  return gulp.src( config.pagesPath )
    .pipe(plumber())
    .pipe(njRender({
      path: [ config.componentsPath, config.layoutsPath ],
    }))
    .pipe(gulp.dest( config.dist ));

});

gulp.task('clean', del.bind(null, [ config.dist ] ) );


gulp.task('serve', function () {

  runSequence(['clean'], ['styles', 'scripts', 'nunjucks'], function () {

    browserSync.init({
      notify: false,
      port: 9000,
      server: {
        baseDir: [ config.dist, config.src ],
      }
    });
    gulp.watch([ config.templatePath + '/**/*']).on('change', reload);
    gulp.watch(config.templatePath + '/**/*', gulp.parallel(['nunjucks']));
    gulp.watch(config.stylesIn, gulp.parallel('styles'));
    gulp.watch(config.scriptsIn, gulp.parallel('scripts'));
  });

});

gulp.task('htmlmin', gulp.series(['styles', 'nunjucks'], function() {

  return gulp.src('dist/*.html')
    .pipe(useref({ searchPath: [ config.dist, config.src, '.'] }))
    .pipe(gulpIf(/\.css$/, cssnano({ safe: true, autoprefixer: false })))
    .pipe(gulpIf(/\.html$/, htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: { compress: { drop_console: true } },
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe(gulpIf(/\.html$/, prettify({ indent_char: ' ', indent_size: 4 })))
    .pipe(gulp.dest( config.build ));

}));


gulp.task('move', function () {

  return gulp.src([
    'src/**/*',
    '!src/styles/*',
    '!src/scripts/*',
    '!src/tpl',
    '!src/libs'
  ], {
    dot: true
  }).pipe( gulp.dest( config.build ) );

});

gulp.task('build', function (done) {

  runSequence(['clean'], ['htmlmin', 'image-min', 'move'], function () {

    return gulp.src( config.build + '**' )
      .pipe( gulp.dest( config.build) );

  });

  done();
});