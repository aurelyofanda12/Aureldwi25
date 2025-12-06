import React, { useState, useEffect } from 'react';
import { ShoppingBag, User as UserIcon, LogOut, Menu, X, Cake, History, Star, CreditCard, ChevronRight, Utensils, Smile } from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_USER, ADMIN_USER, GALLERY_IMAGES } from './constants';
import { Product, CartItem, User, Order } from './types';
import AdminDashboard from './components/AdminDashboard';
import WhatsAppBtn from './components/WhatsAppBtn';

function App() {
  // --- State ---
  const [activeView, setActiveView] = useState<'home' | 'products' | 'cart' | 'history' | 'admin' | 'login'>('home');
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Bolu' | 'Kue Lebaran'>('All');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'Transfer' | 'QRIS'>('Transfer');

  // --- Actions ---

  const handleLogin = (role: 'customer' | 'admin') => {
    setUser(role === 'admin' ? ADMIN_USER : MOCK_USER);
    setActiveView(role === 'admin' ? 'admin' : 'home');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveView('home');
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk memesan.");
      setActiveView('login');
      return;
    }
    setCheckoutStep('payment');
  };

  const confirmPayment = () => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      items: [...cart],
      total: cartTotal,
      status: 'Pending',
      paymentMethod: paymentMethod
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    
    // Reduce stock
    const newProducts = products.map(p => {
      const cartItem = cart.find(c => c.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      }
      return p;
    });
    setProducts(newProducts);

    setCheckoutStep('success');
  };

  const updateStock = (id: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
  };

  // --- Components (Inline for simplicity in single-file requirement context) ---

  const Navbar = () => (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-brand-pink/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setActiveView('home')}>
             <div className="w-10 h-10 bg-brand-pink rounded-full flex items-center justify-center mr-2">
                <Cake className="text-white" size={24} />
             </div>
             <span className="font-display font-bold text-2xl text-brand-dark tracking-wide">Kue<span className="text-brand-pink">Kini</span></span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <button onClick={() => setActiveView('home')} className={`text-sm font-medium transition-colors hover:text-brand-pink ${activeView === 'home' ? 'text-brand-pink' : 'text-gray-600'}`}>Beranda</button>
            <button onClick={() => { setActiveView('products'); setSelectedCategory('Bolu'); }} className="text-sm font-medium text-gray-600 hover:text-brand-pink">Bolu</button>
            <button onClick={() => { setActiveView('products'); setSelectedCategory('Kue Lebaran'); }} className="text-sm font-medium text-gray-600 hover:text-brand-pink">Kue Lebaran</button>
            {user && <button onClick={() => setActiveView('history')} className={`text-sm font-medium transition-colors hover:text-brand-pink ${activeView === 'history' ? 'text-brand-pink' : 'text-gray-600'}`}>Pesanan Saya</button>}
            {user?.role === 'admin' && <button onClick={() => setActiveView('admin')} className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">Dashboard</button>}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
             {/* Cart Trigger */}
             <div className="relative cursor-pointer group" onClick={() => { setActiveView('cart'); setCheckoutStep('cart'); }}>
               <div className="p-2 rounded-full bg-brand-yellow/50 group-hover:bg-brand-yellow transition-colors text-brand-dark">
                  <ShoppingBag size={20} />
               </div>
               {cart.length > 0 && (
                 <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                   {cart.reduce((a, b) => a + b.quantity, 0)}
                 </span>
               )}
             </div>

             {/* User Auth */}
             {user ? (
               <div className="flex items-center gap-2">
                  <img src={user.avatar} alt="User" className="w-9 h-9 rounded-full border-2 border-brand-pink hidden sm:block" />
                  <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                    <LogOut size={20} />
                  </button>
               </div>
             ) : (
               <button onClick={() => setActiveView('login')} className="flex items-center gap-1 bg-brand-dark text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-lg">
                 <UserIcon size={16} /> Login
               </button>
             )}

             {/* Mobile Menu Button */}
             <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 animate-fade-in shadow-xl">
           <div className="px-4 pt-2 pb-6 space-y-2">
              <button onClick={() => {setActiveView('home'); setIsMobileMenuOpen(false)}} className="block w-full text-left py-3 px-4 rounded-lg hover:bg-brand-yellow/30 font-medium">Beranda</button>
              <button onClick={() => {setActiveView('products'); setSelectedCategory('Bolu'); setIsMobileMenuOpen(false)}} className="block w-full text-left py-3 px-4 rounded-lg hover:bg-brand-yellow/30 font-medium">Bolu</button>
              <button onClick={() => {setActiveView('products'); setSelectedCategory('Kue Lebaran'); setIsMobileMenuOpen(false)}} className="block w-full text-left py-3 px-4 rounded-lg hover:bg-brand-yellow/30 font-medium">Kue Lebaran</button>
              {user && <button onClick={() => {setActiveView('history'); setIsMobileMenuOpen(false)}} className="block w-full text-left py-3 px-4 rounded-lg hover:bg-brand-yellow/30 font-medium">Riwayat</button>}
              {user?.role === 'admin' && <button onClick={() => {setActiveView('admin'); setIsMobileMenuOpen(false)}} className="block w-full text-left py-3 px-4 rounded-lg hover:bg-purple-50 text-purple-600 font-medium">Admin Dashboard</button>}
           </div>
        </div>
      )}
    </nav>
  );

  const Hero = () => (
    <div className="relative overflow-hidden bg-brand-yellow/20 py-16 sm:py-24">
       <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-pink/20 rounded-full blur-3xl"></div>
       <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-brand-blue/20 rounded-full blur-3xl"></div>
       
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-pink/10 text-brand-pink font-bold text-xs tracking-wider mb-4 uppercase">Fresh from the oven</span>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-dark mb-6 leading-tight">
            Maniskan Harimu<br/>dengan <span className="text-brand-pink">KueKini</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-10 leading-relaxed">
            Menyediakan aneka Bolu lembut dan Kue Lebaran premium dengan cita rasa otentik namun gaya kekinian. Cocok untuk ngemil santai atau hantaran spesial.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button onClick={() => { setActiveView('products'); setSelectedCategory('All'); }} className="bg-brand-pink text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-brand-pink/30 hover:shadow-xl hover:-translate-y-1 transition-all">
                Belanja Sekarang
             </button>
             <button onClick={() => setActiveView('products')} className="bg-white text-brand-dark px-8 py-4 rounded-full font-bold shadow-md hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                Lihat Katalog <ChevronRight size={18} />
             </button>
          </div>
       </div>
    </div>
  );

  const ProductList = () => {
    const filtered = products.filter(p => selectedCategory === 'All' || p.category === selectedCategory);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-display font-bold text-brand-dark">
             {selectedCategory === 'All' ? 'Semua Kue' : selectedCategory}
          </h2>
          <div className="flex bg-white p-1 rounded-full shadow-sm border border-gray-100">
             {['All', 'Bolu', 'Kue Lebaran'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-brand-dark text-white shadow-md' : 'text-gray-500 hover:text-brand-dark'}`}
                >
                  {cat}
                </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(product => (
            <div key={product.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300">
               <div className="relative h-64 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {product.stock === 0 && (
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold transform -rotate-12">HABIS</span>
                     </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold shadow-sm">
                     <Star size={12} className="text-yellow-400 fill-yellow-400" /> {product.rating}
                  </div>
               </div>
               <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="text-xl font-bold text-brand-dark font-display leading-tight">{product.name}</h3>
                     <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-500">{product.category}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                     <span className="text-lg font-bold text-brand-pink">Rp {product.price.toLocaleString('id-ID')}</span>
                     <button 
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${product.stock > 0 ? 'bg-brand-dark text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                     >
                        {product.stock > 0 ? <><ShoppingBag size={16} /> Beli</> : 'Habis'}
                     </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CartView = () => (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-display font-bold mb-8 text-center">Keranjang Belanja</h2>
      {cart.length === 0 && checkoutStep !== 'success' ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="text-gray-300" size={40} />
           </div>
           <p className="text-gray-500 mb-6">Keranjang kamu masih kosong nih.</p>
           <button onClick={() => setActiveView('products')} className="bg-brand-pink text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-rose-600 transition">Mulai Belanja</button>
        </div>
      ) : (
        <>
          {checkoutStep === 'cart' && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl flex gap-4 items-center shadow-sm border border-gray-100">
                       <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                       <div className="flex-1">
                          <h4 className="font-bold text-brand-dark">{item.name}</h4>
                          <p className="text-brand-pink font-semibold">Rp {item.price.toLocaleString('id-ID')}</p>
                       </div>
                       <div className="flex items-center gap-3 bg-gray-50 px-3 py-1 rounded-full">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-full hover:bg-gray-200 flex items-center justify-center font-bold text-gray-500">-</button>
                          <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-full hover:bg-gray-200 flex items-center justify-center font-bold text-gray-500">+</button>
                       </div>
                       <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 p-2"><X size={20}/></button>
                    </div>
                  ))}
               </div>
               <div className="lg:col-span-1">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                     <h3 className="font-bold text-lg mb-4">Ringkasan</h3>
                     <div className="flex justify-between mb-2 text-gray-500">
                        <span>Subtotal</span>
                        <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                     </div>
                     <div className="flex justify-between mb-6 text-xl font-bold text-brand-dark">
                        <span>Total</span>
                        <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                     </div>
                     <button onClick={handleCheckout} className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg">Checkout</button>
                  </div>
               </div>
             </div>
          )}

          {checkoutStep === 'payment' && (
            <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
               <button onClick={() => setCheckoutStep('cart')} className="text-sm text-gray-500 mb-4 hover:underline">&larr; Kembali ke Keranjang</button>
               <h3 className="text-2xl font-bold mb-6">Pembayaran</h3>
               
               <div className="space-y-4 mb-8">
                  <div onClick={() => setPaymentMethod('Transfer')} className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-4 transition-all ${paymentMethod === 'Transfer' ? 'border-brand-pink bg-pink-50' : 'border-gray-100 hover:border-gray-300'}`}>
                     <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-100"><CreditCard size={24} className="text-gray-600"/></div>
                     <div>
                        <h4 className="font-bold">Transfer Bank</h4>
                        <p className="text-sm text-gray-500">BCA, Mandiri, BNI</p>
                     </div>
                     {paymentMethod === 'Transfer' && <div className="ml-auto w-4 h-4 bg-brand-pink rounded-full"></div>}
                  </div>
                  <div onClick={() => setPaymentMethod('QRIS')} className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-4 transition-all ${paymentMethod === 'QRIS' ? 'border-brand-pink bg-pink-50' : 'border-gray-100 hover:border-gray-300'}`}>
                     <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-100"><span className="font-bold text-xs">QRIS</span></div>
                     <div>
                        <h4 className="font-bold">QRIS</h4>
                        <p className="text-sm text-gray-500">Gopay, OVO, Dana, ShopeePay</p>
                     </div>
                     {paymentMethod === 'QRIS' && <div className="ml-auto w-4 h-4 bg-brand-pink rounded-full"></div>}
                  </div>
               </div>

               <div className="bg-gray-50 p-4 rounded-xl mb-6 text-sm text-gray-600">
                  {paymentMethod === 'Transfer' ? (
                     <>
                        <p className="font-bold mb-1">Bank BCA</p>
                        <p className="font-mono text-lg mb-2">123 456 7890</p>
                        <p>a.n KueKini Official</p>
                     </>
                  ) : (
                     <div className="text-center py-4">
                        <div className="w-48 h-48 bg-gray-200 mx-auto mb-2 flex items-center justify-center text-gray-400 rounded-lg">QR CODE</div>
                        <p>Scan untuk membayar</p>
                     </div>
                  )}
               </div>

               <button onClick={confirmPayment} className="w-full bg-brand-pink text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-rose-500 transition-all">Konfirmasi Pembayaran</button>
            </div>
          )}

          {checkoutStep === 'success' && (
             <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Smile className="text-green-500" size={48} />
                </div>
                <h3 className="text-3xl font-display font-bold text-brand-dark mb-4">Terima Kasih!</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Pesanan kamu telah diterima dan sedang disiapkan oleh tim dapur kami.</p>
                <div className="flex gap-4 justify-center">
                   <button onClick={() => setActiveView('history')} className="px-6 py-3 rounded-full border-2 border-brand-dark font-bold hover:bg-gray-50">Lihat Pesanan</button>
                   <button onClick={() => { setActiveView('products'); setCheckoutStep('cart'); }} className="px-6 py-3 rounded-full bg-brand-dark text-white font-bold hover:bg-gray-800">Belanja Lagi</button>
                </div>
             </div>
          )}
        </>
      )}
    </div>
  );

  const HistoryView = () => (
    <div className="max-w-4xl mx-auto px-4 py-12">
       <h2 className="text-3xl font-display font-bold mb-8">Riwayat Pesanan</h2>
       {orders.length === 0 ? (
          <p className="text-gray-500">Belum ada pesanan.</p>
       ) : (
          <div className="space-y-6">
             {orders.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                   <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-50">
                      <div>
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Order ID: {order.id}</span>
                         <p className="font-bold text-lg">{order.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                         {order.status}
                      </span>
                   </div>
                   <div className="space-y-2 mb-4">
                      {order.items.map(item => (
                         <div key={item.id} className="flex justify-between text-sm text-gray-600">
                            <span>{item.quantity}x {item.name}</span>
                            <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                         </div>
                      ))}
                   </div>
                   <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-medium text-gray-500">{order.paymentMethod}</span>
                      <span className="text-xl font-bold text-brand-pink">Total: Rp {order.total.toLocaleString('id-ID')}</span>
                   </div>
                </div>
             ))}
          </div>
       )}
    </div>
  );

  const Gallery = () => (
     <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <span className="text-brand-pink font-bold tracking-widest uppercase text-sm">#KueKiniLovers</span>
           <h2 className="text-4xl font-display font-bold text-brand-dark mt-2 mb-12">Galeri Kebahagiaan</h2>
           <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {GALLERY_IMAGES.map((src, index) => (
                 <div key={index} className="break-inside-avoid rounded-2xl overflow-hidden group relative">
                    <img src={src} alt="Customer" className="w-full object-cover transform group-hover:scale-110 transition duration-700" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                 </div>
              ))}
           </div>
        </div>
     </div>
  );

  const LoginView = () => (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
       <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-brand-pink rounded-full flex items-center justify-center mx-auto mb-6 text-white">
             <UserIcon size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Selamat Datang!</h2>
          <p className="text-gray-500 mb-8">Masuk untuk mulai memesan kue favoritmu.</p>
          
          <div className="space-y-4">
             <button onClick={() => handleLogin('customer')} className="w-full py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-gray-800 transition-all">
                Login sebagai Pembeli
             </button>
             <button onClick={() => handleLogin('admin')} className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">
                Login sebagai Admin
             </button>
          </div>
          <p className="mt-6 text-xs text-gray-400">
             *Ini adalah simulasi login. Klik tombol di atas untuk masuk.
          </p>
       </div>
    </div>
  );

  const Footer = () => (
    <footer className="bg-brand-dark text-white py-12 mt-auto">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
             <div className="flex items-center gap-2 mb-4">
                <Cake className="text-brand-pink" />
                <span className="font-display font-bold text-2xl">Kue<span className="text-brand-pink">Kini</span></span>
             </div>
             <p className="text-gray-400 text-sm leading-relaxed">
                Toko kue modern dengan cita rasa klasik. Menghadirkan kebahagiaan di setiap gigitan.
             </p>
          </div>
          <div>
             <h4 className="font-bold text-lg mb-4 text-brand-yellow">Kategori</h4>
             <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer" onClick={() => { setActiveView('products'); setSelectedCategory('Bolu'); }}>Bolu Lembut</li>
                <li className="hover:text-white cursor-pointer" onClick={() => { setActiveView('products'); setSelectedCategory('Kue Lebaran'); }}>Kue Kering</li>
                <li className="hover:text-white cursor-pointer">Hampers Spesial</li>
             </ul>
          </div>
          <div>
             <h4 className="font-bold text-lg mb-4 text-brand-yellow">Hubungi Kami</h4>
             <p className="text-gray-400 text-sm mb-2">Jl. Kenangan Manis No. 24, Jakarta Selatan</p>
             <p className="text-gray-400 text-sm">halo@kuekini.com</p>
             <p className="text-gray-400 text-sm">+62 812 3456 7890</p>
          </div>
       </div>
       <div className="border-t border-gray-700 mt-12 pt-8 text-center text-xs text-gray-500">
          &copy; 2024 KueKini. All rights reserved.
       </div>
    </footer>
  );

  // --- Main Render Logic ---

  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-dark bg-[#FFFAF0]">
      <Navbar />
      
      <main className="flex-grow">
        {activeView === 'home' && (
           <>
             <Hero />
             <div className="py-8">
               <ProductList />
             </div>
             <Gallery />
           </>
        )}
        
        {activeView === 'products' && <ProductList />}
        
        {activeView === 'cart' && <CartView />}
        
        {activeView === 'history' && (user ? <HistoryView /> : <LoginView />)}
        
        {activeView === 'admin' && (
           user?.role === 'admin' ? 
           <AdminDashboard products={products} onUpdateStock={updateStock} /> : 
           <div className="text-center py-20 text-red-500 font-bold">Akses Ditolak</div>
        )}

        {activeView === 'login' && <LoginView />}
      </main>

      <WhatsAppBtn />
      <Footer />
    </div>
  );
}

export default App;
