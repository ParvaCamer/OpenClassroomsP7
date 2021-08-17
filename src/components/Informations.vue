<template>
  <div class="rectangle">
    <h2><u>Restaurants </u>:</h2>
    <div v-for="resto in restos" :key="resto.id">
      {{ resto.restaurantName }} : {{ restos }}
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
      allRating: 0,
      currentTotal: 0,
    };
  },
  mounted() {
       axios.get("http://localhost:3000/restos").then( res => {
          this.restos = res.data
          console.log(this.restos);
          let currentTotal = 0;
          let allRatings = 0;
          this.restos.forEach( function(oneResto) {
            oneResto.ratings.forEach( function(stars) {
              currentTotal += stars.stars;
              allRatings += 1;
            })
            let allStars = currentTotal / allRatings;
            console.log("Le resto ", oneResto.restaurantName, "a une moyenne d'étoiles de", allStars, " étoiles");
            console.log(allStars)
            allRatings = 0;
            currentTotal = 0;
            this.restos = allStars
          }); 
          }) 
        .catch((error) => console.log(error));
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
  margin-left: 55px;
  padding-left: 5px;
}
</style>
