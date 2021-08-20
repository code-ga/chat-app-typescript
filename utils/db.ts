import mongoose from 'mongoose'

const connectDB = async (url: string) => {
    try {
        await mongoose.connect(url, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })
        console.log('MongoDB connected')
    } catch (error) {
        console.log(error)
    }
}

export default connectDB
