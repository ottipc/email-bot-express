<template>
  <div id="app">
    <nav>
      <router-link to="/">E-Mail Generieren</router-link>
      <router-link to="/emails">Gespeicherte E-Mails</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
nav {
  background-color: #4caf50;
  padding: 1em;
  display: flex;
  gap: 1em;
}

nav a {
  color: white;
  text-decoration: none;
}

nav a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
