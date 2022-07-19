<template>
  <div class="dropdown-menu">
    <button class="menu-btn">Filtrer</button>
    <div class="menu-content">
      <a class="links" href="#" @click="valueFilter(300)">3 ★</a>
      <a class="links" href="#" @click="valueFilter(350)">3.5 ★</a>
      <a class="links" href="#" @click="valueFilter(400)">4 ★</a>
      <a class="links" href="#" @click="valueFilter(450)">4.5 ★</a>
      <a class="links" href="#" @click="valueFilter(5)">Tout afficher</a>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    valueFilter(value) {
      this.$emit("sendValueFilter", value)
    }
  }
}
</script>

<style src="@/assets/styles/filter.css" />