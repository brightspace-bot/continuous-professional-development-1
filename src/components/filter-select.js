import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { BaseMixin } from '../mixins/base-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';

class FilterSelect extends BaseMixin(LitElement) {

	static get properties() {
		return {
			options: {
				type: Array
			},
			selected: {
				type: Number
			},
			enabled: {
				type: Boolean
			},
			label: {
				type: String
			}
		};
	}

	static get styles() {
		return [ selectStyles,
			css`
			:host {
				display: block;
			}

			.select_filter {
				margin-left: 6px;
				width: 30%;
			}
			.select_filter[dir="rtl"] {
				margin-left: 0px;
				margin-right: 6px;
			}

			.select_filter_controls {
				display: flex;
				align-items: baseline;
				margin-top: 6px;
			}
			`
		];
	}

	constructor() {
		super();

		this.options = [];
		this.selected = 0;
		this.enabled = true;
	}

	fireFilterSelectUpdated() {
		const event = new CustomEvent('d2l-filter-select-updated', {
			detail: {
				value: parseInt(this.selected),
				enabled: this.enabled
			}
		});
		this.dispatchEvent(event);
	}

	renderSelect(option) {
		return html`
		<option
			value="${option.Id}"
			?selected=${this.selected === option.Id}
			>
			${option.Name}
		</option>
		`;
	}

	filterEnable() {
		this.enabled = !this.enabled;
		this.fireFilterSelectUpdated();
	}

	filterChange(e) {
		this.selected = e.target.value;
		this.fireFilterSelectUpdated();
	}

	render() {
		return html`
		<div id="filter">
			<label>
				${this.label}
				<div class="select_filter_controls">
					<d2l-input-checkbox
						aria-label="${this.localize('filterRecordsBy', {choice: this.label})}"
						checked
						@change="${this.filterEnable}"
					>
					</d2l-input-checkbox>
					<select
						class="d2l-input-select select_filter"
						?disabled=${!this.enabled}
						@change="${this.filterChange}"
						aria-label="${this.localize('chooseChoice', {choice: this.label})}"
					>
						<option value="0">${this.localize('selectDefault', { 'object': this.label})}</option>
						${this.options.map(option => this.renderSelect(option))}
					</select>
				</div>
			</label>
		</div>
		`;
	}
}
customElements.define('d2l-filter-select', FilterSelect);
