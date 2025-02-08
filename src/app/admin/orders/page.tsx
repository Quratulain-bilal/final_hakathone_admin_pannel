"use client";

import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";
import { FaSpinner, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  orderStatus: string | null;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const query = `*[_type == "order"]{
          _id,
          orderNumber,
          createdAt,
          total,
          items[]{
            productId,
            name,
            quantity,
            price
          },
          orderStatus
        }`;
        const data: Order[] = await client.fetch(query);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Sorting function
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortBy === "createdAt") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === "total") {
      return a.total - b.total;
    } else if (sortBy === "orderNumber") {
      return a.orderNumber.localeCompare(b.orderNumber);
    }
    return 0;
  });

  // Filtering based on search and status
  const filteredOrders = sortedOrders.filter(
    (order) =>
      (order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )) &&
      (statusFilter === "" || order.orderStatus === statusFilter)
  );

  // Delete order function
  const deleteOrder = async (orderId: string) => {
    try {
      await client.delete(orderId);
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 md:ml-64">
      {/* Page Heading */}
      <motion.h1
        className="text-3xl font-bold text-gray-900 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Orders
      </motion.h1>

      {/* Filters and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Search Bar */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <input
            type="text"
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-400 shadow-md"
            placeholder="Search by Order Number or Product Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        {/* Status Filter Dropdown */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <select
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-gray-900 shadow-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Filter by Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </motion.div>

        {/* Sorting Options */}
        <motion.div
          className="w -full"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <select
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-gray-900 shadow-md"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Sort by Created At</option>
            <option value="total">Sort by Total Amount</option>
            <option value="orderNumber">Sort by Order Number</option>
          </select>
        </motion.div>
      </div>

      {/* Loading State */}
      {loading ? (
        <motion.div
          className="flex justify-center items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaSpinner className="animate-spin text-teal-500" size={30} />
          <p className="text-gray-600">Loading orders...</p>
        </motion.div>
      ) : (
        <motion.div
          className="overflow-x-auto bg-white shadow-lg rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <table className="min-w-full table-auto text-sm text-gray-900">
            <thead className="bg-yellow-500 text-gray-900">
              <tr>
                <th className="px-4 py-3">Order Number</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total Items</th>
                <th className="px-4 py-3">Total Quantity</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <motion.tr
                    key={order._id}
                    className="border-b border-gray-300 hover:bg-yellow-100 transition-all"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-4 py-3 text-center">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`${
                          order.orderStatus === "pending"
                            ? "text-yellow-400 font-bold"
                            : order.orderStatus === "completed"
                              ? "text-green-400 font-bold"
                              : order.orderStatus === "shipped"
                                ? "text-blue-400 font-bold"
                                : order.orderStatus === "cancelled"
                                  ? "text-red-400 font-bold"
                                  : "text-gray-400 font-normal"
                        }`}
                      >
                        {order.orderStatus
                          ? order.orderStatus.toUpperCase()
                          : "Unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {order.items.length}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {order.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center px-4 py-3 text-gray-400"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}
