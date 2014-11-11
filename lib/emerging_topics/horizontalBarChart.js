var barChartObject = (function() {
    var svg,
        margin,
        m_width,
        width,
        height,
        target_div,
        x,
        y;
        
    var _this = {
        initBars: function(t_id) {
            //content here
            target_div = t_id
            margin = {top: 20, right: 40, bottom: 10, left: 0}
            m_width = $("#"+target_div).width()
            width = 320
            height = 500 - margin.top - margin.bottom

            x = d3.scale.linear()
                .range([0, width]);

            y = d3.scale.ordinal()
                .rangeRoundBands([0, height], .05);

            svg = d3.select("#"+target_div).append("svg")
                .attr("preserveAspectRatio", "xMidYMid")
                .attr("viewBox", "0 0 " + width + " " + height)
                .attr("width", m_width)
                .attr("height", m_width * height / width);
        },
        redrawBars: function(data) {
            var topics = data;
                // Censor profanity
                //var PROFANITY = ['ass','bottom','damn','shit'],
            /*
                var PROFANITY = [ "2g1c",
                  "2 girls 1 cup",
                  "acrotomophilia",
                  "anal",
                  "anilingus",
                  "anus",
                  "arsehole",
                  "ass",
                  "asshole",
                  "assmunch",
                  "auto erotic",
                  "autoerotic",
                  "babeland",
                  "baby batter",
                  "ball gag",
                  "ball gravy",
                  "ball kicking",
                  "ball licking",
                  "ball sack",
                  "ball sucking",
                  "bangbros",
                  "bareback",
                  "barely legal",
                  "barenaked",
                  "bastardo",
                  "bastinado",
                  "bbw",
                  "bdsm",
                  "beaver cleaver",
                  "beaver lips",
                  "bestiality",
                  "bi curious",
                  "big black",
                  "big breasts",
                  "big knockers",
                  "big tits",
                  "bimbos",
                  "birdlock",
                  "bitch",
                  "black cock",
                  "blonde action",
                  "blonde on blonde action",
                  "blow j",
                  "blow your l",
                  "blue waffle",
                  "blumpkin",
                  "bollocks",
                  "bondage",
                  "boner",
                  "boob",
                  "boobs",
                  "booty call",
                  "brown showers",
                  "brunette action",
                  "bukkake",
                  "bulldyke",
                  "bullet vibe",
                  "bung hole",
                  "bunghole",
                  "busty",
                  "butt",
                  "buttcheeks",
                  "butthole",
                  "camel toe",
                  "camgirl",
                  "camslut",
                  "camwhore",
                  "carpet muncher",
                  "carpetmuncher",
                  "chocolate rosebuds",
                  "circlejerk",
                  "cleveland steamer",
                  "clit",
                  "clitoris",
                  "clover clamps",
                  "clusterfuck",
                  "cock",
                  "cocks",
                  "coprolagnia",
                  "coprophilia",
                  "cornhole",
                  "cum",
                  "cumming",
                  "cunnilingus",
                  "cunt",
                  "darkie",
                  "date rape",
                  "daterape",
                  "deep throat",
                  "deepthroat",
                  "dick",
                  "dildo",
                  "dirty pillows",
                  "dirty sanchez",
                  "dog style",
                  "doggie style",
                  "doggiestyle",
                  "doggy style",
                  "doggystyle",
                  "dolcett",
                  "domination",
                  "dominatrix",
                  "dommes",
                  "donkey punch",
                  "double dong",
                  "double penetration",
                  "dp action",
                  "eat my ass",
                  "ecchi",
                  "ejaculation",
                  "erotic",
                  "erotism",
                  "escort",
                  "ethical slut",
                  "eunuch",
                  "faggot",
                  "fecal",
                  "felch",
                  "fellatio",
                  "feltch",
                  "female squirting",
                  "femdom",
                  "figging",
                  "fingering",
                  "fisting",
                  "foot fetish",
                  "footjob",
                  "frotting",
                  "fuck",
                  "fuck buttons",
                  "fudge packer",
                  "fudgepacker",
                  "futanari",
                  "g-spot",
                  "gang bang",
                  "gay sex",
                  "genitals",
                  "giant cock",
                  "girl on",
                  "girl on top",
                  "girls gone wild",
                  "goatcx",
                  "goatse",
                  "gokkun",
                  "golden shower",
                  "goo girl",
                  "goodpoop",
                  "goregasm",
                  "grope",
                  "group sex",
                  "guro",
                  "hand job",
                  "handjob",
                  "hard core",
                  "hardcore",
                  "hentai",
                  "homoerotic",
                  "honkey",
                  "hooker",
                  "hot chick",
                  "how to kill",
                  "how to murder",
                  "huge fat",
                  "humping",
                  "incest",
                  "intercourse",
                  "jack off",
                  "jail bait",
                  "jailbait",
                  "jerk off",
                  "jigaboo",
                  "jiggaboo",
                  "jiggerboo",
                  "jizz",
                  "juggs",
                  "kike",
                  "kinbaku",
                  "kinkster",
                  "kinky",
                  "knobbing",
                  "leather restraint",
                  "leather straight jacket",
                  "lemon party",
                  "lolita",
                  "lovemaking",
                  "make me come",
                  "male squirting",
                  "masturbate",
                  "menage a trois",
                  "milf",
                  "missionary position",
                  "motherfucker",
                  "mound of venus",
                  "mr hands",
                  "muff diver",
                  "muffdiving",
                  "nambla",
                  "nawashi",
                  "negro",
                  "neonazi",
                  "nig nog",
                  "nigga",
                  "nigger",
                  "nimphomania",
                  "nipple",
                  "nipples",
                  "nsfw images",
                  "nude",
                  "nudity",
                  "nympho",
                  "nymphomania",
                  "octopussy",
                  "omorashi",
                  "one cup two girls",
                  "one guy one jar",
                  "orgasm",
                  "orgy",
                  "paedophile",
                  "panties",
                  "panty",
                  "pedobear",
                  "pedophile",
                  "pegging",
                  "penis",
                  "phone sex",
                  "piece of shit",
                  "piss pig",
                  "pissing",
                  "pisspig",
                  "playboy",
                  "pleasure chest",
                  "pole smoker",
                  "ponyplay",
                  "poof",
                  "poop chute",
                  "poopchute",
                  "porn",
                  "porno",
                  "pornography",
                  "prince albert piercing",
                  "pthc",
                  "pubes",
                  "pussy",
                  "queef",
                  "raghead",
                  "raging boner",
                  "rape",
                  "raping",
                  "rapist",
                  "rectum",
                  "reverse cowgirl",
                  "rimjob",
                  "rimming",
                  "rosy palm",
                  "rosy palm and her 5 sisters",
                  "rusty trombone",
                  "s&m",
                  "sadism",
                  "scat",
                  "schlong",
                  "scissoring",
                  "semen",
                  "sex",
                  "sexo",
                  "sexy",
                  "shaved beaver",
                  "shaved pussy",
                  "shemale",
                  "shibari",
                  "shit",
                  "shota",
                  "shrimping",
                  "slanteye",
                  "slut",
                  "smut",
                  "snatch",
                  "snowballing",
                  "sodomize",
                  "sodomy",
                  "spic",
                  "spooge",
                  "spread legs",
                  "strap on",
                  "strapon",
                  "strappado",
                  "strip club",
                  "style doggy",
                  "suck",
                  "sucks",
                  "suicide girls",
                  "sultry women",
                  "swastika",
                  "swinger",
                  "tainted love",
                  "taste my",
                  "tea bagging",
                  "threesome",
                  "throating",
                  "tied up",
                  "tight white",
                  "tit",
                  "tits",
                  "titties",
                  "titty",
                  "tongue in a",
                  "topless",
                  "tosser",
                  "towelhead",
                  "tranny",
                  "tribadism",
                  "tub girl",
                  "tubgirl",
                  "tushy",
                  "twat",
                  "twink",
                  "twinkie",
                  "two girls one cup",
                  "undressing",
                  "upskirt",
                  "urethra play",
                  "urophilia",
                  "vagina",
                  "venus mound",
                  "vibrator",
                  "violet blue",
                  "violet wand",
                  "vorarephilia",
                  "voyeur",
                  "vulva",
                  "wank",
                  "wet dream",
                  "wetback",
                  "white power",
                  "women rapping",
                  "wrapping men",
                  "wrinkled starfish",
                  "xx",
                  "xxx",
                  "yaoi",
                  "yellow showers",
                  "yiffy",
                  "zoophilia"
                ],
                //CENZOR = ("#####################").split("").join("########");
                CENZOR = ("*********************").split("").join("********");
                PROFANITY  = new RegExp( PROFANITY.join("|") ,"gi");
                function clearProfanity(s){
                    return s.replace( PROFANITY
                        , function(m) { 
                            //return CENZOR.substr(0, m.length - 1) + "!"
                            return CENZOR.substr(0, m.length - 1) + m.slice(-1);
                        } 
                    );
                }
            */

            change();
            
            function change() {
                d3.transition()
                    .duration(4000)
                    .each(redraw);
            }

            function redraw() {
                //topTopics = topics.sort(function(a, b){ return d3.descending(a.now, b.now); }).slice(0, 11);
                topTopics = topics.sort(function(a, b){ return d3.descending(a.now, b.now); }).slice(0, 15);

                y.domain(topTopics.map(function(d) { return d.name; }));
                //x.domain([0, top[0][d.topic])
                x.domain([0, d3.max(topTopics, function(d) { return d.now; })]);
                
                var bar = svg.selectAll(".bar")
                    .data(topTopics, function(d) { return d.name; });

                var barEnter = bar.enter().insert("g", ".axis")
                    .attr("class", "bar")
                    //.attr("id", function(d,i) {return 'phrase' + i})
                    //.attr("transform", function(d) { return "translate(0," + (y(d.topic) + height) + ")"; })
                    .attr("transform", function(d) { return "translate(0," + y(d.name) + ")"; })
                    .style("fill-opacity", 0);

                barEnter.append("rect")
                    .attr("width", function(d) { return x(d.now); })
                    .attr("id", function(d,i) {return 'phrase' + i})
                    //.attr("width", function(d) { return height - y(d.value); })
                    .attr("height", y.rangeBand())
                    //.attr("x", function(d) { return x(d.value); })
                    //.attr("y", function(d) { return y(d.topic); })

                barEnter.append("text")
                //barEnter.append("div")
                //barEnter.append("tspan")
                //barEnter.append("foreignObject")
                    .attr("class", "name")
                    .attr("x", 5)
                    .attr("y", y.rangeBand() / 2)
                    .attr("dy", ".35em")
                    .attr("text-anchor", "start");

                barEnter.append("text")
                    .attr("class", "value")
                    .attr("x", width - 32)
                    .attr("y", y.rangeBand() / 2)
                    .attr("dy", ".35em")
                    .attr("text-anchor", "start");

                var barUpdate = d3.transition(bar)
                    .attr("transform", function(d) { return "translate(0," + (d.y0 = y(d.name)) + ")"; })
                    //.attr("id", function(d,i) {return 'phrase' + i})
                    .style("fill-opacity", 1);

                barUpdate.select("rect")
                    .attr("id", function(d,i) {return 'phrase' + i})
                    .attr("width", function(d) {return x(d.now); })
                    .attr("height", y.rangeBand()) //added this for transition

                barUpdate.select(".name")
                    .attr("x", 5)
                    //.attr("y", y.rangeBand() / 2) //ADDED THIS TO FIX THE NAME OF BARS ISSUE
                    .attr("y", y.rangeBand() / 2)
                    .attr("dy", ".35em")
                    .text(function(d) {return d.name; });
                    //.text(function(d) {return d.label; });
                    //.html(function(d) {return d.label; });
                    //.text(function(d) {return clearProfanity(d.name); });

                barUpdate.select(".value")
                    .attr("x", width - 32)
                    //.attr("y", y.rangeBand() / 2) //ADDED THIS TO FIX THE NAME OF BARS ISSUE
                    .attr("y", y.rangeBand() / 2)
                    .attr("dy", ".35em")
                    .text(function(d) {return d.now; });

                var barExit = d3.transition(bar.exit())
                    .attr("transform", function(d) {return "translate(0," + (d.y0 + height) + ")"; })
                    .style("fill-opacity", 0)
                    //.attr("id", function(d,i) {return 'phrase' + i})
                    .remove();

                barExit.select("rect")
                    .attr("width", function(d) {return x(d.now); })
                    .attr("id", function(d,i) {return 'phrase' + i})
                    //.attr("height", y.rangeBand())

                barExit.select(".name")
                    .attr("x", 5)
                    .text(function(d) {return d.name; });
                    //.text(function(d) {return d.label; });
                    //.html(function(d) {return d.label; });

                barExit.select(".value")
                    .attr("x", width - 32)
                    .text(function(d) {return d.now; });
            } //end of redraw function

            $(window).resize(function() {
                var w = $("#"+target_div).width();
                svg.attr("width", w);
                svg.attr("height", w * height / width);
            });
        }
    }
    return _this;
})();
