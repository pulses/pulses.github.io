function streamingdataTwo(data) {
/*
var data = [
    {"id": 0, "date": "10m", "username": "HuffingtonPost", "displayname": "Huffington Post", "text": "Walmart.com  is selling 'Occupy Wall Street' posters http://huff.to/1cMxeti", "imgsrc":"../img/twitter/runningtigger_normal.jpg"},
    {"id": 1, "date": "10m", "username": "upwithsteve", "displayname": "Up w/ Steve Kornacki", "text": 'For more on this history, check out "THE RETAIL REVOLUTION: How Wal-Mart Created a Brave New World of Business" pic.twitter.com/bC7VrfJTqD', "imgsrc":"../img/twitter/runningtigger_normal.jpg"},
    {"id": 2, "date": "10m", "username": "Angel Casamiro", "displayname": "angelcasimiro", "text": "Got that Urban Outfitters taste with a Walmart budget.", "imgsrc":"../img/twitter/runningtigger_normal.jpg"},
    {"id": 3, "date": "10m", "username": "adage", "displayname": "Ad Age", "text": "Facebook, Walmart to help write rules on use of facial recognition technology http://bit.ly/Jz0ucY", "imgsrc":"../img/twitter/runningtigger_normal.jpg"},
    {"id": 4, "date": "10m", "username": "HuffPostImpact", "displayname": "Huffington Post Impact", "text": "WOW! Real-life Santa pays off $20,000 of Walmart layaway bills http://huff.to/1cLZFHO", "imgsrc":"../img/twitter/runningtigger_normal.jpg"},
    {"id": 5, "date": "10m", "username": "mrickel", "displayname": "Mark Rickel", "text": "#ShopWithAJock at #Walmart w/Bengals @mo_12_sanu to make Christmas brighter for kids in need. pic.twitter.com/1IsbMta5vK", "imgsrc":"../img/twitter/runningtigger_normal.jpg"},
    {"id": 6, "date": "10m", "username": "jdgreear", "displayname": "J.D. Greear", "text": "Per latest trip to #walmart,I'm pretty sure there's not 1 square in of the commercial cosmos over which the Duck Dynasty has not said â€œmine", "imgsrc":"../img/twitter/runningtigger_normal.jpg"},
    {"id": 7, "date": "10m", "username": "AbbeyNiezgoda", "displayname": "Abbey Niezgoda", "text": "About a dozen shoppers braving the weather to make it to Walmart in Milford. Watch for ice! #FirstAlertCT pic.twitter.com/VN5QVsEnaN", "imgsrc":"../img/twitter/runningtigger_normal.jpg"},
    {"id": 8, "date": "10m", "username": "CNBC", "displayname": "CNBC", "text": "Wal-Mart announced Apple's newest iPhones will be available for sale at its stores without a contract: http://cnb.cx/1czpkDJ â€¢ $AAPL $WMT", "imgsrc":"../img/twitter/runningtigger_normal.jpg"},
    {"id": 9, "date": "10m", "username": "videogamedeals", "displayname": "Cheap Gamer", "text": "PlayStation 4 bundle in stock at Walmart http://ow.ly/rMbcK ", "imgsrc":"../img/twitter/runningtigger_normal.jpg"},
    {"id": 29, "date": "10m", "username": "HuffingtonPost", "displayname": "Huffington Post", "text": "Walmart.com  is selling 'Occupy Wall Street' posters http://huff.to/1cMxeti", "imgsrc":"../img/twitter/runningtigger_normal.jpg"},
    {"id": 17, "date": "10m", "username": "upwithsteve", "displayname": "Up w/ Steve Kornacki", "text": 'For more on this history, check out "THE RETAIL REVOLUTION: How Wal-Mart Created a Brave New World of Business" pic.twitter.com/bC7VrfJTqD', "imgsrc":"../img/twitter/runningtigger_normal.jpg"},
    {"id": 12, "date": "10m", "username": "Angel Casamiro", "displayname": "angelcasimiro", "text": "Got that Urban Outfitters taste with a Walmart budget.", "imgsrc":"../img/twitter/runningtigger_normal.jpg"},
    {"id": 13, "date": "10m", "username": "adage", "displayname": "Ad Age", "text": "Facebook, Walmart to help write rules on use of facial recognition technology http://bit.ly/Jz0ucY ", "imgsrc":"../img/twitter/runningtigger_normal.jpg"},
    {"id": 44, "date": "10m", "username": "HuffPostImpact", "displayname": "Huffington Post Impact", "text": "WOW! Real-life Santa pays off $20,000 of Walmart layaway bills http://huff.to/1cLZFHO", "imgsrc":"../img/twitter/runningtigger_normal.jpg"},
    {"id": 37, "date": "10m", "username": "mrickel", "displayname": "Mark Rickel", "text": "#ShopWithAJock at #Walmart w/Bengals @mo_12_sanu to make Christmas brighter for kids in need. pic.twitter.com/1IsbMta5vK", "imgsrc":"../img/twitter/runningtigger_normal.jpg"},
    {"id": 9, "date": "10m", "username": "jdgreear", "displayname": "J.D. Greear", "text": "Per latest trip to #walmart,I'm pretty sure there's not 1 square in of the commercial cosmos over which the Duck Dynasty has not said â€œmine", "imgsrc":"../img/twitter/runningtigger_normal.jpg"},
    {"id": 1, "date": "10m", "username": "AbbeyNiezgoda", "displayname": "Abbey Niezgoda", "text": "About a dozen shoppers braving the weather to make it to Walmart in Milford. Watch for ice! #FirstAlertCT pic.twitter.com/VN5QVsEnaN", "imgsrc":"../img/twitter/runningtigger_normal.jpg"},
    {"id": 18, "date": "10m", "username": "CNBC", "displayname": "CNBC", "text": "Wal-Mart announced Apple's newest iPhones will be available for sale at its stores without a contract: http://cnb.cx/1czpkDJ â€¢ $AAPL $WMT", "imgsrc":"../img/twitter/runningtigger_normal.jpg"},
    {"id": 6, "date": "10m", "username": "videogamedeals", "displayname": "Cheap Gamer", "text": "PlayStation 4 bundle in stock at Walmart http://ow.ly/rMbcK", "imgsrc":"../img/twitter/runningtigger_normal.jpg"}
];
*/
//console.log('STREAM STREAM')
//console.log(data)

moment.lang('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s",
        //s:  "%d seconds",
        //m:  "a minute",
        s:  "%ds",
        m:  "%dm",
        mm: "%dm",
        //h:  "an hour",
        //hh: "%d hours",
        h:  "%dh",
        hh: "%dh",
        d:  "a day",
        dd: "%d days",
        M:  "a month",
        MM: "%d months",
        y:  "a year",
        yy: "%d years"
    }
});

