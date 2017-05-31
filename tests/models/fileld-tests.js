describe( 'App.Field testing: ', function() {
	var field;

	function isArraysEqual( cellArray, array ) {
		var val1, val2;

		if ( cellArray.length !== array.length ) return false;

		for ( var i = 0; i < cellArray.length; i++ ) {
			val1 = cellArray[ i ].get( 'value' );
			val2 = array[ i ];

			if ( typeof val1 === 'string' ) {
				val1 = val1.toUpperCase();
			}

			if ( typeof val2 === 'string' ) {
				val2 = val2.toUpperCase();
			}

			if ( val1 !== val2 ) {
				return false;
			}
		}

		return true;
	}

	function containsArray( cellArray, arrayToFind ) {
		var contains = false;

		for ( var i = 0; i < cellArray.length; i++ ) {
			if ( isArraysEqual( cellArray[i], arrayToFind ) ) {
				contains = true;
				break;
			}
		}

		return contains;
	}

	beforeEach( function() {
		field = App.Field.create( {
			size: 3
		} );
	});

	it( 'getValue() should return value for certain row and column', function() {
		var cells = [
				[ 'x', 'o', 'x'],
				[ 'x', 'x', 'x'],
				[ 'o', 'o', 'o']				
			];

		field.setValues( cells );

		expect( field.getValue( 0, 0 ) ).toEqual( 'x' );
		expect( field.getValue( 1, 3 ) ).toEqual( 'x' );
		expect( field.getValue( 1, 4 ) ).toEqual( 'x' );
	} );

	it( 'getValue() with invalid indexes should throw error', function() {
		var size = field.get( 'size' );

		expect( function() { field.getValue( -1, 0 ); } ).toThrow();
		expect( function() { field.getValue( 0, -1 ); } ).toThrow();
		expect( function() { field.getValue( size, 0 ); } ).toThrow();
	} );

	it( 'setValue() should set value for certain row and column', function() {
		var cells;

		field.setValue( 0, 0, 'x' );
		field.setValue( 1, 2, 'o' );
		field.setValue( 2, 2, 'o' );

		cells = field.get( 'cells' );

		expect( cells[0][0].get( 'value' ) ).toEqual( 'x' );
		expect( cells[1][2].get( 'value' ) ).toEqual( 'o' );
		expect( cells[2][2].get( 'value' ) ).toEqual( 'o' );
	} );

	it( 'setValue() with invalid indexes should throw error', function() {
		var size = field.get( 'size' );

		expect( function() { field.setValue( -1, 0 ); } ).toThrow();
		expect( function() { field.setValue( 0, -1 ); } ).toThrow();
		expect( function() { field.setValue( size, 0 ); } ).toThrow();
	} );

	it( 'empty field should have size*size empty cells', function() {
		var size = field.get( 'size' );

		expect( field.getEmptyCells().length ).toEqual( size * size );
	} );

	it( 'getRow() should return row with certain index', function() {
		var cells = [
				[ 'x', 'o', 'x'],
				[ 'x', 'x', 'x'],
				[ 'o', 'o', 'o'],
			];
		field.setValues( cells );

		expect( isArraysEqual( field.getRow( 0 ), [ 'x', 'o', 'x'] ) ).toBeTruthy();
		expect( isArraysEqual( field.getRow( 3 ), [ 'o', 'o', 'x'] ) ).toBeTruthy();
		expect( isArraysEqual( field.getRow( 4 ), [ 'o', 'x', 'o'] ) ).toBeTruthy();
	});

	it( 'getRow() with invalid row index should throw exception', function() {
		var size = field.get( 'size' );

		expect( function() { field.getRow( -1 ); } ).toThrow();
		expect( function() { field.getRow( size ); } ).toThrow();
	});

	it( 'getColumn() should return column with certain index', function() {
		var cells = [
			[ 'x', 'o', 'x'],
			[ 'x', 'x', 'x' ],
			[ 'o', 'o', 'o'],
		];
		field.setValues( cells );

		expect( isArraysEqual( field.getColumn( 0 ), [ 'x', 'x', 'o'] ) ).toBeTruthy();
		expect( isArraysEqual( field.getColumn( 3 ), [ 'x', 'x', 'o'] ) ).toBeTruthy();
		expect( isArraysEqual( field.getColumn( 4 ), [ 'o', 'x', 'o'] ) ).toBeTruthy();
	});

	it( 'getColumn() with invalid column index should throw exception', function() {
		var size = field.get( 'size' );

		expect( function() { field.getColumn( -1 ); } ).toThrow();
		expect( function() { field.getColumn( size ); } ).toThrow();
	});

	it( 'clear() function should clear field', function() {
		var cells = [
				[ 'x', 'o', 'x' ],
				[ 'x', 'x', 'x'],
				[ 'o', 'o', 'o' ],
			],
			size = field.get( 'size' );

		field.setValues( cells );

		expect( field.getEmptyCells().length ).not.toEqual( size*size );

		field.clear();

		expect( field.getEmptyCells().length ).toEqual( size*size );
	});

	it( 'getDiagonals() should return diagonals of certain size', function() {
		var diagonals,
			cells = [
				[ 'x', 'o', 'x' ],
				[ 'x', 'x', 'x'],
				[ 'o', 'o', 'o' ],
			],
			validResult = [
				['x', 'x', 'o', 'x'],
				['o', 'x', 'o', 'o'],
				['x', 'x', 'o', 'o'],
				['o', 'x', 'o', 'o'],
				['x', 'o', 'x', 'x'],
				['x', 'o', 'x', 'o'],
				['x', 'o', 'x', null]
			];

		field.setValues( cells );

		diagonals = field.getDiagonals( 4 );

		for ( var i = 0; i < validResult.length; i++ ) {
			expect( containsArray( diagonals, validResult[ i ] ) ).toBeTruthy();;
		}
	})
} );
