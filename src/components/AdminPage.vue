<template>
  <div v-if="brokers && stocks" class="brokers">
    <div class="navigation">
      <ins class="link" v-on:click="goBack">Назад</ins>
    </div>
    <div v-for="broker in brokers" v-bind:key = broker.id class="broker-card">
      <div class="broker-info">
        <h2>{{broker.name}}</h2>
        <h4>Баланс: {{Number(broker.balance).toFixed(3)}}$</h4>
        <div v-for="stock in stocks" v-bind:key = stock.id>
          <div v-if="broker.stocks[stock.id]?.count" class="broker-stock">
            <div class="rows">
              <p>Компания: {{ stock.name }}</p>
            </div>
            <div class="rows">
              <p>Количество: {{ broker.stocks[stock.id].count }}</p>
            </div>
            <div v-if="getDifference(broker, stock) > 0"  class="rows">
              <p class="more">+{{ getDifference(broker, stock) }}$</p>
            </div>
            <div v-else class="rows">
              <p class="less">{{ getDifference(broker, stock) }}$</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>


<script>
import router from "@/Router"
import axios from "axios";
import {mapState} from "vuex";


const BROKERS_URL = 'http://localhost:8080/brokers'
const STOCKS_URL = 'http://localhost:8080/stocks'


export default {
  name: "AdminPage",

  data() {
    return {
      brokers: null,
      stocks: null
    };
  },

  created(){
    axios.get(BROKERS_URL)
        .then(response => (this.brokers = response.data))
        .catch(error => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });

    axios.get(STOCKS_URL)
        .then(response => (
            this.stocks = response.data
        ))
        .catch(error => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });
  },

  mounted() {
    this.$socket.on("buy", (data) => {
      let broker = JSON.parse(data)
      for (let i = 0; i < this.brokers.length; i++) {
        if (this.brokers[i].id === broker.id){
          this.brokers[i] = broker
        }
      }
    })
    this.$socket.on("sell", (data) => {
      let broker = JSON.parse(data)
      for (let i = 0; i < this.brokers.length; i++) {
        if (this.brokers[i].id === broker.id){
          this.brokers[i] = broker
        }
      }
    })
  },

  methods: {
    goBack() {
      router.go(-1)
    },

    getDifference(broker, stock) {
      const stockPrice = Number(stock.data[stock.data?.length-1-this.$store.state.index]?.Open) * broker.stocks[stock.id]?.count;
      const brokerSum = broker.stocks[stock.id]?.sum;
      let difference = (stockPrice - brokerSum).toFixed(3)
      return !isNaN(difference) ? difference : 0
    }
  },

  computed: {
    ...mapState(["tradingList"]),
    ...mapState(["index"]),
  },
}

</script>


<style>

.brokers {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  //justify-content: top;
}

.navigation {
  background-color: #0a0d3a;
  border-radius: 0 0 10px 10px;
  padding: 10px;
  font-size: 20px;
  width: 400px;
  height: 30px;
  margin-bottom: 50px;
}

.link {
  color: white;
  cursor: pointer;
}

.broker-card {
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  margin-bottom: 30px;
  border-radius: 10px;
}

.broker-stock {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}

.rows {
  width: 430px;
  margin-right: 30px;
  display: flex;
  flex-direction: column;
  align-items: start;
}

.broker-info {
  background-color: white;
  width: 95%;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: start;
}

.more {
  color: green;
}

.less {
  color: red;
}

</style>