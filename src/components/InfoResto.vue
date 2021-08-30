<template>
  <div class="infos">
    <div class="btnInfo">
      <button v-on:click="$emit('closeInfo')">Clique fort</button>
    </div>
    <div v-for="infoResto in infoRestos" :key="infoResto.id">
      {{ infoResto.restaurantName }} : {{ infoResto.infoComment }}
    </div>
  </div>
</template>

<script>
import axios from "axios";


export default {
  name: "InfoResto",
  data() {
    return {
      infoRestos: [],
    };
  },
  mounted() {
    axios
      .get("http://localhost:3000/restos").then((res) => {
        this.infoRestos = res.data;

        this.infoRestos.forEach(function (oneResto) {
          let infoRating = "";
          oneResto.ratings.forEach(function (infos) {
            infoRating = infos.comment;
          });
          oneResto.infoComment = infoRating;
        });
      }).catch((error) => console.log(error));
  },
  methods: {
    getInfo: function(index) {
      return this.infoRestos[index]
    }
  }
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
.btnInfo {
  text-align: center;
}
</style>