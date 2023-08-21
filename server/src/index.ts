import mongoose from 'mongoose';
import app from './app';

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to mongodb.'));

const db = mongoose.connection;

db.on('error', () => console.error('Failed connecting to mongodb.'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
