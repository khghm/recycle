import React, { useState, useMemo } from 'react';
import { useApp, POINTS_PER_KG } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Coins, Search, Filter, Star, Check, X, AlertTriangle, Recycle, ArrowLeft, Calendar, MapPin, Plus, Minus, Trash2 } from 'lucide-react';

export default function Shop() {
  const { products, currentUser, addPurchase, addCollectionRequest, collectionRequests, cart, addToCart, removeFromCart, updateCartQuantity, getCartTotalPoints, clearCart, showCartModal, setShowCartModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [showModal, setShowModal] = useState(false);
  const [showWastePlan, setShowWastePlan] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedCombination, setSelectedCombination] = useState(0);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const categories = ['همه', ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === 'همه' || p.category === selectedCategory;
    const matchSearch = p.name.includes(searchQuery) || p.description.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  const selectedProductData = products.find((p) => p.id === selectedProduct);
  
  // محاسبه امتیاز مورد نیاز
  const requiredPoints = useMemo(() => {
    if (!selectedProductData || !currentUser) return 0;
    return Math.max(0, selectedProductData.points - currentUser.points);
  }, [selectedProductData, currentUser]);

  // محاسبه برنامه زباله
  const wastePlan = useMemo(() => {
    if (requiredPoints <= 0) return [];
    const wasteTypes = Object.entries(POINTS_PER_KG);
    const plan: { wasteType: string; weight: number; pointsPerKg: number; totalPoints: number }[] = [];
    let remaining = requiredPoints;
    const sorted = [...wasteTypes].sort((a, b) => b[1] - a[1]);
    
    for (const [type, pointsPerKg] of sorted) {
      if (remaining <= 0) break;
      const weight = Math.ceil(remaining / pointsPerKg);
      const totalPoints = weight * pointsPerKg;
      plan.push({ wasteType: type, weight, pointsPerKg, totalPoints });
      remaining -= totalPoints;
    }
    return plan;
  }, [requiredPoints]);

  // محاسبه ترکیب‌ها
  const combinations = useMemo(() => {
    if (requiredPoints <= 0) return [];
    const combos: { wasteType: string; weight: number; pointsPerKg: number; totalPoints: number }[][] = [];
    const wasteTypes = Object.entries(POINTS_PER_KG);
    const sorted = [...wasteTypes].sort((a, b) => b[1] - a[1]);

    // ترکیب ۱: فقط یک نوع زباله (بالاترین امتیاز)
    const combo1: { wasteType: string; weight: number; pointsPerKg: number; totalPoints: number }[] = [];
    const [type1, points1] = sorted[0];
    const weight1 = Math.ceil(requiredPoints / points1);
    combo1.push({ wasteType: type1, weight: weight1, pointsPerKg: points1, totalPoints: weight1 * points1 });
    combos.push(combo1);

    // ترکیب ۲: دو نوع زباله
    if (sorted.length >= 2) {
      const combo2: { wasteType: string; weight: number; pointsPerKg: number; totalPoints: number }[] = [];
      const halfPoints = Math.ceil(requiredPoints / 2);
      const [type2a, points2a] = sorted[0];
      const [type2b, points2b] = sorted[1];
      const weight2a = Math.ceil(halfPoints / points2a);
      const remaining2 = requiredPoints - weight2a * points2a;
      const weight2b = remaining2 > 0 ? Math.ceil(remaining2 / points2b) : 0;
      combo2.push({ wasteType: type2a, weight: weight2a, pointsPerKg: points2a, totalPoints: weight2a * points2a });
      if (weight2b > 0) {
        combo2.push({ wasteType: type2b, weight: weight2b, pointsPerKg: points2b, totalPoints: weight2b * points2b });
      }
      combos.push(combo2);
    }

    // ترکیب ۳: سه نوع زباله
    if (sorted.length >= 3) {
      const combo3: { wasteType: string; weight: number; pointsPerKg: number; totalPoints: number }[] = [];
      const thirdPoints = Math.ceil(requiredPoints / 3);
      const [type3a, points3a] = sorted[0];
      const [type3b, points3b] = sorted[1];
      const [type3c, points3c] = sorted[2];
      const weight3a = Math.ceil(thirdPoints / points3a);
      const weight3b = Math.ceil(thirdPoints / points3b);
      const remaining3 = requiredPoints - (weight3a * points3a + weight3b * points3b);
      const weight3c = remaining3 > 0 ? Math.ceil(remaining3 / points3c) : 0;
      combo3.push({ wasteType: type3a, weight: weight3a, pointsPerKg: points3a, totalPoints: weight3a * points3a });
      combo3.push({ wasteType: type3b, weight: weight3b, pointsPerKg: points3b, totalPoints: weight3b * points3b });
      if (weight3c > 0) {
        combo3.push({ wasteType: type3c, weight: weight3c, pointsPerKg: points3c, totalPoints: weight3c * points3c });
      }
      combos.push(combo3);
    }

    return combos;
  }, [requiredPoints]);

  const handleBuy = (productId: string) => {
    if (!currentUser) { navigate('/login'); return; }
    setSelectedProduct(productId);
    const product = products.find((p) => p.id === productId);
    if (product && currentUser.points >= product.points) {
      setShowModal(true);
    } else {
      setShowWastePlan(true);
    }
  };

  const confirmPurchase = () => {
    if (!currentUser || !selectedProduct) return;
    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;
    const success = addPurchase({
      userId: currentUser.id, userName: currentUser.name,
      productId: product.id, productName: product.name,
      points: product.points, status: 'pending',
    });
    if (success) setMessage({ text: 'خرید با موفقیت ثبت شد!', type: 'success' });
    else setMessage({ text: 'امتیاز کافی ندارید یا محصول موجود نیست', type: 'error' });
    setShowModal(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRequestCollection = () => {
    if (!currentUser || !selectedProductData) return;
    const selectedCombo = combinations[selectedCombination] || wastePlan;
    
    addCollectionRequest({
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      userAddress: currentUser.address,
      productId: selectedProductData.id,
      productName: selectedProductData.name,
      requiredPoints: requiredPoints,
      wastePlan: selectedCombo,
    });

    setMessage({ text: 'درخواست جمع‌آوری با موفقیت ثبت شد!', type: 'success' });
    setShowWastePlan(false);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-emerald-600 via-green-600 to-teal-600 pt-16 pb-24">
        <div className="absolute inset-0 noise"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-6"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm font-medium">فروشگاه محصولات</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            با امتیازهایت <span className="text-yellow-300">خرید</span> کن
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg mb-8"
          >
            محصولات متنوع و با کیفیت در انتظار شماست
          </motion.p>
          {currentUser && (
            <div className="flex items-center gap-4 justify-center flex-wrap">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3"
              >
                <Coins className="w-5 h-5 text-yellow-300" />
                <span className="font-black text-xl">{currentUser.points.toLocaleString('fa-IR')}</span>
                <span className="text-white/60 text-sm">امتیاز موجود</span>
              </motion.div>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => setShowCartModal(true)}
                className="relative inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-3 hover:bg-white/20 transition"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="font-bold">سبد خرید</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </motion.button>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,40 1440,30 L1440,60 L0,60 Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
          >
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl ${
              message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              <span className="font-bold">{message.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        {/* Search & Filter */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی محصول..."
                className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-emerald-500 focus:outline-none transition text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-l from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-100 border border-gray-100 card-hover"
            >
              <div className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 overflow-hidden" style={{ aspectRatio: '1/1' }}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-200/20 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-200/20 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover z-10 group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                {product.stock <= 3 && product.stock > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg z-20">
                    فقط {product.stock} عدد
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-lg font-bold">{product.category}</span>
                  <span className={`text-xs px-2 py-1 rounded-lg font-bold ${product.stock > 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} موجود` : 'ناموجود'}
                  </span>
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-1">{product.name}</h3>
                <p className="text-gray-400 text-xs mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-black text-lg gradient-text-gold">{product.points}</span>
                    <span className="text-[10px] text-gray-400">امتیاز</span>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => currentUser && addToCart(product.id)}
                      disabled={product.stock <= 0 || !currentUser}
                      className={`flex-1 px-3 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                        product.stock > 0 && currentUser
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-4 h-4 inline" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBuy(product.id)}
                      disabled={product.stock <= 0}
                      className={`flex-1 px-3 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                        product.stock > 0
                          ? 'bg-gradient-to-l from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {currentUser && currentUser.points >= product.points ? (
                        <span className="flex items-center gap-1 justify-center"><ShoppingBag className="w-3.5 h-3.5" />خرید</span>
                      ) : currentUser ? (
                        <span className="flex items-center gap-1 justify-center"><Recycle className="w-3.5 h-3.5" />جمع‌آوری</span>
                      ) : (
                        <span>ورود</span>
                      )}
                    </motion.button>
                  </div>
                </div>
                {currentUser && currentUser.points < product.points && (
                  <div className="mt-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1 text-center">
                    {product.points - currentUser.points} امتیاز دیگر نیاز دارید
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-bold">محصولی یافت نشد</p>
          </div>
        )}
      </div>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCartModal && currentUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowCartModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl my-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-7 h-7 text-emerald-600" />
                  سبد خرید
                </h3>
                <button onClick={() => setShowCartModal(false)} className="p-2 rounded-lg hover:bg-gray-100 transition">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-bold">سبد خرید شما خالی است</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cart.map((item) => {
                      const product = products.find((p) => p.id === item.productId);
                      if (!product) return null;
                      return (
                        <div key={item.productId} className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4">
                          <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-500">{product.points} امتیاز</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition mr-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-gradient-to-l from-emerald-50 to-green-50 rounded-2xl p-5 border border-emerald-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">مجموع امتیاز مورد نیاز:</span>
                      <span className="text-2xl font-black text-emerald-700">{getCartTotalPoints()}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-600">امتیاز شما:</span>
                      <span className="font-bold">{currentUser.points}</span>
                    </div>
                    {currentUser.points < getCartTotalPoints() && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
                        شما {getCartTotalPoints() - currentUser.points} امتیاز دیگر نیاز دارید
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => { clearCart(); setShowCartModal(false); }}
                      className="flex-1 border-2 border-gray-200 text-gray-700 py-3.5 rounded-2xl font-bold hover:bg-gray-50 transition"
                    >
                      خالی کردن سبد
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowCartModal(false);
                        setShowWastePlan(true);
                        setSelectedProduct(cart[0]?.productId || null);
                      }}
                      disabled={currentUser.points < getCartTotalPoints()}
                      className="flex-1 bg-gradient-to-l from-emerald-500 to-green-600 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    >
                      <Recycle className="w-5 h-5" />
                      درخواست جمع‌آوری
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Purchase Modal */}
      <AnimatePresence>
        {showModal && selectedProductData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center">
                <div className="w-32 h-32 bg-emerald-50 rounded-3xl overflow-hidden mx-auto mb-4">
                  <img 
                    src={selectedProductData.image} 
                    alt={selectedProductData.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{selectedProductData.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{selectedProductData.description}</p>
                
                <div className="bg-gradient-to-l from-emerald-50 to-green-50 rounded-2xl p-5 mb-6 border border-emerald-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-sm">هزینه:</span>
                    <span className="font-black text-emerald-700 text-lg">{selectedProductData.points} امتیاز</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">امتیاز شما:</span>
                    <span className="font-bold text-gray-800">{currentUser?.points}</span>
                  </div>
                  <div className="h-px bg-emerald-200 my-2"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">باقیمانده:</span>
                    <span className={`font-black ${(currentUser?.points || 0) - selectedProductData.points >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {(currentUser?.points || 0) - selectedProductData.points}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 border-2 border-gray-200 text-gray-700 py-3.5 rounded-2xl font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    انصراف
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmPurchase}
                    className="flex-1 bg-gradient-to-l from-emerald-500 to-green-600 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    تأیید خرید
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Waste Plan Modal */}
      <AnimatePresence>
        {showWastePlan && selectedProductData && currentUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowWastePlan(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl my-8"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Recycle className="w-10 h-10 text-amber-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">برنامه جمع‌آوری زباله</h3>
                <p className="text-gray-500 text-sm">
                  برای خرید <span className="font-bold text-emerald-600">{selectedProductData.name}</span> به{' '}
                  <span className="font-bold text-amber-600">{requiredPoints}</span> امتیاز دیگر نیاز دارید
                </p>
              </div>

              {/* Product Info */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0">
                  <img src={selectedProductData.image} alt={selectedProductData.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{selectedProductData.name}</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">قیمت: <span className="font-bold text-emerald-600">{selectedProductData.points}</span> امتیاز</span>
                    <span className="text-gray-500">امتیاز شما: <span className="font-bold">{currentUser.points}</span></span>
                  </div>
                </div>
              </div>

              {/* Combinations */}
              {combinations.length > 1 && (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-black">۱</span>
                    ترکیب‌های پیشنهادی
                  </h4>
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {combinations.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedCombination(i)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition ${
                          selectedCombination === i
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-emerald-50'
                        }`}
                      >
                        ترکیب {i + 1} ({combinations[i].length} نوع زباله)
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Waste Plan Table */}
              <div className="bg-gradient-to-l from-emerald-50 to-green-50 rounded-2xl p-5 mb-6 border border-emerald-100">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Recycle className="w-5 h-5 text-emerald-600" />
                  برنامه جمع‌آوری
                </h4>
                <div className="space-y-3">
                  {(combinations[selectedCombination] || wastePlan).map((item, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-800">{item.wasteType}</span>
                        <span className="text-xs text-gray-500 mr-2">({item.pointsPerKg} امتیاز/کیلو)</span>
                      </div>
                      <div className="text-left">
                        <span className="font-black text-emerald-600 text-lg">{item.weight}</span>
                        <span className="text-xs text-gray-500 mr-1">کیلوگرم</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-emerald-200 flex items-center justify-between">
                  <span className="text-gray-600 font-bold">مجموع امتیاز:</span>
                  <span className="font-black text-emerald-700 text-xl">
                    {(combinations[selectedCombination] || wastePlan).reduce((sum, item) => sum + item.totalPoints, 0)} امتیاز
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowWastePlan(false)}
                  className="flex-1 border-2 border-gray-200 text-gray-700 py-3.5 rounded-2xl font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  بعداً
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRequestCollection}
                  className="flex-1 bg-gradient-to-l from-emerald-500 to-green-600 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  درخواست جمع‌آوری
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
