<template>
  <div id="app">
    <custom-map
      @inputInfo="updateInfo"
      @displayInfo="updateDisplayInfo"
      :infoUpdate="showInfo"
      :getNewCenter="center"
      @sendNewCenter="haveNewCenter"
    />
    <info-resto
      :info="childData"
      :displayInfo="showInfo"
      @hideInfo="updateDisplayInfo"
    >
    </info-resto>
    <informations @centerUpdate="updateCenter" :newCenter="newCenter"></informations>
  </div>
</template>

<script>
import CustomMap from "@/components/CustomMap.vue";
import Informations from "@/components/Informations.vue";
import InfoResto from "@/components/InfoResto.vue";

export default {
  name: "App",
  components: {
    CustomMap,
    Informations,
    InfoResto,
  },
  data() {
    return {
      childData: 0,
      showInfo: null,
      center: null, //boolean to display the list Informations
      newCenter: {} //for the list Informations
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
      this.newCenter = variable
    }
  },
};
</script>

<style>
</style>
