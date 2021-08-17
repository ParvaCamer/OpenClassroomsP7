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
        v-for="resto of restos"
        :key="resto.id"
        :lat-lng="[resto.lat, resto.long]"
        :icon="icon"
        @click="showInfos = !showInfos"
      >
        <l-popup> {{ resto.restaurantName }}</l-popup>
      </l-marker>
    </l-map>
    <div class ="showInfosResto" v-show="showInfos">
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Icon } from "leaflet";
import axios from "axios";
import Informations from "@/components/InfoResto.vue";
import InfosResto from "@/components/InfoResto.vue";


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
    Informations,
    InfosResto
  },
  props: {
    defaultLocation: {
      type: Object,
      default: () => ({
        lat: 0,
        lng: 0,
      }),
    },
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
      showInfos: false,
    };
  },

  mounted() {
    this.getUserPosition(); // run the function to get the position
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
  },

  async created() {
    try {
      const res = await axios.get(`http://localhost:3000/restos`);

      this.restos = res.data;
    } catch (e) {
      console.error(e);
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
}
</style>