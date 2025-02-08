"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  FiBox,
  FiTrendingUp,
  FiDollarSign,
  FiShoppingCart,
  FiStar,
  FiCheckCircle,
  FiClock,
  FiTruck,
} from "react-icons/fi";
import { useTheme } from "next-themes";

export default function Dashboard() {
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalInventory, setTotalInventory] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [completedOrders, setCompletedOrders] = useState<number>(0);
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [deliveredOrders, setDeliveredOrders] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
  const [productPerformanceData, setProductPerformanceData] = useState<any[]>(
    []
  );
  const [inventorySalesData, setInventorySalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products data
        const productQuery = `*[_type == "shopProduct"]{
          price,
          stockLevel,
          _createdAt,
          name
        }`;

        const productsData = await client.fetch(productQuery);
        setTotalProducts(productsData.length);
        setTotalInventory(
          productsData.reduce(
            (acc: number, product: { stockLevel: number }) =>
              acc + product.stockLevel,
            0
          )
        );
        setTotalAmount(
          productsData.reduce(
            (acc: number, product: { price: number; stockLevel: number }) =>
              acc + product.price * product.stockLevel,
            0
          )
        );

        // Fetch orders data
        const ordersQuery = `*[_type == "order"]{
          orderStatus,
          createdAt,
          total
        }`;

        const ordersData = await client.fetch(ordersQuery);
        setTotalOrders(ordersData.length);
        setCompletedOrders(
          ordersData.filter(
            (order: { orderStatus: string }) =>
              order.orderStatus === "completed"
          ).length
        );
        setPendingOrders(
          ordersData.filter(
            (order: { orderStatus: string }) => order.orderStatus === "pending"
          ).length
        );
        setDeliveredOrders(
          ordersData.filter(
            (order: { orderStatus: string }) => order.orderStatus === "shipped"
          ).length
        );

        // Fetch reviews data
        const reviewsQuery = `*[_type == "review"]{ _id }`;
        const reviewsData = await client.fetch(reviewsQuery);
        setTotalReviews(reviewsData.length);

        // Process data for the charts
        const monthlyData = ordersData.reduce(
          (
            acc: { [key: string]: { orders: number; sales: number } },
            order: { createdAt: string; total: number }
          ) => {
            const date = new Date(order.createdAt);
            const month = date.toLocaleString("default", {
              month: "short",
              year: "numeric",
            });
            if (!acc[month]) {
              acc[month] = { orders: 0, sales: 0 };
            }
            acc[month].orders += 1;
            acc[month].sales += order.total;
            return acc;
          },
          {}
        );

        const labels = Object.keys(monthlyData);
        const ordersDataPoints = labels.map(
          (month) => monthlyData[month].orders
        );
        const salesDataPoints = labels.map((month) => monthlyData[month].sales);

        const chartDataFormatted = labels.map((month, index) => ({
          name: month,
          totalOrders: ordersDataPoints[index],
          totalSales: salesDataPoints[index],
        }));

        setChartData(chartDataFormatted);

        // Process inventory data
        const inventoryDataFormatted = productsData.map((product: any) => ({
          name: product.name,
          stockLevel: product.stockLevel,
        }));
        setInventoryData(inventoryDataFormatted);

        // Process revenue data
        const revenueDataFormatted = labels.map((month, index) => ({
          name: month,
          revenue: salesDataPoints[index],
        }));
        setRevenueData(revenueDataFormatted);

        // Process order status data for Pie Chart
        const orderStatusDataFormatted = [
          { name: "Completed", value: completedOrders },
          { name: "Pending", value: pendingOrders },
          { name: "Delivered", value: deliveredOrders },
        ];
        setOrderStatusData(orderStatusDataFormatted);

        // Process product performance data for Radar Chart
        const productPerformanceDataFormatted = productsData.map(
          (product: any) => ({
            subject: product.name,
            A: product.stockLevel,
            B: product.price,
          })
        );
        setProductPerformanceData(productPerformanceDataFormatted);

        // Process inventory vs sales data for Scatter Chart
        const inventorySalesDataFormatted = productsData.map(
          (product: any) => ({
            stockLevel: product.stockLevel,
            sales: product.price * product.stockLevel,
          })
        );
        setInventorySalesData(inventorySalesDataFormatted);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Variants for animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, type: "spring", stiffness: 75 },
    }),
  };

  // Colors for Pie Chart
  const COLORS = ["#3B82F6", "#F59E0B", "#10B981"];

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} p-6 md:ml-64`}
    >
      {/* Header Section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">
          Insights and analytics for your business.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Products Card */}
        <motion.div
          className={`rounded-xl p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <FiBox className="text-4xl mb-4 text-blue-500" />
          <h2 className="text-lg font-semibold">Total Products</h2>
          <p className="text-2xl font-bold">{totalProducts}</p>
        </motion.div>

        {/* Total Inventory Card */}
        <motion.div
          className={`rounded-xl p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <FiTrendingUp className="text-4xl mb-4 text-green-500" />
          <h2 className="text-lg font-semibold">Total Inventory</h2>
          <p className="text-2xl font-bold">{totalInventory}</p>
        </motion.div>

        {/* Total Sales Amount Card */}
        <motion.div
          className={`rounded-xl p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <FiDollarSign className="text-4xl mb-4 text-yellow-500" />
          <h2 className="text-lg font-semibold">Total Sales Amount</h2>
          <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
        </motion.div>

        {/* Total Orders Card */}
        <motion.div
          className={`rounded-xl p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
          custom={3}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <FiShoppingCart className="text-4xl mb-4 text-purple-500" />
          <h2 className="text-lg font-semibold">Total Orders</h2>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Line Chart */}
        <motion.div
          className={`rounded-xl p-6 shadow-sm border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <FiTrendingUp className="text-2xl mr-2 text-blue-500" />
            Sales & Orders Trend
          </h2>
          {loading ? (
            <div className="animate-pulse h-96 bg-gray-100 rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                  dataKey="name"
                  stroke={theme === "dark" ? "#D1D5DB" : "#6B7280"}
                />
                <YAxis stroke={theme === "dark" ? "#D1D5DB" : "#6B7280"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                    border: `1px solid ${theme === "dark" ? "#374151" : "#E5E7EB"}`,
                    borderRadius: "8px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalOrders"
                  stroke="#3B82F6" // Blue
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="totalSales"
                  stroke="#F59E0B" // Amber
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          className={`rounded-xl p-6 shadow-sm border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <FiDollarSign className="text-2xl mr-2 text-green-500" />
            Monthly Revenue
          </h2>
          {loading ? (
            <div className="animate-pulse h-96 bg-gray-100 rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                  dataKey="name"
                  stroke={theme === "dark" ? "#D1D5DB" : "#6B7280"}
                />
                <YAxis stroke={theme === "dark" ? "#D1D5DB" : "#6B7280"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                    border: `1px solid ${theme === "dark" ? "#374151" : "#E5E7EB"}`,
                    borderRadius: "8px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="#10B981" // Green
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Additional Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Pie Chart */}
        <motion.div
          className={`rounded-xl p-6 shadow-sm border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <FiShoppingCart className="text-2xl mr-2 text-purple-500" />
            Order Status Distribution
          </h2>
          {loading ? (
            <div className="animate-pulse h-96 bg-gray-100 rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                    border: `1px solid ${theme === "dark" ? "#374151" : "#E5E7EB"}`,
                    borderRadius: "8px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          className={`rounded-xl p-6 shadow-sm border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <FiBox className="text-2xl mr-2 text-blue-500" />
            Product Performance
          </h2>
          {loading ? (
            <div className="animate-pulse h-96 bg-gray-100 rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={productPerformanceData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  dataKey="A"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
                <Radar
                  dataKey="B"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                    border: `1px solid ${theme === "dark" ? "#374151" : "#E5E7EB"}`,
                    borderRadius: "8px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Scatter Chart */}
        <motion.div
          className={`rounded-xl p-6 shadow-sm border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <FiTrendingUp className="text-2xl mr-2 text-green-500" />
            Inventory vs. Sales
          </h2>
          {loading ? (
            <div className="animate-pulse h-96 bg-gray-100 rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                  type="number"
                  dataKey="stockLevel"
                  name="Stock Level"
                  stroke={theme === "dark" ? "#D1D5DB" : "#6B7280"}
                />
                <YAxis
                  type="number"
                  dataKey="sales"
                  name="Sales"
                  stroke={theme === "dark" ? "#D1D5DB" : "#6B7280"}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                    border: `1px solid ${theme === "dark" ? "#374151" : "#E5E7EB"}`,
                    borderRadius: "8px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                />
                <Legend />
                <Scatter
                  name="Inventory vs. Sales"
                  data={inventorySalesData}
                  fill="#10B981" // Green
                />
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>
    </div>
  );
}
