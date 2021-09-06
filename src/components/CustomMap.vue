<template>
  <div>
    <l-map
      :center="[
        userLocation.lat || defaultLocation.lat,
        userLocation.lng || defaultLocation.lng,
      ]"
      :zoom="zoom"
      class="map"
      ref="map"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
    >
      <l-tile-layer :url="url"> </l-tile-layer>
      <l-marker
        :lat-lng="[
          userLocation.lat || defaultLocation.lat,
          userLocation.lng || defaultLocation.lng,
        ]"
      >
      </l-marker>
      <l-marker
        v-for="(resto, index) in restos"
        :key="index"
        :lat-lng="[resto.lat, resto.long]"
        :icon="icon"
        v-on:click="sendInfos(index)"
      >
      </l-marker>
    </l-map>

  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Icon } from "leaflet";
import axios from "axios";
import InfoResto from './InfoResto.vue';


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
    InfoResto
  },
  props: {
    defaultLocation: {
      type: Object,
      default: () => ({
        lat: 0,
        lng: 0,
      })
    },
    infoUpdate: {
      type: Boolean
    }
  },
  data() {
    return {
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      zoom: 15,
      userLocation: {},
      restos: [],
      icon: L.icon({
        iconUrl: require("../assets/restoPNG.png"),
        iconSize: [17, 17],
        iconAnchor: [5, 5],
      }),
      showInfo: false,
      index: 0
    };
  },

  mounted() {
    this.getUserPosition(); // run the function to get the position
        axios
      .get("http://localhost:3000/restos").then((res) => {
        this.restos = res.data;})
  },

  methods: {
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    centerUpdated(center) {
      this.center = center;
    },
    async getUserPosition() {
      //for the userMarker
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
    sendInfos(index) {
      this.showInfo = true;
      this.index = index
      this.$emit("inputInfo", this.index)
      this.$emit("displayInfo", this.showInfo)
    },
  },
  
  watch: {
    infoUpdate() {
      this.showInfo = this.infoUpdate
    }
  }
};
</script>
<style scoped>
.map {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>