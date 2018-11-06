var gulp        = require("gulp");
var stylus      = require("gulp-stylus");
var runSequence = require("run-sequence");
var browserSync = require("browser-sync").create();
var plumber     = require("gulp-plumber");
var notify      = require("gulp-notify");
var babel       = require("gulp-babel");
var ejs         = require("gulp-ejs");
var stripDebug  = require("gulp-strip-debug");
var uglify      = require("gulp-uglify");
var cleanCSS    = require("gulp-clean-css");
var del         = require("del");
var sourcemaps  = require("gulp-sourcemaps");

/* babelでjsをトランスパイル */
gulp.task("babel", () =>
{
    gulp.src(['./debug/_babel/**/*.es6', '!'+'./debug/_babel/**/_*.es6'])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./debug/js"))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task("babel_sp", () =>
{
    gulp.src(['./debug/sp/_babel/**/*.es6', '!'+'./debug/sp/_babel/**/_*.es6'])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(babel())
    .pipe(gulp.dest("./debug/sp/js"))
    .pipe(browserSync.reload({stream:true}));
});


/* stylusからcssへコンパイル */
gulp.task("styl", () =>
{
    gulp.src(['./debug/_styl/**/*.styl', '!'+'./debug/_styl/**/_*.styl'])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(stylus())
    .pipe(gulp.dest("./debug/css"))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task("styl_sp", () =>
{
    gulp.src(['./debug/sp/_styl/**/*.styl', '!'+'./debug/sp/_styl/**/_*.styl'])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(stylus())
    .pipe(gulp.dest("./debug/sp/css"))
    .pipe(browserSync.reload({stream:true}));
});


/* ejsからsrcへコンパイル */
gulp.task("ejs", () =>
{
    gulp.src(['./debug/_ejs/**/*.ejs','!'+'./debug/_ejs/**/_*.ejs'])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(ejs( {}, {}, { ext:'.html'} ))
    .pipe(gulp.dest("./debug"))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task("ejs_sp", () =>
{
    gulp.src(['./debug/sp/_ejs/**/*.ejs','!'+'./debug/sp/_ejs/**/_*.ejs'])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(ejs( {}, {}, { ext:'.html'} ))
    .pipe(gulp.dest("./debug/sp"))
    .pipe(browserSync.reload({stream:true}));
});


/* サーバーの監視をActiveに */
gulp.task("server", function()
{
    browserSync.init(
        {
            server  :
            {
                baseDir : "./debug",
                index   : "index.html"
            }
        });
});


/* 監視＆自動リロード */
gulp.task("default", ["server"], function()
{
    // pc
    gulp.watch("./debug/_styl/**/*.styl", ["styl"]);
    gulp.watch("./debug/_babel/**/*.es6", ["babel"]);
    gulp.watch("./debug/_ejs/**/*.ejs", ["ejs"]);
    gulp.watch("./debug/_shader/**/*.vert", ["babel"]);
    gulp.watch("./debug/_shader/**/*.frag", ["babel"]);

    // sp
    gulp.watch("./debug/sp/_styl/**/*.styl", ["styl_sp"]);
    gulp.watch("./debug/sp/_babel/**/*.es6", ["babel_sp"]);
    gulp.watch("./debug/sp/_ejs/**/*.ejs", ["ejs_sp"]);
});


/* 
    アップロード用ファイルを作成
*/
gulp.task("release", ["releaseClear", "releaseOut"]);


/* 
    リリースの中身を削除
*/
gulp.task("releaseClear", () =>
{
    return del([
        "./release/**/*"
    ]);
});


/* 
    リリースファイルを作成
*/
gulp.task("releaseOut", ["releaseClear"], () =>
{
    // common //
    gulp.src("./debug/favicon.ico")
    .pipe(gulp.dest("./release"));

    gulp.src("./debug/ogp_1200x630.png")
    .pipe(gulp.dest("./release"));


    // PC //

    // babelからリリースファイルを作成
    gulp.src(['./debug/_babel/**/*.es6', '!'+'./debug/_babel/**/_*.es6'])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(babel())
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest("./release/js"));

    // js ライブラリをリリースフォルダにコピー
    gulp.src("./debug/js/Libs/**/*")
    .pipe(gulp.dest("./release/js/Libs"));

    // stylusからリリースファイルを作成
    gulp.src(['./debug/_styl/**/*.styl', '!'+'./debug/_styl/**/_*.styl'])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(stylus())
    .pipe(cleanCSS())
    .pipe(gulp.dest("./release/css"));

    // ejsからリリースファイルを作成
    gulp.src(['./debug/_ejs/**/*.ejs','!'+'./debug/_ejs/**/_*.ejs'])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(ejs( {}, {}, { ext:'.html'} ))
    .pipe(gulp.dest("./release"));

    // assetsをリリースフォルダにコピー
    gulp.src("./debug/assets/**/*")
    .pipe(gulp.dest("./release/assets"));


    // SP //

    // babelからリリースファイルを作成
    gulp.src(['./debug/sp/_babel/**/*.es6', '!'+'./debug/sp/_babel/**/_*.es6'])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(babel())
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest("./release/sp/js"));

    // stylusからリリースファイルを作成
    gulp.src(['./debug/sp/_styl/**/*.styl', '!'+'./debug/sp/_styl/**/_*.styl'])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(stylus())
    .pipe(cleanCSS())
    .pipe(gulp.dest("./release/sp/css"));

    // ejsからリリースファイルを作成
    gulp.src(['./debug/sp/_ejs/**/*.ejs','!'+'./debug/sp/_ejs/**/_*.ejs'])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(ejs( {}, {}, { ext:'.html'} ))
    .pipe(gulp.dest("./release/sp"));

    // assetsをリリースフォルダにコピー
    gulp.src("./debug/sp/assets/**/*")
    .pipe(gulp.dest("./release/sp/assets"));
});