data.forEach(function(d) {
            //d.date = moment(+d.time).fromNow();
            d.date = moment(d.time).format('DD MMM');
            //d.id = +d.id;
            d.authorid = +d.authorid;
            d.klout = +d.klout;
            d.followerCount = +d.followerCount;
            d.impressions = +d.impressions;
            d.shares = +d.shares;
            //d.newtext = d.text;
        });

$("#tweet-stream-two").empty()

var tweetsBox = d3.select("#tweet-stream-two");
/*
var ri = Math.floor(Math.random() * data.length); // Random Index position in the array
var rs = data.splice(ri, 10); // Splice out a random element using the ri var
*/

//var data = originalData.splice(0, 8); //starts at element 0, removes 10
//console.log(data)

    /*
    var newdata = data.sort(function(a,b) {
        return d3.descending(a.id, b.id);
    });
    */

var numberFormat = d3.format(',')

tweetsBox.selectAll('.tweetdiv')
    .remove()
    
    console.log('recent streaming data %%%%%%%%%%%%%%%%%%%%%%%%%')
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
        //.enter().append('img')
        .enter().append('div')
        .attr('class', 'picture')
        //.attr('src', function(d) { return d.imgsrc; });
        .html(function(d) {return '<a href=" ' + d.profileUrl + ' " target="_blank"><img class="streamImage" src=" ' + d.imgsrc + ' "></a> ' })

    var containerDiv = enterDiv.append("div")
        .attr('class', 'containerDiv')

    var bothUsernames = containerDiv.append("div")
        .attr("class", 'bothUserNames')

    bothUsernames.append("span")
        .attr("class", "displayname")
        //.text(function(d) {return d.displayname});
        .html(function(d) {return ' <a href=" ' + d.profileUrl + ' " class="displayNameLink" target="_blank"> ' + d.displayname + ' </a> ' });

    bothUsernames.append("span")
        .attr("class", "username")
        //.text(function(d) {return "@" + d.username});
        //.html(function(d) {return "@" + d.username + '<i class="fa fa-twitter"></i>' + d.date});
        //.html(function(d) {return "@" + d.username + '<a href="https://twitter.com/" target="_blank"><i class="fa fa-twitter"></i></a>' + '<a href=" ' + d.tweetUrl + ' " target="_blank" class="timeagoTweetText">' + d.date + '</a>' });
        //.html(function(d) {return "@" + d.username + '<a href="https://twitter.com/" target="_blank"><i class="fa fa-twitter"></i></a>' + '<a href=" ' + d.tweetUrl + ' " target="_blank" class="timeagoTweetText">' + moment.utc(String(d.datetime)).fromNow() + '</a>' });
        .html(function(d) {return "@" + '<a href=" ' + d.profileUrl + ' " target="_blank" class="twitterUsername">' + d.username+ ' </a> ' + '<a href="https://twitter.com/" target="_blank"><i class="fa fa-twitter"></i></a>' + '<a href=" ' + d.tweetUrl + ' " target="_blank" class="timeagoTweetText">' + moment.utc(String(d.datetime)).fromNow() + '</a>' });
