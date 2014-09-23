!function(){"use strict";var app=angular.module("myCrawler",[]);app.factory("urlData",function($http,$q){return{getData:function(url){var deferred=$q.defer();return $http.get(url).success(function(data){deferred.resolve(data)}).error(function(data,status){deferred.reject(status)}),deferred.promise}}}),app.directive("showTab",function(){return{link:function(scope,element){element.click(function(e){if(e.preventDefault(),!element.parent().hasClass("disabled")){$(element).tab("show"),tab=element.parent().attr("id");var tabid="#"+tab+"tab";$(".navtabs").hide(),$(tabid).show()}})}}}),app.controller("CrawlerController",function($scope,urlData){this.website=web,this.navtab=tab,$scope.CheckUrl=function(){var checkUrl=web.hostname.replace(/\/$/,"");checkUrl.match(/^(http:\/\/)/i)&&(web.protocol="http://",checkUrl=checkUrl.replace(/^(http:\/\/)/i,"")),checkUrl.match(/^(https:\/\/)/i)&&(web.protocol="https://",checkUrl=checkUrl.replace(/^(https:\/\/)/i,"")),web.hostname=checkUrl,web.invalidurl=checkUrl.match(/^(https?:\/\/)?([a-z0-9]+\.*-*)+(\.[a-z]{2,6})$/i)?!1:!0},$scope.SelectProtocol=function(protocol){web.protocol=protocol},$scope.ShowRobots=function(){return null===web.robotsurl?"false":"true"},$scope.ShowSitemaps=function(){return web.sitemaps=$scope.ArrayUnique(web.sitemaps),0===web.sitemaps.length?"false":"true"},$scope.ShowPages=function(){return web.pages=$scope.ArrayUnique(web.pages),0===web.pages.length?"false":"true"},$scope.ShowImages=function(){return 0===web.images.length?"false":"true"},$scope.ShowLinks=function(){var sizeext=$scope.ObjectSize(web.external),sizeint=$scope.ObjectSize(web.internal);return 0===sizeext&&0===sizeint?"false":"true"},$scope.ShowExternal=function(){var size=$scope.ObjectSize(web.external);return 0===size?"false":"true"},$scope.ShowInternal=function(){var size=$scope.ObjectSize(web.internal);return 0===size?"false":"true"},$scope.ObjectSize=function(obj){var key,size=0;for(key in obj)obj.hasOwnProperty(key)&&size++;return size},$scope.ArrayUnique=function(a){return a.reduce(function(p,c){return p.indexOf(c)<0&&p.push(c),p},[])},$scope.CodeComment=function(line){return line.indexOf("#")>-1?"codecomment":void 0},$scope.parseRobots=function(data){var robotsArray=data.match(/[^\r\n]+/g);web.robotstxt=robotsArray;for(var i in robotsArray)if(robotsArray[i].match(/sitemap:/i)){var sitemap=robotsArray[i].replace(/sitemap\:/i,"").trim();-1===web.sitemaps.indexOf(sitemap)&&web.sitemaps.push(sitemap)}},$scope.crawlSitemaps=function(){for(var i in web.sitemaps)urlData.getData(web.sitemaps[i]).then(function(data){$scope.parseSitemap(data);for(var j in web.sitemaps)urlData.getData(web.sitemaps[j]).then(function(data){$scope.parseSitemap(data)})})},$scope.parseSitemap=function(data){var urlsArray1=data.match(/(\<loc\>)([a-z0-9:\/\-\.\?\=\#\_])*(\<\/loc\>)/gi),urlsArray2=data.match(/(\<link\>)([a-z0-9:\/\-\.\?\=\#\_])*(\<\/link\>)/gi);for(var i in urlsArray1){var item=urlsArray1[i].trim(),unit=item.replace(/\<\/?loc\>/gi,"").trim();unit.match(/(\.xml)$/i)?(web.sitemaps.push(unit),-1===web.sitemaps.indexOf(unit)&&web.sitemaps.push(unit)):-1===web.urls.indexOf(unit)&&(web.urls.push(unit),web.mapurls.push(unit))}for(var i in urlsArray2){var item=urlsArray2[i].trim(),unit=item.replace(/\<\/?link\>/gi,"").trim();-1===web.urls.indexOf(unit)&&(web.urls.push(unit),web.mapurls.push(unit))}},$scope.TrimString=function(string,length){var trimmedString=string.length>length?string.substring(0,length-3)+"...":string.substring(0,length);return trimmedString},$scope.FormatCount=function(num){return num>999999?(num/=1e6,num=Math.floor(num),num="+"+num+"m"):num>999&&(num/=1e3,num=Math.floor(num),num="+"+num+"k"),num},$scope.Unformat=function(num){return num.indexOf("m")>-1?(num=num.replace("m",""),num=parseInt(num),num=1e6*num):(num.indexOf("k")>-1&&(num=num.replace("k",""),num=parseInt(num),num=1e3*num),num)},$scope.GplusFormat=function(num){return num.indexOf("m")>-1?(num=num.replace("m",""),num=parseInt(num),num=1e6*num):num.indexOf("k")>-1?(num=num.replace("k",""),num=parseInt(num),num=1e3*num):(num.indexOf(".")>-1&&(num=num.replace(".",""),num=parseInt(num)),num)},$scope.CodeScore=function(code){return 200===code?"pass":"warning"},$scope.DoCrawl=function(){web.urls=[],web.sitemaps=[],web.processed=[],web.pages=[],web.robotstxt=null,web.mapurls=[],web.external=[],web.extlinks=[],web.internal=[],web.intlinks=[],web.images=[];var url=web.protocol+web.hostname,statusurl="http://www.metricspot.com/api/status?url="+url;urlData.getData(statusurl).then(function(data){url=data.target.replace(/\/$/,"");var robotsUrl=url+"/robots.txt",sitemapUrl=url+"/sitemap.xml";web.robotsurl=robotsUrl,web.sitemaps.push(sitemapUrl),web.urls.push(data.target),$scope.crawlSitemaps(),200===data.code?urlData.getData(robotsUrl).then(function(data){$scope.parseRobots(data),$scope.crawlSitemaps()}).then(function(){}):(301===data.code||302===data.code)&&(data.target.match(/^(http:\/\/)/i)&&(web.protocol="http://"),data.target.match(/^(https:\/\/)/i)&&(web.protocol="https://"),web.hostname=url.replace(web.protocol,""))})},$scope.IsInArray=function(value,array){return array.indexOf(value)>-1},$scope.$watch("web",function(){},!0),setInterval(function(){if(web.urls=$scope.ArrayUnique(web.urls),web.processed=$scope.ArrayUnique(web.processed),0!==web.urls.length&&web.processed.length<=10){var mainurl=web.protocol+web.hostname;web.urls.forEach(function(url){if(!$scope.IsInArray(url,web.processed)){web.processed.push(url);var crawlurl="http://www.metricspot.com/api/crawlurl?url="+url;urlData.getData(crawlurl).then(function(data){web.processed.push(data.url),data.social=[],data.social.fb=0,data.social.tw=0,data.social.gp=0,data.social.ln=0;var fbapiurl="https://graph.facebook.com/fql?q=SELECT%20total_count%20FROM%20link_stat%20WHERE%20url=%27"+encodeURIComponent(data.url)+"%27",twapiurl="http://cdn.api.twitter.com/1/urls/count.json?url="+data.url,gplusurl="https://plusone.google.com/_/+1/fastbutton?url="+encodeURIComponent(data.url),linkdurl="http://www.linkedin.com/countserv/count/share?url="+data.url+"&format=json";urlData.getData(fbapiurl).then(function(json){data.social.fb=$scope.FormatCount(json.data[0].total_count)}),urlData.getData(twapiurl).then(function(json){data.social.tw=$scope.FormatCount(json.count)}),urlData.getData(gplusurl).then(function(json){var count=json.match(/<div id=\"aggregateCount\" class=\"Oy\">(.*?)<\/div>/);count=$scope.GplusFormat(count[1]);{var formatted=$scope.FormatCount(count);$scope.Unformat(formatted)}data.social.gp=formatted}),urlData.getData(linkdurl).then(function(json){data.social.ln=$scope.FormatCount(json.count)}),data.displayurl=data.url.replace(/^http:\/\//i,""),data.displaytitle=$scope.TrimString(data.title,70),data.displaydescription=$scope.TrimString(data.metadescription,155),0===data.title.length||data.title===!1?(data.title=!1,data.titlemessage="ERROR - Not set",data.tscore="error"):data.title.length>70?(data.titlemessage="ERROR - Title too long",data.tscore="error"):(data.titlemessage=!1,data.tscore="pass"),data.descriptioncount>1?(data.descriptionmessage="ERROR - Multiple META DESCRIPTIONS",data.dscore="error"):0===data.metadescription.length||data.metadescription===!1?(data.metadescription=!1,data.descriptionmessage="ERROR - Not set",data.dscore="error"):data.metadescription.length>155?(data.descriptionmessage="ERROR - Description too long",data.dscore="error"):data.metadescription.length<70?(data.descriptionmessage="ERROR - Description too short",data.dscore="error"):data.metadescription.length>145&&data.metadescription.length<156?(data.descriptionmessage="WARNING - Description possibly cut",data.dscore="warning"):(data.descriptionmessage=!1,data.dscore="pass"),data.url===data.canonical&&data.canonical!==!1?(data.canonicalmessage=!1,data.cscore="pass"):data.url!==data.canonical&&data.canonical!==!1?(data.canonicalmessage="ERROR - URL and canonical do not match",data.cscore="error"):(data.canonicalmessage="ERROR - Canonical not set",data.cscore="error"),data.robots!==!1?(data.robotsmessage=!1,data.rscore="pass"):(data.robotsmessage="WARNING - Meta Robots not set",data.rscore="warning"),data.publisher!==!1?(data.publishermessage=!1,data.pscore="pass"):(data.publishermessage="WARNING - Google+ publisher not set",data.pscore="warning"),data.encoding!==!1?(data.escore="pass",data.encodingmessage=!1):(data.escore="error",data.encodingmessage="ERROR - encoding not set"),data.language!==!1?(data.lscore="pass",data.languagemessage=!1):(data.lscore="error",data.languagemessage="ERROR - language not set"),data.headers.h1.length?(data.hscore="pass",data.h1message=!1):(data.hscore="error",data.h1message="ERROR - H1 not set"),data.links.external.forEach(function(link){link.data=[];var linkdata=[];if(linkdata.anchor=link.anchor,linkdata.title=link.title,linkdata.url=data.url,linkdata.displayurl="..."+data.url.replace(mainurl,""),linkdata.rel=link.rel,data.author===!1&&null!==link.rel.match(/author/i)&&(data.author=link.href.replace(/(https?\:\/\/plus\.google\.com\/)/,"")),linkdata.score="-"===link.title?"warning":"pass",delete link.anchor,delete link.title,delete link.url,delete link.displayurl,delete link.rel,!$scope.IsInArray(link.href,web.extlinks)){web.extlinks.push(link.href);var statusurl="http://www.metricspot.com/api/status?url="+link.href;urlData.getData(statusurl).then(function(statusdata){link.code=statusdata.code,link.score=$scope.CodeScore(statusdata.code),link.data.push(linkdata),web.external.push(link),console.log(link)})}}),data.links.internal.forEach(function(link){link.data=[];var linkdata=[];if(linkdata.anchor=link.anchor,linkdata.title=link.title,linkdata.url=data.url,linkdata.displayurl="..."+data.url.replace(mainurl,""),linkdata.rel=link.rel,linkdata.score="-"===link.title?"warning":"pass",delete link.anchor,delete link.title,delete link.url,delete link.displayurl,delete link.rel,!$scope.IsInArray(link.href,web.intlinks)){web.intlinks.push(link.href);var statusurl="http://www.metricspot.com/api/status?url="+link.href;urlData.getData(statusurl).then(function(statusdata){link.code=statusdata.code,link.score=$scope.CodeScore(statusdata.code),link.data.push(linkdata),web.internal.push(link),console.log(link)})}$scope.IsInArray(link.href,web.processed)||$scope.IsInArray(link.href,web.urls)||web.urls.push(link.href)});var imgarray=$.map(data.images,function(value){return[value]});imgarray.forEach(function(img){delete img.anchornum,img.url=data.url,img.displayurl="..."+data.url.replace(mainurl,"");var filename=img.src.split("/");img.filename=filename[filename.length-1],img.score="-"===img.alt?"error":"-"===img.title?"warning":"pass",web.images.push(img)}),data.author!==!1?(data.authormessage=!1,data.ascore="pass"):(data.authormessage="WARNING - Google+ author not set",data.ascore="warning"),web.pages.push(data)})}})}},1e3)});var tab="home",web={hostname:null,protocol:"http://",invalidurl:!0,robotsurl:null,robotstxt:null,sitemaps:[],urls:[],mapurls:[],processed:[],pages:[],external:[],extlinks:[],internal:[],intlinks:[],images:[]}}();