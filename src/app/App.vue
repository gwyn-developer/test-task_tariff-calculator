<template>
	<router-view/>
</template>

<script>
import { mapActions } from 'pinia';
import { useRootStore } from '@/stores/store';

export default {
	name: 'app',

	methods: {
		...mapActions(useRootStore, [ 'getRates' ]),
	},

	async created() {
		await this.getRates();
	},

};
</script>