<template>
  <div class="login-page">
    <h2>Вход в приложение</h2>
    <h2>"Продажа и покупка акций"</h2>
    <form @submit.prevent="login">
      <label for="login" style="margin-bottom: 8px;">Логин:</label>
      <input type="text" list="brokers" v-model="selectedBroker" style="margin-bottom: 8px;">
      <datalist id="brokers">
        <option v-for="broker in brokers" :key="broker.id" :value="broker.name"></option>
      </datalist>
      <button v-bind:disabled="!selectedBroker" v-on:click="login" style="margin-top: 8px;">Войти</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import router from "@/Router";

export default {
  name: 'StartPage',

  data() {
    return {
      brokers: null,
      selectedBroker: undefined
    };
  },

  created() {
    axios.get('http://localhost:8080/brokers')
        .then(res => (this.brokers = res.data))
        .catch(error => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });
  },

  methods: {
    login() {
      if(this.selectedBroker){
        router.push({ path: `/broker/${this.selectedBroker}`})
      }
    }
  }
};
</script>

<style scoped>
.login-page {
  width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

form {
  display: flex;
  flex-direction: column;
}

h2 {
  margin-bottom: 8px;
}

label {
  margin-bottom: 8px;
}

select {
  padding: 10px;
  margin-bottom: 8px;
}

button {
  padding: 10px;
  background-color: #47bdfa;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0b6896;
}
</style>
