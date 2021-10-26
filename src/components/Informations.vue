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
          <span v-if="(dataMarker.includes(index) && dataMarker.length > 0) || dataMarker.length === 0">
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
    };
  },
  props: {
    newCenter: Object,
    newStar: String,
    info: Number,
    propsMarker: Object,
    dataMarker: Array
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
    }
  },
};
</script>

<style scoped>
.rectangle {
  position: absolute;
  z-index: 2;
  background-color: #79b4b7;
  height: 72.8%;
  border-top: 5px double black;
  border-left: 5px double black;
  left: 5%;
  top: 12%;
  padding-left: 15px;
  width: 13%;
  border-radius: 30px 0px 30px 0px;
  box-shadow: 6px -9px 0.5em rgba(131, 131, 131, 0.856);
}
.listColour {
  background-color: #fefbf3;
  border: 2px solid black;
  padding-left: 10px;
  padding-top: 6px;
  padding-bottom: 9px;
  width: 88%;
  height: 84%;
  border-radius: 30px 0px 30px 0px;
}
.itemList {
  margin-top: 6%;
}
h2 {
  font-family: Trebuchet MS;
}
/* Bouton "Liste restaurants" */
a.abutton1 {
  border: 4px solid #3f3f3f;
  color: #3f3f3f;
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  line-height: 24px;
  margin: auto;
  padding: 12px 32px 12px 82px;
  position: absolute;
  text-decoration: none;
  z-index: 2;
  bottom: 3%;
  left: 3%;
  background-color: rgba(155, 155, 155, 0.5);
}

a.abutton1 .label,
a.abutton1 .icon-arrow {
  backface-visibility: hidden;
  transform: translateZ(0);
  perspective: 1000;
}

a.abutton1 .label {
  display: inline-block;
  transition: transform 0.5s cubic-bezier(0.86, 0, 0.07, 1);
}

a.abutton1 .icon-arrow {
  fill: #3f3f3f;
  height: 15px;
  top: 17px;
  transition: transform 0.5s cubic-bezier(0.86, 0, 0.07, 1),
    opacity 0.4s cubic-bezier(0.86, 0, 0.07, 1);
  width: 35px;
}

a.abutton1 .icon-arrow.before {
  left: 32px;
  margin-right: 15px;
  position: absolute;
  transform-origin: left center;
}

a.abutton1 .icon-arrow.after {
  margin-left: 15px;
  opacity: 0;
  position: absolute;
  right: 32px;
  transform: translateX(75%) scaleX(0.1);
  transform-origin: right center;
}

a.abutton1:hover .label {
  transform: translateX(-52px);
}

a.abutton1:hover .icon-arrow.before {
  opacity: 0;
  transform: translateX(-75%) scaleX(0.1);
}

a.abutton1:hover .icon-arrow.after {
  opacity: 1;
  transform: translateX(0) scaleX(1);
}

a.abutton1:active {
  border-color: #79b4b7;
  color: #79b4b7;
}

a.abutton1:active .icon-arrow {
  fill: #79b4b7;
}

/* bouton fermer */
.close-container {
  position: relative;
  margin: auto;
  margin-left: 85%;
  cursor: pointer;
}

.leftright {
  height: 4px;
  width: 25px;
  position: absolute;
  background-color: #9d9d9d;
  border-radius: 2px;
  transform: rotate(45deg);
  transition: all 0.3s ease-in;
  margin-top: -90%;
}

.rightleft {
  height: 4px;
  width: 25px;
  position: absolute;
  background-color: #9d9d9d;
  border-radius: 2px;
  transform: rotate(-45deg);
  transition: all 0.3s ease-in;
  margin-top: -90%;
}
.close {
  margin: 60px 0 0 5px;
  position: absolute;
}

.close-container:hover .leftright {
  transform: rotate(-45deg);
  background-color: #f25c66;
}
.close-container:hover .rightleft {
  transform: rotate(45deg);
  background-color: #f25c66;
}
.close-container:hover label {
  opacity: 1;
}
</style>
