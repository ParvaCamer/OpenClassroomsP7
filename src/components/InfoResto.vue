<template>
  <div id="windowInfos" v-show="showInfo">
    <div v-for="comment in restoID" :key="comment">
      <ul
         v-for="(resto, index) in restos"
        :key="index"
        v-show="comment == index"
      >
      <span class="imgStreetView">
        <img  
        :src="resto.url"/>
      </span>
      <span class="underimgSV"/>
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
    info: Number,
    displayInfo: Boolean,
    propsMarker: Object,
    receiveRestoAPI: Array
  },
  data() {
    return {
      restos: [],
      restoID: [],
      showInfo: false,
      message: "",
      selected: "",
      username: "",
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
              oneResto.infoComment.push( "▸ " + infos.name + " - " + " mon avis : " + infos.stars + " \u2605" );
              oneResto.infoComment.push("Commentaire : " + infos.comment);
            });
            oneResto.url = `https://maps.googleapis.com/maps/api/streetview?size=480x200&location=${oneResto.lat},${oneResto.long}&fov=80&heading=${oneResto.heading}&pitch=0&key=AIzaSyBicaraRK7wIvEUpXJ0XptenscyvULmMDM`
          });
        })
        .catch((error) => console.log(error));
  },
  watch: {
    info() {//to have the id of the marker
      this.restoID = [];
      this.restoID.push(this.info);
      document.getElementById('windowInfos').scrollTop = 0
    },
    displayInfo() {//to display the marker's window
      let watchInfo = this.displayInfo;
      this.showInfo = watchInfo;
      document.getElementById('windowInfos').scrollTop = 0
    },
    propsMarker() {//add the marker data into the array
      this.restos.push(this.propsMarker);
      this.restos.forEach(function (oneResto) {
            oneResto.infoComment = [];
            oneResto.ratings.forEach(function (infos) {
              oneResto.infoComment.push( "▸ " + infos.name + " - " + " mon avis : " + infos.stars + " \u2605" );
              oneResto.infoComment.push("Commentaire : " + infos.comment);
            });
          });
      let pick = null
      this.$emit("pick", pick)
    },
    receiveRestoAPI() {
      this.receiveRestoAPI.forEach(function (oneResto) {
        oneResto.infoComment = []
        axios.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?&placeid=${oneResto.placeID}&fields=reviews&key=AIzaSyBicaraRK7wIvEUpXJ0XptenscyvULmMDM`)
       .then(response => {
          oneResto.detailsAPI = response.data.result.reviews
          oneResto.detailsAPI.forEach(function (placeDetails) {
            oneResto.infoComment.push( "▸ " + placeDetails.author_name + " - " + " mon avis : " + placeDetails.rating + " \u2605");
            if (placeDetails.text == "") {
              placeDetails.text = "Pas de commentaire disponible."
            }
            oneResto.infoComment.push("Commentaire : " + placeDetails.text)
          })
        })
      })
      this.restos = this.restos.concat(this.receiveRestoAPI)
    }
  },
  methods: {
    hideInfo() {//to hide the marker's window
      this.showInfo = false;
      this.$emit("hideInfo", this.showInfo);
    },
    addData() {//to add a new rating -- refresh the resto's stars
      if ( this.restos[this.info].infoComment[1] === "Commentaire : Pas de commentaire disponible." ) {
        for (let i=0; i < 2; i++) {
          this.restos[this.info].infoComment.shift()
        }
      }
      this.restos[this.info].infoComment.push("▸ " + this.username + " - " + " mon avis : " + this.selected + " \u2605");
      this.restos[this.info].infoComment.push("Commentaire : " + this.message);
      this.message = "";
      this.username = "";
      //to change the resto star from the list. it works, dont touch
      var a = document.getElementById("mySelect").selectedIndex;
      var b = document.getElementsByTagName("option")[a].value;
      this.$emit("changeStarResto", b);      
      this.selected = "";
    },
  },
};
</script>

<style src="@/assets/styles/infoResto.css" />