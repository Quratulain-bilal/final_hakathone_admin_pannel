"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    discountPercentage: "",
    image: "", // Stores the image URL after uploading
    category: "",
    description: "",
    stockLevel: "",
    isFeaturedProduct: "",
    
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null); // Stores the selected image file
  const router = useRouter();

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;

      // Upload image if selected
      if (imageFile) {
        const formDataToSend = new FormData();
        formDataToSend.append("file", imageFile);

        const uploadResponse = await fetch("/api/products/uploadImage", {
          method: "POST",
          body: formDataToSend,
        });

        const uploadData = await uploadResponse.json();
        if (uploadResponse.ok) {
          imageUrl = uploadData.imageUrl; // Use the returned image URL
        } else {
          throw new Error("Image upload failed.");
        }
      }

      // Construct the payload according to API expectations
      const productPayload = {
        name: formData.title, // Adjusted to match API requirements
        details: formData.description, // Adjusted field
        price: parseFloat(formData.price) || 0,
        priceWithoutDiscount: parseFloat(formData.discountPercentage) || 0,
        category: formData.category,
    
        inventory: parseInt(formData.stockLevel) || 0,
         // Convert tags into an array
        image: imageUrl, // Uploaded image URL
      };

      const productResponse = await fetch("/api/products/addProducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productPayload),
      });

      const productData = await productResponse.json();
      if (productResponse.ok) {
        alert("Product added successfully!");
        router.push("/admin/product"); // Redirect to the product listing page
      } else {
        alert(`Error: ${productData.message}`);
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("An error occurred while adding the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col items-center space-y-6 shadow-lg">
        <h1 className="text-4xl font-bold text-blue-500 mb-8">Admin Panel</h1>
        <button
          onClick={() => router.push("/")}
          className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
        <nav className="mt-8 space-y-4">
          <a href="#" className="text-lg hover:text-blue-300 transition duration-200">Dashboard</a>
          <a href="#" className="text-lg hover:text-blue-300 transition duration-200">Categories</a>
          <a href="#" className="text-lg hover:text-blue-300 transition duration-200">Products</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-900 text-white flex justify-center items-center">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-6 text-blue-300">Add Product</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium">Price</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium">Price Without Discount</label>
              <input type="number" name="priceWithoutDiscount" value={formData.discountPercentage} onChange={handleChange} className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg" />
            </div>

          

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg" rows={4} />
            </div>

            <div>
              <label className="block text-sm font-medium">Inventory</label>
              <input type="number" name="inventory" value={formData.stockLevel} onChange={handleChange} className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg" />
            </div>

           

            <div>
              <label className="block text-sm font-medium">Category (ID)</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium">Image Upload</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg" />
            </div>

            <div className="mt-4">
              <button type="submit" disabled={loading} className={`w-full p-3 bg-blue-600 text-white rounded-lg ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}>
                {loading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
