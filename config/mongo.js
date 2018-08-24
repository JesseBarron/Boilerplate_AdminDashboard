var mongoose = require('mongoose');

require('../models');

mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log('opened mongo database connection!');
});