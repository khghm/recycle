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
  level: number;
  badges: string[];
  totalWasteCollected: number;
  treesSaved: number;
  co2Reduced: number;
  referralCode: string;
  referredBy?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  createdAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  type: 'collection' | 'purchase' | 'level_up' | 'badge' | 'referral';
  title: string;
  description: string;
  points?: number;
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
  date: string; // شمسی با ساعت و دقیقه
  employeeId: string;
  employeeName: string;
  area: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface CollectionRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userAddress: string;
  productId: string;
  productName: string;
  requiredPoints: number;
  wastePlan: WastePlan[];
  status: 'pending' | 'assigned' | 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  scheduledDate?: string;
  employeeId?: string;
  employeeName?: string;
}

export interface WastePlan {
  wasteType: string;
  weight: number;
  pointsPerKg: number;
  totalPoints: number;
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
  requestId?: string;
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
  collectionRequests: CollectionRequest[];
  collectionRecords: CollectionRecord[];
  purchases: Purchase[];
  cart: CartItem[];
  notifications: Notification[];
  activities: Activity[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (user: Omit<User, 'id' | 'points' | 'createdAt'>) => boolean;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  addCollectionDay: (day: Omit<CollectionDay, 'id'>) => void;
  updateCollectionDay: (id: string, updates: Partial<CollectionDay>) => void;
  addCollectionRecord: (record: Omit<CollectionRecord, 'id'>) => void;
  addPurchase: (purchase: Omit<Purchase, 'id' | 'date'>) => boolean;
  updatePurchase: (id: string, status: Purchase['status']) => void;
  updateUserPoints: (userId: string, points: number) => void;
  addCollectionRequest: (request: Omit<CollectionRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateCollectionRequest: (id: string, updates: Partial<CollectionRequest>) => void;
  calculateWastePlan: (requiredPoints: number) => WastePlan[];
  calculateCombinations: (requiredPoints: number) => WastePlan[][];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotalPoints: () => number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  getUserActivities: (userId: string) => Activity[];
  getUserLevel: (points: number) => number;
  checkAndAwardBadges: (userId: string) => void;
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
    level: 1,
    badges: [],
    totalWasteCollected: 0,
    treesSaved: 0,
    co2Reduced: 0,
    referralCode: 'ADMIN001',
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
    level: 1,
    badges: [],
    totalWasteCollected: 0,
    treesSaved: 0,
    co2Reduced: 0,
    referralCode: 'EMP001',
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
    level: 3,
    badges: ['first_collection', 'eco_warrior', 'recycling_pro'],
    totalWasteCollected: 45,
    treesSaved: 3,
    co2Reduced: 120,
    referralCode: 'SARA123',
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

// نقاط هر کیلو زباله
export const POINTS_PER_KG: Record<string, number> = {
  'پلاستیک': 40,
  'کاغذ': 50,
  'شیشه': 50,
  'فلزات': 60,
  'پارچه': 30,
  'الکترونیک': 100,
};

const initialCollectionDays: CollectionDay[] = [
  {
    id: '1',
    date: '۱۴۰۳/۰۱/۲۵ - ۰۹:۰۰',
    employeeId: '2',
    employeeName: 'علی محمدی',
    area: 'منطقه ۵ تهران',
    status: 'completed',
  },
  {
    id: '2',
    date: '۱۴۰۳/۰۲/۰۲ - ۱۰:۳۰',
    employeeId: '2',
    employeeName: 'علی محمدی',
    area: 'منطقه ۲ تهران',
    status: 'scheduled',
  },
];

const initialCollectionRequests: CollectionRequest[] = [];

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
  const [collectionRequests, setCollectionRequests] = useState<CollectionRequest[]>(() => {
    const saved = localStorage.getItem('gr_collectionRequests');
    return saved ? JSON.parse(saved) : initialCollectionRequests;
  });
  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem('gr_purchases');
    return saved ? JSON.parse(saved) : initialPurchases;
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gr_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('gr_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('gr_activities');
    return saved ? JSON.parse(saved) : [];
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
    localStorage.setItem('gr_collectionRequests', JSON.stringify(collectionRequests));
  }, [collectionRequests]);

  useEffect(() => {
    localStorage.setItem('gr_purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('gr_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gr_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('gr_activities', JSON.stringify(activities));
  }, [activities]);

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

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, ...updates } : u)));
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

  // محاسبه برنامه زباله برای رسیدن به امتیاز مورد نیاز
  const calculateWastePlan = (requiredPoints: number): WastePlan[] => {
    const wasteTypes = Object.entries(POINTS_PER_KG);
    const plan: WastePlan[] = [];
    let remaining = requiredPoints;

    // شروع با بالاترین امتیاز به ازای هر کیلو
    const sorted = [...wasteTypes].sort((a, b) => b[1] - a[1]);
    
    for (const [type, pointsPerKg] of sorted) {
      if (remaining <= 0) break;
      const weight = Math.ceil(remaining / pointsPerKg);
      const totalPoints = weight * pointsPerKg;
      plan.push({ wasteType: type, weight, pointsPerKg, totalPoints });
      remaining -= totalPoints;
    }

    return plan;
  };

  // محاسبه ترکیب‌های مختلف زباله
  const calculateCombinations = (requiredPoints: number): WastePlan[][] => {
    const combinations: WastePlan[][] = [];
    const wasteTypes = Object.entries(POINTS_PER_KG);

    // ترکیب ۱: فقط یک نوع زباله (بالاترین امتیاز)
    const sorted = [...wasteTypes].sort((a, b) => b[1] - a[1]);
    const combo1: WastePlan[] = [];
    const [type1, points1] = sorted[0];
    const weight1 = Math.ceil(requiredPoints / points1);
    combo1.push({ wasteType: type1, weight: weight1, pointsPerKg: points1, totalPoints: weight1 * points1 });
    combinations.push(combo1);

    // ترکیب ۲: دو نوع زباله
    if (sorted.length >= 2) {
      const combo2: WastePlan[] = [];
      const halfPoints = Math.ceil(requiredPoints / 2);
      const [type2a, points2a] = sorted[0];
      const [type2b, points2b] = sorted[1];
      const weight2a = Math.ceil(halfPoints / points2a);
      const weight2b = Math.ceil((requiredPoints - weight2a * points2a) / points2b);
      combo2.push({ wasteType: type2a, weight: weight2a, pointsPerKg: points2a, totalPoints: weight2a * points2a });
      if (weight2b > 0) {
        combo2.push({ wasteType: type2b, weight: weight2b, pointsPerKg: points2b, totalPoints: weight2b * points2b });
      }
      combinations.push(combo2);
    }

    // ترکیب ۳: سه نوع زباله
    if (sorted.length >= 3) {
      const combo3: WastePlan[] = [];
      const thirdPoints = Math.ceil(requiredPoints / 3);
      const [type3a, points3a] = sorted[0];
      const [type3b, points3b] = sorted[1];
      const [type3c, points3c] = sorted[2];
      const weight3a = Math.ceil(thirdPoints / points3a);
      const weight3b = Math.ceil(thirdPoints / points3b);
      const remaining3 = requiredPoints - (weight3a * points3a + weight3b * points3b);
      const weight3c = Math.ceil(remaining3 / points3c);
      combo3.push({ wasteType: type3a, weight: weight3a, pointsPerKg: points3a, totalPoints: weight3a * points3a });
      combo3.push({ wasteType: type3b, weight: weight3b, pointsPerKg: points3b, totalPoints: weight3b * points3b });
      if (weight3c > 0) {
        combo3.push({ wasteType: type3c, weight: weight3c, pointsPerKg: points3c, totalPoints: weight3c * points3c });
      }
      combinations.push(combo3);
    }

    return combinations;
  };

  const addCollectionRequest = (request: Omit<CollectionRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: CollectionRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setCollectionRequests([...collectionRequests, newRequest]);
  };

  const updateCollectionRequest = (id: string, updates: Partial<CollectionRequest>) => {
    setCollectionRequests(collectionRequests.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  // Cart functions
  const addToCart = (productId: string) => {
    const existing = cart.find((item) => item.productId === productId);
    if (existing) {
      setCart(cart.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { productId, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map((item) => item.productId === productId ? { ...item, quantity } : item));
    }
  };

  const clearCart = () => setCart([]);

  const getCartTotalPoints = () => {
    return cart.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      return total + (product ? product.points * item.quantity : 0);
    }, 0);
  };

  // Notification functions
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications([newNotification, ...notifications]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  // Activity functions
  const addActivity = (activity: Omit<Activity, 'id' | 'createdAt'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setActivities([newActivity, ...activities]);
  };

  const getUserActivities = (userId: string) => {
    return activities.filter((a) => a.userId === userId);
  };

  // Level system
  const getUserLevel = (points: number) => {
    if (points >= 5000) return 10;
    if (points >= 3000) return 9;
    if (points >= 2000) return 8;
    if (points >= 1500) return 7;
    if (points >= 1000) return 6;
    if (points >= 750) return 5;
    if (points >= 500) return 4;
    if (points >= 300) return 3;
    if (points >= 150) return 2;
    return 1;
  };

  // Badge system
  const checkAndAwardBadges = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const newBadges: string[] = [];
    const userActivities = activities.filter((a) => a.userId === userId);

    // First collection badge
    if (userActivities.some((a) => a.type === 'collection') && !user.badges.includes('first_collection')) {
      newBadges.push('first_collection');
    }

    // Eco warrior badge (10+ collections)
    if (userActivities.filter((a) => a.type === 'collection').length >= 10 && !user.badges.includes('eco_warrior')) {
      newBadges.push('eco_warrior');
    }

    // Recycling pro badge (50+ kg collected)
    if (user.totalWasteCollected >= 50 && !user.badges.includes('recycling_pro')) {
      newBadges.push('recycling_pro');
    }

    // First purchase badge
    if (userActivities.some((a) => a.type === 'purchase') && !user.badges.includes('first_purchase')) {
      newBadges.push('first_purchase');
    }

    // Level 5 badge
    if (user.level >= 5 && !user.badges.includes('level_5')) {
      newBadges.push('level_5');
    }

    if (newBadges.length > 0) {
      const updatedUser = { ...user, badges: [...user.badges, ...newBadges] };
      setUsers(users.map((u) => u.id === userId ? updatedUser : u));
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
        collectionRequests,
        collectionRecords,
        purchases,
        login,
        logout,
        register,
        addProduct,
        updateProduct,
        updateUser,
        deleteProduct,
        addCollectionDay,
        updateCollectionDay,
        addCollectionRecord,
        addPurchase,
        updatePurchase,
        updateUserPoints,
        addCollectionRequest,
        updateCollectionRequest,
        calculateWastePlan,
        calculateCombinations,
        cart,
        notifications,
        activities,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotalPoints,
        addNotification,
        markNotificationRead,
        addActivity,
        getUserActivities,
        getUserLevel,
        checkAndAwardBadges,
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
