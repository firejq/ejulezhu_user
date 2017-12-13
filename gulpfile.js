var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');
//var autoprefixer = required('gulp-autoprefixer');

var app = {
	srcPath: 'app/',
	//devPath: 'build/',
	prdPath: 'dist/'
};

gulp.task('lib', function() {
	gulp.src('bower_components/**/*.js')
		.pipe(gulp.dest(app.prdPath + 'vendor'))
		.pipe($.connect.reload());
});

gulp.task('html', function() {
	gulp.src(app.srcPath + '**/*.html')
		.pipe(gulp.dest(app.prdPath))
		.pipe($.connect.reload());
});

gulp.task('txt', function() {
	gulp.src(app.srcPath + '*.txt')
		.pipe(gulp.dest(app.prdPath))
		.pipe($.connect.reload());
});

gulp.task('json', function() {
	gulp.src(app.srcPath + 'data/**/*.json')
		.pipe(gulp.dest(app.prdPath + 'data'))
		.pipe($.connect.reload());
});

gulp.task('less', function() {
	gulp.src(app.srcPath + 'styles/index.less')
		.pipe($.plumber())
		.pipe($.less())
		.pipe($.autoprefixer({
			browsers: ['last 2 versions', 'Android >= 4.0', 'last 3 Safari versions', 'iOS 7'],
			cascade: false
		}))
		.pipe($.cssmin())
		.pipe(gulp.dest(app.prdPath + 'css'))
		.pipe($.connect.reload());
});

gulp.task('js', function() {
	gulp.src(app.srcPath + 'scripts/**/*.js')
		//.pipe($.plumber())
		.pipe($.concat('index.js'))
		.pipe($.uglify())
		.pipe(gulp.dest(app.prdPath + 'js'))
		.pipe($.connect.reload());
});

gulp.task('image', function() {
	gulp.src(app.srcPath + 'images/**/*')
		.pipe($.plumber())
		.pipe($.imagemin())
		.pipe(gulp.dest(app.prdPath + 'images'))
		.pipe($.connect.reload());
});

gulp.task('build', ['js', 'less', 'lib', 'txt', 'html', 'json', 'image']);

gulp.task('clean', function() {
	gulp.src([app.prdPath])
		.pipe($.clean());
});

gulp.task('serve', ['build'], function() {
	$.connect.server({
		root: [app.prdPath],
		livereload: true,
		port: 80
	});

	open('http://localhost:80');

	gulp.watch('bower_components/**/*', ['lib']);
	gulp.watch(app.srcPath + '**/*.html', ['html']);
	gulp.watch(app.srcPath + 'data/**/*.json', ['json']);
	gulp.watch(app.srcPath + 'styles/**/*.less', ['less']);
	gulp.watch(app.srcPath + 'scripts/**/*.js', ['js']);
	gulp.watch(app.srcPath + 'images/**/*', ['image']);
});

gulp.task('default', ['clean', 'serve']);
