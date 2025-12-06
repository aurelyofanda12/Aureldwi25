import React from 'react';
import { Product } from '../types';
import { Package, Edit2, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  products: Product[];
  onUpdateStock: (id: string, newStock: number) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, onUpdateStock }) => {
  
  const chartData = products.map(p => ({
    name: p.name.split(' ').slice(0, 2).join(' '), // Shorten name
    stock: p.stock,
    sales: Math.floor(Math.random() * 50) + 10 // Mock sales data
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-purple rounded-xl shadow-sm">
           <Package className="text-brand-dark" size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold text-brand-dark">Dashboard Dapur</h2>
          <p className="text-gray-500">Kelola stok dan pantau penjualan</p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-500" /> Tren Stok
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} />
                <YAxis />
                <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="stock" fill="#A9DEF9" radius={[4, 4, 0, 0]} name="Stok Tersedia" />
                <Bar dataKey="sales" fill="#FF99C8" radius={[4, 4, 0, 0]} name="Terjual (Minggu ini)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
            <div className="w-full bg-red-50 p-4 rounded-xl mb-4">
                <AlertCircle className="mx-auto text-red-500 mb-2" size={32} />
                <h4 className="font-bold text-red-700">Stok Menipis</h4>
                <ul className="text-sm text-red-600 mt-2 space-y-1">
                    {products.filter(p => p.stock < 5).map(p => (
                        <li key={p.id}>{p.name} (Sisa: {p.stock})</li>
                    ))}
                    {products.filter(p => p.stock < 5).length === 0 && <li>Aman! Semua stok cukup.</li>}
                </ul>
            </div>
            <p className="text-gray-400 text-sm">Pastikan untuk restock sebelum kehabisan!</p>
        </div>
      </div>

      {/* Stock Management Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
           <h3 className="text-xl font-bold">Manajemen Produk</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="p-4">Produk</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Harga</th>
                <th className="p-4 text-center">Sisa Stok</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-brand-yellow/10 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                    <span className="font-semibold text-brand-dark">{product.name}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.category === 'Bolu' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    Rp {product.price.toLocaleString('id-ID')}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-bold ${product.stock === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <button 
                            onClick={() => onUpdateStock(product.id, Math.max(0, product.stock - 1))}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 flex items-center justify-center transition"
                        >
                            -
                        </button>
                        <button 
                            onClick={() => {
                                const newStock = parseInt(window.prompt(`Update stok untuk ${product.name}:`, product.stock.toString()) || product.stock.toString());
                                if (!isNaN(newStock)) onUpdateStock(product.id, newStock);
                            }}
                            className="p-2 text-brand-blue hover:text-blue-600 transition"
                            title="Edit manual"
                        >
                           <Edit2 size={16} />
                        </button>
                         <button 
                            onClick={() => onUpdateStock(product.id, product.stock + 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600 flex items-center justify-center transition"
                        >
                            +
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
