import gulp from "gulp";
import { deleteAsync } from "del";
import webp from "gulp-webp";
import webphtml from "gulp-webp-html-nosvg";

import plumber from "gulp-plumber";
import notify from "gulp-notify";

import gcmq from "gulp-group-css-media-queries";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import gulpSass from "gulp-sass";
import sass from "sass";

import concat from "gulp-concat";

import browserSync from "browser-sync";

import webpack from "webpack-stream";
import Dotenv from "dotenv-webpack";
import newer from "gulp-newer";
import imagemin from "gulp-imagemin";
import sprite from "gulp-svg-sprite";

import gulpif from "gulp-if";
import gulpPages from "gulp-gh-pages";
import path from "./gulp.config.js";

const scss = gulpSass(sass);

const port = 3000;

const isBuild = process.env.NODE_ENV === "production";

const html = () =>
  gulp
    .src(path.src.html)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "HTML",
          message: "Error: <%= error.message %>",
        }),
      })
    )
    .pipe(gulpif(isBuild, webphtml()))
    .pipe(gulp.dest(path.build.html));

const style = () =>
  gulp
    .src(path.src.scss, { sourcemaps: !isBuild })
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "SCSS",
          message: "Error: <%= error.message %>",
        }),
      })
    )
    .pipe(scss())
    .pipe(gulpif(isBuild, gcmq()))
    .pipe(
      gulpif(
        isBuild,
        autoprefixer({
          overrideBrowserslist: ["last 10 version"],
          grid: "autoplace",
        })
      )
    )
    .pipe(concat("style.css"))
    .pipe(gulp.dest(path.build.css))
    .pipe(gulpif(isBuild, cleanCSS({ compatibility: "ie8" })))
    .pipe(concat("style.css"))
    .pipe(gulp.dest(path.build.css));

const js = () =>
  gulp
    .src(path.src.js, { sourcemaps: !isBuild })
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "JS",
          message: "Error: <%= error.message %>",
        }),
      })
    )
    .pipe(
      webpack({
        plugins: [new Dotenv()],
        mode: isBuild ? "production" : "development",
        output: {
          filename: "script.js",
        },
      })
    )
    .pipe(gulp.dest(path.build.js));

const images = () =>
  gulp
    .src(path.src.images)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "Images",
          message: "Error: <%= error.message %>",
        }),
      })
    )
    .pipe(newer(path.build.images))
    .pipe(gulpif(isBuild, webp()))
    .pipe(gulpif(isBuild, gulp.dest(path.build.images)))
    .pipe(gulpif(isBuild, gulp.src(path.src.images)))
    .pipe(gulpif(isBuild, newer(path.build.images)))
    .pipe(
      gulpif(
        isBuild,
        imagemin({
          progressive: true,
          svgoPlugins: [
            {
              removeViewbox: false,
            },
          ],
          interplaced: true,
          opimizationLevel: 3,
        })
      )
    )
    .pipe(gulp.dest(path.build.images))
    .pipe(gulp.src(path.src.svgImages))
    .pipe(gulp.dest(path.build.images));

const svgSprite = () => {
  const config = {
    mode: {
      symbol: true,
    },
  };

  return gulp
    .src(path.src.svg)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "SVG Sprite",
          message: "Error: <%= error.message %>",
        }),
      })
    )
    .pipe(gulp.dest(`${path.build.svg}/svg`))
    .pipe(gulp.src(path.src.svg))
    .pipe(sprite(config))
    .pipe(concat("sprite.svg"))
    .pipe(gulp.dest(path.build.svg));
};

const reset = () => deleteAsync(path.clear);

const createGHPages = () => {
  return gulp
    .src(`${path.buildFolder}/**/*`, { allowEmpty: true })
    .pipe(gulpPages());
};

const watcher = () => {
  browserSync.init({
    server: {
      baseDir: path.buildFolder,
      index: "/index.html",
    },
    port,
  });
  gulp.watch(path.watch.html, html).on("change", browserSync.reload);
  gulp.watch(path.watch.scss, style).on("change", browserSync.reload);
  gulp.watch(path.watch.js, js).on("change", browserSync.reload);
  gulp.watch(path.watch.images, images).on("change", browserSync.reload);
  gulp.watch(path.watch.svg, svgSprite).on("change", browserSync.reload);
};

const mainTask = gulp.parallel(html, style, js, images);
const dev = gulp.series(reset, svgSprite, mainTask, watcher);
const build = gulp.series(reset, svgSprite, mainTask);

const deploy = gulp.series(build, createGHPages);

gulp.task("dev", dev);
gulp.task("build", build);
gulp.task("deploy", deploy);
gulp.task(svgSprite);
