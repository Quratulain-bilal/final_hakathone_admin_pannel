"use client";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { FiStar } from "react-icons/fi";

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const query = `*[_type == "review"]{
          productId,
          userName,
          text,
          createdAt,
          rating
        }`;
        const reviewsData = await client.fetch(query);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Standalone hash function
  const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  // Function to generate a random avatar URL
  const getRandomAvatar = (userName: string) => {
    const userHash = userName ? hashCode(userName) : "default"; // Create a hash from the username
    return `https://i.pravatar.cc/150?u=${userHash}`; // Use the hash to get a unique avatar
  };

  return (
    <div className={`min-h-screen bg-white text-gray-900 p-10 md:ml-64`}>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Product Reviews</h1>
        <p className="text-gray-600 mt-2">
          Here are the reviews submitted by users.
        </p>
      </motion.div>

      {loading ? (
        <div className="animate-pulse h-96 bg-yellow-500 rounded-lg" />
      ) : (
        <div className="flex flex-wrap gap-6">
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              className="rounded-xl p-6 shadow-sm border bg-white border-gray-100 w-full md:w-1/2 lg:w-1/3" // Adjust width here
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={getRandomAvatar(review.userName)}
                  alt={`${review.userName}'s avatar`}
                  className="h-10 w-10 rounded-full mr-4"
                />
                <h2 className="text-lg font-semibold">{review.userName}</h2>
              </div>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, index) => (
                  <FiStar
                    key={index}
                    className={`h-5 w-5 ${index < review.rating ? "text-yellow-500" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-gray-700">{review.text}</p>
              <p className="text-gray-500 text-sm mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
