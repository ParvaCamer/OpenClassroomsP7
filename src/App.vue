<template>
  <div id="app">
    <custom-map @inputInfo="updateInfo" @displayInfo="updateDisplayInfo" :infoUpdate="showInfo"/>
    <info-resto :info="childData" :displayInfo="showInfo" @hideInfo="updateDisplayInfo"> </info-resto>
    <informations></informations>
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
    InfoResto
  },
  data() {
    return {
      childData: 0,
      showInfo: null,
    }
  },
  methods: {
    updateInfo(variable) {
      this.childData = variable;
    },
    updateDisplayInfo(variable) {
      this.showInfo = variable;
    }
  }
};
</script>

<style>
</style>
