import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getRazorpayClient } from "@/lib/razorpay";
import { Payment } from "@/models/Payment";
import { PLAN_PRICING, isPaidPlanId } from "@/lib/plans";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { plan } = await req.json();

    if (!isPaidPlanId(plan)) {
      return NextResponse.json(
        { success: false, message: "Unsupported plan" },
        { status: 400 }
      );
    }

    const pricing = PLAN_PRICING[plan];

    await connectToDatabase();

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: pricing.amount,
      currency: pricing.currency,
      receipt: `${plan}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
      notes: { userId, plan },
    });

    await Payment.create({
      userId,
      plan,
      amount: pricing.amount,
      currency: pricing.currency,
      razorpayOrderId: order.id,
      status: "created",
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: pricing.amount,
      currency: pricing.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}
