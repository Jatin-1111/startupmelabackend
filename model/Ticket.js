import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  passType: { type: String, required: true }, // e.g., "General Visitor", "Investor"
  amount: { type: Number, required: true },
  orderId: { type: String, required: true }, // Razorpay Order ID
  paymentId: { type: String }, // Razorpay Payment ID (added after success)
  signature: { type: String }, // Razorpay Signature
  status: { type: String, default: 'created' }, // created, paid, failed
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;