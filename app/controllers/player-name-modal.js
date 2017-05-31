/**
 * @module Controllers
 * @class PlayerNameModalController
 */
App.PlayerNameModalController = Ember.ObjectController.extend( {
	/**
	 * Controller dependencies.
	 */
	needs: [ 'game' ],

	/**
	 * Player name.
	 *
	 * @property playerName
	 * @type {string}
	 * @default {null}
	 */
	playerOneName: null,
	playerTwoName: null,

	saveBtn: {
		title: 'Save',
		action: 'saveName',
		style: 'btn-success'
	},

	cancelBtn: {
		title: 'Cancel',
		action: 'cancel',
		style: 'btn-default',
		closeModal: true,
		isHidden: true
	},

	/**
	 * List of buttons for modal dialog.
	 *
	 * @property customModalButtons
	 * @type {Object[]}
	 */
	customModalButtons: [],

	init: function () {
		this.customModalButtons.addObjects( [
			this.get( 'saveBtn' ),
			this.get( 'cancelBtn' )
		] );
	},

	didNameChange: function () {
		this.set( 'playerOneName', this.get( 'playerOne.nameOne' ) );
		this.set( 'playerTwoName', this.get( 'playerTwo.nameTwo' ) );
	}.observes( 'playerOne.nameOne', 'playerTwo.nameTwo' ),

	isNameRequiredChange: function () {
		this.set( 'cancelBtn.isHidden', this.get( 'isNameRequired' ) )
	}.observes( 'isNameRequired' ),

	/**
	 * Define that player data is valid or not.
	 *
	 * @property isValid
	 * @type {boolean}
	 */
	isValid: true,

	/**
	 * Player name validation message.
	 *
	 * @property validationMessage
	 * @type {string}
	 */
	validationMessage: 'Players names should not be empty',

	/**
	 * Validate player name.
	 *
	 * @method validateName
	 * @returns {boolean} Returns <tt>true</tt> if player name is valid. Otherwise returns <tt>false</tt>.
	 */
	validateName: function () {
		var name = $.trim( this.get( 'playerOneName' ) || ''),
			isValid = !Ember.isEmpty( name );

		this.set( 'isValid', isValid );
		return isValid;
	},

	actions: {
		onModalShow: function () {
			this.set( 'isValid', true );
			this.set( 'playerOneName', this.get( 'playerOne.nameOne' ) );
			this.set( 'playerTwoName', this.get( 'playerTwo.nameTwo' ) );
		},
		onModalShown: function() {
			var modal = this.get( 'modal' );
			modal.$( 'input' ).focus();			
		},
		onModalHidden: function() {
			var gameController = this.get( 'controllers.game' );

			this.send( 'removeModal' );
			gameController.send( 'playerNameModalClosed' );
		},
		saveName: function () {
			var modal = this.get( 'modal' );

			if ( this.validateName() ) {
				this.set( 'playerOne.nameOne', this.get( 'playerOneName' ) );
				this.set( 'playerTwo.nameTwo', this.get( 'playerTwoName' ) );
				modal.set( 'isVisible', false );
			}
		},
		submit: function() {
			this.send( 'saveName' );
		}
	}
} );
