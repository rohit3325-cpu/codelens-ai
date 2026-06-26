import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Payment } from "@/models/Payment";
import { markPaymentPaidAndExtendSubscription } from "@/lib/subscriptionStore";

interface RazorpayWebhookEvent {
  event: string;
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
      };
    };
  };
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-razorpay-signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const rawBody = await req.text();

  if (!secret || !signature) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const isValid =
    expectedSignature.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));

  if (!isValid) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  try {
    const event: RazorpayWebhookEvent = JSON.parse(rawBody);

    if (event.event === "payment.captured") {
      const { id: razorpayPaymentId, order_id: razorpayOrderId } =
        event.payload.payment.entity;

      await connectToDatabase();

      const payment = await Payment.findOne({ razorpayOrderId });

      if (payment) {
        await markPaymentPaidAndExtendSubscription(payment, razorpayPaymentId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
