export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  category: 'Keyboards' | 'Audio' | 'Accessories' | 'Lighting';
  image: string;
  rating: number;
  reviewCount: number;
  features: string[];
  specs: Record<string, string>;
  colors: { name: string; hex: string }[];
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentDetails {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
}

export interface PiUser {
  uid: string;
  username: string;
  accessToken: string;
}

