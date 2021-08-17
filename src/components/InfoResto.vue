<template>
  <div class="infos">
    <h2>a</h2>
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
      restos: [],
    };
  },
methods: {
  displayInfos() {
    return axios.get('http://localhost:3000/restos/1/ratings')
  }
}
};
</script>

<style scoped>
.infos {
  z-index: 3;
  background-color: aliceblue;
  height: 50%;
  border: 1px solid black;
  margin-left: 100px;
}
</style>