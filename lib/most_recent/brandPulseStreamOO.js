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

            bothUsernames.append("span")
                .attr("class", "username")
                //.text(function(d) {return "@" + d.username});
                //.html(function(d) {return "@" + d.username + '<a href="https://twitter.com/" target="_blank"><i class="fa fa-twitter"></i></a>' + moment(+d.datetime).fromNow(true) });
                //.html(function(d) {return "@" + d.username + '<a href="https://twitter.com/" target="_blank"><i class="fa fa-twitter"></i></a>' + '<a href=" ' + d.tweetUrl + ' " target="_blank" class="timeagoTweetText">' + moment(String(d.datetime)).fromNow(true) + '</a>' });
                //.html(function(d) {return "@" + d.username + '<a href="https://twitter.com/" target="_blank"><i class="fa fa-twitter"></i></a>' + '<a href=" ' + d.tweetUrl + ' " target="_blank" class="timeagoTweetText">' + moment(String(d.datetime)).format('DD MMM') + '</a>' });
                //.html(function(d) {return "@" + d.username + '<a href="https://twitter.com/" target="_blank"><i class="fa fa-twitter"></i></a>' + '<a href=" ' + d.tweetUrl + ' " target="_blank" class="timeagoTweetText">' + moment.utc(String(d.datetime)).fromNow() + '</a>' });
                .html(function(d) {return "@" + '<a href=" ' + d.profileUrl + ' " target="_blank" class="twitterUsername">' + d.username+ ' </a> ' + '<a href="https://twitter.com/" target="_blank"><i class="fa fa-twitter"></i></a>' + '<a href=" ' + d.tweetUrl + ' " target="_blank" class="timeagoTweetText">' + moment.utc(String(d.datetime)).fromNow() + '</a>' });

            containerDiv.append("div")
                .attr("class", "text")
                //.text(function(d) {return d.text}); Wrong/old code
                //.html(function(d,i) {return d.text});
                //.html(function(d,i) {return twttr.txt.autoLink(d.text)});
                .html(function(d,i) {
                    var mentionedUrlLinks = d.mentionedUrls;
                    if(mentionedUrlLinks === undefined || mentionedUrlLinks === null) {
                        //console.log('undefined')
                        var endStr = d.text;
                    } else {
                        var origStr = d.text;
                        var tempTweetText = [];
                        tempTweetText.push(d.text);
                        for(var i = 0; i < mentionedUrlLinks.length; i++) {
                            var oLink = mentionedUrlLinks[i].url;
                            var dLink = mentionedUrlLinks[i].displayUrl;

                            var lastTweetCheckedForUrls = tempTweetText.pop();
                            var endStr = lastTweetCheckedForUrls.replace(oLink, 'https://' + dLink);
                            tempTweetText.push(endStr);
                        }
                    }

                    return twttr.txt.autoLink(endStr)
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
                .text(leftLabel);


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
                    //console.log('<a href="https://twitter.com/intent/tweet?in_reply_to=' + d.id + '" target="_blank"><i class="fa fa-reply"></i></a>' + '<a href="https://twitter.com/intent/retweet?tweet_id=' + d.id + '" target="_blank"><i class="fa fa-retweet"></i></a>' + '<a href="https://twitter.com/intent/favorite?tweet_id=' + d.id + '" target="_blank"><i class="fa fa-star"></i></a>')
                    return '<a href="https://twitter.com/intent/tweet?in_reply_to=' + d.id + '" target="_blank"><i class="fa fa-reply"></i></a>' + '<a href="https://twitter.com/intent/retweet?tweet_id=' + d.id + '" target="_blank"><i class="fa fa-retweet"></i></a>' + '<a href="https://twitter.com/intent/favorite?tweet_id=' + d.id + '" target="_blank"><i class="fa fa-star"></i></a>'
                })

            $(".iconHoverDiv").hide();
            $( " .tweetdiv " )
                .on("mouseenter", function() {
                    //$( ".vis-header" ).hover(function() {
                    //console.log('HOVER')
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
                });

            tweet.transition()
                .duration(300)
                .style("opacity", 1);
        });
    }

    chart.leftLabel = function(value) {
        if (!arguments.length) return leftLabel;
        leftLabel = value;
        return chart;
    };

    return chart;
}