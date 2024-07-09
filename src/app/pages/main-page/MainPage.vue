<template>
	<div class="page">
		<spinner v-if="isLoading"/>

		<div v-else class="main-page">
			<div class="main-page__container">
				<div class="main-page__wrap">
					<div class="main-page__header">
						<div class="main-page__header-title">
							{{ headerTitle }}
						</div>
					</div>

					<div class="main-page__body">
						<div class="main-view-form__body-title">
							{{ bodyTitle }}:
						</div>

						<div class="main-page__body-container">
							<div class="main-page__body-item">
								<string-select
									:title="tariffObj.title"
									:disabledValue="tariffObj.disabledValue"
									:id="tariffObj.id"
									:selectList="tariffList"
									@updateSelect="updateSelect"
								/>
							</div>

							<div class="main-page__body-item">
								<string-select
									:title="currencyObj.title"
									:disabledValue="currencyObj.disabledValue"
									:id="currencyObj.id"
									:selectList="currencyList"
									@updateSelect="updateSelect"
								/>
							</div>

							<div class="main-page__body-item">
								<string-select
									:title="periodObj.title"
									:disabledValue="periodObj.disabledValue"
									:id="periodObj.id"
									:selectList="periodList"
									@updateSelect="updateSelect"
								/>
							</div>
						</div>
					</div>

					<div class="main-page__footer">
						<div class="main-page__footer-title">
							{{ footerTitle }}:
						</div>

						<div class="main-page__footer-container">
							<template v-if="isFilled">
								<div class="main-page__footer-item">
									{{ footerTextOne }}: {{ numberWithSpaces(sum) }} {{ textCurrency }}.
								</div>

								<div class="main-page__footer-item">
									<span v-if="isDiscount" class="main-page__footer-item_positive">
										{{ footerTextTwoPositive }}: {{ numberWithSpaces(differenceSum) }} {{ textCurrency }}.
									</span>

									<span v-else class="main-page__footer-item_negative">
										{{ footerTextTwoNegative }}: {{ numberWithSpaces(differenceSum) }} {{ textCurrency }}.
									</span>
								</div>
							</template>

							<template v-else>
								<div class="main-page__footer-item">
									{{ footerTextStub }}
								</div>
							</template>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
	
<script>
import { mapState } from 'pinia';
import { useRootStore } from '@/stores/store';

import Spinner from '@app/components/spinner/Spinner.vue';
import StringSelect from '@app/components/string-select/StringSelect.vue';


