import mongoose from 'mongoose';

let isConnected = false;// variable to track the connection status;

export const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);
    if(!process.env.MONGODB_URI) throw new Error('Please provide a valid MongoDB URI');

    if(isConnected) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;

        }
    catch (error:any) {
        throw new Error('An error occured while trying to connect to the database');
        
    }

}