<template>
  <div class="infos">
    <input name="zone de texte" type="text" value="non modifiable" size="20" maxlength="20" readonly />
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
      restos: null
    };
  },
mounted() {
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