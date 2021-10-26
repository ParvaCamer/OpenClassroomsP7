<template>
  <div id="app">
    <custom-map
      @inputInfo="updateInfo"
      @displayInfo="updateDisplayInfo"
      :infoUpdate="showInfo"
      :getNewCenter="center"
      @sendNewCenter="haveNewCenter"
      :pick="pickMarker"
      :markerID="pickMarkerID"
      :markerName="pickMarkerName"
      :markerAddress="pickMarkerAddress"
      :markerRatings="pickMarkerRatings"
      @moreMarker="ObjectMarker"
      :receiveValueFilter="getValueFilter"
      :receiveArrayStar="getArrayStar"
      @deleteMarker="valueDelete"
    />
    <info-resto
      :info="childData"
      :displayInfo="showInfo"
      @hideInfo="updateDisplayInfo"
      @changeStarResto="updateStar"
      :propsMarker="markerObject"
      @pick="toAddMarker"
    />
    <informations
      :newCenter="newCenter"
      :newStar="newStar"
      :info="childData"
      :propsMarker="markerObject"
      @sendArrayStar="getValueStar"
      :dataMarker="getValueMarker"
    />
    <addResto
      @pick="toAddMarker"
      @addMarkerID="toAddMarkerID"
      @addMarkerName="toAddMarkerName"
      @addMarkerAddress="toAddMarkerAddress"
      @addMarkerRatings="toAddMarkerRatings"
    />
    <showFilter 
      @sendValueFilter="getValue"
    />
  </div>
</template>

<script>
import CustomMap from "@/components/CustomMap.vue";
import Informations from "@/components/Informations.vue";
import InfoResto from "@/components/InfoResto.vue";
import addResto from "@/components/addResto.vue";
import showFilter from "@/components/Filter.vue";

export default {
  name: "App",
  components: {
    CustomMap,
    Informations,
    InfoResto,
    addResto,
    showFilter
  },
  data() {
    return {
      childData: 0,
      showInfo: null,
      center: null, //boolean to display the list Informations
      newCenter: {}, //for the list Informations
      newStar: "", //to update the star from the list Resto
      pickMarker: null, //to add a marker on the map
      pickMarkerID: 0,
      pickMarkerName: "",
      pickMarkerAddress: "",
      pickMarkerRatings: [],
      markerObject: {},
      getValueFilter: 0,
      getArrayStar: [],
      getValueMarker: []
    };
  },
  methods: {
    updateInfo(variable) {
      this.childData = variable;
    },
    updateDisplayInfo(variable) {
      this.showInfo = variable;
    },
    updateCenter(variable) {
      this.center = variable;
    },
    haveNewCenter(variable) {
      this.newCenter = variable;
    },
    updateStar(variable) {
      this.newStar = variable;
    },
    toAddMarker(v) {
      this.pickMarker = v;
    },
    toAddMarkerID(v) {
      this.pickMarkerID = v;
    },
    toAddMarkerName(v) {
      this.pickMarkerName = v;
    },
    toAddMarkerAddress(v) {
      this.pickMarkerAddress = v;
    },
    toAddMarkerRatings(v) {
      this.pickMarkerRatings = v;
    },
    ObjectMarker(v) {
      this.markerObject = v;
    },
    getValue(value) {
      this.getValueFilter = value
    },
    getValueStar(value) {
      this.getArrayStar = value
    },
    valueDelete(v) {
      this.getValueMarker = v
    }
  },
};
</script>

<style>
</style>
