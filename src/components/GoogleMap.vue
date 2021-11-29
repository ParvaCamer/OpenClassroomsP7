<template>
  <div>
    <GmapMap id="map" :center="userPos || defaultLocation" :zoom="zoom" @click="addMarker" @center_changed="centerUpdated" @zoom_changed="zoomUpdated" :options="options">
      <GmapMarker :position="userPos || defaultLocation" :icon="icon"/>
      <span v-for="(resto, index) in restos" :key="index">
        <GmapMarker
          id="marker"
          v-if=" (restosToShow.includes(index) && restosToShow.length > 0) || restosToShow.length === 0 "
          :position="{
            lat: parseFloat(resto.lat),
            lng: parseFloat(resto.long),
          }"
          v-on:click="sendInfos(index)"
        />
      </span>
    </GmapMap>
      <div class="ui">
        <input type="text" placeholder="Entrer l'adresse" v-model="coordinates" />
        <a class="round-button" @click="locatorButtonPressed"></a>
        <select v-model="type">
          <option value="restaurant">Restaurants</option>
        </select>
        <select v-model="radius">
          <option value="5">5 KM</option>
          <option value="10">10 KM</option>
          <option value="15">15 KM</option>
          <option value="20">20 KM</option>
        </select>
        <button class="uiBtn" @click="findRestaurants">Chercher</button>
      </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "GoogleMap",
  props: {
    defaultLocation: {
      type: Object,
      default: () => ({
        lat: 0,
        lng: 0,
      }),
    },
    infoUpdate: Boolean,
    pick: Boolean,
    markerID: Number,
    markerName: String,
    markerAddress: String,
    markerRatings: Array,
    receiveArrayStar: Array,
    receiveValueFilter: Number,
  },
  data() {
    return {
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      center: { lat: 50.66884925400181, lng: 3.0668234933230782 },
      zoom: 16,
      userPos: {lat: 0, lng: 0},
      options: {
        clickableIcons: false
      },
      icon : {
        url: require("../assets/user.png"),
        scaledSize: {width: 32, height: 32},
        labelOrigin: {x: 16, y: -10}
      },
      loadData: true,
      restos: [],
      showInfo: false,
      index: 0,
      restosToShow: [],
      address: "",

      type: "",
      radius: "",
      places: []
    };
  },

  mounted() {
    this.getUserPosition(); // run the function to get the position
    axios.get("http://localhost:3000/restos").then((res) => {
      this.restos = res.data;
    });
    this.$emit("sendNewCenter", this.center);
  },
  computed: {
    coordinates() {
      return `${this.userPos.lat}, ${this.userPos.lng}`;
    },
  },

  methods: {
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    centerUpdated(center) {
      this.center= {
        lat: center.lat(),
        lng: center.lng()
      }
      this.$emit("sendNewCenter", this.center);
    },
    async getUserPosition() {
      //for the userMarker
      // check if API is supported
      if (navigator.geolocation) {
        // get  geolocation
        navigator.geolocation.getCurrentPosition( pos => {
          // set user location
          this.userPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
        });
      }
    },
    sendInfos(index) {
      //send markers' id
      this.showInfo = true;
      this.index = index;
      this.$emit("inputInfo", this.index);
      this.$emit("displayInfo", this.showInfo);
    },
    addMarker(event) {
      //add a new marker when we click on the "add" button
      if (this.pick) {
        let newMarker = {
          id: 0,
          restaurantName: "",
          address: "",
          lat: 0,
          long: 0,
          ratings: [],
        };
        newMarker.id = this.restos.length + this.markerID;
        newMarker.restaurantName = this.markerName;
        newMarker.address = this.markerAddress;
        newMarker.lat = event.latLng.lat();
        newMarker.long = event.latLng.lng();
        newMarker.ratings = this.markerRatings;
        this.restos.push(newMarker);
        this.$emit("moreMarker", newMarker);
      }
    },
    locatorButtonPressed() {
      navigator.geolocation.getCurrentPosition(position => {
        this.userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
      },
      error => {
        console.log(error);
        }
      );
    },
    findRestaurants() {
      const URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json
      ?location=${this.userPos.lat},${this.userPos.lng}
      &types=${this.type}
      &radius=${this.radius *1000}`;
      axios.get(URL).then(response => {
        this.places = response.data.results;
        this.addLocationsToGoogleMaps();
        console.log(this.places)
      }).catch(error => {
        console.log(error.message);
      });
    },
  },

  watch: {
    infoUpdate() {
      this.showInfo = this.infoUpdate;
    },
    receiveArrayStar() {
      for (let i = 0; i < this.receiveArrayStar.length; i++) {
        this.receiveArrayStar[i] = Math.round(this.receiveArrayStar[i] * 100);
      }
    },
    receiveValueFilter(elem) {
      this.restosToShow = [];
      for (let i = 0; i < 49; i++) {
        if (
          this.receiveArrayStar[i] >= elem &&
          this.receiveArrayStar[i] < elem + 50
        ) {
          this.restosToShow.push(i);
        }
      }
      this.$emit("deleteMarker", this.restosToShow);
    },
  },
};
</script>
<style scoped>
#map {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  left: 0px;
  top: 0px;
}
#marker{
  width: 50%;
}
.ui {
  position: relative;
  z-index: 2;
}
.round-button {
    display:block;
    width:20px;
    height:20px;
    border: 2px solid #f5f5f5;
    border-radius: 50%;
    color:#f5f5f5;
    background: #555777;
}
.round-button:hover {
    background: #777555;
}
</style>