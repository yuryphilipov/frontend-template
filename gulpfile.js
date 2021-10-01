const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');


const browsersync = () => {
	browserSync.init({
		server: { baseDir: 'app/' },
		notify: false,
		online: true
	});
}

const scripts = () => {
	return src([
			'node_modules/jquery/dist/jquery.min.js',
			'node_modules/uikit/dist/js/uikit.min.js',
			'app/js/app.js',
		])
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(dest('app/js/'))
		.pipe(browserSync.stream())
}

const styles = () => {
	return src('app/sass/main.sass')
		.pipe(sass())
		.pipe(concat('app.min.css'))
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
		.pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
		.pipe(dest('app/css/'))
		.pipe(browserSync.stream())
}

const libstyles = () => {
	return src([
			'node_modules/uikit/dist/css/uikit.min.css',
		])
		.pipe(concat('libs.min.css'))
		.pipe(dest('app/css/'))
		.pipe(browserSync.stream())
}

const startwatch = () => {
	watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
	watch('app/**/sass/**/*', styles);
	watch('app/**/*.html').on('change', browserSync.reload);
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.libstyles = libstyles;
exports.styles = styles;
exports.default = parallel(libstyles, styles, scripts, browsersync, startwatch);