const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['Pothole', 'Crack', 'Flooding', 'Debris', 'Signage', 'Other'],
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true } // [lng, lat]
    },
    address: String,
    images: [String],
    aiAnalysis: {
        tags: [String],
        verifiedHazard: Boolean,
        confidence: Number,
        analyzedAt: Date
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

issueSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Issue', issueSchema);