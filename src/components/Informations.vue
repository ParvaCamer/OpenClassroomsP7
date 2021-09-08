<template>
  <div class="information">
    <div class="button1" v-show="!show">
      <a class="abutton1" href="javascript:;" v-on:click="show = !show">
    <svg class="icon-arrow before">
        <use xlink:href="#arrow"></use>
    </svg>
    <span class="label">Afficher les restaurants</span>
    <svg class="icon-arrow after">
        <use xlink:href="#arrow"></use>
    </svg>
</a>

<svg style="display: none;">
  <defs>
    <symbol id="arrow" viewBox="0 0 35 15">
      <title>Arrow</title>
      <path d="M27.172 5L25 2.828 27.828 0 34.9 7.071l-7.07 7.071L25 11.314 27.314 9H0V5h27.172z "/>
    </symbol>
  </defs>
</svg>
    </div>
    <div class="rectangle" v-show="show">
    <h2><u>Restaurants </u>:</h2>
    <div v-for="resto in restos" :key="resto.id">
      {{ resto.restaurantName }} : {{ resto.restoStar }}
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
      show: false
    };
  },
  mounted() {
       axios.get("http://localhost:3000/restos").then( res => {
          this.restos = res.data

          this.restos.forEach( function(oneResto) {
            let currentTotal = 0;
            let allRatings = 0; 
            oneResto.ratings.forEach( function(stars) {
              currentTotal += stars.stars;
              allRatings += 1;
            })
            oneResto.restoStar = currentTotal / allRatings
          });
          }) .catch((error) => console.log(error));
    },
};
</script>

<style scoped>
.rectangle {
  position: absolute;
  z-index: 2;
  background-color: aliceblue;
  height: 90%;
  border: 1px solid black;
  left:5%;
  top:3%;
  padding-left: 5px;
}
/* Bouton "Liste restaurants" */
a.abutton1 {
    border: 4px solid #3F3F3F;
    color: #3F3F3F;
    display: inline-block;
    font-size: 18px;
    font-weight: bold;
    line-height: 24px;
    margin: auto;
    padding: 12px 32px 12px 82px;
    position: absolute;
    text-decoration: none;
    z-index: 2;
    bottom:3%;
    left:3%;
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
    transition: transform .5s cubic-bezier(0.86, 0, 0.07, 1);
}

a.abutton1 .icon-arrow {
    fill: #3F3F3F;
    height: 15px;
    top: 17px;
    transition: transform .5s cubic-bezier(0.86, 0, 0.07, 1), opacity .4s cubic-bezier(0.86, 0, 0.07, 1);
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

</style>
