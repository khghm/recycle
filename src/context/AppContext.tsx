import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'employee' | 'user';
  points: number;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  points: number;
  image: string;
  category: string;
  stock: number;
}

export interface CollectionDay {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  area: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface CollectionRecord {
  id: string;
  userId: string;
  userName: string;
  employeeId: string;
  employeeName: string;
  date: string;
  wasteType: string;
  weight: number;
  pointsAwarded: number;
  status: 'pending' | 'completed';
}

export interface Purchase {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  productName: string;
  points: number;
  date: string;
  status: 'pending' | 'delivered';
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  collectionDays: CollectionDay[];
  collectionRecords: CollectionRecord[];
  purchases: Purchase[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (user: Omit<User, 'id' | 'points' | 'createdAt'>) => boolean;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  addCollectionDay: (day: Omit<CollectionDay, 'id'>) => void;
  updateCollectionDay: (id: string, updates: Partial<CollectionDay>) => void;
  addCollectionRecord: (record: Omit<CollectionRecord, 'id'>) => void;
  addPurchase: (purchase: Omit<Purchase, 'id' | 'date'>) => boolean;
  updatePurchase: (id: string, status: Purchase['status']) => void;
  updateUserPoints: (userId: string, points: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial data
const initialUsers: User[] = [
  {
    id: '1',
    name: 'مدیر سیستم',
    email: 'admin@greenrecycle.ir',
    password: 'admin123',
    role: 'admin',
    points: 0,
    phone: '09123456789',
    address: 'تهران، خیابان ولیعصر',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'علی محمدی',
    email: 'employee@greenrecycle.ir',
    password: 'emp123',
    role: 'employee',
    points: 0,
    phone: '09123456788',
    address: 'تهران، خیابان انقلاب',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    name: 'سارا احمدی',
    email: 'user@test.com',
    password: 'user123',
    role: 'user',
    points: 450,
    phone: '09123456787',
    address: 'تهران، خیابان آزادی',
    createdAt: '2024-02-01',
  },
];

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'اسکیت حرفه‌ای',
    description: 'اسکیت حرفه‌ای با کیفیت بالا مناسب برای بزرگسالان',
    points: 500,
    image: 'https://image.qwenlm.ai/generated-images/c85e1c59-9275-493e-90bb-99a5c8222244/_result.png',
    category: 'ورزشی',
    stock: 10,
  },
  {
    id: '2',
    name: 'عینک آفتابی',
    description: 'عینک آفتابی UV400 با فریم مقاوم',
    points: 200,
    image: 'https://image.qwenlm.ai/generated-images/b68d37ad-462c-4622-8bc0-f7c85fc76001/_result.png',
    category: 'اکسسوری',
    stock: 25,
  },
  {
    id: '3',
    name: 'صندلی اداری',
    description: 'صندلی اداری ارگونومیک با پشتی قابل تنظیم',
    points: 800,
    image: 'https://image.qwenlm.ai/generated-images/913b8123-d807-40d7-9b0d-2df62198bfd2/_result.png',
    category: 'مبلمان',
    stock: 5,
  },
  {
    id: '4',
    name: 'میز تحریر',
    description: 'میز تحریر چوبی با کشو و فضای کافی',
    points: 1000,
    image: 'https://image.qwenlm.ai/generated-images/d6bdc170-b2c1-4f10-b2bf-0565f5283087/_result.png',
    category: 'مبلمان',
    stock: 8,
  },
  {
    id: '5',
    name: 'دوچرخه',
    description: 'دوچرخه شهری 26 اینچ با 7 دنده',
    points: 1500,
    image: 'https://image.qwenlm.ai/generated-images/9fcbf794-aaed-4f8b-9cd8-fb5f15a58fbd/_result.png',
    category: 'ورزشی',
    stock: 3,
  },
  {
    id: '6',
    name: 'کوله‌پشتی',
    description: 'کوله‌پشتی ضد آب با ظرفیت 30 لیتر',
    points: 300,
    image: 'https://image.qwenlm.ai/generated-images/655faaeb-f4d8-4a4a-9586-485aa3552ed4/_result.png',
    category: 'اکسسوری',
    stock: 20,
  },
  {
    id: '7',
    name: 'ساعت مچی',
    description: 'ساعت مچی استیل ضد زنگ با بند چرمی',
    points: 600,
    image: 'https://image.qwenlm.ai/generated-images/e0e738ba-8539-4cbb-be34-308e8f7ecdee/_result.png',
    category: 'اکسسوری',
    stock: 15,
  },
  {
    id: '8',
    name: 'هدفون بلوتوثی',
    description: 'هدفون بی‌سیم با کیفیت صدای بالا و نویزکنسلینگ',
    points: 700,
    image: 'https://image.qwenlm.ai/generated-images/7af6b13b-3f88-4dad-b7f1-bd371b7c9a44/_result.png',
    category: 'الکترونیک',
    stock: 12,
  },
  {
    id: '9',
    name: 'چراغ مطالعه',
    description: 'چراغ مطالعه LED با نور قابل تنظیم',
    points: 250,
    image: 'https://image.qwenlm.ai/generated-images/3ce377b8-38ff-4ea7-aae0-f3f3fd831b75/_result.png',
    category: 'الکترونیک',
    stock: 18,
  },
  {
    id: '10',
    name: 'گلدان سرامیکی',
    description: 'گلدان سرامیکی دست‌ساز با طرح گل',
    points: 150,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
    category: 'دکوری',
    stock: 30,
  },
  {
    id: '11',
    name: 'توپ فوتبال',
    description: 'توپ فوتبال سایز 5 استاندارد',
    points: 350,
    image: 'https://images.unsplash.com/photo-1614632537190-23e4b2e69c89?w=400&h=400&fit=crop',
    category: 'ورزشی',
    stock: 20,
  },
  {
    id: '12',
    name: 'کتابخوان الکترونیکی',
    description: 'کتابخوان با صفحه E-ink و نور پس‌زمینه',
    points: 1200,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
    category: 'الکترونیک',
    stock: 7,
  },
];

const initialCollectionDays: CollectionDay[] = [
  {
    id: '1',
    date: '2024-03-15',
    employeeId: '2',
    employeeName: 'علی محمدی',
    area: 'منطقه ۵ تهران',
    status: 'completed',
  },
  {
    id: '2',
    date: '2024-03-22',
    employeeId: '2',
    employeeName: 'علی محمدی',
    area: 'منطقه ۲ تهران',
    status: 'scheduled',
  },
];

const initialCollectionRecords: CollectionRecord[] = [
  {
    id: '1',
    userId: '3',
    userName: 'سارا احمدی',
    employeeId: '2',
    employeeName: 'علی محمدی',
    date: '2024-03-15',
    wasteType: 'پلاستیک',
    weight: 5,
    pointsAwarded: 200,
    status: 'completed',
  },
  {
    id: '2',
    userId: '3',
    userName: 'سارا احمدی',
    employeeId: '2',
    employeeName: 'علی محمدی',
    date: '2024-03-15',
    wasteType: 'کاغذ',
    weight: 3,
    pointsAwarded: 150,
    status: 'completed',
  },
  {
    id: '3',
    userId: '3',
    userName: 'سارا احمدی',
    employeeId: '2',
    employeeName: 'علی محمدی',
    date: '2024-03-15',
    wasteType: 'شیشه',
    weight: 2,
    pointsAwarded: 100,
    status: 'completed',
  },
];

const initialPurchases: Purchase[] = [];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('gr_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('gr_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration: Replace emoji images with real URLs
      const needsMigration = parsed.some((p: Product) => p.image && !p.image.startsWith('http'));
      if (needsMigration) {
        const migrated = parsed.map((p: Product) => {
          const initial = initialProducts.find((ip) => ip.name === p.name);
          if (initial && !p.image.startsWith('http')) {
            return { ...p, image: initial.image };
          }
          return p;
        });
        return migrated;
      }
      return parsed;
    }
    return initialProducts;
  });
  const [collectionDays, setCollectionDays] = useState<CollectionDay[]>(() => {
    const saved = localStorage.getItem('gr_collectionDays');
    return saved ? JSON.parse(saved) : initialCollectionDays;
  });
  const [collectionRecords, setCollectionRecords] = useState<CollectionRecord[]>(() => {
    const saved = localStorage.getItem('gr_collectionRecords');
    return saved ? JSON.parse(saved) : initialCollectionRecords;
  });
  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem('gr_purchases');
    return saved ? JSON.parse(saved) : initialPurchases;
  });

  useEffect(() => {
    localStorage.setItem('gr_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('gr_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('gr_collectionDays', JSON.stringify(collectionDays));
  }, [collectionDays]);

  useEffect(() => {
    localStorage.setItem('gr_collectionRecords', JSON.stringify(collectionRecords));
  }, [collectionRecords]);

  useEffect(() => {
    localStorage.setItem('gr_purchases', JSON.stringify(purchases));
  }, [purchases]);

  const login = (email: string, password: string): boolean => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('gr_currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gr_currentUser');
  };

  const register = (userData: Omit<User, 'id' | 'points' | 'createdAt'>): boolean => {
    if (users.find((u) => u.email === userData.email)) return false;
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      points: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, newUser]);
    return true;
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...product, id: Date.now().toString() };
    setProducts([...products, newProduct]);
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const addCollectionDay = (day: Omit<CollectionDay, 'id'>) => {
    const newDay: CollectionDay = { ...day, id: Date.now().toString() };
    setCollectionDays([...collectionDays, newDay]);
  };

  const updateCollectionDay = (id: string, updates: Partial<CollectionDay>) => {
    setCollectionDays(collectionDays.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const addCollectionRecord = (record: Omit<CollectionRecord, 'id'>) => {
    const newRecord: CollectionRecord = { ...record, id: Date.now().toString() };
    setCollectionRecords([...collectionRecords, newRecord]);
    // Update user points
    const user = users.find((u) => u.id === record.userId);
    if (user) {
      const updatedUser = { ...user, points: user.points + record.pointsAwarded };
      setUsers(users.map((u) => (u.id === record.userId ? updatedUser : u)));
      if (currentUser?.id === record.userId) {
        setCurrentUser(updatedUser);
        localStorage.setItem('gr_currentUser', JSON.stringify(updatedUser));
      }
    }
  };

  const addPurchase = (purchase: Omit<Purchase, 'id' | 'date'>): boolean => {
    const user = users.find((u) => u.id === purchase.userId);
    if (!user || user.points < purchase.points) return false;
    
    const product = products.find((p) => p.id === purchase.productId);
    if (!product || product.stock <= 0) return false;

    const newPurchase: Purchase = {
      ...purchase,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };
    setPurchases([...purchases, newPurchase]);

    // Update user points
    const updatedUser = { ...user, points: user.points - purchase.points };
    setUsers(users.map((u) => (u.id === purchase.userId ? updatedUser : u)));
    if (currentUser?.id === purchase.userId) {
      setCurrentUser(updatedUser);
      localStorage.setItem('gr_currentUser', JSON.stringify(updatedUser));
    }

    // Update product stock
    setProducts(products.map((p) => (p.id === purchase.productId ? { ...p, stock: p.stock - 1 } : p)));

    return true;
  };

  const updatePurchase = (id: string, status: Purchase['status']) => {
    setPurchases(purchases.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const updateUserPoints = (userId: string, points: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      const updatedUser = { ...user, points: user.points + points };
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
      if (currentUser?.id === userId) {
        setCurrentUser(updatedUser);
        localStorage.setItem('gr_currentUser', JSON.stringify(updatedUser));
      }
    }
  };

  // Check for saved session
  useEffect(() => {
    const saved = localStorage.getItem('gr_currentUser');
    if (saved) {
      const user = JSON.parse(saved);
      const freshUser = users.find((u) => u.id === user.id);
      if (freshUser) setCurrentUser(freshUser);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        products,
        collectionDays,
        collectionRecords,
        purchases,
        login,
        logout,
        register,
        addProduct,
        deleteProduct,
        addCollectionDay,
        updateCollectionDay,
        addCollectionRecord,
        addPurchase,
        updatePurchase,
        updateUserPoints,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
