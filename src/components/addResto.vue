<template>
  <div class="addResto">
    <div class="btnResto">
      <div class="btnRestoRelative">
        <a href="#" v-on:click="showWindow" v-show="!window"></a>
      </div>
    </div>
    <div class="windowResto" v-show="window">
      <h2>Ajout d'un restaurant</h2>
      <div class="forInput">
        <input class="inputName" v-model="name" />
        <label>Nom du restaurant :</label>
      </div>
      <div class="forInput">
        <input class="inputAddress" v-model="address" />
        <label>Adresse du restaurant :</label>
      </div>
      <button class="btnMarker" v-on:click="pickASpot" :disabled="name.length === 0 || address.length === 0">
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
      ratings: [{
        stars: 0,
        comment: "Pas de commentaire disponible.",
        name: "Exemple Davis"
      }]
    };
  },
  methods: {
    showWindow() {
      this.window = !this.window;
    },
    updateData() {
      this.pick = !this.pick;
      this.id += 1;
    },
    pickASpot() {
      this.showWindow(); //close the window to click on the map
      this.updateData() //can click on the map to add marker
      this.$emit("pick", this.pick);
      this.$emit("addMarkerID", this.id);
      this.$emit("addMarkerName", this.name);
      this.$emit("addMarkerAddress", this.address);
      this.$emit("addMarkerRatings", this.ratings);
      this.name = "";
      this.address = "";
      this.pick = false;
    },
  },
};
</script>

<style src="@/assets/styles/addResto.css" />
