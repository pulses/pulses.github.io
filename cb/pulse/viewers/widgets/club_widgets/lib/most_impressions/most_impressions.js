function append_most_impressions_html_to_dom(dom_id){
  var mostimpressions_html = '<div id="'+ dom_id +'_tweetContainer">'+
          '<div id="'+ dom_id +'_news-container">'+
            '<ul id="'+ dom_id +'_tweet-stream-two">'+
            '</ul>'+
          '</div>'+
        '</div>';

  $('#'+dom_id).html(mostimpressions_html);

  $("#"+dom_id+"_tweet-stream-two").ticker({
    scrollTime: 9800000,
    mouseOffTimeout: 5000
  });
}


function handleUpdateMostImpressions(data, dom_id) {
  append_most_impressions_html_to_dom(dom_id);
  // valueTime will be zero if no data comes back
  var valueTime = data.value.valueTime;
  if(valueTime === 0){
    $('#myModal').foundation('reveal', 'open');
  }
  else {
    $('#myModal').foundation('reveal', 'close');
  }
  
  $("#"+dom_id+"_tweet-stream-two").empty();
  $("#"+dom_id+"_tweet-stream-two").html("");

  function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(www\.|http\:\/\/)\S+\b)/ig;
    return text.replace(exp,"<a href='$1' target='_blank'>$1</a>"); 
  }

  var sentenceDataWholeImpr = data.value.value.TopOriginalDocumentsImpressions.docs; 
  var sentenceDataImpr = sentenceDataWholeImpr.map(function(item) {
    var usernameID = item.doc.properties.author;
    var imgUrl = item.doc.properties.authorAvatarUrl;
    if(!imgUrl){
      imgUrl = "./lib/most_impressions/profile-default.jpg";
    }
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


  kickoffStreamTwo();
  function kickoffStreamTwo() {
    streamingdataTwo(sentenceDataImpr, dom_id);
  };


}


