import { NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Validate the secret to ensure the request is from our Apps Script
    if (data.secret !== "GEMIGRAM_WEBHOOK_SECRET_2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!data.userId || !data.type || !data.title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Add notification to Firestore
    const docRef = await addDoc(collection(db, 'notifications'), {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message || '',
      read: false,
      timestamp: serverTimestamp(),
      secret: data.secret // Required by our Firestore rules for creation
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
