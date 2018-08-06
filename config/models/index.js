var glob = require( 'glob' )
  , path = require( 'path' );


glob.sync( './config/models/*.js' ).forEach( function( file ) {
    if (file !== './config/models/index.js') {
        require( path.resolve( file ) );
    }
});