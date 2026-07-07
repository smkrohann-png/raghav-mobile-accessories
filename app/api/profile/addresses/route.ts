import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { db } from "@/lib/db/memory";

// GET all addresses
export async function GET(req: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const addresses = db.getAddressesByUserId(session.userId);
    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Get addresses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

// CREATE new address
export async function POST(req: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { fullName, phone, street, city, state, pincode, isDefault } = body;

    if (!fullName || !phone || !street || !city || !state || !pincode) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // If this is default, unset other defaults
    if (isDefault) {
      const addresses = db.getAddressesByUserId(session.userId);
      addresses.forEach((addr) => {
        if (addr.isDefault) {
          db.updateAddress(addr.id, { isDefault: false });
        }
      });
    }

    const address = db.createAddress({
      userId: session.userId,
      fullName,
      phone,
      street,
      city,
      state,
      pincode,
      isDefault: isDefault || false,
    });

    return NextResponse.json(
      {
        message: "Address added successfully",
        address,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create address error:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}
