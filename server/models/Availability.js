import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeSlots: [{
        time: {
            type: String,
            required: true
        },
        isBooked: {
            type: Boolean,
            default: false
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure no duplicate dates for the same doctor
availabilitySchema.index({ doctor: 1, date: 1 }, { unique: true });

export default mongoose.model('Availability', availabilitySchema);