import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Shop() {
  const { products, currentUser, addPurchase } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const categories = ['همه', ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredProducts = selectedCategory === 'همه' ? products : products.filter((p) => p.category === selectedCategory);

  const handleBuy = (productId: string) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setSelectedProduct(productId);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    if (!currentUser || !selectedProduct) return;
    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const success = addPurchase({
      userId: currentUser.id,
      userName: currentUser.name,
      productId: product.id,
      productName: product.name,
      points: product.points,
      status: 'pending',
    });

    if (success) {
      setMessage('خرید با موفقیت ثبت شد! 🎉');
    } else {
      setMessage('امتیاز کافی ندارید یا محصول موجود نیست ❌');
    }
    setShowPurchaseModal(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const selectedProductData = products.find((p) => p.id === selectedProduct);

  return (
    <div className="min-h-screen bg-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-800 mb-4">
            <i className="fas fa-store text-green-600 ml-2"></i>
            فروشگاه
          </h1>
          <p className="text-gray-600 text-lg">با امتیازهای خود محصولات مورد علاقه‌تان را بخرید</p>
          {currentUser && (
            <div className="mt-4 inline-flex items-center bg-green-100 text-green-800 px-6 py-2 rounded-full font-bold">
              <i className="fas fa-coins ml-2 text-yellow-500"></i>
              امتیاز شما: {currentUser.points}
            </div>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white border-2 border-green-500 text-green-700 px-6 py-3 rounded-xl shadow-lg z-50 font-bold">
            {message}
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full font-medium transition ${
                selectedCategory === cat
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-green-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition transform hover:-translate-y-2"
            >
              <div className="bg-gradient-to-bl from-green-100 to-emerald-50 p-8 text-center">
                <span className="text-6xl">{product.image}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                    {product.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                    {product.stock > 0 ? `${product.stock} عدد موجود` : 'ناموجود'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-green-700 font-black text-lg">
                    {product.points}
                    <span className="text-sm font-normal text-gray-500 mr-1">امتیاز</span>
                  </span>
                  <button
                    onClick={() => handleBuy(product.id)}
                    disabled={product.stock <= 0}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                      product.stock > 0
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {currentUser && currentUser.points >= product.points ? (
                      <><i className="fas fa-shopping-cart ml-1"></i>خرید</>
                    ) : currentUser ? (
                      <><i className="fas fa-exclamation-triangle ml-1"></i>امتیاز کم</>
                    ) : (
                      <><i className="fas fa-sign-in-alt ml-1"></i>ورود</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedProductData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <span className="text-5xl mb-4 block">{selectedProductData.image}</span>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedProductData.name}</h3>
              <p className="text-gray-600 mb-4">{selectedProductData.description}</p>
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <p className="text-green-700 font-bold">
                  هزینه: {selectedProductData.points} امتیاز
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  امتیاز فعلی شما: {currentUser?.points} | باقیمانده: {(currentUser?.points || 0) - selectedProductData.points}
                </p>
              </div>
              {(currentUser?.points || 0) < selectedProductData.points ? (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
                  <i className="fas fa-exclamation-circle ml-2"></i>
                  امتیاز کافی ندارید! {(currentUser?.points || 0)} از {selectedProductData.points} امتیاز
                </div>
              ) : null}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
                >
                  انصراف
                </button>
                <button
                  onClick={confirmPurchase}
                  disabled={(currentUser?.points || 0) < selectedProductData.points}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-check ml-2"></i>
                  تأیید خرید
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
