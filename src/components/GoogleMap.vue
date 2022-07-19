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
    <div class="btnPlaceDetails">
      <a href="#" @click="findRestaurants"></a>
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
        clickableIcons: false,
      },
      icon : {
        url: require("../assets/images/user.png"),
        scaledSize: {width: 32, height: 32},
        labelOrigin: {x: 16, y: -10}
      },
      loadData: true,
      restos: [],
      showInfo: false,
      index: 0,
      restosToShow: [],
      address: "",
      places: [],
    };
  },

  mounted() {
    this.getUserPosition(); // run the function to get the position
    alert('Veuillez donner accès à votre position pour une meilleure expérience !') 
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
      this.showInfo = false
      this.$emit("displayInfo", this.showInfo);
      //add a new marker when we click on the "add restaurant" button
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
    findRestaurants() {
      let lat = this.userPos.lat
      let lng = this.userPos.lng
      const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&type=restaurant&radius=1500&key=AIzaSyBicaraRK7wIvEUpXJ0XptenscyvULmMDM`;
      axios.get(URL).then(response => {
        this.places = response.data.results;
        console.log(this.places)
        this.addPlaces()
      })
    },
    addPlaces() {
      let restoLength = this.restos.length +1;
      let restoToSend = [];
      for (let i = 0; i < this.places.length; i++) {
        // for (let j = 0; j < this.restos.length; j++) {
          
        //   if (this.places[i].name === this.restos[j].restaurantName) {
        //     this.places.splice(i,1)
        //   }
        // }
        let newPlace = {
          id: i + restoLength,
          restaurantName: this.places[i].name,
          address: this.places[i].vicinity,
          lat: this.places[i].geometry.location.lat,
          long: this.places[i].geometry.location.lng,
          detailsAPI: [],
          placeID: this.places[i].place_id
          }
        this.restos.push(newPlace)
        restoToSend.push(newPlace)
      }
      this.$emit("restoToSend", restoToSend)
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
        if (this.receiveArrayStar[i] >= elem && this.receiveArrayStar[i] < elem + 50) {
          this.restosToShow.push(i);
        }
      }
      this.$emit("deleteMarker", this.restosToShow);
    },
  },
};
</script>
<style src="@/assets/styles/googleMap.css" />