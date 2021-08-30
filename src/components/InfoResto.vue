<template>
  <div class="infos">
    {{ msg }}
    <div v-for="infoResto in infoRestos" :key="infoResto.id">
      {{ infoResto.restaurantName }} : {{ infoResto.infoRating }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "InfoResto",
  props: {
    msg: String,
  },
  data() {
    return {
      infoRestos: [],
    };
  },
  mounted() {
    axios.get("http://localhost:3000/restos").then((res) => {
      this.infoRestos = res.data;

      this.infoRestos.forEach(function (oneResto) {
        let infoRating = null;
        oneResto.ratings.forEach(function (infos) {
          infoRating = infos.comment;
        });
        oneResto.infoComment = infoRating;
      });
    }).catch((error) => console.log(error));
  },
};
</script>

<style scoped>
.infos {
  z-index: 2;
  position: absolute;
  background-color: aliceblue;
  height: 50%;
  border: 1px solid black;
  left: 50%;
  top: 25%;
}
</style>