const fileschema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    fileurl: {
        type: String,
        required: true
    },
    createdAt: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});
const File = mongoose.model("File", fileschema);
export default File;