import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Upload, Star, Check, AlertCircle, Eye } from 'lucide-react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const ProductForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    shortDescription: '',
    fullDescription: '',
    categoryId: '',
    embroideryType: 'HANDMADE',
    suitType: 'READY_MADE',
    price: '',
    originalPrice: '',
    fabric: 'Pure Silk',
    color: 'Royal Maroon',
    stock: 10,
    isAvailable: true,
    isFeatured: false,
    isNewArrival: false,
    processingTime: '2-4 Business Days',
    shippingInfo: 'Complimentary shipping across India',
    customizationAvailable: true,
    tags: 'punjabi suit, wedding, festive',
    disclaimer: 'Product colors may vary slightly due to screen lighting.',
    seoTitle: '',
    seoDescription: '',
    videoUrl: '',
    images: [{ url: '/assets/hero_punjabi_suit.jpg', altText: 'Punjabi Suit Main Image' }],
    variants: [
      { size: 'S (36)', color: 'Default', stitchingOption: 'Ready-to-Wear Stitched', priceAdjustment: 0, stock: 3 },
      { size: 'M (38)', color: 'Default', stitchingOption: 'Ready-to-Wear Stitched', priceAdjustment: 0, stock: 4 },
      { size: 'L (40)', color: 'Default', stitchingOption: 'Ready-to-Wear Stitched', priceAdjustment: 0, stock: 3 },
    ],
  });

  useEffect(() => {
    const initData = async () => {
      try {
        const catRes = await api.getCategories();
        if (catRes.success) {
          setCategories(catRes.categories || []);
          if (!isEdit && catRes.categories?.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: catRes.categories[0].id }));
          }
        }

        if (isEdit && id) {
          // Fetch product by ID (or list and find)
          const prodsRes = await api.getProducts({ limit: 100 });
          const target = prodsRes.products?.find((p) => p.id === id);
          if (target) {
            setFormData({
              name: target.name,
              slug: target.slug,
              sku: target.sku,
              shortDescription: target.shortDescription || '',
              fullDescription: target.fullDescription || '',
              categoryId: target.categoryId,
              embroideryType: target.embroideryType,
              suitType: target.suitType,
              price: target.price,
              originalPrice: target.originalPrice || '',
              fabric: target.fabric,
              color: target.color,
              stock: target.stock,
              isAvailable: target.isAvailable,
              isFeatured: target.isFeatured,
              isNewArrival: target.isNewArrival,
              processingTime: target.processingTime || '2-4 Business Days',
              shippingInfo: target.shippingInfo || 'Standard Delivery',
              customizationAvailable: target.customizationAvailable,
              tags: target.tags || '',
              disclaimer: target.disclaimer || '',
              seoTitle: target.seoTitle || '',
              seoDescription: target.seoDescription || '',
              videoUrl: target.videoUrl || '',
              images: target.images?.length > 0 ? target.images : [{ url: '/assets/hero_punjabi_suit.jpg', altText: target.name }],
              variants: target.variants?.length > 0 ? target.variants : [],
            });
          }
        }
      } catch (err) {
        console.error('Failed to init form data:', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Image Upload Handling
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const res = await api.uploadMedia(files);
      if (res.success && res.files) {
        const newImages = res.files.map((f) => ({
          url: f.url,
          altText: formData.name || 'Uploaded suit image',
        }));
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...newImages],
        }));
      }
    } catch (err) {
      alert(err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Variant Controls
  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { size: 'M', color: prev.color, stitchingOption: 'Ready-to-Wear Stitched', priceAdjustment: 0, stock: 5 },
      ],
    }));
  };

  const updateVariant = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      setErrorMsg('Please specify product name, price, and category.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      if (isEdit && id) {
        await api.updateProduct(id, formData);
      } else {
        await api.createProduct(formData);
      }
      navigate('/admin/products');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading Product Editor..." />;

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/admin/products" style={{ color: 'var(--color-maroon)', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Products List
        </Link>
        <h1 style={{ fontSize: '1.8rem', marginTop: '0.8rem' }}>
          {isEdit ? `Edit Suit: "${formData.name}"` : 'Add New Punjabi Suit'}
        </h1>
      </div>

      {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        {/* 1. Basic Information */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.5rem' }}>
            Basic Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Suit Title *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. Royal Emerald Hand-Embroidered Zardozi Suit"
              />
            </div>

            <div className="form-group">
              <label className="form-label">URL Slug (Auto-generated if blank)</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="form-input"
                placeholder="royal-emerald-zardozi-suit"
              />
            </div>

            <div className="form-group">
              <label className="form-label">SKU (Stock Keeping Unit)</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="form-input"
                placeholder="PRS-HE-001"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="categoryId"
                required
                value={formData.categoryId}
                onChange={handleChange}
                className="form-select"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Embroidery Type *</label>
              <select
                name="embroideryType"
                value={formData.embroideryType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="HANDMADE">Handmade Needlework (Adda/Zardozi/Phulkari)</option>
                <option value="MACHINE">Machine Embroidery (Computerized Ari)</option>
                <option value="MIXED">Mixed Craftsmanship</option>
                <option value="NONE">Plain / Printed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Suit Silhouette / Type *</label>
              <select
                name="suitType"
                value={formData.suitType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="READY_MADE">Ready-Made Punjabi Suit</option>
                <option value="UNSTITCHED">Unstitched 3-Piece Set</option>
                <option value="CUSTOM">Bespoke Custom Order</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Fabric Composition *</label>
              <input
                type="text"
                name="fabric"
                required
                value={formData.fabric}
                onChange={handleChange}
                className="form-input"
                placeholder="Pure Chanderi Silk with Organza Dupatta"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Color *</label>
              <input
                type="text"
                name="color"
                required
                value={formData.color}
                onChange={handleChange}
                className="form-input"
                placeholder="Emerald Green"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Short Summary (Catalog snippet)</label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className="form-input"
              placeholder="Brief 1-2 sentence description"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Full Product Description & Needlework Details</label>
            <textarea
              name="fullDescription"
              rows={4}
              value={formData.fullDescription}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Detailed explanation of kurti cut, embroidery motifs, salwar dimensions, dupatta fabric, and styling tips..."
            />
          </div>
        </div>

        {/* 2. Pricing & Stock */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.5rem' }}>
            Pricing & Inventory
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Selling Price (INR ₹) *</label>
              <input
                type="number"
                step="1"
                min="0"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="form-input"
                placeholder="8499"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Original Price (For discount strike-through)</label>
              <input
                type="number"
                step="1"
                min="0"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                className="form-input"
                placeholder="10999"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Overall Stock Quantity *</label>
              <input
                type="number"
                min="0"
                name="stock"
                required
                value={formData.stock}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-maroon)' }}
              />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Publish to Storefront</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-maroon)' }}
              />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Feature on Homepage</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="isNewArrival"
                checked={formData.isNewArrival}
                onChange={handleChange}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-maroon)' }}
              />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>New Arrival Badge</span>
            </label>
          </div>
        </div>

        {/* 3. Product Images & Gallery */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Product Photography & Gallery</h3>
            <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
              <Upload size={14} /> {uploadingImage ? 'Uploading...' : 'Upload Photos'}
              <input
                type="file"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {formData.images.map((img, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  aspectRatio: '3 / 4',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  border: idx === 0 ? '2px solid var(--color-maroon)' : '1px solid var(--color-border)',
                }}
              >
                <img src={img.url} alt={img.altText} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {idx === 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '4px',
                      left: '4px',
                      backgroundColor: 'var(--color-maroon)',
                      color: '#FFF',
                      fontSize: '0.65rem',
                      padding: '2px 5px',
                      borderRadius: '2px',
                      fontWeight: 600,
                    }}
                  >
                    Main
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Remove image"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-gray-light)' }}>
            The first photo is the primary catalog image. You can upload multiple photographs from your computer.
          </span>
        </div>

        {/* 4. Variants: Sizes & Stitching Options */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Sizes & Custom Stitching Variations</h3>
            <button type="button" className="btn btn-outline btn-sm" onClick={addVariant}>
              <Plus size={14} /> Add Size / Fit
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {formData.variants.map((v, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1.5fr 1fr 1fr auto',
                  gap: '0.8rem',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: '#FAF8F5',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-light)', display: 'block' }}>Size Label</span>
                  <input
                    type="text"
                    value={v.size}
                    onChange={(e) => updateVariant(idx, 'size', e.target.value)}
                    className="form-input"
                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-light)', display: 'block' }}>Stitching Option</span>
                  <input
                    type="text"
                    value={v.stitchingOption}
                    onChange={(e) => updateVariant(idx, 'stitchingOption', e.target.value)}
                    className="form-input"
                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-light)', display: 'block' }}>Price Extra (₹)</span>
                  <input
                    type="number"
                    value={v.priceAdjustment}
                    onChange={(e) => updateVariant(idx, 'priceAdjustment', parseFloat(e.target.value) || 0)}
                    className="form-input"
                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-light)', display: 'block' }}>Stock</span>
                  <input
                    type="number"
                    value={v.stock}
                    onChange={(e) => updateVariant(idx, 'stock', parseInt(e.target.value, 10) || 0)}
                    className="form-input"
                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeVariant(idx)}
                  style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '0.4rem' }}
                  title="Remove variant"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Disclaimers & SEO */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.5rem' }}>
            Disclaimers & SEO Metadata
          </h3>

          <div className="form-group">
            <label className="form-label">Product-Specific Disclaimer Notice</label>
            <input
              type="text"
              name="disclaimer"
              value={formData.disclaimer}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. Handmade embroidery may have slight variations in sequin density."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">SEO Page Title</label>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                className="form-input"
                placeholder="Product Title | Punjab Royal Suits"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Search Keywords / Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="form-input"
                placeholder="zardozi, phulkari, patiala suit, silk"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Link to="/admin/products" className="btn btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
            {submitting ? 'Saving to Database...' : isEdit ? 'Update Suit Listing' : 'Publish New Suit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const AddProduct = () => <ProductForm isEdit={false} />;
export const EditProduct = () => <ProductForm isEdit={true} />;
