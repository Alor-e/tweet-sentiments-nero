
new Vue({
    el: '#app',
    data () {
      return {
        info: null,
        
        text: '',
      }
    },

    filters: {
      titleize(value){
          return value.replace(/(?:^|\s|-)\S/g, x => x.toUpperCase());
      },

      decimal(value){
        value = Number(value)
        if (Number.isInteger(value)) {
          return value;
        } else {
          return value.toFixed(2);
        }
        
    },
  },

    computed: {
        actualEmotions: function () {

        return Object.fromEntries(
                    
                Object.entries(this.info.emotions).filter(function (item) {
                    return item[1] >= 0.1
                })
                );
          
        },

       

    },

    created: function () {
        // `this` points to the vm instance
        
    },


    mounted () {
    //   axios
    //     .get('http://localhost:5000/api/text?name=you are a noble')
    //     .then(response => (this.info = response.data))
    document.getElementById("htmlMain").style.visibility = 'visible';
    },


    methods: {
        sendRequest() {
          if (this.$refs.input.value) {
            axios
                .get("/api/text", {
                    params: {
                        name: this.text
                    }
                })
                  .then(response => (this.info = response.data))
            }
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

          if (sentiment === 0) {
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
            
            if (subjection === 0) {
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
          }

    }
  })



