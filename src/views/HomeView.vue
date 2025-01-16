<script setup>

</script>

<template>
  <div class="container">
    <div class="first-part">
      <h1>Hello World!</h1>
    </div>
    <div class="splitter"/>
    <div class="second-part">
      <h1>你好，世界！</h1>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.first-part, .second-part{
  height: 100%;
  width: 100%;
}

h1 {
  color: #333;
  font-size: 2em;
  text-align: center;
  margin-top: 50px;
  flex: 1;
}
.splitter {
  height: 100%;
  width: 1px;
  background-color: #2b2b2b;
}
</style>
