import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Coins, Search, Filter, Star, Check, X, AlertTriangle } from 'lucide-react';

export default function Shop() {
  const { products, currentUser, addPurchase } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const categories = ['همه', ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === 'همه' || p.category === selectedCategory;
    const matchSearch = p.name.includes(searchQuery) || p.description.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  const handleBuy = (productId: string) => {
    if (!currentUser) { navigate('/login'); return; }
    setSelectedProduct(productId);
    setShowModal(true);
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
    if (success) setMessage({ text: 'خرید با موفقیت ثبت شد! 🎉', type: 'success' });
    else setMessage({ text: 'امتیاز کافی ندارید یا محصول موجود نیست', type: 'error' });
    setShowModal(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const selectedProductData = products.find((p) => p.id === selectedProduct);

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
              <div className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-200/20 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-200/20 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                <span className="text-7xl relative z-10 group-hover:scale-110 transition-transform duration-500 block text-center drop-shadow-lg">{product.image}</span>
                {product.stock <= 3 && product.stock > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBuy(product.id)}
                    disabled={product.stock <= 0}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                      product.stock > 0
                        ? 'bg-gradient-to-l from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {currentUser && currentUser.points >= product.points ? (
                      <span className="flex items-center gap-1"><ShoppingBag className="w-3.5 h-3.5" />خرید</span>
                    ) : currentUser ? (
                      <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />امتیاز کم</span>
                    ) : (
                      <span>ورود</span>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 font-bold">محصولی یافت نشد</p>
          </div>
        )}
      </div>

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
                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">{selectedProductData.image}</span>
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

                {(currentUser?.points || 0) < selectedProductData.points && (
                  <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>امتیاز کافی ندارید!</span>
                  </div>
                )}

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
                    disabled={(currentUser?.points || 0) < selectedProductData.points}
                    className="flex-1 bg-gradient-to-l from-emerald-500 to-green-600 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
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
    </div>
  );
}
