const gulp = require("gulp");
const sass = require("gulp-sass"); //编译scss
const autoprefixer = require("gulp-autoprefixer"); //添加浏览器内核
const minCss = require("gulp-clean-css"); //压缩css
const babel = require("gulp-babel"); //编译es6
const uglify = require("gulp-uglify"); //压缩js
const concat = require("gulp-concat"); //合并
const minHtml = require("gulp-htmlmin"); //压缩html
const minImg = require("gulp-imagemin"); //压缩img
const webserver = require("gulp-webserver"); //开启服务

//编译scss文件,压缩css
gulp.task("scss", () => {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(minCss())
        .pipe(gulp.dest("./src/css/"))
})

//编译js文件,合并js,并压缩
gulp.task("js", () => {
    return gulp.src("./src/js/javascripts/*.js")
        .pipe(babel({
            presets: ['env']
        }))
        // .pipe(concat("all.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./src/js/"))
})

//创建本地服务
gulp.task("webserver", () => {
    return gulp.src("./src/")
        .pipe(webserver({
            port: 8086,
            open: true,
            livereload: true,
            proxies: [
                { source: "/api/login", target: "http://localhost:3001/api/login" },
				{ source: "/api/register", target: "http://localhost:3001/api/register" },
				{ source: "/api/getBill", target: "http://localhost:3001/api/getBill" },
				{ source: "/api/getDateBill", target: "http://localhost:3001/api/getDateBill" },
				{ source: "/api/deleteBill", target: "http://localhost:3001/api/deleteBill" },
				{ source: "/api/getClass", target: "http://localhost:3001/api/getClass" },
				{ source: "/api/addBill", target: "http://localhost:3001/api/addBill" },
				{ source: "/api/getIcons", target: "http://localhost:3001/api/getIcons" },
				{ source: "/api/addClass", target: "http://localhost:3001/api/addClass" },
            ]
        }))
})

//用来打包的部分命令
//压缩HTML
gulp.task("html", () => {
    return gulp.src("./src/*.html")
        .pipe(minHtml())
        .pipe(gulp.dest("./dist/"))
})

//压缩img
// gulp.task("img",() => {
// 	return gulp.src("./src/")
// 	.pipe(minImg())
// 	.pipe(gulp.dest("./dist/img"))
// })

//压缩css
gulp.task("css", () => {
    return gulp.src("./src/css/*css")
        .pipe(gulp.dest("./dist/css"))
})

//压缩js
gulp.task("distJs", () => {
    return gulp.src("./src/js/")
        .pipe(gulp.dest("./dist/js"))
})

//watch事件监听css和js
gulp.task("watch", () => {
    gulp.watch(["./src/scss/*.scss", "./src/js/javascripts/*.js"], gulp.series("scss", "js"))
})

//默认执行webserver任务,js、css、watch任务
gulp.task("default", gulp.series("webserver", "js", "scss", "watch"))

//启动开发环境
gulp.task("dev", gulp.series("webserver", "scss", "watch"))

//打包文件，生成文件夹dist
gulp.task("build", gulp.parallel("html", "distJs", "css"))