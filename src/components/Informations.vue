<template>
  <div class="rectangle">
    <h2><u>Restaurants </u>:</h2>
    <div v-for="resto in restos" :key="resto.id">
      {{ resto.restaurantName }} : {{ resto.restoStar }}
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
</style>
