<template>
  <div class="infos" v-show="showInfo">
    <div v-for="comment in restoComment" :key="comment">
      <ul
        v-for="(resto, index) in restos"
        :key="index"
        v-show="comment == index"
      >
        <h2>{{resto.restaurantName}} :</h2>
        <div
          v-for="restoComment in resto.infoComment"
          :key="restoComment"
        >
        {{ restoComment }} 
        </div>
      </ul>
    </div>
    <div class="textarea">
      <span class="spanAvis"> Ajouter un avis :</span>
      <p style="white-space: pre-line;"> {{ message }} </p>
      <input id="myInput" v-model="message" placeholder="Appuyez sur Entrée pour valider" v-on:keyup.enter="pressEnter">
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
      showInfo: false,
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
          oneResto.ratings.forEach(function (infos) {
            oneResto.infoComment.push("▸ " + infos.name + " : "+ " mon avis : " + infos.stars + " \u2605");
            oneResto.infoComment.push("Commentaire : " + infos.comment)
          });
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
    pressEnter(){
    }
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
  color:rgb(63, 60, 60);
  border-style:groove
}
.textarea {
  position: relative;
  top:1%;
}
.spanAvis{
  text-decoration: underline;
  font-size: 17px;
}
</style>