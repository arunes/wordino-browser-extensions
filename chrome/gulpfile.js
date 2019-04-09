let gulp = require("gulp"),
    clean = require("gulp-clean")
sass = require("gulp-sass")
cleanCSS = require('gulp-clean-css')
concat = require("gulp-concat")
babel = require("gulp-babel")
uglify = require("gulp-uglify")
rename = require("gulp-rename")
htmlreplace = require("gulp-html-replace");

// config
const paths = {
    src: "./src",
    build: "./build",
    compile: "./dist",

    static: [
        "/manifest.json",
        "/images/**/*"
    ],
    html: ["/popup.html"],
    css: "/css/*.css",
    sass: "/css/*.{scss,sass}",
    js: [
        "/js/vendor/jquery-3.3.1.slim.min.js",
        "/js/common/chrome.js",
        "/js/wordino/api.js",
        "/js/wordino/uiHelper.js",
        "/js/popup.js"
    ]
}

// Global tasks
gulp.task("clean", function () {
    return gulp.src(paths.build + "/*", { read: false })
        .pipe(clean())
        .pipe(gulp.src(paths.compile + "/*"))
        .pipe(clean());
});

gulp.task("copy", function () {
    return gulp.src(paths.src + "/**/*")
        .pipe(gulp.dest(paths.build));
});

// Build tasks
gulp.task("sass", function () {
    return gulp.src(paths.src + paths.sass, { base: paths.src })
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.build));
});

gulp.task("css:build", function () {
    return gulp.src(paths.src + paths.css, { base: paths.src })
        .pipe(gulp.dest(paths.build));
});

gulp.task("js:build", function () {
    let all = paths.js.map((p) => { return paths.src + p; });
    return gulp.src(all, { base: paths.src })
        .pipe(gulp.dest(paths.build));
});

gulp.task("static:build", function () {
    let static = paths.static.map((p) => { return paths.src + p; });
    let html = paths.html.map((p) => { return paths.src + p; });
    return gulp.src(static.concat(html), { base: paths.src })
        .pipe(gulp.dest(paths.build));
});

// Compile tasks
gulp.task("css:compile", function () {
    return gulp.src(paths.build + paths.css)
        .pipe(concat("wordino.css"))
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.compile));
});

gulp.task("js:compile", function () {
    let all = paths.js.map((p) => { return paths.build + p; });
    let polyfill = "./node_modules/@babel/polyfill/dist/polyfill.min.js";

    gulp.src(polyfill).pipe(gulp.dest(paths.compile));

    return gulp.src(all)
        .pipe(concat("wordino.js"))
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest(paths.compile));
});

gulp.task("static:compile", function () {
    let all = paths.static.map((p) => { return paths.src + p; });
    return gulp.src(all, { base: paths.src })
        .pipe(gulp.dest(paths.compile));
});

gulp.task("html:compile", function () {
    let html = paths.html.map((p) => { return paths.src + p; });
    return gulp.src(html, { base: paths.src })
        .pipe(htmlreplace({ css: 'wordino.css', js: ['polyfill.min.js', 'wordino.js'] }))
        .pipe(gulp.dest(paths.compile));
});

gulp.task("build", gulp.series("clean", "sass", "css:build", "js:build", "static:build"));
gulp.task("compile", gulp.series("build", "css:compile", "js:compile", "static:compile", "html:compile"));
