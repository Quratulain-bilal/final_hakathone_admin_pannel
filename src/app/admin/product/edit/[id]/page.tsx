"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client"; // Sanity client import
import { Product } from "../../../../../../interface"; // Correct path for Product interface

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch product details when the component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const query = `*[_type == "shopProduct"]{
    _id,
    title,
   "slug": slug.current, 
    price,
    description,
    "image": image.asset->url,
    discountPercentage,
    isFeaturedProduct,
    stockLevel,
    category
  }`;
        ;

        const data = await client.fetch(query, { id: params.id });

        if (data) {
          setProduct(data);
        } else {
          console.error("Product not found for ID:", params.id);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  // Handle form submission to update the product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    // Prepare product data to update, excluding category and image
    const productToUpdate = {
      ...product,
      id: product._id, // Ensure we are passing _id to id
    };

    console.log("Submitting product data:", productToUpdate);

    try {
      const response = await fetch(`/api/products/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productToUpdate),
      });

      if (response.ok) {
        alert("Product updated successfully!");
        router.push("/admin");
      } else {
        alert("Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-400">Loading product data...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-400">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white p-8">
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-8 text-blue-300">Edit Product</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400">Title</label>
            <input
              type="text"
              value={product.title || ""}
              onChange={(e) =>
                setProduct((prevProduct) =>
                  prevProduct ? { ...prevProduct, title: e.target.value } : null
                )
              }
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-400">Price</label>
            <input
              type="number"
              value={product.price || 0}
              onChange={(e) =>
                setProduct((prevProduct) =>
                  prevProduct
                    ? { ...prevProduct, price: parseFloat(e.target.value) }
                    : null
                )
              }
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-400">Price without Discount</label>
            <input
              type="number"
              value={product.priceWithoutDiscount || 0}
              onChange={(e) =>
                setProduct((prevProduct) =>
                  prevProduct
                    ? { ...prevProduct, priceWithoutDiscount: parseFloat(e.target.value) }
                    : null
                )
              }
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-400">Inventory</label>
            <input
              type="number"
              value={product.inventory || 0}
              onChange={(e) =>
                setProduct((prevProduct) =>
                  prevProduct ? { ...prevProduct, inventory: parseInt(e.target.value) } : null
                )
              }
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-400">Description</label>
            <textarea
              value={product.description || ""}
              onChange={(e) =>
                setProduct((prevProduct) =>
                  prevProduct ? { ...prevProduct, description: e.target.value } : null
                )
              }
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-400">Badge</label>
            <input
              type="text"
              value={product.badge || ""}
              onChange={(e) =>
                setProduct((prevProduct) =>
                  prevProduct ? { ...prevProduct, badge: e.target.value } : null
                )
              }
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-400">Tags</label>
            <select
              multiple
              value={product.tags || []}
              onChange={(e) =>
                setProduct((prevProduct) =>
                  prevProduct
                    ? {
                        ...prevProduct,
                        tags: Array.from(e.target.selectedOptions, (option) => option.value),
                      }
                    : null
                )
              }
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
            >
              <option value="featured">Featured</option>
              <option value="instagram">Instagram</option>
              <option value="gallery">Gallery</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}
