const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const fileInclude = require('gulp-file-include');
const jsPlugins = [
	'node_modules/jquery/dist/jquery.min.js',
	'node_modules/uikit/dist/js/uikit.min.js',
];
const cssPlugins = [
	'node_modules/uikit/dist/css/uikit.min.css',
];

const browsersync = () => {
	browserSync.init({
		server: { baseDir: 'dist/' },
		notify: false,
		online: true
	});
}

const libscripts = () => {
	return src(jsPlugins)
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(dest('dist/js/'))
		.pipe(browserSync.stream())
}

const scripts = () => {
	return src('app/js/app.js')
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(dest('dist/js/'))
		.pipe(browserSync.stream())
}

const libstyles = () => {
	return src(cssPlugins)
		.pipe(concat('libs.min.css'))
		.pipe(dest('dist/css/'))
		.pipe(browserSync.stream())
}

const styles = () => {
	return src('app/sass/main.sass')
		.pipe(sass())
		.pipe(concat('app.min.css'))
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
		.pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
		.pipe(dest('dist/css/'))
		.pipe(browserSync.stream())
}

const fileinclude = () => {
	return src(['app/html/**/*.html', '!app/html/_includes/**/*'])
		.pipe(fileInclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(dest('dist/'))
		.pipe(browserSync.stream())
}

const startwatch = () => {
	watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
	watch('app/**/sass/**/*', styles);
	watch('app/**/html/**/*', fileinclude);
	watch('app/html/**/*.html').on('change', browserSync.reload);
}

exports.browsersync = browsersync;
exports.libscripts = libscripts;
exports.scripts = scripts;
exports.libstyles = libstyles;
exports.styles = styles;
exports.fileinclude = fileinclude;
exports.default = parallel(libstyles, styles, libscripts, scripts, fileinclude, browsersync, startwatch);