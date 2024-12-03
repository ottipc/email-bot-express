<template>
  <div id="app">
    <NavBar /> <!-- Globale Navigationsleiste -->
    <router-view /> <!-- Bereich für dynamische Komponenten -->
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'; // NavBar importieren

export default {
  components: {
    NavBar,
  },
};
</script>
