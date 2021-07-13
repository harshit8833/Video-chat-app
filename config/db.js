const mongoose = require('mongoose')

/////////////////////////////////////////////////////////////
// PRODUCTION: CONNECTION TO MONGO ATLAS CLUSTER
/////////////////////////////////////////////////////////////

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`mongo db connected with ${conn.connection.host}:${conn.connection.port}`)
    }
    catch (err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB