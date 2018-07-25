var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var watch = require('gulp-watch');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');
const babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var minify = require('gulp-minify');



gulp.task('default', ['copy-html', 'copy-images', 'styles', 'scripts'], () => {
    gulp.watch('sass/**/*.scss', ['styles']);
    gulp.watch('js/**/*.js', ['lint']);
    gulp.watch('/index.html', ['copy-html']);
    
});



gulp.task('styles', function(){
    gulp.src('sass/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
        }))
    .pipe(gulp.dest('dist/css'))
});

gulp.task('dist', [
    'copy-html',
    'copy-images',
    'styles',
    'lint',
    'scripts-dist'

]);

gulp.task('scripts', function(){
    return gulp.src('js/**/*.js')
    .pipe(babel())
    .pipe(concat('all.js'))
    /*
    .pipe(uglify().on('error', function(uglify) {
        console.error(uglify.message);
        this.emit('end');}))
        */
    .pipe(gulp.dest('dist/js'));
});
gulp.task('scripts-dist', function(){
    return gulp.src('js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    /*
    .pipe(uglify().on('error', function(uglify) {
        console.error(uglify.message);
        this.emit('end');}))
        */
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('copy-html', function(){
   gulp.src('./index.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', () =>
    gulp.src('img/**/*.png')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
);


gulp.task('compress', function (cb) {
    pump([
          gulp.src('js/**/*.js'),
          uglify(),
          gulp.dest('dist/js')
      ],
      cb
    );
  });




  gulp.task('compress', function() {
    gulp.src('js/*.js')
      .pipe(minify({
          ext:{
              src:'-debug.js',
              min:'.js'
          },
          exclude: ['tasks'],
          ignoreFiles: ['.combo.js', '-min.js']
      }))
      .pipe(gulp.dest('dist/js'))
  });


