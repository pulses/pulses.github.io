function append_most_recent_html_to_dom(dom_id){  
  var mostrecent_html = '<div id="'+ dom_id +'_tweetContainer">'+
        '<div id="'+ dom_id +'_news-container">'+
          '<ul id="'+ dom_id +'_tweetstream">'+
          '</ul>'+
        '</div>'+
      '</div>';
  $('#'+dom_id).html(mostrecent_html);

  $("#"+dom_id+"_tweetstream").ticker({
    mouseOffTimeout: 5000
  });
}  


function handleUpdateMostRecent(data, dom_id) {
  append_most_recent_html_to_dom(dom_id);
  // valueTime will be zero if no data comes back
  var valueTime = data.value.valueTime;
  if(valueTime === 0){
    $('#myModal').foundation('reveal', 'open');
  }
  else {
    $('#myModal').foundation('reveal', 'close');
  }

  // @@@@@@@@@@@@ STREAM @@@@@@@@@@@@

  //clear out ul
  // SOLVE memory leak, detached DOM elements
  $("#"+dom_id+"_tweetstream").empty()
  $("#"+dom_id+"_tweetstream").html("");

  var sentenceDataWhole = data.value.value.TopDocuments.docs 

  function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(www\.|http\:\/\/)\S+\b)/ig;
    return text.replace(exp,"<a href='$1' target='_blank'>$1</a>"); 
  }

  var sentenceData = sentenceDataWhole.map(function(item) {
    var usernameID = item.doc.properties.author;
    var imgUrl = item.doc.properties.authorAvatarUrl;
    if(!imgUrl){
        imgUrl = "./lib/most_recent/profile-default.jpg";
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
      profileUrl: item.doc.properties.authorLink,
      tweetUrl: item.doc.properties.url,
      // added for twitter compliance
      mentionedUrls: item.doc.properties.mentionedUrls,
      lastRetweetAuthor: item.lastRetweetAuthor
    }
  })
  //console.log('SENTENCEDATA !!!!!!!')
  //console.log(sentenceData)

  $("#"+dom_id+"_tweetstream").empty()

  var poneStream = streamChart()
    .leftLabel(function(d) {
      p = d.location
      for (var i in p) { 
        if (p[i].geoType == "STATE") { 
          return p[i].name;
        }
      }
    });

  function kickoffStream() {
    d3.select("#"+dom_id+"_tweetstream")
      .datum(sentenceData)
      .call(poneStream);
  }
  kickoffStream();

}// end of handleUpdate(data) function

