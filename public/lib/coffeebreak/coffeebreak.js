/*jshint multistr:true */
(function() {

	var CoffeeBreak = {
		debug: true	
	};

	var cbconf;

	/**
	 * Render main navigation
	 */
	CoffeeBreak.renderNavigation = function() {
		var $nav,
			content = '';


		cbconf.projects.forEach(function(item) {
			content += '\
				<div class="navItem">\
					<h1><a href="/projects/' + item.dirName + '/SpecRunner.html">' + item.project + '</a></h1>\
					<a class="covLink" href="/' + item.dirName + '/SpecRunner.html">Tests</a>\
					<a class="testLink" href="/' + item.dirName + '/CoverageRunner.html">Coverage</a>\
				</div>\
			';
		});

		$nav = $.parseHTML('<nav id="mainNavigation">\
			<a href="/" class="navItem"><img src="/lib/coffeebreak/img/Coffee_beans.svg" width="32" height="32"></a>\
			' + content + '\
			</nav>');
		
		$('#coffeeBreakHeader').append($nav);
	};

	$.getJSON('/cbconf.json', function(data) {
		cbconf = data;
		// console.log('cbconf', cbconf);
		$(function() {
			CoffeeBreak.renderNavigation();
		});
	});

	window.CoffeeBreak = CoffeeBreak;
})();