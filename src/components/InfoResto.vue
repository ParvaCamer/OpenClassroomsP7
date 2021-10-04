<template>
  <div class="infos" v-show="showInfo && loadData === true">
    <div v-for="comment in restoID" :key="comment">
      <ul
         v-for="(resto, index) in restos"
        :key="index"
        v-show="comment == index"
      >
        <h2>{{ resto.restaurantName }}</h2>
        <h4 class="h4resto">{{ resto.address }}</h4>
        <div class="divComment">
          <div v-for="restoComments in resto.infoComment" :key="restoComments">
            {{ restoComments }}
          </div>
        </div>
      </ul>
    </div>

    <div class="textarea">
      <p class="spanAvis">Ajouter un avis :</p>
      <p style="white-space: pre-line"></p>
      <input id="anotherInput" placeholder="Prénom - Nom" v-model="username" />
      <select class="average" id="mySelect" v-model="selected">
        <option disabled value="">Choisissez</option>
        <option value="1">1 étoiles</option>
        <option value="2">2 étoiles</option>
        <option value="3">3 étoiles</option>
        <option value="4">4 étoiles</option>
        <option value="5">5 étoiles</option>
      </select>
      <span class="average"> Avis donné : {{ selected }} ★</span>
      <p style="white-space: pre-line"></p>
      <textarea
        id="firstInput"
        placeholder="Ecrivez votre ressenti :"
        v-model="message"
        style="height: 80px"
      ></textarea>
      <p style="white-space: pre-line"></p>
    </div>
    <div class="btnInfo">
      <button
        v-on:click="addData"
        class="btn1"
        :disabled="username.length === 0 || message.length === 0 || selected.length === 0"
      >
        Envoyer
      </button>
      <button v-on:click="hideInfo" class="btn2">Fermer</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "InfoResto",
  props: {
    info: {
      type: Number,
    },
    displayInfo: {
      type: Boolean,
    },
    propsMarker: {
      type: Object,
    },
  },
  data() {
    return {
      restos: [],
      restoID: [],
      showInfo: false,
      message: "",
      selected: "",
      username: "",
      toShow: [],
      loadData: true,
    };
  },
  mounted() {
    if (this.loadData) {
      axios
        .get("http://localhost:3000/restos")
        .then((res) => {
          this.restos = res.data;

          this.restos.forEach(function (oneResto) {
            oneResto.infoComment = [];
            oneResto.ratings.forEach(function (infos) {
              oneResto.infoComment.push( "▸ " + infos.name + " - " + " mon avis : " + infos.stars + " \u2605" );
              oneResto.infoComment.push("Commentaire : " + infos.comment);
            });
          });
        })
        .catch((error) => console.log(error));
    }
  },
  watch: {
    info() {//to have the id of the marker
      this.restoID = [];
      this.restoID.push(this.info);
    },
    displayInfo() {//to display the marker's window
      let watchInfo = this.displayInfo;
      this.showInfo = watchInfo;
    },
    propsMarker() {//reload data and add the marker data into the array
      this.loadData = false;
      this.restos.push(this.propsMarker);
      this.loadData = true;
    },
  },
  methods: {
    hideInfo() {//to hide the marker's window
      this.showInfo = false;
      this.$emit("hideInfo", this.showInfo);
    },
    addData() {//to add a new rating -- refresh the resto's stars
      this.loadData = false;
      this.restos[this.info].infoComment.push("▸ " + this.username + " - " + " mon avis : " + this.selected + " \u2605");
      this.restos[this.info].infoComment.push("Commentaire : " + this.message);
      this.loadData = true;
      this.message = "";
      this.username = "";
      this.selected = "";
      //to change the resto star from the list. it works, dont touch
      var a = document.getElementById("mySelect").selectedIndex;
      var b = document.getElementsByTagName("option")[a].value;
      this.$emit("changeStarResto", b);
    },
  },
};
</script>

<style scoped>
.infos {
  z-index: 2;
  position: absolute;
  background-color: rgb(255, 255, 255);
  height: 55%;
  border: 1px solid black;
  left: 37%;
  top: 20%;
  right: 32%;
  overflow-y: scroll;
  padding-left: 1.5%;
  padding-right: 1.5%;
  border-radius: 2%;
  box-shadow: -5px -9px 0.5em rgba(131, 131, 131, 0.856);
}
.ulInfo {
  left: 50%;
}
.btnInfo {
  position: relative;
  height: 10%;
  top: 4%;
}
.btn1 {
  position: relative;
  left: 35%;
}
.btn2 {
  position: relative;
  left: 45%;
}
.btn:hover {
  color: rgb(63, 60, 60);
  border-style: groove;
}
.textarea {
  position: relative;
  top: 1%;
}
.spanAvis {
  text-decoration: underline;
  font-size: 17px;
}
h2 {
  text-align: center;
}
#firstInput {
  position: relative;
  resize: none;
  left: 6%;
  padding: 12px;
  width: 85% !important;
  background-color: rgba(240, 240, 240, 0.329);
  border: 0px;
  border-bottom: 1px solid rgb(190, 190, 190);
}
#anotherInput {
  position: relative;
  left: 10%;
  background-color: rgba(240, 240, 240, 0.329);
  border: 1px solid rgb(190, 190, 190);
}
.average {
  position: relative;
  left: 20%;
}
.divComment {
  border: 1px solid rgb(190, 190, 190);
  padding: 2%;
  border-radius: 3%;
}
.h4resto {
  text-align: center;
}
</style>