/**
 * @module Routes
 * @class GameRoute
 */
App.GameRoute = Ember.Route.extend( {
	game: App.Game.create( {
		player1: App.Player.create( {} ),
		player2: App.Player.create( {} )
	} ),

	model: function () {
		return this.get( 'game' );
	},

	setupController: function ( controller, model ) {
		var user = model.get( 'player1' );
		var user2 = model.get( 'player2' );

		this._super( controller, model );

		model.reset();
		controller.set( 'isGameOver', false );

		if ( Ember.isEmpty( user.get( 'name' ), user.get( 'name' ) ) ) {
			controller.send( 'editName', true );
		}
		else {
			model.start();
		}
	}
} );