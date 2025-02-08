interface Dimensions {
  height: number;
  depth: number;
  width: number;
}

interface Rating {
  rate: number;
  count: number;
}

export interface Category {
  _id: string;
  title: string;
  image: {
    asset: {
      url: string;
    };
  };
  products: number;
  
}
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  priceWithoutDiscount: number;
  discount: number;
  stock: number;
  rating: Rating;
  badge?: string;
  tags: string[];
  dimensions?: Dimensions;
  image: string; // Image stored as a URL string (or Sanity object reference)
  category: Category; // Reference to category object
  inventory: number;
  _id: string;
}
