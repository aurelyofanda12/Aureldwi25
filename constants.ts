import { Product, User } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Bolu Gulung Rainbow',
    description: 'Soft sponge cake roll with colorful layers and premium strawberry jam.',
    price: 85000,
    category: 'Bolu',
    image: 'https://picsum.photos/seed/bolu1/400/400',
    stock: 20,
    rating: 4.8,
    reviews: [
      { id: 'r1', user: 'Siti M.', comment: 'Enak banget, lembut!', rating: 5 },
      { id: 'r2', user: 'Budi', comment: 'Warnanya cantik.', rating: 4 }
    ]
  },
  {
    id: '2',
    name: 'Premium Nastar Wisman',
    description: 'Melt-in-your-mouth pineapple tarts made with Wijsman butter.',
    price: 150000,
    category: 'Kue Lebaran',
    image: 'https://picsum.photos/seed/nastar/400/400',
    stock: 15,
    rating: 5.0,
    reviews: []
  },
  {
    id: '3',
    name: 'Chiffon Pandan Keju',
    description: 'Fluffy aromatic pandan cake topped with generous cheddar cheese.',
    price: 90000,
    category: 'Bolu',
    image: 'https://picsum.photos/seed/pandan/400/400',
    stock: 10,
    rating: 4.5,
    reviews: []
  },
  {
    id: '4',
    name: 'Kastengel Keju Edam',
    description: 'Savory cheese cookies using premium Edam cheese.',
    price: 165000,
    category: 'Kue Lebaran',
    image: 'https://picsum.photos/seed/kastengel/400/400',
    stock: 0, // Out of stock example
    rating: 4.9,
    reviews: []
  },
  {
    id: '5',
    name: 'Lapis Legit Prunes',
    description: 'Traditional thousand-layer cake with sweet prunes.',
    price: 350000,
    category: 'Bolu',
    image: 'https://picsum.photos/seed/lapis/400/400',
    stock: 5,
    rating: 5.0,
    reviews: []
  },
  {
    id: '6',
    name: 'Putri Salju Mede',
    description: 'Cashew crescent cookies dusted with powdered sugar.',
    price: 135000,
    category: 'Kue Lebaran',
    image: 'https://picsum.photos/seed/salju/400/400',
    stock: 25,
    rating: 4.7,
    reviews: []
  }
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Kakak Manis',
  email: 'customer@kuekini.com',
  role: 'customer',
  avatar: 'https://picsum.photos/seed/user1/100/100'
};

export const ADMIN_USER: User = {
  id: 'a1',
  name: 'Owner Kece',
  email: 'admin@kuekini.com',
  role: 'admin',
  avatar: 'https://picsum.photos/seed/admin/100/100'
};

export const GALLERY_IMAGES = [
  'https://picsum.photos/seed/c1/300/400',
  'https://picsum.photos/seed/c2/300/300',
  'https://picsum.photos/seed/c3/400/300',
  'https://picsum.photos/seed/c4/300/400',
  'https://picsum.photos/seed/c5/300/300',
  'https://picsum.photos/seed/c6/400/300',
];
