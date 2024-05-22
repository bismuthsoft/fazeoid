import mongoose, { Schema } from 'mongoose';

interface Instrument extends mongoose.Document {
    name: string,
//    creator: any,
    data: any,
}

const instrumentSchema = new mongoose.Schema<Instrument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        // creator: {
        //     required: true,
        //     type: Schema.Types.ObjectId,
        //     ref: 'User'
        // },
        data: {
            type: Schema.Types.Mixed,
            required: true
        }
    },
    // Created at and updated at timestamps
    { timestamps: true }
);


const Instrument = mongoose.model<Instrument>('Instrument', instrumentSchema);

export { Instrument };