/*
    containerDiv.append("div")
        .attr("class", "date")
        .text(function(d) {return d.date});
*/
    //containerDiv.append("br")

    containerDiv.append("div")
        .attr("class", "text")
        //.text(function(d) {return d.text});
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
                var tempTweetText = [];
                tempTweetText.push(d.text)
                for(var i = 0; i < mentionedUrlLinks.length; i++) {
                    console.log(mentionedUrlLinks[i])
                    var oLink = mentionedUrlLinks[i].url;
                    console.log('old link')
                    console.log(oLink)
                    var dLink = mentionedUrlLinks[i].displayUrl;
                    console.log('desired / new link')
                    console.log(dLink)
                    console.log(d.text)
                    console.log('-----------')
                    var lastTweetCheckedForUrls = tempTweetText.pop();
                    var endStr = lastTweetCheckedForUrls.replace(oLink, 'https://' + dLink)
                    tempTweetText.push(endStr)
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
            return twttr.txt.autoLink(endStr)
            //return twttr.txt.autoLink(correctTweetAllReplacements)
        });

    //maybe here use jquery to force text into div, or to try to get html into d3

    //var footerTextDiv = containerDiv.append("div")
    //    .attr("class", "footerTextDiv")

var footerTextDiv = containerDiv.append('div')
    .attr('class', 'footerTextDiv')

    footerTextDiv.append("div")
    //footerTextDiv.append("span")
        .attr("class", "locationtext")
        .style('color', function(d) {
            if (d.impressions >= 200000) {
                return "red"
            } else if (d.impressions >= 50000) {
                return "steelblue"
            }
        })
        .style("font-weight", function(d) {
            if (d.impressions >= 100000) {
                return "bold"
            }
        })
        .text(function(d) { return numberFormat(d.impressions); })
        .insert("span")
        .text(" impressions")
        //.text(function(d) {return d.impressions + " impressions"})
        /*
        .text(function(d) {
            p = d.location
            //for (var i in p) { if (p[i].geoType == "STATE") { console.log(p[i].name) }}
            for (var i in p) { 
                if (p[i].geoType == "STATE") { 
                    return p[i].name 
                }
            }
            */  
        //});


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
    /*
    var logoTimeDiv = containerDiv.append('div')
        .attr("class", "logoTimeDiv")
        .html(function(d){
            //return '<i class="fa fa-twitter"></i>' + d.date
            return d.date
        })
    */

    var iconHoverDiv = containerDiv.append('div')
        .attr('class', 'iconHoverDiv')

    iconHoverDiv.append("div")
        .attr("class", "allIcons")
        .html(function(d) {
            //console.log('ID ID -------------')
            //console.log(d.id)
            //console.log('<a href="https://twitter.com/intent/tweet?in_reply_to=' + d.id + '" target="_blank"><i class="fa fa-reply"></i></a>' + '<a href="https://twitter.com/intent/retweet?tweet_id=' + d.id + '" target="_blank"><i class="fa fa-retweet"></i></a>' + '<a href="https://twitter.com/intent/favorite?tweet_id=' + d.id + '" target="_blank"><i class="fa fa-star"></i></a>')
            return '<a href="https://twitter.com/intent/tweet?in_reply_to=' + d.id + '" target="_blank"><i class="fa fa-reply"></i></a>' + '<a href="https://twitter.com/intent/retweet?tweet_id=' + d.id + '" target="_blank"><i class="fa fa-retweet"></i></a>' + '<a href="https://twitter.com/intent/favorite?tweet_id=' + d.id + '" target="_blank"><i class="fa fa-star"></i></a>'
        })

    $(".iconHoverDiv").hide();
    $( " .tweetdiv " )
        .on("mouseenter", function() {
            console.log('HOVER')
            $(this).find(".iconHoverDiv").fadeIn();
        })
        .on("mouseleave", function() {
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
    containerDiv.append("span")
        .attr("class", "date")
        .text(function(d) {return d.date});
*/
    tweet.transition()
        .duration(300)
        .style("opacity", 1)
    
//} //end of function update(data)

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
 }// end of wrapper function
