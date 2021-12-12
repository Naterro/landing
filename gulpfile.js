const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

function build(cb) {
    // body omitted
    cb();
}
/* server */
gulp.task('server',function (){
    browserSync.init({
        browser: "firefox",
        server:{
            port:9000,
            baseDir:"build",

        }
    })
    gulp.watch('build/**/*').on('change',browserSync.reload);
})

/* compile */
gulp.task('compile:pug', function (){
    return gulp.src('source/template/**/*.pug')
        .pipe(
            pug({
               pretty:true
            })
        )
        .pipe(gulp.dest('build'));
});
gulp.task('compile:sass',function (){
    return gulp.src('source/styles/main_style.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('build/css'));
})
gulp.task('autoprefixer',function (){
    return gulp.src('build/css/*.css')
        .pipe(autoprefixer({cascade:false}))
        .pipe(gulp.dest('build/css'))
})

gulp.task('sprite', function () {
    var spriteData = gulp.src('source/images/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css'
    }));
    return spriteData.pipe(gulp.dest('./build/img'));
});
/*gulp.task('sourcemap',function (){
    gulp.src('src/!**!/!*.js')
        .pipe(sourcemaps.init())
        .pipe(plugin1())
        .pipe(plugin2())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
})*/
/* clean build*/
gulp.task('clean',function del(cb){
    return rimraf('build/*',{},cb);

})

/* copy */
gulp.task('copy:img',function (){
    return gulp.src("source/images/**/*.*")
        .pipe(gulp.dest("build/img"));
})
gulp.task('copy:fonts',function (){
    return gulp.src("source/fonts/*")
        .pipe(gulp.dest("build/fonts"));
})
gulp.task('copy',gulp.parallel("copy:fonts","copy:img"));

gulp.task('watch',function (){

    gulp.watch('source/styles/**/*.scss',gulp.series("compile:sass"));
    gulp.watch('source/template/**/*.pug',gulp.series("compile:pug"));
/*    gulp.watch('build/css/!*.css',gulp.series("autoprefixer"));*/
})
/* gulp default task */
gulp.task('default',gulp.series(
    'clean',
    gulp.parallel("compile:sass","compile:pug","copy","sprite"),
    gulp.parallel("watch","server")
))