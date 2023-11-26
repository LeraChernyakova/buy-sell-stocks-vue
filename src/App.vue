<template>
  <router-view/>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  padding: 0px;
  margin: 0px;
}

body {
  width: 100%;
  background-color: #9ca5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>