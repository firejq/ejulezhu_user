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
		//.pipe($.htmlmin({
		//	removeComments: true,//清除HTML注释
		//	//collapseWhitespace: true//压缩HTML
		//	//collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
		//	//removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
		//	//removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
		//	//removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
		//	//minifyJS: true,//压缩页面JS
		//	//minifyCSS: true//压缩页面CSS
		//}))
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
		.pipe($.base64())
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
		// root: [app.prdPath],
		root: '.',
		livereload: true,
		port: 80
	});

	open('http://localhost:80/dist');

	gulp.watch('bower_components/**/*', ['lib']);
	gulp.watch(app.srcPath + '**/*.html', ['html']);
	gulp.watch(app.srcPath + 'data/**/*.json', ['json']);
	gulp.watch(app.srcPath + 'styles/**/*.less', ['less']);
	gulp.watch(app.srcPath + 'scripts/**/*.js', ['js']);
	gulp.watch(app.srcPath + 'images/**/*', ['image']);
});

gulp.task('default', ['clean', 'serve']);
