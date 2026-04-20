import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types

const carSchema = new mongoose.Schema({
    owner: {type: ObjectId, ref: 'User'},
    brand: {type: String, required: true},
    model: {type: String, required: true},
    image: {type: String, required: true},
    year: {type: Number, required: true},
    category: {type: String, required: true},
    seating_capacity: {type: Number, required: true},
    fuel_type: { type: String, required: true },
    transmission: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    pricePerHour: { type: Number, required: true, default: 0 },
    location: { type: String, required: true },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    threeSixtyImages: { type: [String], default: [] },
    rtoDate: { type: Date },
    // New Document & Fitness Fields
    rcCertificate: { type: String }, // URL to registration certificate
    pucCertificate: { type: String }, // URL to PUC certificate
    insuranceCertificate: { type: String }, // URL to Insurance policy
    fitnessExpiryDate: { type: Date },
    luggageCapacity: { type: Number, default: 0 },
    isAvaliable: {type: Boolean, default: true},
    status: { type: String, enum: ['pending', 'approved'], default: 'approved' }
},{timestamps: true})

// Performance Indexes for Scalability
carSchema.index({ category: 1 });
carSchema.index({ brand: 1 });
carSchema.index({ location: 1 });
carSchema.index({ isAvaliable: 1, status: 1 });
carSchema.index({ owner: 1 });

const Car = mongoose.model('Car', carSchema)

export default Car