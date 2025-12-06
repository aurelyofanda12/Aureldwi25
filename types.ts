export type Category = 'Bolu' | 'Kue Lebaran';

export interface Review {
  id: string;
  user: string;
  comment: string;
  rating: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  stock: number;
  rating: number;
  reviews: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Paid' | 'Shipped';
  paymentMethod: 'Transfer' | 'QRIS';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar: string;
}
