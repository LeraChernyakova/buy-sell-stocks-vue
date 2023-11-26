<template>
  <div class="main-container">

    <div class="side-panel">

      <div class="content-container">

        <div v-if="broker" class="user-info">
          <div class="all-info">
            <FontAwesomeIcon :icon="['fas', 'user']" size="2x" />
            <p class="info"> {{ broker.name }} </p>
          </div>
          <div class="all-info">
            <FontAwesomeIcon :icon="['fas', 'money-bill']" size="2x" />
            <p id="brokerBalance"> {{Number(broker.balance).toFixed(3)}}$ </p>
          </div>
        </div>

        <div v-if="stocks" class="Stock">
          <div v-for="stock in stocks" v-bind:key="stock.id">
            <div v-if="broker.stocks[stock.id] && broker.stocks[stock.id].sum" class="all-info">
              <div v-if="tradingList.includes(stock.id)">
                <h3 v-if="getDifference(stock) > 0" class="PositiveDifference">
                  {{ stock.id }}
                </h3>
                <h3 v-else class="NegativeDifference">
                  {{ stock.id }}
                </h3>
              </div>
              <div v-else>
                <h3>
                  {{ stock.id }}
                </h3>
              </div>
              <div v-if="tradingList.includes(stock.id)">
                <p v-if="getDifference(stock) > 0" class="PositiveDifference">
                  +{{ getDifference(stock) }}$
                </p>
                <p v-else-if="getDifference(stock) < 0" class="NegativeDifference">
                  {{ getDifference(stock) }}$
                </p>
                <p v-else>
                  {{ getDifference(stock) }}$
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <div class="row">

      <div class="navigation-panel">

        <h3 v-if="stocks">Дата: {{ stocks[0].data[stocks[0]?.data.length-1-this.$store.state.index]?.Date }}</h3>
        <h3 v-else>Date: {{ new Date().toLocaleDateString("en-US") }}</h3>
        <div class="navigation-links">
          <router-link to="/admin">Администратор</router-link>
          <router-link to="/login">Выход</router-link>
        </div>

      </div>

      <div v-if="broker && stocks" class="stocks">
        <div v-for="stock in stocks" v-bind:key="stock.id" class="Stock">
          <div v-if="this.$store.state.tradingList.includes(stock.id)">
            <div class="current-stock">
              <h1>{{ stock.id }}</h1>
              <h3>{{ stock.name }}</h3>
              <p class="Price" v-bind:id="stock.id+'_price'">
                {{ stock.data[stock.data.length-1-this.$store.state.index]?.Open }}$
              </p>
              <p v-if="broker.stocks[stock.id] && broker.stocks[stock.id].count" class="Count">
                Ваши акции: {{ broker.stocks[stock.id].count }}
              </p>
              <input
                  v-bind:id="stock.id+'_buy_inp'"
                  type="number"
                  v-model="stockCounts[stock.id]"
                  @input="clearError(stock.id)"
                  :class="{ 'error': buyingErrors[stock.id] || sellErrors[stock.id] }"
              />
              <p v-if="buyingErrors[stock.id]" class="error-message">Операция невозможна. Недостаточно средств.</p>
              <p v-if="sellErrors[stock.id]" class="error-message">Операция невозможна. Недостаточно акций.</p>
              <div class="buttons">
                <button v-if="tradingList.includes(stock.id)" v-bind:id="stock.id+'_buy_confirm_btn'" v-on:click="buy(stock.id)">
                  Купить
                </button>
                <button v-if="tradingList.includes(stock.id)" v-bind:id="stock.id+'_sell_confirm_btn'" v-on:click="sell(stock.id)">
                  Продать
                </button>
                <button @click="toggleGraphic(stock.id)">График</button>
              </div>
            </div>
            <div v-if="stocksGraphics[stock.id]" class="Graphic">
              <Line
                  id="chart"
                  :options="{
                            responsive: true,
                            height:1000,
                            plugins: {
                                title: {
                                    display: true,
                                    text: stock.id,
                                    color: 'white'
                                },
                            },
                        }"
                  :data="{
                            title: stock.id,
                            labels: stock.data.map((data) => data.Date).slice(stock.data.length-1-this.$store.state.index, stock.data.length-1).reverse(),
                            datasets: [{
                                data: stock.data.map((data) =>data.Open.match(/(\d+)/)[0]).slice(stock.data.length-1-this.$store.state.index, stock.data.length-1).reverse(),
                                borderColor: 'rgb(255,255,255)',
                                label: 'price',
                            }]
                        }"
              />
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {faMoneyBill, faUser} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import axios from "axios";
import {mapState} from "vuex";
import {Line} from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

library.add(faUser);
library.add(faMoneyBill)

