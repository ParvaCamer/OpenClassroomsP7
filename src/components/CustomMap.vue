<template>
    <l-map
      v-show="loadData == true"
      :center="[
        userLocation.lat || defaultLocation.lat,
        userLocation.lng || defaultLocation.lng,
      ]"
      :zoom="zoom"
      class="map"
      ref="map"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @click="addMarker"
    >
      <l-tile-layer :url="url"> </l-tile-layer>
      <l-marker
        :lat-lng="[
          userLocation.lat || defaultLocation.lat,
          userLocation.lng || defaultLocation.lng,
        ]"
      >
      </l-marker>
      <span
        v-for="(resto, index) in restos"
        :key="index"
        >
        <l-marker 
          v-if="(restosToShow.includes(index) && restosToShow.length > 0) || restosToShow.length === 0 "
          :lat-lng="[resto.lat, resto.long]"
          :icon="icon"
          v-on:click="sendInfos(index)"
        >
        </l-marker>
      </span>
    </l-map>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Icon } from "leaflet";
import axios from "axios";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LIcon,
  },
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
    receiveValueFilter: Number
  },
  data() {
    return {
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      zoom: 16,
      userLocation: {},
      loadData: true,
      restos: [],
      icon: L.icon({
        iconUrl: require("../assets/restoPNG.png"),
        iconSize: [17, 17],
        iconAnchor: [5, 5],
      }),
      showInfo: false,
      index: 0,
      restosToShow: []
    };
  },

  mounted() {
    this.getUserPosition(); // run the function to get the position
      axios.get("http://localhost:3000/restos").then((res) => {
        this.restos = res.data;
      });
  },

  methods: {
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    centerUpdated(center) {
      this.center = center;
      this.$emit("sendNewCenter", this.center);
    },
    async getUserPosition() {//for the userMarker
      // check if API is supported
      if (navigator.geolocation) {
        // get  geolocation
        navigator.geolocation.getCurrentPosition((pos) => {
          // set user location
          this.userLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
        });
      }
    },
    sendInfos(index) { //send markers' id
      this.showInfo = true;
      this.index = index;
      this.$emit("inputInfo", this.index);
      this.$emit("displayInfo", this.showInfo);
    },
    addMarker(event) { //add a new marker when we click on the "add" button
      if (this.pick) {
        let newMarker = {
          id: 0,
          restaurantName: "",
          address: "",
          lat: 0,
          long: 0,
          ratings: [],
        }
        newMarker.id = this.restos.length + this.markerID;
        newMarker.restaurantName = this.markerName;
        newMarker.address = this.markerAddress;
        newMarker.lat = event.latlng.lat;
        newMarker.long = event.latlng.lng;
        newMarker.ratings = this.markerRatings;
        this.restos.push(newMarker);
        this.$emit("moreMarker", newMarker);
      }
    },
  },

  watch: {
    infoUpdate() {
      this.showInfo = this.infoUpdate;
    },
    receiveArrayStar() {
      for (let i = 0; i < this.receiveArrayStar.length; i++) {
        this.receiveArrayStar[i] = Math.round(this.receiveArrayStar[i] * 100)
      }
    },
    receiveValueFilter(elem) {
      this.restosToShow = [];
        for (let i = 0; i < 49; i++) {
          if (this.receiveArrayStar[i] >= elem && this.receiveArrayStar[i] < elem + 50 ) {
            this.restosToShow.push(i)
          }
        }
      this.$emit("deleteMarker", this.restosToShow)
    }
  },
};
</script>
<style scoped>
.map {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  left:0px;
  top:0px;
}
</style>