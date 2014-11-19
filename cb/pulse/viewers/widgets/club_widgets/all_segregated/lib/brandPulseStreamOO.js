function streamChart(){
    //var margin = {top: 3, right: 5, bottom: 3, left: 0},
    //    width = 100,
    //    height = 600;

    function chart(selection){
        selection.each(function(data){

moment.lang('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s",
        //s:  "%d seconds",
        //m:  "a minute",
        s:  "%ds",
        //m:  "%d m",
        //mm: "%d m",
        m:  "%dm",
        mm: "%dm",
        h:  "an hour",
        hh: "%d hours",
        d:  "a day",
        dd: "%d days",
        M:  "a month",
        MM: "%d months",
        y:  "a year",
        yy: "%d years"
    }
});
            console.log(data)

            var numberFormat = d3.format(',')

            var tweetsBox = d3.select(this);

            tweetsBox.selectAll('.tweetdiv')
                .remove()

            var tweet = tweetsBox.selectAll('.tweetdiv')
                .data(data, function(d) {return d.id; });

            var enterDiv = tweet.enter()
                .append("li")
                .attr("class", "tweetdiv")
                .attr("id", function(d,i) {return 'id' + i})
                .style("opacity", 0);

            var pic = enterDiv.append("div")
                .attr('class', 'pictureDiv')

            pic.selectAll('.picture')
                .data(function(d) { return [d]; })
                //.enter().append('img')
                .enter().append('div')
                .attr('class', 'picture')
                //.attr('src', function(d) { return d.imgsrc; });
                .html(function(d) {return '<a href=" ' + d.profileUrl + ' " target="_blank"><img class="streamImage" src=" ' + d.imgsrc + ' "></a> ' })

            var containerDiv = enterDiv.append("div")
                .attr('class', 'containerDiv')

            var headerDiv = containerDiv.append("div")
                .attr("class", "headerDiv")

            //var bothUsernames = containerDiv.append("div")
            var bothUsernames = headerDiv.append("div")
                .attr("class", 'bothUserNames')

            bothUsernames.append("span")
                .attr("class", "displayname")
                //.text(function(d) {return d.displayname}); 
                .html(function(d) {return ' <a href=" ' + d.profileUrl + ' " class="displayNameLink" target="_blank"> ' + d.displayname + ' </a> ' }); 
                /*
                .text(function(d) {
                    var displayName = d.displayname;
                    var userName = d.username;
                    if (window.displayName){
                        if(6+displayName.length>50){ //this is whats inducing the error, maybe when there is no displayname
                            return "@" + displayName.slice(0,10) + "..."
                        } else {
                            return "@" + d.displayname
                        }
                    } else {
                        return "@" + d.displayname
                    }
                    /*
                    if(6+displayName.length>50){ //this is whats inducing the error, maybe when there is no displayname
                        return "@" + displayName.slice(0,10) + "..."
                    } else {
                        return "@" + d.displayname
                    }
                    */

                //})
                

            /*
            var bothNameAggregateLength = function() {
                return d.displayname + d.username;
            }
            console.log('HAIM HAIM')
            //console.log(bothNameAggregateLength())
            */

            /*
             function shortenName(name) {
                return $.trim(name).substring(0, 10).split(" ").slice(0, -1).join(" ") + "...";
            }
            console.log('++++++++++++++++++++++++++')
            console.log(shortenName('Anna KournikovaISHOTTY'))
            */
            bothUsernames.append("span")
                .attr("class", "username")
                //.text(function(d) {return "@" + d.username});
                //.html(function(d) {return "@" + d.username + '<a href="https://twitter.com/" target="_blank"><i class="fa fa-twitter"></i></a>' + moment(+d.datetime).fromNow(true) });
                //.html(function(d) {return "@" + d.username + '<a href="https://twitter.com/" target="_blank"><i class="fa fa-twitter"></i></a>' + '<a href=" ' + d.tweetUrl + ' " target="_blank" class="timeagoTweetText">' + moment(String(d.datetime)).fromNow(true) + '</a>' });
                //.html(function(d) {return "@" + d.username + '<a href="https://twitter.com/" target="_blank"><i class="fa fa-twitter"></i></a>' + '<a href=" ' + d.tweetUrl + ' " target="_blank" class="timeagoTweetText">' + moment(String(d.datetime)).format('DD MMM') + '</a>' });
                //.html(function(d) {return "@" + d.username + '<a href="https://twitter.com/" target="_blank"><i class="fa fa-twitter"></i></a>' + '<a href=" ' + d.tweetUrl + ' " target="_blank" class="timeagoTweetText">' + moment.utc(String(d.datetime)).fromNow() + '</a>' });
                .html(function(d) {return "@" + '<a href=" ' + d.profileUrl + ' " target="_blank" class="twitterUsername">' + d.username+ ' </a> ' + '<a href="https://twitter.com/" target="_blank"><i class="fa fa-twitter"></i></a>' + '<a href=" ' + d.tweetUrl + ' " target="_blank" class="timeagoTweetText">' + moment.utc(String(d.datetime)).fromNow() + '</a>' });
                /*
                .text(function(d) {
                    var displayName = d.displayname;
                    var userName = d.username;
                    if(userName.length+displayName.length>20){
                        return "@" + userName.slice(0,6) + "..."
                    } else {
                        return "@" + d.username
                    }

                })
                */
/*
            var logoTimeDiv = headerDiv.append("div")
                .attr("class", 'logoTimeDiv')

            logoTimeDiv.append("span")
                .attr("class", "twitterLogo")
                .text("b")

            logoTimeDiv.append("span")
                .attr("class", "timeAgo")
                .text("1m ago")
*/
            containerDiv.append("div")
                .attr("class", "text")
                //.text(function(d) {return d.text}); Wrong/old code
                //.html(function(d,i) {return d.text});
                //.html(function(d,i) {return twttr.txt.autoLink(d.text)});
                .html(function(d,i) {
                    var mentionedUrlLinks = d.mentionedUrls;
                    if(mentionedUrlLinks === undefined || mentionedUrlLinks === null) {
                        console.log('undefined')
                        var endStr = d.text;
                    } else {
                        var origStr = d.text;
                        console.log(origStr)
                        //var pone = origStr.replace('Bryan', 'Feusse')
                        //console.log(pone)
                        var tempTweetText = [];
                        tempTweetText.push(d.text)
                        for(var i = 0; i < mentionedUrlLinks.length; i++) {
                            console.log(mentionedUrlLinks[i])
                            var oLink = mentionedUrlLinks[i].url;
                            console.log(oLink)
                            var dLink = mentionedUrlLinks[i].displayUrl;
                            console.log(dLink)
                            console.log(d.text)
                            console.log('-----------')
                            var lastTweetCheckedForUrls = tempTweetText.pop();
                            var endStr = lastTweetCheckedForUrls.replace(oLink, 'https://' + dLink)
                            tempTweetText.push(endStr)
                            //var pone = origStr.replace('Bryan', 'FEUSSE')
                            console.log(endStr)
                        }
                    }
                    //return origStr;
                    console.log('8888888888')
                    console.log(endStr)
                    console.log(tempTweetText)
                    console.log('8888888888')
                    //var correctTweetAllReplacements = tempTweetText;
                    //return d.text;
                    //return pone;
                    return twttr.txt.autoLink(endStr)
                    //return twttr.txt.autoLink(correctTweetAllReplacements)
                });

            var footerTextDiv = containerDiv.append('div')
                .attr('class', 'footerTextDiv')
                .attr('id', 'shortTermSecondaryFooter')

            footerTextDiv.append("div")
                .attr("class", "locationtext")
                //.text(leftLabel)
                //.html(leftLabel)
                //.html(function(d){return '<i class="fa fa-twitter"></i>' + moment(+d.datetime).fromNow() })
                //.html(function(d){return moment(+d.datetime).fromNow(true) })
                .text(leftLabel)
                /*
                .text(function(d) {
                    p = leftLabel
                    //for (var i in p) { if (p[i].geoType == "STATE") { console.log(p[i].name) }}
                    for (var i in p) { 
                        if (p[i].geoType == "STATE") { 
                            return p[i].name 
                        }
                    }  
                });
                */

            footerTextDiv.append("div")
                .attr("class", "followerCountText")
                .style('color', function(d) {
                    if (d.followerCount >= 50000) {
                        return "red"
                    } else if (d.followerCount >= 1000) {
                        return "steelblue"
                    }
                })
                .style("font-weight", function(d) {
                    if (d.followerCount >= 10000) {
                        return "bold"
                    }
                })
                .text(function(d) { return numberFormat(d.followerCount); })
                .insert("span")
                .text(" followers")

            
            var iconHoverDiv = containerDiv.append('div')
                .attr('class', 'iconHoverDiv')

            iconHoverDiv.append("div")
                .attr("class", "allIcons")
                .html(function(d) {
                    console.log('<a href="https://twitter.com/intent/tweet?in_reply_to=' + d.id + '" target="_blank"><i class="fa fa-reply"></i></a>' + '<a href="https://twitter.com/intent/retweet?tweet_id=' + d.id + '" target="_blank"><i class="fa fa-retweet"></i></a>' + '<a href="https://twitter.com/intent/favorite?tweet_id=' + d.id + '" target="_blank"><i class="fa fa-star"></i></a>')
                    return '<a href="https://twitter.com/intent/tweet?in_reply_to=' + d.id + '" target="_blank"><i class="fa fa-reply"></i></a>' + '<a href="https://twitter.com/intent/retweet?tweet_id=' + d.id + '" target="_blank"><i class="fa fa-retweet"></i></a>' + '<a href="https://twitter.com/intent/favorite?tweet_id=' + d.id + '" target="_blank"><i class="fa fa-star"></i></a>'
                })

            $(".iconHoverDiv").hide();
            $( " .tweetdiv " )
                .on("mouseenter", function() {
                    //$( ".vis-header" ).hover(function() {
                    console.log('HOVER')
                    //$(this).css("background-color", "red")
                    //$(this).css('background-color', 'red')
                    //$(this).find('.iconHoverDiv').show(300);
                    //$(this).find(".iconHoverDiv").show();
                    $(this).find(".iconHoverDiv").fadeIn();
                })
                .on("mouseleave", function() {
                    //$(".iconHoverDiv").hide();
                    $(".iconHoverDiv").fadeOut();
                })

            containerDiv.append("div")
                .attr("class", "retweetedByText")
                //.text(function(d) {return "retweeted by: " + d.username});
                .html(function(d){
                    if(d.lastRetweetAuthor) {
                        //return "retweeted by: " + d.lastRetweetAuthor;
                        return 'Retweeted by: ' + '<a class="retweetedByTextUrl" href="http://www.twitter.com/' + d.lastRetweetAuthor + ' " target="_blank" class="twitterUsername">' + d.lastRetweetAuthor + ' </a> '
                    }
                })

            /*
            containerDiv.append("div")
                .attr("class", "locationtext")
                .attr("id", "stateName")
                .text(leftLabel)
            */
            tweet.transition()
                .duration(300)
                .style("opacity", 1)


            /*
            var tweet = tweetsBox.selectAll('.tweetdiv')
                .data(data, function(d) {return +d.id; });

            var enterDiv = tweet.enter()
                .append("li")
                .attr("class", "tweetdiv")
                .attr("id", function(d,i) {return 'id' + i})
                .style("opacity", 0);

            var containerDiv = enterDiv.append("div")
                .attr('class', 'containerDiv')

            var bothUsernames = containerDiv.append("div")
                .attr("class", 'bothUserNames')

            bothUsernames.append("span")
                .attr("class", "displayname")
                //.text(function(d) {return d.displayname});
                .text(leftLabel)
            */

        })
    }

    chart.leftLabel = function(value) {
        if (!arguments.length) return leftLabel;
        leftLabel = value;
        return chart;
    };

    return chart;
}
/*
function streamingdata(data) {

data.forEach(function(d) {
            //d.date = parseDate(d.date);
            d.date = moment(+d.time).fromNow();
            d.id = +d.id;
            d.authorid = +d.authorid;
            d.klout = +d.klout;
            d.followerCount = +d.followerCount;
            //d.newtext = d.text;
        });

$("#tweet-stream").empty()

var tweetsBox = d3.select("#tweet-stream");

var numberFormat = d3.format(',')

tweetsBox.selectAll('.tweetdiv')
    .remove()
    
    console.log('streaming data %%%%%%%%%%%%%%%%%%%%%%%%%')
    console.log(data)
    
    
    var tweet = tweetsBox.selectAll('.tweetdiv')
        .data(data, function(d) {return d.id; });

    var enterDiv = tweet.enter()
        .append("li")
        .attr("class", "tweetdiv")
        .attr("id", function(d,i) {return 'id' + i})
        .style("opacity", 0);

    var pic = enterDiv.append("div")
        .attr('class', 'pictureDiv')

    pic.selectAll('.picture')
        .data(function(d) { return [d]; })
        .enter().append('img')
        .attr('class', 'picture')
        .attr('src', function(d) { return d.imgsrc; });

    var containerDiv = enterDiv.append("div")
            .attr('class', 'containerDiv')

    var bothUsernames = containerDiv.append("div")
        .attr("class", 'bothUserNames')

    bothUsernames.append("span")
        .attr("class", "displayname")
        .text(function(d) {return d.displayname});

    bothUsernames.append("span")
        .attr("class", "username")
        .text(function(d) {return "@" + d.username});

    //containerDiv.append("br")

    containerDiv.append("div")
        .attr("class", "text")
        //.text(function(d) {return d.text});
        .html(function(d,i) {return d.text});

    //maybe here use jquery to force text into div, or to try to get html into d3

    //var footerTextDiv = containerDiv.append("div")
    //    .attr("class", "footerTextDiv")

var footerTextDiv = containerDiv.append('div')
    .attr('class', 'footerTextDiv')

    footerTextDiv.append("div")
    //footerTextDiv.append("span")
        .attr("class", "locationtext")
        .text(function(d) {
            p = d.location
            //for (var i in p) { if (p[i].geoType == "STATE") { console.log(p[i].name) }}
            for (var i in p) { 
                if (p[i].geoType == "STATE") { 
                    return p[i].name 
                }
            }  

        });


     footerTextDiv.append("div")
        .attr("class", "followerCountText")
        .style('color', function(d) {
            if (d.followerCount >= 50000) {
                return "red"
            } else if (d.followerCount >= 1000) {
                return "steelblue"
            }
        })
        .style("font-weight", function(d) {
            if (d.followerCount >= 10000) {
                return "bold"
            }
        })
        .text(function(d) { return numberFormat(d.followerCount); })
        .insert("span")
        .text(" followers")

    tweet.transition()
        .duration(300)
        .style("opacity", 1)
    
//} //end of function update(data)
*/
/*
//setInterval(function() {
setTimeout(function() {
    //console.log(data)
    //console.log(originalData)
    console.log(data)
    data.pop(); 
    console.log(data)

    var newdata = data;

    var newPost = originalData.shift()
    //console.log(originalData)
    newdata.unshift(newPost)
    console.log('pone')
    console.log(data)

    update(newdata)
}, 2000) 
*/

    /*
    $("#tweetContainer").on("resize", function() {
        //$(".tweetdiv").height($(".tweetdiv").height()).width($(".tweetdiv").width());
        $("#tweetContainer").height( $("#tweetContainer").width()*2 )//.width($(".tweetdiv").width());
        //map.invalidateSize();
    }).trigger("resize");
    */

 //}// end of wrapper function
