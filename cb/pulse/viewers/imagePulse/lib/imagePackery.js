var imageVisual = (function() {
    var container,
        pckry,
        formatImpr;

    var _this = {
        initImages: function() {
            
            formatImpr = d3.format(",");

            container = document.querySelector('#container');
            
            pckry = new Packery( container, {
                // options
                itemSelector: '.item',
                gutter: 10,
                //transitionDuration:"1.5s"
                transitionDuration:"2s"
            });

        },
        redrawImages: function(data) {
            console.log('REDRAW FUNCTION CALLED')
            var elems = [];
            var fragment = document.createDocumentFragment();
            var maxImprObject = _.max(data, function(imagedata) { return imagedata.impressions})
            var maxImpr = maxImprObject.impressions
            console.log(maxImpr)

            var imageWidthScale = d3.scale.pow().exponent(.5)
                //.domain([0, d3.max(imagesData, function(d) {return d.impressions}) ])
                .domain([0, maxImpr])
                .range([0, 600]);

                //function(d) {
                //      return imageWidthScale(d.impressions)
                //  })

            var loops = [];
            var imprTicker;

            for ( var i = 0; i < data.length; i++ ) {
                console.log('I: ')
                console.log(i)
                console.log(data[i].src)
                var imaage = data[i].src;
                //var e = getItemElement(imagesData[i].src)
                var imgWidth = data[i].width,
                    imgHeight = data[i].height,
                    imgRatio = imgHeight/imgWidth,
                    imgImpr = data[i].impressions,
                    imgShares = data[i].shares,
                    imgUrl = data[i].docUrl;

                //var num = 177,
                //  numm = 123;
                var prefix_Impressions = d3.formatPrefix(data[i].impressions)
                var prefixSymbol_Impressions = prefix_Impressions.symbol;
                var prefixScale_Impressions = prefix_Impressions.scale(data[i].impressions)
                //$('#prefixMentionsSymbolSpan').html(prefixSymbol_LastMentions);

                var prefix_Shares = d3.formatPrefix(data[i].shares)
                var prefixSymbol_Shares = prefix_Shares.symbol;
                var prefixScale_Shares = prefix_Shares.scale(data[i].shares)

                //var e = getItemElement('<img style="width:177px;height:123px" src="' + imaage + '">')
                //var e = getItemElement('<img style="width:' + num + 'px;height:' + numm + 'px" src="' + imaage + '">')
                //var e = getItemElement('<img style="width:' + imageWidthScale(imgImpr) + 'px;height:' + imageWidthScale(imgImpr) * imgRatio + 'px" src="' + imaage + '">');
                var e = getItemElement('<a href=" ' + imgUrl + ' " target="_blank"><img style="width:' + imageWidthScale(imgImpr) + 'px;height:' + imageWidthScale(imgImpr) * imgRatio + 'px" src="' + imaage + '"></a>');

                console.log('%%%%%%%%%%%%%%%%')
                console.log(imageWidthScale(imgImpr))
                console.log(imageWidthScale(imgImpr) * imgRatio)
                console.log('%%%%%%%%%%%%%%%%')

                //var i = getItemDescription(imagesData[i].impressions)
                console.log('SANITY CHECK FOR DATA POINTS')
                console.log(formatImpr(imgImpr))
                console.log(formatImpr(imgShares))

                fragment.appendChild( e );
                var de = document.createElement('div')
                de.className = 'impressionDiv'
                //de.innerHTML = formatImpr(imgImpr) + ' impr'
                e.appendChild(de)

                var imprSpan = document.createElement('span')
                imprSpan.className = 'imprSpan'
                //imprSpan.innerHTML = '<i class="fa fa-eye fa-lg"></i>' + formatImpr(imgImpr)
                imprSpan.innerHTML = '<i class="fa fa-bullhorn"></i>' + d3.round(prefixScale_Impressions) + prefixSymbol_Impressions;
                //imprSpan.innerHTML = '9a8c' + d3.round(prefixScale_Impressions) + prefixSymbol_Impressions;
                //imprSpan.innerHTML = '<i class="fa fa-eye fa-lg"></i>' //+ '<span id="imprRotating"></span>' + prefixSymbol_Impressions;
                de.appendChild(imprSpan)

                var imprRotatingSpan = document.createElement('span')
                imprRotatingSpan.id= 'imprRotating_' + i;
                //imprRotatingSpan.innerHTML = 'SPIN'
                de.appendChild(imprRotatingSpan)

                var mentionSpan = document.createElement('span')
                mentionSpan.className = 'mentionSpan'
                //mentionSpan.innerHTML = '<i class="fa fa-share fa-lg"></i>' + formatImpr(imgShares)
                mentionSpan.innerHTML = '<i class="fa fa-share-square-o"></i>' + d3.round(prefixScale_Shares) + prefixSymbol_Shares;
                //mentionSpan.innerHTML = '<i class="fa fa-share fa-lg"></i>' + '<span id="sharesRotating"></span>' + prefixSymbol_Shares;
                de.appendChild(mentionSpan)

                //var imprTicker = new countUp('imprRotating_' + i, 25, 250, 0, 10);
                //var imprTicker = new countUp('imprRotating_0', 25, 250, 0, 10);
                //var mentionsTicker = new countUp("sharesRotating", 1, prefixScale_Shares, 0, 10)//data.waitTime);
                //imprTicker.start();
                //mentionsTicker.start();

                //fragment.appendChild( i );
                elems.push( e );
                //elems.push(de)
                //var imprTicker = new countUp('imprRotating_0', 25, 250, 0, 10);
                //var mentionsTicker = new countUp("sharesRotating", 1, prefixScale_Shares, 0, 10)//data.waitTime);
                //imprTicker.start();
                loops.push(i);

                console.log(imprRotatingSpan.id)
                //var imprTicker = new countUp('imprRotating_' + i, 25, 250, 0, 15);
                //var imprTicker = new countUp('imprRotating_0', 25, 250, 0, 15);
                //imprTicker.start();

            } // end of for loop
        /*
        setTimeout(function(){
            //var imprTicker = new countUp('imprRotating_0', 25, 250, 0, 15);
            //imprTicker.start();
            for(i=0;i<loops.length;i++){
                console.log('FOR LOOP CALLED')
                //console.log(loops[i])
                console.log('imprRotating_' + i)
                var imprTicker = new countUp('imprRotating_' + i, 25, 250, 0, 15);
                imprTicker.start();
            }  
        },1000);
        */
        
        /*
        window.onload = function() {
            // process DOM elements here
            for(i=0;i<loops.length;i++){
                console.log('FOR LOOP CALLED')
                //console.log(loops[i])
                console.log('imprRotating_' + i)
                var imprTicker = new countUp('imprRotating_' + i, 25, 250, 0, 15);
                imprTicker.start();
            }  
        };
        */ 

            var elToRemove = pckry.getItemElements() //this is just selecting all packery elements
            // append elements to container
            container.appendChild( fragment );
            // add and lay out newly appended elements
            pckry.addItems( elems );
            pckry.remove(elToRemove);
            pckry.layout();

            console.log('LOOPS ARRAY')
            console.log(loops)
            
            //function spinNumbers(i){
        /*    for(i=0;i<loops.length;i++){
                console.log('FOR LOOP CALLED')
                //console.log(loops[i])
                console.log('imprRotating_' + i)
                var imprTicker = new countUp('imprRotating_' + i, 25, 250, 0, 15);
                imprTicker.start();
            }   */


            function getItemElement(data) {
                var elem = document.createElement('div');
                var wRand = Math.random();
                var hRand = Math.random();
                var widthClass = wRand > 0.85 ? 'w4' : wRand > 0.7 ? 'w2' : '';
                var heightClass = hRand > 0.85 ? 'h4' : hRand > 0.7 ? 'h2' : '';
                elem.className = 'item ' + widthClass + ' ' + heightClass;
                //elem.innerHTML = '<img style="width:177px;height:123px" src="' + data[i].src + '">'
                elem.innerHTML = data;
                return elem;
            }

            function getItemDescription(data) {
                var elem = document.createElement('div');
                elem.innerHTML = data;
                return elem;
            }

        } //end of redraw images
    }
    return _this;
})();
