<template>
  <div class="infos" v-show="showInfo">
    <div v-for="(comment, index) in restoComment" :item="comment" :key="index">
      <ul
        v-for="(resto, index) in restos"
        :key="index"
        v-show="comment === index"
      >
        {{resto.restaurantName}} :
        <li
          class="liInfo"
          v-for="restoComment in resto.infoComment"
          :key="restoComment"
        >
        {{ restoComment }}
        </li>
      </ul>
    </div>
    <div class="textarea">
      <span> Ajouter un avis :</span>
      <p style="white-space: pre-line;"> {{ message }} </p>
      <input v-model="message" placeholder="Appuyez sur Entrée pour valider">
    </div>
    <div class="btnInfo">
      <button v-on:click="hideInfo" class="btn">Fermer</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import customMap from "@/components/CustomMap.vue";

export default {
  name: "InfoResto",
  components: {
    customMap,
  },
  props: {
    info: {
      type: Number,
    },
    displayInfo: {
      type: Boolean,
    },
  },
  data() {
    return {
      restos: [],
      restoComment: [],
      showInfo: true,
      message: "",
    };
  },
  mounted() {
    axios
      .get("http://localhost:3000/restos")
      .then((res) => {
        this.restos = res.data;

        this.restos.forEach(function (oneResto) {
          oneResto.infoComment = [];
          oneResto.allStars = [];
          oneResto.ratings.forEach(function (infos) {
            oneResto.infoComment.push(infos.comment);
          });
          oneResto.ratings.forEach(function (stars) {
            oneResto.allStars.push(stars.stars)
          })
        });
      })
      .catch((error) => console.log(error));
  },
  watch: {
    info() {
      this.restoComment = [];
      this.restoComment.push(this.info);
    },
    displayInfo() {
      let watchInfo = this.displayInfo;
      this.showInfo = watchInfo;
    },
  },
  methods: {
    hideInfo() {
      this.showInfo = false;
      this.$emit("hideInfo", this.showInfo);
    },
  },
};
</script>

<style scoped>
.infos {
  z-index: 2;
  position: absolute;
  background-color: rgb(251, 253, 255);
  height: 60%;
  border: 1px solid black;
  left: 30%;
  top: 20%;
  right: 25%;
  overflow-y: scroll;
  padding-left: 1.5%;
  padding-right: 1.5%;
}
.ulInfo{
  left: 50%
}
.liInfo {
  list-style-type: circle;
}
.btnInfo {
  position:relative;
  height: 10%;
  top:4%;
  text-align: center;
}
.btn{
  position: relative;
}
.btn:hover{
  color:grey;
  border-style:groove
}
</style>