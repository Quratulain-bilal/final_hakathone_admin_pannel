"use client";

import { atom } from "jotai";
import { Product } from "../interface";
import { client } from "./sanity/lib/client";
import { useAtom } from "jotai";
import { useEffect } from "react";

export const data = atom<Product[]>([]);

const DataFetching = () => {
  const [, setProducts] = useAtom(data);

  useEffect(() => {
    const dataFetching = async () => {
      try {
        const query = `*[_type == "products"]{
          _id,
          title,
          tags,
          price,
          inventory as stock,
          dimensions,
          description,
          discount,
          priceWithoutDiscount as originalPrice,
          badge,
          "categoryName": category->title,
          "slug": slug.current,
          "imageUrl": image.asset->url,
          rating
        }`;

        const fetchedProducts: Product[] = await client.fetch(query);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    dataFetching();
  }, [setProducts]);

  return null;
};

export default DataFetching;
