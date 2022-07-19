<template>
  <div class="information" v-show="loadData === true">
    <div class="button1" v-show="!show">
      <a class="abutton1" v-on:click="showList">
        <svg class="icon-arrow before">
          <use xlink:href="#arrow"></use>
        </svg>
        <span class="label">Afficher les restaurants</span>
        <svg class="icon-arrow after">
          <use xlink:href="#arrow"></use>
        </svg>
      </a>

      <svg style="display: none">
        <defs>
          <symbol id="arrow" viewBox="0 0 35 15">
            <title>Arrow</title>
            <path
              d="M27.172 5L25 2.828 27.828 0 34.9 7.071l-7.07 7.071L25 11.314 27.314 9H0V5h27.172z "
            />
          </symbol>
        </defs>
      </svg>
    </div>
    <div class="rectangle" v-show="show">
      <div class="restoColour">
        <h2><u>Restaurants </u>:</h2>
        <div class="close-container">
          <div class="leftright" v-on:click="showList"></div>
          <div class="rightleft" v-on:click="showList"></div>
        </div>
      </div>
      <div class="listColour">
        <div
          class="itemList"
          v-for="(resto, index) in restos"
          :key="index"
          v-show="
            resto.lat <= center[0] + 0.0063 &&
            resto.lat >= center[0] - 0.0063 &&
            resto.long <= center[1] + 0.02051 &&
            resto.long >= center[1] - 0.02051
          "
        >
          <span v-if="(dataMarker.includes(index) && dataMarker.length > 0) || dataMarker.length === 0" @click="sendInfos(index)">
            {{ resto.restaurantName }} : {{ resto.restoStar }}★
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Informations",
  data() {
    return {
      restos: [],
      show: false,
      center: [],
      loadData: true,
      showInfo: false,
      index: 0,
    };
  },
  props: {
    newCenter: Object,
    newStar: String,
    info: Number,
    propsMarker: Object,
    dataMarker: Array,
    receiveRestoAPI: Array
  },
  mounted() {
      axios
        .get("http://localhost:3000/restos")
        .then((res) => {
          this.restos = res.data;
          let arrayStar = [];

          this.restos.forEach(function (oneResto) {
            //to get the average stars
            let currentTotal = 0;
            let allRatings = 0;
            oneResto.allStarAdded = []
            oneResto.ratings.forEach(function (stars) {
              currentTotal += stars.stars;
              allRatings += 1;
              oneResto.allStarAdded.push(stars.stars)
            });
            oneResto.restoStar = currentTotal / allRatings;

            //to get the lat-lng to display on the list
            oneResto.infoList = [];
            oneResto.infoList.push(oneResto.lat, oneResto.long);

            arrayStar.push(oneResto.restoStar)            
          }); 
          this.$emit("sendArrayStar", arrayStar)
        })
        .catch((error) => console.log(error));
  },
  methods: {
    showList() { //hide or show the window
      this.show = !this.show;
    },
    sendInfos(index) {
      //send markers' id
      this.showInfo = true;
      this.index = index;
      this.$emit("inputInfo", this.index);
      this.$emit("displayInfo", this.showInfo);
    }
  },
  watch: {
    newCenter() { //can refresh the list everytime we move
      this.center = [];
      this.center.push(this.newCenter.lat, this.newCenter.lng);
    },
    newStar() { //refresh the resto's star
      this.loadData = false;
      let numberStar = parseInt(this.newStar);
      if (this.restos[this.info].restoStar === 0) {
        this.restos[this.info].restoStar = numberStar;
        this.restos[this.info].allStarAdded.splice(0, 1)
        this.restos[this.info].allStarAdded.push(numberStar);
      } else {
        let total = 0;
        this.restos[this.info].allStarAdded.push(numberStar);

        for (let i = 0; i < this.restos[this.info].allStarAdded.length; i++) {
          total += Number(this.restos[this.info].allStarAdded[i])
        }
        this.restos[this.info].restoStar = total / this.restos[this.info].allStarAdded.length;
      }
      this.restos[this.info].restoStar = this.restos[this.info].restoStar.toFixed(2);
      this.loadData = true;
    },
    propsMarker() { //add the new marker's star
      this.restos.push(this.propsMarker);
      this.restos.forEach(function (oneResto) {
        let currentTotal = 0;
        let allRatings = 0;
        oneResto.allStarAdded = [];
        oneResto.ratings.forEach(function (stars) {
          currentTotal += stars.stars;
          allRatings += 1;
          oneResto.allStarAdded.push(stars.stars)
        });
        oneResto.restoStar = currentTotal / allRatings;
      }) 
    },
    receiveRestoAPI() {
      this.receiveRestoAPI.forEach(function (oneResto) {
        let currentTotal = 0;
        let allRatings = 0;
        oneResto.allStarAdded = [];
        axios.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?&placeid=${oneResto.placeID}&fields=reviews&key=AIzaSyBicaraRK7wIvEUpXJ0XptenscyvULmMDM`)
       .then(response => {
          oneResto.detailsAPI = response.data.result.reviews
          oneResto.detailsAPI.forEach(function (placeDetails) {
          currentTotal += placeDetails.rating;
          allRatings += 1;
          oneResto.allStarAdded.push(placeDetails.rating)
        })
        oneResto.restoStar = (currentTotal / allRatings).toFixed(2);
       })
      })
      this.restos = this.restos.concat(this.receiveRestoAPI)
    }
  },
};
</script>

<style src="@/assets/styles/informations.css" />
