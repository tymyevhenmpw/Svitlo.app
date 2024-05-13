import mongoose from "mongoose";

const hashtagSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    }, 
});

const Hashtag = mongoose.models.Hashtag  || mongoose.model('Hashtag', hashtagSchema);

export default Hashtag;