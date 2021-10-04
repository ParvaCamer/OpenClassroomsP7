<template>
  <div class="addResto">
    <div class="btnResto">
      <a href="#" v-on:click="showWindow" v-show="!window"></a>
    </div>
    <div class="windowResto" v-show="window">
      <h2>Ajout d'un restaurant</h2>
      <div class="forInput">
        <input class="inputName" v-model="name" />
        <label>Nom du restaurant</label>
      </div>
      <div class="forInput">
        <input class="inputAddress" v-model="address" />
        <label>Adresse du restaurant</label>
      </div>
      <button
        class="btnMarker"
        v-on:click="pickASpot"
        :disabled="name.length === 0 || address.length === 0"
      >
        Définir l'endroit
      </button>
      <button class="btnClose" v-on:click="showWindow">Fermer</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      window: false,
      pick: false,
      id: 0,
      name: "",
      address: "",
      ratings:[{
        stars:0,
        comment:"oui",
        name:"michel"
      }]
    };
  },
  methods: {
    showWindow() {
      this.window = !this.window;
    },
    pickASpot() {
      this.showWindow();
      this.pick = true; //can click on the map to add marker
      this.$emit("pick", this.pick);
      this.$emit("addMarkerID", this.id + 1);
      this.$emit("addMarkerName", this.name);
      this.$emit("addMarkerAddress", this.address);
      this.$emit("addMarkerRatings", this.ratings);
      this.name = "";
      this.address = "";
    },
  },
};
</script>


<style>
.windowResto {
  z-index: 2;
  position: absolute;
  background-color: rgb(255, 255, 255);
  width: 15%;
  height: 35%;
  border: 1px solid black;
  left: 39%;
  top: 29%;
  right: 30%;
  padding:50px 50px;
  border-radius: 2%;
  box-shadow: -5px -9px 0.5em rgba(131, 131, 131, 0.856);
}
.forInput{
	position:relative;
	margin-bottom:25px;
  top:5%;
}
.forInput label{
	position:absolute;
	top:0px;
	left:0px;
	font-size:16px;
	color:rgb(0, 0, 0);	
  pointer-events: none;
}
.forInput input{ 
  border:0;
  border-bottom:1px solid #555;  
  background:transparent;
  width:100%;
  padding:8px 0 5px 0;
  font-size:16px;
  color:rgb(0, 0, 0);
}
.forInput input:focus{ 
 border:none;	
 outline:none;
 border-bottom:1px solid #79b4b7;	
}
h2 {
  text-align: center;
}
/* bouton restaurant */
.btnResto {
  position: relative;
  display: inline-flex;
  width: 180px;
  height: 55px;
  margin: 0 15px;
  perspective: 1000px;
  z-index: 2;
  top: 830px;
  left: 45%;
}
.btnResto a {
  font-size: 12px;
  letter-spacing: 1px;
  transform-style: preserve-3d;
  transform: translateZ(-25px);
  transition: transform 0.25s;
  font-family: "Montserrat", sans-serif;
}
.btnResto a:before,
.btnResto a:after {
  position: absolute;
  content: "AJOUTER UN RESTAURANT";
  height: 45px;
  width: 190px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(0, 0, 0, 0.6);
  box-sizing: border-box;
  border-radius: 5px;
}
.btnResto a:before {
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  transform: rotateY(0deg) translateZ(25px);
}
.btnResto a:after {
  color: #000;
  transform: rotateX(90deg) translateZ(25px);
}
.btnResto a:hover {
  transform: translateZ(-25px) rotateX(-90deg);
}
</style>