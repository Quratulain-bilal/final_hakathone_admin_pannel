"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { Product } from "../../../../interface";
import { FaSpinner, FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
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

        const data = await client.fetch(query);

        // Convert `_id` to `id` as a string for consistency
        const formattedData = data.map((product: any) => ({
          ...product,
          id: String(product._id), // Ensure `id` is always a string
        }));

        setProducts(formattedData);
        setFilteredProducts(formattedData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.category?.title?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  const handleDelete = (id: string) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/product/edit/${id}`);
  };

  const handleAddProduct = () => {
    router.push("/admin/product/add");
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Main Content */}
      <main className="p-6 md:p-8 overflow-y-auto ml-0 md:ml-64 flex flex-col items-center">
        {/* Header */}
        <motion.div
          className="w-full max-w-6xl mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-yellow-600">
            Product Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your products with ease and efficiency.
          </p>
        </motion.div>

        {/* Add Product Button and Search Bar */}
        <motion.div
          className="w-full max-w-6xl mb-8 flex flex-col md:flex-row justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            onClick={handleAddProduct}
            className="flex items-center bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-600 transition duration-200 text-sm md:text-base"
          >
            <FaPlus className="mr-2" /> Add Product
          </button>
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search products by name or category..."
              className="w-full p-2 pl-10 bg-gray-100 text-gray-900 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm md:text-base"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <motion.div
            className="flex justify-center items-center space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaSpinner className="animate-spin text-yellow-500" size={24} />
            <p className="text-gray-600 text-sm md:text-base">
              Loading products...
            </p>
          </motion.div>
        ) : (
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={product.image || "/placeholder.jpg"}
                        alt={product.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-xl"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {product.category?.title?.toUpperCase() ||
                          "Uncategorized"}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-lg font-bold text-yellow-600">
                          ${product.price}
                        </span>
                        <span className="text-sm text-gray-600">
                          {product.stock} in stock
                        </span>
                      </div>
                      <div className="flex items-center mt-3">
                        <span className="text-sm text-gray-600">Rating: </span>
                        <span className="text-sm text-yellow-600 ml-2">
                          {product.rating
                            ? `${product.rating.rate} ⭐ (${product.rating.count})`
                            : "No ratings"}
                        </span>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex justify-between mt-4 space-x-2">
                        <button
                          onClick={() => handleEdit(product.id)}
                          className="flex items-center justify-center w-full bg-blue-500 text-white py-1 rounded-lg hover:bg-blue-600 transition duration-200 text-sm"
                        >
                          <FaEdit className="mr-2" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="flex items-center justify-center w-full bg-red-500 text-white py-1 rounded-lg hover:bg-red-600 transition duration-200 text-sm"
                        >
                          <FaTrash className="mr-2" /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.p
                  className="text-center text-gray-600 col-span-full text-sm md:text-base"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  No products found.
                </motion.p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
