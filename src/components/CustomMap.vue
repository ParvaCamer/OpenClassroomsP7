<template>
  <div>
    <p :key="data" v-for="data in $options.myJson">{{ data }}</p>

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
        <l-popup>T'es ici gros bg !</l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import my_json from "/listRestaurant.json";

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
    myJson: my_json,
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
};
</script>
<style scoped>
.map {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>