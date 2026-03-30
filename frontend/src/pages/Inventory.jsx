import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Trash2, Edit, X, AlertTriangle, Upload, Image as ImageIcon, Maximize2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [imagePopupUrl, setImagePopupUrl] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', brand: '', price: 0, stockQuantity: 0, color: '', size: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', brand: '', price: 0, stockQuantity: 0, color: '', size: '' });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price,
      stockQuantity: product.stockQuantity,
      color: product.color || '',
      size: product.size || ''
    });
    setImageFile(null);
    setImagePreview(product.imageUrl || null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (editingId) {
        await axios.patch(`http://localhost:5000/api/products/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product added successfully!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      toast.error('Failed to save product.');
    }
  };

  const confirmDelete = (id) => {
    setDeleteConfirmationId(id);
  };

  const handleDelete = async () => {
    if (!deleteConfirmationId) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${deleteConfirmationId}`);
      toast.success('Product deleted successfully!');
      setDeleteConfirmationId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error('Error deleting product.');
    }
  };

  // 🔍 Dynamic Search Logic
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Shop Inventory</h1>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-3 bg-accent text-white px-6 py-3 rounded-2xl font-bold hover:shadow-xl hover:shadow-accent/30 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name, brand..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Brand</th>
                <th className="px-6 py-4">Color</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50/50 transition capitalize text-sm">
                  <td className="px-6 py-4">
                    <div className="relative w-12 h-12 group cursor-pointer" onClick={() => setImagePopupUrl(product.imageUrl)}>
                      {product.imageUrl ? (
                        <>
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg shadow-sm border border-slate-200" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Maximize2 className="text-white w-4 h-4" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-dashed">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{product.name}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">{product.brand}</td>
                  <td className="px-6 py-4 text-slate-500">{product.color || 'N/A'}</td>
                  <td className="px-6 py-4 text-slate-500 font-semibold">{product.size || 'N/A'}</td>
                  <td className="px-6 py-4 font-bold text-primary">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-extrabold ${product.stockQuantity > 5 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {product.stockQuantity} Left
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-4 text-slate-400">
                    <Edit 
                      onClick={() => openEditModal(product)}
                      className="w-5 h-5 cursor-pointer hover:text-primary transition" 
                    />
                    <button onClick={() => confirmDelete(product._id)}>
                      <Trash2 className="w-5 h-5 cursor-pointer hover:text-rose-500 transition" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {loading && <p className="p-10 text-center text-slate-500 animate-pulse">Fetching inventory...</p>}
        {!loading && filteredProducts.length === 0 && <p className="p-10 text-center text-slate-500">No products found matching your search.</p>}
      </div>

      {/* 🖼️ Full Size Image Popup */}
      {imagePopupUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-8 overflow-hidden" onClick={() => setImagePopupUrl(null)}>
           <button className="absolute top-8 right-8 text-white hover:rotate-90 transition-transform">
             <X className="w-10 h-10" />
           </button>
           <img src={imagePopupUrl} alt="Product Zoom" className="max-w-full max-h-full rounded-2xl shadow-2xl animate-zoomIn" />
        </div>
      )}

      {/* 🛠️ Product Modal (Add/Edit) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">{editingId ? 'Edit Product' : 'New Product'}</h2>
              <X onClick={() => setShowModal(false)} className="cursor-pointer text-slate-400 hover:text-slate-600" />
            </div>
            <form onSubmit={handleSaveProduct} className="p-8 flex flex-col md:flex-row gap-8">
              {/* Left Column: Image Upload */}
              <div className="flex-shrink-0 w-full md:w-56 space-y-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Product Image</p>
                <div className="relative group aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center transition-all hover:border-primary/50">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="text-white w-8 h-8" />
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="text-slate-300 w-12 h-12 mb-2" />
                      <p className="text-[10px] text-slate-400 font-medium">Click to upload</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Right Column: Form Data */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary" placeholder="Nike Air Max" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Brand</label>
                    <input required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary" placeholder="Nike" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Price (₹)</label>
                    <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Stock Qty</label>
                    <input type="number" required value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: Number(e.target.value)})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Size</label>
                    <input value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary" placeholder="10" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Color</label>
                    <input value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary" placeholder="Red" />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                    <button type="submit" className="flex-1 bg-accent text-white py-4 rounded-2xl font-bold hover:bg-slate-800 hover:shadow-xl hover:shadow-accent/20 transition-all">
                    {editingId ? 'Update Product' : 'Save Product'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 border py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ⚠️ Delete Confirmation Modal */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-8 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Delete Product?</h2>
              <p className="text-slate-500">This action cannot be undone. Are you sure you want to remove this item from your inventory?</p>
              
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={handleDelete}
                  className="flex-1 bg-rose-500 text-white py-3 rounded-xl font-bold hover:bg-rose-600 transition active:scale-95"
                >
                  Yes, Delete
                </button>
                <button 
                  onClick={() => setDeleteConfirmationId(null)}
                  className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
