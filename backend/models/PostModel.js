import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema({
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        maxLength: 500
    },
    img: {
        type: String
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    replies: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            maxLength: 500
        },
        userProfilePic: {
            type: String
        },
        username: {
            type: String
        }
    }]
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;
