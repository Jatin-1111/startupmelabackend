import Razorpay from 'razorpay';
import crypto from 'crypto';
import Ticket from '../model/Ticket.js';
import dotenv from 'dotenv';

dotenv.config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create Order
export const createOrder = async (req, res) => {
  try {
    const { name, email, phone, passType, amount } = req.body;

    const options = {
      amount: amount * 100, // Amount in paise (e.g. 199.00 -> 19900)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    // Save initial ticket info to DB
    const ticket = new Ticket({
      name,
      email,
      phone,
      passType,
      amount,
      orderId: order.id,
      status: 'created'
    });
    
    await ticket.save();

    res.json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID // Send key to frontend
    });

  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ success: false, message: "Payment initiation failed" });
  }
};

// 2. Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update DB status
      await Ticket.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { 
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          status: 'paid' 
        }
      );

      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};