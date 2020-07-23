
new Vue({
    el: '#app',
    data() {
        return {
            info: null,

            text: '',

            uniquePolarity: '',

            polarityCount: '',

            uniqueEmotion: '',

            emotionCount: '',

            uniqueSubjectivity: '',

            subjectivityCount: '',

            polarityObject: '',

            emotionObject: '',

            subjectivityObject: '',

            averagePolarityValue: '',

            averageSubjectivityValue: '',

            averagePolarityValueApprox: '',

            averageSubjectivityValueApprox: '',

            titleHolder: null,

        }
    },

    filters: {
        titleize(value) {
            return value.replace(/(?:^|\s|-)\S/g, x => x.toUpperCase());
        },

        decimal(value) {
            value = Number(value)
            if (Number.isInteger(value)) {
                return value;
            } else {
                return value.toFixed(2);
            }

        },
    },


    created: function () {
        // `this` points to the vm instance

    },


    mounted() {
        //   axios
        //     .get('http://localhost:5000/api/text?name=you are a noble')
        //     .then(response => (this.info = response.data))
        document.getElementById("htmlMain").style.visibility = 'visible';
    },


    methods: {
        sendRequest() {
            if (this.$refs.input.value) {
                axios
                    .get("http://localhost:5000/api/tweet", {
                        params: {
                            name: this.text
                        }
                    })
                    .then(response => (this.info = response.data))
                    .then(() => (this.wordCloud()))
                    .then(axios.spread(() => {
                        this.chartEmotionListsGenerator()
                        this.chartPolarityListsGenerator()
                        this.chartSubjectivityListsGenerator()
                        this.averagePolarity()
                        this.averageSubjectivity()
                        this.titleHolder = this.text

                    }))

                    .then(axios.spread(() => {
                        this.charts(this.uniqueEmotion, this.emotionCount, 'pie', 'emotionPie', 'Tweets Emotion Pie Chart')
                        this.charts(this.uniquePolarity, this.polarityCount, 'pie', 'polarityPie', 'Tweets Sentiment Pie Chart')
                        this.charts(this.uniqueSubjectivity, this.subjectivityCount, 'pie', 'subjectivityPie', 'Tweets Subjectivity Pie Chart')
                        this.charts(this.uniqueEmotion, this.emotionCount, 'bar', 'emotionBar', 'Tweets Emotion Bar Chart')
                        this.charts(this.uniquePolarity, this.polarityCount, 'bar', 'polarityBar', 'Tweets Sentiment Bar Chart')
                        this.charts(this.uniqueSubjectivity, this.subjectivityCount, 'bar', 'subjectivityBar', 'Tweets Subjectivity Bar Chart')

                    }))

            }
        },

        pageRequest() {

            location.replace()
        },

        nestedEmotions: function (obj) {

            return Object.fromEntries(

                Object.entries(obj).filter(function (item) {
                    return item[1] >= 0.1
                })
            );

        },



        polarityNormalized(sentiment) {

            let normalisedValue = ''

            if (sentiment == 0) {
                normalisedValue = 'Neutral';
            } else if (sentiment < -0.5) {
                normalisedValue = 'Very Negative';
            } else if (sentiment < 0) {
                normalisedValue = 'Negative';
            } else if (sentiment > 0.5) {
                normalisedValue = 'Very Positive';
            } else if (sentiment > 0) {
                normalisedValue = 'Positive';
            }

            return normalisedValue
        },

        subjectivityNormalized(subjection) {

            let normalisedValue = ''

            if (subjection == 0) {
                normalisedValue = 'Very Objective';
            } else if (subjection === 1) {
                normalisedValue = 'Very Subjective';
            } else if (subjection > 0.55) {
                normalisedValue = 'Subjective';
            } else if (subjection < 0.45) {
                normalisedValue = 'Subjective';
            }
            else {
                normalisedValue = 'Medium'
            }

            return normalisedValue
        },


        charts(labelsList, dataList, type, htmlId, label) {
            let ctx = document.getElementById(htmlId).getContext('2d');
            var myChart = new Chart(ctx, {
                type: type,
                data: {
                    labels: labelsList,
                    datasets: [{
                        label: label,
                        data: dataList,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(130, 224, 170, 0.2)',
                            'rgba(248, 196, 113, 0.2)',
                            'rgba(174, 214, 68, 0.2)',
                            'rgba(215, 189, 226, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(130, 224, 170, 1)',
                            'rgba(248, 196, 113, 1)',
                            'rgba(174, 214, 241, 1)',
                            'rgba(215, 189, 226, 1)',
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });



        },

        averagePolarity() {

            let result = this.info.reduce((sum, current) => sum + current.sentiment.polarity, 0);
            this.averagePolarityValue = result / (this.info.length);
            this.averagePolarityValueApprox = this.averagePolarityValue.toFixed(1);

        },


        averageSubjectivity() {
            let result = this.info.reduce((sum, current) => sum + current.sentiment.subjectivity, 0);
            this.averageSubjectivityValue = result / (this.info.length)
            this.averageSubjectivityValueApprox = this.averageSubjectivityValue.toFixed(1);

        },

        chartPolarityListsGenerator() {


            let polarity = this.info.map(item => this.polarityNormalized(item.sentiment.polarity));
            // let unique = [...new Set(info.map(item => item.sentiment.polarity))];

            let counts = {};

            for (let i = 0; i < polarity.length; i++) {
                let num = polarity[i];
                counts[num] = counts[num] ? counts[num] + 1 : 1;
            }
            this.uniquePolarity = Object.keys(counts)
            this.polarityCount = Object.values(counts)
            this.polarityObject = counts;

        },

        chartEmotionListsGenerator() {

            let allSignificantEmotions = []
            this.info.forEach(element => {
                let holder = Object.keys(this.nestedEmotions(element.emotions))
                allSignificantEmotions.push(...holder);
            });

            let counts = {};

            for (let i = 0; i < allSignificantEmotions.length; i++) {
                let num = allSignificantEmotions[i];
                counts[num] = counts[num] ? counts[num] + 1 : 1;
            }

            this.uniqueEmotion = Object.keys(counts);
            this.emotionCount = Object.values(counts);
            this.emotionObject = counts;

        },

        chartSubjectivityListsGenerator() {

            let subjectivity = this.info.map(item => this.subjectivityNormalized(item.sentiment.subjectivity));
            // let unique = [...new Set(info.map(item => item.sentiment.polarity))];

            let counts = {};

            for (let i = 0; i < subjectivity.length; i++) {
                let num = subjectivity[i];
                counts[num] = counts[num] ? counts[num] + 1 : 1;
            }
            this.uniqueSubjectivity = Object.keys(counts);
            this.subjectivityCount = Object.values(counts);
            this.subjectivityObject = counts;



        },


        sortObject(obj) {


            tempList = Object.entries(obj).sort(function (a, b) { return a[1] - b[1]; });

            slicedList = tempList.slice(-3);

            return slicedList


        },


        sideBar() {
            let x = document.getElementById("sideBar");

            x.style.display = "none";

            let y = document.getElementById("expandedSideBar");

            y.style.display = "flex";

            
        },

        expandedSideBar() {
            let x = document.getElementById("expandedSideBar");

            x.style.display = "none";

            let y = document.getElementById("sideBar");

            y.style.display = "flex";

        
        },

        resizeCanvas() {
            // let canvs = document.getElementsByTagName('canvas')

            // for (let item of canvs) {

            //     item.height = 500 ;
            // }

        },

        wordCloud() {

            let allText = ''
            this.info.forEach(element => {
                let holder = element.text;
                allText += holder;
            });

            function remove_stopwords(str) {
                res = []
                words = str.split(' ')
                for (i = 0; i < words.length; i++) {
                    word_clean = words[i].split(".").join("")
                    if (!stopwords.includes(word_clean)) {
                        res.push(word_clean)
                    }
                }
                return (res.join(' '))
            }

            function wordFrequency(txt) {


                let wordArray = txt.split(/[ .?!,*'"]/);
                let newArray = [];
                let wordObj = [];
                wordArray.forEach(function (word) {
                    wordObj = newArray.filter(function (w) {
                        return w.text == word;
                    });
                    if (wordObj.length) {
                        wordObj[0].size += 3;
                    } else {
                        newArray.push({ text: word, size: 3 });
                    }
                });
                return newArray;
            }



            wordsAll = wordFrequency(remove_stopwords(allText))
            let relevantWords = wordsAll.filter((item) => item.size > 4);

            var color = d3.scale.linear()
                .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
                .range(["#1d1d1d", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

            d3.layout.cloud().size([800, 400])
                .words(relevantWords)
                .padding(5)
                .rotate(0)
                // .text(function(d) { return d.word; })
                .font('calibri')
                .fontSize(function (d) { return (d.size); })
                .spiral("rectangular") // "archimedean" or "rectangular"
                .on("end", draw)
                .start();

            function draw(words) {

                d3.select("noble").selectAll("*").remove()
                d3.select("noble").append("svg")
                    .attr("width", 850)
                    .attr("height", 450)
                    .attr("class", "wordcloud")
                    .append("g")
                    // without the transform, words words would get cutoff to the left and top, they would
                    // appear outside of the SVG area
                    // .attr("transform", "translate(320,200)")
                    .attr("transform", "translate(" + 800 / 2 + "," + 400 / 2 + ")")
                    .selectAll("text")
                    .data(words)
                    .enter().append("text")
                    .attr("text-anchor", "middle")
                    .attr('font-family', 'calibri')
                    .style("font-size", function (d) { return d.size + "px"; })
                    .style("fill", function (d, i) { return color(i); })
                    .attr("transform", function (d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .text(function (d) { return d.text; });



            }

        },


    }
})



var stopwords = new Array(
    'a',
    ' ',
    '.',
    '',
    'about',
    'above',
    'across',
    'after',
    'again',
    'against',
    'all',
    'almost',
    'alone',
    'along',
    'already',
    'also',
    'although',
    'always',
    'among',
    'an',
    'and',
    'another',
    'any',
    'anybody',
    'anyone',
    'anything',
    'anywhere',
    'are',
    'area',
    'areas',
    'around',
    'as',
    'ask',
    'asked',
    'asking',
    'asks',
    'at',
    'away',
    'b',
    'back',
    'backed',
    'backing',
    'backs',
    'be',
    'became',
    'because',
    'become',
    'becomes',
    'been',
    'before',
    'began',
    'behind',
    'being',
    'beings',
    'best',
    'better',
    'between',
    'big',
    'both',
    'but',
    'by',
    'c',
    'came',
    'can',
    'cannot',
    'case',
    'cases',
    'certain',
    'certainly',
    'clear',
    'clearly',
    'come',
    'could',
    'd',
    'did',
    'differ',
    'different',
    'differently',
    'do',
    'does',
    'done',
    'down',
    'down',
    'downed',
    'downing',
    'downs',
    'during',
    'e',
    'each',
    'early',
    'either',
    'end',
    'ended',
    'ending',
    'ends',
    'enough',
    'even',
    'evenly',
    'ever',
    'every',
    'everybody',
    'everyone',
    'everything',
    'everywhere',
    'f',
    'face',
    'faces',
    'fact',
    'facts',
    'far',
    'felt',
    'few',
    'find',
    'finds',
    'first',
    'for',
    'four',
    'from',
    'full',
    'fully',
    'further',
    'furthered',
    'furthering',
    'furthers',
    'g',
    'gave',
    'general',
    'generally',
    'get',
    'gets',
    'give',
    'given',
    'gives',
    'go',
    'going',
    'good',
    'goods',
    'got',
    'great',
    'greater',
    'greatest',
    'group',
    'grouped',
    'grouping',
    'groups',
    'h',
    'had',
    'has',
    'have',
    'having',
    'he',
    'her',
    'here',
    'herself',
    'high',
    'high',
    'high',
    'higher',
    'highest',
    'him',
    'himself',
    'his',
    'how',
    'however',
    'i',
    'if',
    'important',
    'in',
    'interest',
    'interested',
    'interesting',
    'interests',
    'into',
    'is',
    'it',
    'its',
    'itself',
    'j',
    'just',
    'k',
    'keep',
    'keeps',
    'kind',
    'knew',
    'know',
    'known',
    'knows',
    'l',
    'large',
    'largely',
    'last',
    'later',
    'latest',
    'least',
    'less',
    'let',
    'lets',
    'like',
    'likely',
    'long',
    'longer',
    'longest',
    'm',
    'made',
    'make',
    'making',
    'man',
    'many',
    'may',
    'me',
    'member',
    'members',
    'men',
    'might',
    'more',
    'most',
    'mostly',
    'mr',
    'mrs',
    'much',
    'must',
    'my',
    'myself',
    'n',
    'necessary',
    'need',
    'needed',
    'needing',
    'needs',
    'never',
    'new',
    'new',
    'newer',
    'newest',
    'next',
    'no',
    'nobody',
    'non',
    'noone',
    'not',
    'nothing',
    'now',
    'nowhere',
    'number',
    'numbers',
    'o',
    'of',
    'off',
    'often',
    'old',
    'older',
    'oldest',
    'on',
    'once',
    'one',
    'only',
    'open',
    'opened',
    'opening',
    'opens',
    'or',
    'order',
    'ordered',
    'ordering',
    'orders',
    'other',
    'others',
    'our',
    'out',
    'over',
    'p',
    'part',
    'parted',
    'parting',
    'parts',
    'per',
    'perhaps',
    'place',
    'places',
    'point',
    'pointed',
    'pointing',
    'points',
    'possible',
    'present',
    'presented',
    'presenting',
    'presents',
    'problem',
    'problems',
    'put',
    'puts',
    'q',
    'quite',
    'r',
    'rather',
    'really',
    'right',
    'right',
    'room',
    'rooms',
    's',
    'said',
    'same',
    'saw',
    'say',
    'says',
    'second',
    'seconds',
    'see',
    'seem',
    'seemed',
    'seeming',
    'seems',
    'sees',
    'several',
    'shall',
    'she',
    'should',
    'show',
    'showed',
    'showing',
    'shows',
    'side',
    'sides',
    'since',
    'small',
    'smaller',
    'smallest',
    'so',
    'some',
    'somebody',
    'someone',
    'something',
    'somewhere',
    'state',
    'states',
    'still',
    'still',
    'such',
    'sure',
    't',
    'take',
    'taken',
    'than',
    'that',
    'the',
    'their',
    'them',
    'then',
    'there',
    'therefore',
    'these',
    'they',
    'thing',
    'things',
    'think',
    'thinks',
    'this',
    'those',
    'though',
    'thought',
    'thoughts',
    'three',
    'through',
    'thus',
    'to',
    'today',
    'together',
    'too',
    'took',
    'toward',
    'turn',
    'turned',
    'turning',
    'turns',
    'two',
    'u',
    'under',
    'until',
    'up',
    'upon',
    'us',
    'use',
    'used',
    'uses',
    'v',
    'very',
    'w',
    'want',
    'wanted',
    'wanting',
    'wants',
    'was',
    'way',
    'ways',
    'we',
    'well',
    'wells',
    'went',
    'were',
    'what',
    'when',
    'where',
    'whether',
    'which',
    'while',
    'who',
    'whole',
    'whose',
    'why',
    'will',
    'with',
    'within',
    'without',
    'work',
    'worked',
    'working',
    'works',
    'would',
    'x',
    'y',
    'year',
    'years',
    'yet',
    'you',
    'young',
    'younger',
    'youngest',
    'your',
    'yours',
    'z'
)