export default {
  name: 'BrokerComponent',
  components: { FontAwesomeIcon, Line },

  data() {
    return {
      broker: null,
      stocks: null,
      stocksGraphics: {},
      username: '',
      balance: '',
      buyingErrors: {},
      sellErrors: {},
      stockCounts: {}
    };
  },

  created() {
    axios.get('http://localhost:8080/brokers/getBroker/?name=' + this.$route.params.name)
        .then(res => (
            this.broker = res.data
        ))
        .catch(error => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });

    axios.get('http://localhost:8080/stocks')
        .then(res => {
          this.stocks = res.data;
          this.stocks.forEach((stock) => {
            this.stocksGraphics[stock.id] = false;
          })
        })
        .catch(error => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });
    console.log(this.stocks)
  },

  mounted() {
    this.$socket.on('trading', (data) => {
      this.$store.commit("setIndex", JSON.parse(data))
    })

    this.$socket.on('tradingList', (data) => {
      this.$store.commit("setTradingList", JSON.parse(data).listTradings)
    })

    this.$socket.on('brokerBuy', (data) => {
      let broker = JSON.parse(data)
      console.log(data)
      if (this.broker.id === broker.id)
        this.broker = broker
    })

    this.$socket.on('brokerSell', (data) => {
      let broker = JSON.parse(data)
      if (this.broker.id === broker.id)
        this.broker = broker
    })
  },

  computed: {
    ...mapState(["tradingList"]),
    ...mapState(["index"]),
  },


  methods: {
    clearError(stockId) {
      this.buyingErrors[stockId] = false;
      this.sellErrors[stockId] = false;
    },

    toggleGraphic(stock_id) {
      console.log(this.stockCounts)
      this.stocksGraphics[stock_id] = !this.stocksGraphics[stock_id]
    },

    buy(stock_id) {
      const stock = this.stocks.find(stock => stock.id === stock_id);
      const stockPrice = Number(stock.data[stock.data.length - 1 - this.$store.state.index]?.Open);
      if (this.broker.balance >= stockPrice * this.stockCounts[stock_id]) {
        this.buyingErrors[stock_id] = false;
        const data = {
          "index": this.$store.state.index,
          "broker_id": this.broker.id,
          "stock_id": stock_id,
          "stock_count": this.stockCounts[stock_id]
        };
        this.$socket.emit("buy", JSON.stringify(data));
      } else {
        this.buyingErrors[stock_id] = true;
      }
    },

    sell(stock_id) {
      if (
          this.broker.stocks[stock_id] &&
          (this.broker.stocks[stock_id].count >= this.stockCounts[stock_id])
      ) {
        this.sellErrors[stock_id] = false;
        const data = {
          "index": this.$store.state.index,
          "broker_id": this.broker.id,
          "stock_id": stock_id,
          "stock_count": this.stockCounts[stock_id]
        };
        this.$socket.emit("sell", JSON.stringify(data));
      } else {
        this.sellErrors[stock_id] = true;
      }
    },

    getDifference(stock) {
      const stockPrice = Number(stock.data[stock.data.length-1-this.$store.state.index]?.Open);
      const brokerSum = this.broker.stocks[stock.id]?.sum / this.broker.stocks[stock.id]?.count;
      let difference = (stockPrice - brokerSum).toFixed(3)
      return !isNaN(difference) ? difference : 0
    }
  }
};
</script>

<style scoped>
.main-container {
  display: flex;
  height: 100%;
  width: 100%;
}

.navigation-panel {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  height: 50px;
}

.navigation-links {
  display: flex;
  gap: 10px;
}

.navigation-links a {
  text-decoration: none;
  color: blue;
}

.side-panel {
  max-width: 130px;
  transition: margin-left 0.3s;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 5px;
}

.content-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.user-info {
  text-align: center;
}

.user-info p {
  margin: 5px 0;
}

.all-info {
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: left;
  margin-bottom: 10px;
  gap: 10px;
}

.Stock {
  display: flex;
  flex-direction: column;
}

.PositiveDifference {
  color: green;
}

.NegativeDifference {
  color: red;
}

.row {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-left: 60px;
}

.current-stock {
  background-color: white;
  width: 1200px;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: start;
}

.current-stock h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.current-stock h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.current-stock p {
  font-size: 16px;
  margin-bottom: 10px;
}

input {
  width: 100%;
  height: 30px;
  font-size: 16px;
}

.error {
  border: 1px solid red;
}

.error-message {
  color: red;
  margin-top: 5px; /* Adjust margin as needed */
}

.buttons {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
}

button {
  margin-right: 10px;
  background-color: #465be8;
  color: white;
  border-radius: 10px;
  font-size: 16px;
  padding: 5px;
  cursor: pointer;
}

</style>