export default {
	name: 'main-page',

	components: {
		Spinner,
		StringSelect,
	},


	data() {
		return {
			headerTitle: 'Тарифный калькулятор',
			bodyTitle: 'Выберите необходимые настройки тарифа',
			footerTitle: 'Итог',

			footerTextOne: 'Сумма к оплате',
			footerTextTwoPositive: 'Сумма скидки за год из-за выбранного периода составила',
			footerTextTwoNegative: 'Сумма переплаты за месяц из-за выбранного периода составила',
			footerTextStub: 'Для отображения информации необходимо выбрать все настройки.',

			tariffObj: {
				title: 'Выберите тариф',
				id: 'tariff',
				disabledValue: 'Тариф',
			},
			currencyObj: {
				title: 'Выберите валюту',
				id: 'currency',
				disabledValue: 'Валюта',
			},
			periodObj: {
				title: 'Выберите период оплаты',
				id: 'period',
				disabledValue: 'Период',
			},

			tariffList: [
				{ value: 1, name: 'Стандартный' },
				{ value: 2, name: 'Продвинутый' },
			],
			currencyList: [
				{ value: 1, name: 'Китайский юань' },
				{ value: 2, name: 'Казахстанский тенге' },
			],
			periodList: [
				{ value: 1, name: 'Месяц' },
				{ value: 2, name: 'Год' },
			],

			tariff: '',
			currency: '',
			period: '',

			standartMonthPrice: 100,
			standartYearPrice: 1000,
			advancedMonthPrice: 150,
			advancedYearPrice: 1400,
		};
	},

	computed: {
		...mapState(useRootStore, [ 'isLoading', 'exchangeRateYuanByServer', 'exchangeRateTengeByServer' ]),

		isFilled() {
			if (this.tariff && this.currency && this.period) {
				return true;
			} else {
				return false;
			}
		},

		sum() {
			if (this.currency === 'Китайский юань') {
				if (this.period === 'Месяц') {
					if (this.tariff === 'Стандартный') {
						return this.standartMonthPrice * this.exchangeRateYuan.toFixed(2);
					} else {
						return this.advancedMonthPrice * this.exchangeRateYuan.toFixed(2);
					}
				} else {
					if (this.tariff === 'Стандартный') {
						return this.standartYearPrice * this.exchangeRateYuan.toFixed(2);
					} else {
						return this.advancedYearPrice * this.exchangeRateYuan.toFixed(2);
					}
				}
			}
			if (this.currency === 'Казахстанский тенге') {
				if (this.period === 'Месяц') {
					if (this.tariff === 'Стандартный') {
						return this.standartMonthPrice * this.exchangeRateTenge.toFixed(2);
					} else {
						return this.advancedMonthPrice * this.exchangeRateTenge.toFixed(2);
					}
				} else {
					if (this.tariff === 'Стандартный') {
						return this.standartYearPrice * this.exchangeRateTenge.toFixed(2);
					} else {
						return this.advancedYearPrice * this.exchangeRateTenge.toFixed(2);
					}
				}
			}

			return 0;
		},

		differenceSum() {
			if (this.currency === 'Китайский юань') {
				if (this.period === 'Месяц') {
					if (this.tariff === 'Стандартный') {
						return ((this.standartMonthPrice - this.standartYearPrice / 12) * this.exchangeRateYuan).toFixed(2);
					} else {
						return ((this.advancedMonthPrice - this.advancedYearPrice / 12) * this.exchangeRateYuan).toFixed(2);
					}
				} else {
					if (this.tariff === 'Стандартный') {
						return ((this.standartMonthPrice * 12 - this.standartYearPrice) * this.exchangeRateYuan).toFixed(2);
					} else {
						return ((this.advancedMonthPrice * 12 - this.advancedYearPrice) * this.exchangeRateYuan).toFixed(2);
					}
				}
			}
			if (this.currency === 'Казахстанский тенге') {
				if (this.period === 'Месяц') {
					if (this.tariff === 'Стандартный') {
						return ((this.standartMonthPrice - this.standartYearPrice / 12) * this.exchangeRateTenge).toFixed(2);
					} else {
						return ((this.advancedMonthPrice - this.advancedYearPrice / 12) * this.exchangeRateTenge).toFixed(2);
					}
				} else {
					if (this.tariff === 'Стандартный') {
						return ((this.standartMonthPrice * 12 - this.standartYearPrice) * this.exchangeRateTenge).toFixed(2);
					} else {
						return ((this.advancedMonthPrice * 12 - this.advancedYearPrice) * this.exchangeRateTenge).toFixed(2);
					}
				}
			}

			return 0;
		},

		textCurrency() {
			if (this.currency === 'Китайский юань') {
				return 'CNY';
			}
			if (this.currency === 'Казахстанский тенге') {
				return 'KZT';
			}

			return 'RUB';
		},

		isDiscount() {
			if (this.period === 'Месяц') {
				return false;
			} else {
				return true;
			}
		},

		exchangeRateYuan() {
			if (this.exchangeRateYuanByServer) {
				return this.exchangeRateYuanByServer;
			} else {
				return 11.98;
			}
		},

		exchangeRateTenge() {
			if (this.exchangeRateTengeByServer) {
				return this.exchangeRateTengeByServer;
			} else {
				return 0.19;
			}
		},
	},

	methods: {
		updateSelect ({ id, value }) {
			console.log(`Updating "${id}" to "${value}"`);
			
			switch (id) {
				case 'tariff':
					this.tariff = value;
					break;
				case 'currency':
					this.currency = value;
					break;
				case 'period':
					this.period = value;
					break;
			}
		},

		numberWithSpaces(x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
		},
	}
};
</script>