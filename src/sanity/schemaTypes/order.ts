import { defineType } from "sanity";

export const orderSchema = defineType({
  name: "orders",
  title: "Orders",
  type: "document",
  fields: [
    {
      name: "orderNumber",
      title: "Order Number",
      type: "string",
    },
    {
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
    },
    {
      name: "totalAmount",
      title: "Total Amount",
      type: "number",
    },
    {
      name: "orderItems",
      title: "Order Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "products" }],
            },
            {
              name: "price",
              title: "Price",
              type: "number",
            },
            {
              name: "quantity",
              title: "Quantity",
              type: "number",
            },
          ],
        },
      ],
    },
    {
      name: "orderStatus",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Completed", value: "completed" },
          { title: "Shipped", value: "shipped" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
    },
  ],
});