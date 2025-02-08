import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client"; // Ensure this path is correct

export async function PUT(req: Request) {
  try {
    // Parse the incoming request body
    const {
      id,
      title,
      price,
      priceWithoutDiscount,
      badge,
      description,
      inventory,
      tags,
      category,
      image, // Image URL or asset reference (depending on how it's provided)
    } = await req.json();

    // Log the incoming request body to inspect the structure
    console.log("Received request body:", { id, title, price, priceWithoutDiscount, badge, description, inventory, tags, category, image });

    // Check if id is provided in the request body
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Handle image upload (Sanity Image Asset)
    let imageReference;
    if (image) {
      // If the image is a URL, convert it into a Sanity image reference
      imageReference = await uploadImage(image);
    }

    // Update the product in Sanity with the image included
    const updatedProduct = await client
      .patch(id) // The ID of the document you want to update
      .set({
        title,
        price,
        priceWithoutDiscount,
        badge,
        description,
        inventory,
        tags,
        category: { _type: "reference", _ref: category }, // Assuming category is a reference to another document
        image: imageReference, // Set the image reference or leave it out if not provided
      })
      .commit(); // Commit the changes

    // Return success response with updated product data
    return NextResponse.json({ message: "Product updated successfully", updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// Helper function to upload the image to Sanity
async function uploadImage(imageUrl: string) {
  try {
    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Create a new file object from the blob
    const file = new File([blob], "image.jpg", { type: blob.type });

    // Upload the file to Sanity
    const uploadedImage = await client.assets.upload("image", file);

    return {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: uploadedImage._id,
      },
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}
