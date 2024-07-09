import { defineStore } from 'pinia';

import {BASE_URL, API_KEY} from "@/constants/constants";

export const useRootStore = defineStore('rootStore', {
	state() {
		return {
			isLoading: false,

			exchangeInfo: {},

			exchangeRateYuanByServer: 0,
			exchangeRateTengeByServer: 0,

			baseCurrent: 'RUB',
			exchangeCurrents: 'KZT,CNY'
		}
	},

	actions: {
		async getRates() {
			this.isLoading = true;

			let myHeaders = new Headers();
			myHeaders.append("apikey", `${API_KEY}`);

			const requestOptions = {
				method: 'GET',
				redirect: 'follow',
				headers: myHeaders
			};

			await fetch(`${BASE_URL}?apikey=${API_KEY}`, requestOptions)
				.then(response => response.text())
				.then(result => this.exchangeInfo = JSON.parse(result))
				.catch(error => console.log('error: ', error));

			if (this.checkNotEmptyObj(this.exchangeInfo)) {
				this.exchangeRateYuanByServer = (Number(this.exchangeInfo?.rates?.CNY) / Number(this.exchangeInfo?.rates?.RUB)) ?? 0;
				this.exchangeRateTengeByServer = (Number(this.exchangeInfo?.rates?.KZT) / Number(this.exchangeInfo?.rates?.RUB)) ?? 0;
			}

			setTimeout(() => {
				this.isLoading = false;
			}, 500);
		},

		checkNotEmptyObj(obj) {
			return !(Object.entries(obj).length === 0 && obj.constructor === Object);
		}
	},
})
