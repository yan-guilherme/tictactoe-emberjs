/**
 * @module Controllers
 * @class GameController
 *
 * @requires GameController
 */
App.GameController = Ember.ObjectController.extend( {

	//region Properties

	/**
	 * Is game over or not.
	 *
	 * @property isGameOver
	 * @type {boolean}
	 */
	isGameOver: false,

	/**
	 * Game winner.
	 *
	 * @property winner
	 * @type {Player}
	 */
	winner: null,

	/**
	 * Status of the game.
	 *
	 * @property gameOverStatus Returns 'win', 'lose' or 'draw' status.
	 * @type {string}
	 */
	gameOverStatus: function () {
		var winner = this.get( 'winner' );

		if ( Ember.isNone( winner ) ) {
			return 'draw';
		}
		else return 'win';
	}.property( 'winner' ),

	/**
	 * Text displayed when player win, lose or game ends in a draw.
	 *
	 * @property gameOverText
	 * @type {string}
	 */
	gameOverText: function () {
		var status = this.get( 'gameOverStatus' );		
		
		switch ( status ) {
			case 'win':
				return 'end game';
			case 'draw':
				return 'draw';			
		}

		return '';
	}.property( 'gameOverStatus' ),

	//endregion

	//region Methods

	/**
	 * Set a mark of current player in a field cell and check that game is over or not. If game is not over,
	 * then turn goes to the next player. Otherwise we end the game and save game result.
	 *
	 * @method makeMove
	 * @param {Cell} cell Field cell to set a mark.
	 */
	makeMove: function ( cell ) {
		var game = this.get( 'model' ),
			player = game.get( 'currentPlayer' );

		if ( !( cell instanceof App.Cell ) ) return;

		if ( cell.get( 'isEmpty' ) ) {
			cell.set( 'value', player.get( 'mark' ) );

			if ( game.isGameOver() ) {
				this.endGame();
			}
			else {
				game.set( 'currentPlayer', game.nextPlayer() );
			}
		}
	},

	/**
	 * Generate game result data, save it and show game over text.
	 *
	 * @method endGame
	 */
	endGame: function () {
		var winner = null,
			game = this.get( 'model' ),
			currentPlayer = game.get( 'currentPlayer' ),
			field = game.get( 'field' ),
			startTime = game.get( 'startTime' ),
			endTime = moment(),
			winnerCells = game.findWinnerCells();

		if ( !Ember.isEmpty( winnerCells )  ) {
			winner = currentPlayer;
			field.highlightCells( winnerCells );
		}

		this.saveGameResult( App.GameResultItem.create( {
			date: Date.now(),
			winnerName: Ember.isEmpty( winner ) ? null : winner.get( 'nameOne' ),
			playTime: endTime.diff( startTime )
		} ) );

		this.set( 'isGameOver', true );
		this.set( 'winner', winner );
	},

	/**
	 * Save game result in storage.
	 *
	 * @method saveGameResult
	 * @throws Throws error if <tt>gameResult</tt> parameter is empty.
	 * @param {GameResultItem} gameResult
	 */
	saveGameResult: function ( gameResult ) {
		var storage = App.get( 'gameResultsStorage' );

		if ( Ember.isNone( gameResult ) ) {
			throw 'Parameter "gameResult" should not be empty.';
		}

		storage.addItem( gameResult );
	},

	//endregion

	//region Observers

	/**
	 * Observes currentPlayer field state. If current player is player2, then select any empty field cell
	 *
	 */
	didCurrentPlayerChange: function () {
		var currentPlayer = this.get( 'model.currentPlayer' );
		var	nextPlayer = this.get( 'model.player2' );
			field = this.get( 'model.field' ),
			emptyCells = field.getEmptyCells();

		//if it's player two turn
		if ( Ember.isEqual( currentPlayer, nextPlayer ) ) {
			//select empty cell and make move
			field = this.get( 'model.field' ),
			emptyCells = field.getEmptyCells();
		}
	}.observes( 'model.currentPlayer' ),

	//endregion

	//region Actions

	actions: {
		/**
		 * Fired when user click a field cell.
		 *
		 * @event cellClick
		 * @param {Cell} cell Cell that was clicked.
		 */
		cellClick: function ( cell ) {
			if ( !this.get( 'isGameOver' ) ) {
				this.makeMove( cell );
			}
		},

		/**
		 * Fired when we need to restart the game.
		 *
		 * @event playAgain
		 */
		playAgain: function () {
			var game = this.get( 'model' );

			this.set( 'isGameOver', false );
			game.reset();
			game.start();
		},

		/**
		 * Fired when user click "Restart game" button
		 *
		 * @event restartGame
		 */
		restartGame: function () {
			if ( confirm( 'Are you sure you want to restart the game?' ) ) {
				this.send( 'playAgain' );
			}
		},

		/**
		 * Fired when user click "Edit name" button.
		 *
		 * @event editName
		 */
		editName: function () {
			var playerOneName = this.get( 'player1.nameOne' );
			var playerTwoName = this.get( 'player2.nameTwo' );
				modalData = {
					playerOne: this.get( 'player1' ),
					playerTwo: this.get( 'player2' ),
					isNameRequired: Ember.isEmpty( playerOneName, playerTwoName )					
				};

			this.send( 'showModal', 'player-name-modal', modalData );
		},

		/**
		 * Fired when user close player name modal dialog.
		 *
		 * @event playerNameModalClosed
		 */
		playerNameModalClosed: function() {
			var game = this.get( 'model' );

			if ( Ember.isNone( game.get( 'startTime') ) ) {
				game.start();
			}
		}
	}

	//endregion
} );
