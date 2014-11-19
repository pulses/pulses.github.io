function viewerSetup() {
    viewerConfig = JSON.parse(_viewerConfig);

        // install the topic logo 
        if ("topicLogo" in viewerConfig) {
                var logoUrl = viewerConfig.topicLogo;
                console.log("topic logo = " + logoUrl);
                document.getElementById("topicLogo").src = logoUrl;
        }
        
        // and the theme logo, if any.  if not, delete the node
        if ("themeLogo" in viewerConfig) {
                var logoUrl = viewerConfig.themeLogo;
                console.log("theme logo = " + logoUrl);
                document.getElementById("themeLogo").src = logoUrl;
        }
        else {
                var img = document.getElementById("themeLogo");
                img.parentNode.removeChild(img);
        }

        // and the service logo (to override NB logo)
        if ("serviceLogo" in viewerConfig) {
                var logoUrl = viewerConfig.serviceLogo;
                console.log("service logo = " + logoUrl);
                document.getElementById("serviceLogo").src = logoUrl;
        }
                
}
