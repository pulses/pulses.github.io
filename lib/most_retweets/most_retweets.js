function append_most_retweets_html_to_dom(dom_id){
  var mostretweets_html = '<div id="'+ dom_id +'_tweetContainer">'+
          '<div id="'+ dom_id +'_news-container">'+
            '<ul id="'+ dom_id +'_tweet-stream-three">'+
            '</ul>'+
          '</div>'+
        '</div>';

  $('#'+dom_id).html(mostretweets_html);

  $("#"+dom_id+"_tweet-stream-three").ticker({
    scrollTime: 9800000,
    mouseOffTimeout: 5000
  });
}

function handleUpdateMostRetweets(data, dom_id) {
  append_most_retweets_html_to_dom(dom_id);
  // valueTime will be zero if no data comes back
  var valueTime = data.value.valueTime;
  if(valueTime === 0){
    $('#myModal').foundation('reveal', 'open');
  }
  else {
    $('#myModal').foundation('reveal', 'close');
  }

  // NEW
  var parseDate = d3.time.format("%d-%b-%y %H:%M:%S").parse;

  $("#"+dom_id+"_tweet-stream-three").empty()
  $("#"+dom_id+"_tweet-stream-three").html("");

  var sentenceDataWhole = data.value.value.TopDocuments.docs 

  function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(www\.|http\:\/\/)\S+\b)/ig;
    return text.replace(exp,"<a href='$1' target='_blank'>$1</a>"); 
  }

  var sentenceDataWholeShares = data.value.value.TopOriginalDocumentsShares.docs 
  var sentenceDataShares = sentenceDataWholeShares.map(function(item) {
    var usernameID = item.doc.properties.author
    var imgUrl = item.doc.properties.authorAvatarUrl;
    if(!imgUrl){imgUrl = "./lib/most_retweets/profile-default.jpg";}
    return {
      id: item.doc.properties.docID,
      authorid: parseInt(item.doc.properties.authorID),
      datetime: item.doc.properties.datetime,
      displayname: item.doc.properties.authorName,
      username: item.doc.properties.author,
      text: item.html,
      imgsrc: imgUrl,
      location: item.doc.properties.authorGeoInfo,
      klout: item.doc.properties.klout,
      followerCount: item.lastTweetOrRetweetAuthorFollower,
      impressions: item.totalImpressions,
      shares: item.totalShares,
      profileUrl: item.doc.properties.authorLink,
      tweetUrl: item.doc.properties.url,
      // added for twitter compliance
      mentionedUrls: item.doc.properties.mentionedUrls,
      lastRetweetAuthor: item.lastRetweetAuthor
    }
  });

  var shuffledSentenceDataShares = _(sentenceDataShares).sortBy("authorid");

  kickoffStreamThree();
  function kickoffStreamThree() {
    streamingdataThree(sentenceDataShares, dom_id);
  };

}// end of handleUpdate(data) function

