/**
 * @module Models
 * @class Player
 */
App.Player = Ember.Object.extend( {
	/**
	 * Player One name.
	 *
	 * @property name
	 * @type {string}
	 */
	nameOne: '',

	/**
	 * Player Two name.
	 *
	 * @property name
	 * @type {string}
	 */
	nameTwo: '',

	/**
	 * Player mark to set of field.
	 *
	 * @property mark
	 * @type {string}
	 * @default {null}
	 */
	mark: null

} );
