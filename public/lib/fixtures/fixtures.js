"use strict";
(function(fixtures){
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // NodeJS
        module.exports = fixtures;
    } else if (typeof define === 'function' && define.amd){
        define(function(){
            return fixtures;
        });
    } else{
        var global = (false || eval)("this");
        global.fixtures = fixtures;
    }

}(new function(){
        var fixturesCache = {};
        var self = this;

        self.containerId = 'js-fixtures';
        self.path = 'fixtures';
        
        self.set = function(html){
            self.cleanUp();
            addToContainer(html);
        };
        self.appendSet = function(html){
            addToContainer(html);
        };
        self.preload = function(){
            self.read.apply(self, arguments);
        };
        self.load = function(){
            self.cleanUp();
            createContainer(self.read.apply(self, arguments));
        };
        self.appendLoad = function(){
            addToContainer(self.read.apply(self, arguments));
        };
        self.read = function(){
            var htmlChunks = [];

            var fixtureUrls = arguments;
            for (var urlCount = fixtureUrls.length, urlIndex = 0; urlIndex < urlCount; urlIndex++){
                htmlChunks.push(getFixtureHtml(fixtureUrls[urlIndex]));
            }
            return htmlChunks.join('');
        };
        self.clearCache = function(){
            fixturesCache = {};
        };
        self.cleanUp = function(){
            var div = document.getElementById(self.containerId);
            if(!div) {
                return null;
            }

            div.parentNode.removeChild(div);
        };
        var createContainer  = function(html){

            var div = document.createElement('div');
            div.setAttribute("id", self.containerId);
            div.style.position = "absolute";
            div.style.left = "-1000px";
            div.style.top = "-1000px";
            div.style.width = "100px";
            div.style.height = "100px";
            div.style.overflow = "hidden";
            document.body.appendChild(div);
            div.innerHTML = html;
        };
        var addToContainer = function(html){
            var container = document.getElementById(self.containerId);
            if (!container){
                createContainer(html);
            } else{
                container.innerHTML += html;
            }
        };
        var getFixtureHtml = function(url){
            if (typeof fixturesCache[url] === 'undefined'){
                loadFixtureIntoCache(url);
            }
            return fixturesCache[url];
        };
        var loadFixtureIntoCache = function(relativeUrl){
            var url = makeFixtureUrl(relativeUrl);
            var request = new XMLHttpRequest();
            request.open("GET", url + "?" + new Date().getTime(), false);
            request.send(null);
            fixturesCache[relativeUrl] = request.responseText;
        };
        var makeFixtureUrl = function(relativeUrl){
            return self.path.match('/$') ? self.path + relativeUrl : self.path + '/' + relativeUrl;
        };
    }
));
