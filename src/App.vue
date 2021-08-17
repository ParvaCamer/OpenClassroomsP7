<template>
  <div id="app">
    <custom-map></custom-map>
    <informations></informations>
    <info-resto></info-resto>
  </div>
</template>

<script>
import CustomMap from '@/components/CustomMap.vue';
import Informations from '@/components/Informations.vue';
import InfoResto from '@/components/InfoResto.vue';

export default {
  name: 'App',
  components: {
    CustomMap,
    Informations,
    InfoResto
  },
};
</script>

<style>

</style>
