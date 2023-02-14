import mongoose from 'mongoose'

mongoose.set('strictQuery', true)
mongoose.set('strictPopulate', false)

const ConnectMongoDB = async (uri) => {
  const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  await mongoose.connect(uri, connectionOptions)
    .then(() => console.log(`Successfully Connected To MongoDB, @URI = ${uri}`))
    .catch(error => {
      console.error(`Database Connection Error: ${error}`)
      process.exit(1)
    })
};

mongoose.connection.on("disconnected", () => console.log(`MongoDB Connection Disconnected!`))

export default ConnectMongoDB