<template>
	<div class="string-select-group">
		<select
			class="string-select"
			:class="{'string-select_disabled': selectedValue == ''}"
			:name="id"
			:id="id"
			v-model="selectedValue"
			@change="update()"
			@keydown.esc ="pressEsc"
		>
			<option
				class="string-select-option string-select-option_disabled"
				disabled
				value=""
			>
				{{ disabledValue }}
			</option>

			<option
				class="string-select-option"
				v-for="position in selectList"
				:key="position.value"
				:value="position.name"
			>
				{{ position.name }}
			</option>
		</select>
	</div>
</template>

<script>
export default {
	name: 'string-select',

	props: {
		disabledValue: {
			type: String
		},
		title: {
			type: String
		},
		id: {
			type: String
		},
		selectList: {
			type: Array,
		},
	},

	data () {
		return {
			selectedValue: '',
		}
	},

	methods: {
		pressEsc (event) {
			event.target.blur()
		},

		togglePasswordHidden () {
			this.passwordHidden = !this.passwordHidden
		},

		update () {
			this.$emit('updateSelect', { id: this.id, value: this.selectedValue });
		}
	}
}
</script>
