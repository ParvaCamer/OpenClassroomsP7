<template>
  <div class="information">
    <div class="button1" v-show="!show">
      <a class="abutton1" href="javascript:;" v-on:click="showList">
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
      <div class="close-container" >
        <div class="leftright" v-on:click="show = false"></div>
        <div class="rightleft" v-on:click="show = false"></div>
        <label class="close">fermer</label>
      </div>
      </div>
      <div class="listColour">
      <div v-for="resto in restos" :key="resto.id">
        {{ resto.restaurantName }} : {{ resto.restoStar }}★
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
      center: []
    };
  },
  props: {
    newCenter: {
      type: Object
    }
  },
  mounted() {
    axios
      .get("http://localhost:3000/restos")
      .then((res) => {
        this.restos = res.data;

        this.restos.forEach(function (oneResto) {
          let currentTotal = 0;
          let allRatings = 0;
          oneResto.ratings.forEach(function (stars) {
            currentTotal += stars.stars;
            allRatings += 1;
          });
          oneResto.restoStar = currentTotal / allRatings;
        });
      })
      .catch((error) => console.log(error));
  },
  methods: {
    showList() {
      this.show = true
      this.$emit("centerUpdate", this.show)
    }
  },
  watch: {
    newCenter() {
      console.log(this.newCenter)
      this.center.push(this.newCenter.lat, this.newCenter.lng)
      console.log(this.center, "longueur : ", this.center.length)
    }
  }
};
</script>

<style scoped>
.rectangle {
  position: absolute;
  z-index: 2;
  background-color: rgb(58, 155, 58);
  height: 90%;
  border-top: 5px double black;
  border-left: 5px double black;
  left: 5%;
  top: 3%;
  padding-left: 5px;
  width: 13%;
  border-radius: 30px 0px 30px 0px;
}
.listColour {
  background-color: honeydew;
  border: 1px black;
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
  border-color: #ac0000;
  color: #ac0000;
}

a.abutton1:active .icon-arrow {
  fill: #ac0000;
}

/* bouton fermer */
.close-container {
  position: relative;
  margin: auto;
  margin-left: 75%;
  cursor: pointer;
}

.leftright {
  height: 4px;
  width: 25px;
  position: absolute;
  background-color: #f4a259;
  border-radius: 2px;
  transform: rotate(45deg);
  transition: all 0.3s ease-in;
}

.rightleft {
  height: 4px;
  width: 25px;
  position: absolute;
  background-color: #f4a259;
  border-radius: 2px;
  transform: rotate(-45deg);
  transition: all 0.3s ease-in;
}

label {
  color: white;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 0.6em;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease-in;
  opacity: 0;
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
