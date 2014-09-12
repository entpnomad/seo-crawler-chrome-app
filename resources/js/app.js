!function(){"use strict";var app=angular.module("myCrawler",[]);app.factory("urlData",function($http,$q){return{getData:function(url){var deferred=$q.defer();return $http.get(url).success(function(data){deferred.resolve(data)}).error(function(data,status){deferred.reject(status)}),deferred.promise}}}),app.directive("showTab",function(){return{link:function(scope,element){element.click(function(e){if(e.preventDefault(),!element.parent().hasClass("disabled")){$(element).tab("show"),tab=element.parent().attr("id");var tabid="#"+tab+"tab";$(".navtabs").hide(),$(tabid).show()}})}}}),app.controller("CrawlerController",function($scope,urlData){this.website=web,this.navtab=tab,$scope.CheckUrl=function(){var checkUrl=web.hostname;checkUrl.match(/^(http:\/\/)/i)&&(web.protocol="http://",checkUrl=checkUrl.replace(/^(http:\/\/)/i,"")),checkUrl.match(/^(https:\/\/)/i)&&(web.protocol="https://",checkUrl=checkUrl.replace(/^(https:\/\/)/i,"")),web.hostname=checkUrl,web.invalidurl=checkUrl.match(/^(https?:\/\/)?([a-z0-9]+\.*-*)+(\.[a-z]{2,6})$/i)?!1:!0},$scope.SelectProtocol=function(protocol){web.protocol=protocol},$scope.ShowRobots=function(){return null===web.robotsurl?"false":"true"},$scope.ShowSitemaps=function(){return web.sitemaps=$scope.ArrayUnique(web.sitemaps),0===web.sitemaps.length?"false":"true"},$scope.ShowPages=function(){return web.pages=$scope.ArrayUnique(web.pages),0===web.pages.length?"false":"true"},$scope.ArrayUnique=function(a){return a.reduce(function(p,c){return p.indexOf(c)<0&&p.push(c),p},[])},$scope.CodeComment=function(line){return line.indexOf("#")>-1?"codecomment":void 0},$scope.parseRobots=function(data){var robotsArray=data.match(/[^\r\n]+/g);web.robotstxt=robotsArray;for(var i in robotsArray)if(robotsArray[i].match(/sitemap:/i)){var sitemap=robotsArray[i].replace(/sitemap\:/i,"").trim();-1===web.sitemaps.indexOf(sitemap)&&web.sitemaps.push(sitemap)}},$scope.parseSitemap=function(data){var urlsArray1=data.match(/(\<loc\>)([a-z0-9:\/\-\.\?\=\#\_])*(\<\/loc\>)/gi),urlsArray2=data.match(/(\<link\>)([a-z0-9:\/\-\.\?\=\#\_])*(\<\/link\>)/gi);for(var i in urlsArray1){var item=urlsArray1[i].trim(),unit=item.replace(/\<\/?loc\>/gi,"").trim();unit.match(/(\.xml)$/i)?(web.sitemaps.push(unit),-1===web.sitemaps.indexOf(unit)&&web.sitemaps.push(unit)):-1===web.urls.indexOf(unit)&&web.urls.push(unit)}for(var i in urlsArray2){var item=urlsArray2[i].trim(),unit=item.replace(/\<\/?link\>/gi,"").trim();-1===web.urls.indexOf(unit)&&web.urls.push(unit)}},$scope.DoCrawl=function(){web.urls=[],web.sitemaps=[];var robotsUrl=(web.protocol+web.hostname,web.protocol+web.hostname+"/robots.txt"),sitemapUrl=web.protocol+web.hostname+"/sitemap.xml";web.sitemaps.push(sitemapUrl),urlData.getData(robotsUrl).then(function(data){web.robotsurl=robotsUrl,$scope.parseRobots(data)}).then(function(){for(var i in web.sitemaps)urlData.getData(web.sitemaps[i]).then(function(data){$scope.parseSitemap(data);for(var j in web.sitemaps)urlData.getData(web.sitemaps[j]).then(function(data){$scope.parseSitemap(data)})})}).then(function(){})},$scope.IsInArray=function(value,array){return array.indexOf(value)>-1},$scope.$watch("web",function(){},!0),setInterval(function(){web.urls=$scope.ArrayUnique(web.urls),0!==web.urls.length&&web.urls.forEach(function(url){if(!$scope.IsInArray(url,web.processed)){web.processed.push(url);var crawlurl="http://www.metricspot.com/api/crawlurl?url="+url;urlData.getData(crawlurl).then(function(data){web.pages.push(data)})}})},1e3)});var tab="home",web={hostname:null,protocol:"http://",invalidurl:!0,robotsurl:null,robotstxt:null,sitemaps:[],urls:[],processed:[],pages:[]}}();