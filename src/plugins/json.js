/**
 * JSON plugin
 * @param {Route} route
 * @returns {Function}
 */
function json( route ) {
  route.post( 'dispatch', function( req, res ) {
    res.json( res.body )
  } )
}

export default json
