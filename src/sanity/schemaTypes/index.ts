import { type SchemaTypeDefinition } from "sanity";
import { productSchema } from "./products";

import { orderSchema } from "./order";
import { categorySchema } from "./categories";



export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productSchema,categorySchema , orderSchema],
};