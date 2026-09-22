import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import Button from '../../Button';

const CATEGORIES = ['SpeedBay', 'SplashBay', 'ChillBay'];
const DEFAULT_PREVIEW =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';

export default function AttractionFormModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}) {
  const isEdit = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    name: '',
    category: 'SpeedBay',
    image: '',
    description: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize or reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          category: initialData.category || 'SpeedBay',
          image: initialData.image || '',
          description: initialData.description || '',
          isActive: initialData.isActive !== false,
        });
      } else {
        setFormData({
          name: '',
          category: 'SpeedBay',
          image: '',
          description: '',
          isActive: true,
        });
      }
      setErrors({});
      setImgError(false);
      setIsDirty(false);
    }
  }, [isOpen, initialData]);

  // Handle ESC key with unsaved changes check
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleAttemptClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isDirty]);

  if (!isOpen) return null;

  const handleAttemptClose = () => {
    if (isDirty) {
      const confirmDiscard = window.confirm(
        'You have unsaved changes. Are you sure you want to discard them?'
      );
      if (!confirmDiscard) return;
    }
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    if (field === 'image') {
      setImgError(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    const nameTrimmed = formData.name.trim();
    if (!nameTrimmed) {
      newErrors.name = 'Attraction name is required.';
    } else if (nameTrimmed.length < 2 || nameTrimmed.length > 80) {
      newErrors.name = 'Name must be between 2 and 80 characters.';
    }

    const descTrimmed = formData.description.trim();
    if (!descTrimmed) {
      newErrors.description = 'Description is required.';
    } else if (descTrimmed.length < 10 || descTrimmed.length > 500) {
      newErrors.description = 'Description must be between 10 and 500 characters.';
    }

    const imgTrimmed = formData.image.trim();
    if (!imgTrimmed) {
      newErrors.image = 'Image URL is required.';
    } else if (!imgTrimmed.startsWith('http://') && !imgTrimmed.startsWith('https://')) {
      newErrors.image = 'Image URL must begin with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await onSave({
        name: formData.name.trim(),
        category: formData.category,
        image: formData.image.trim(),
        description: formData.description.trim(),
        isActive: formData.isActive,
      });
      setIsDirty(false);
      onClose();
    } catch (err) {
      // Errors handled in caller with toast
    } finally {
      setSaving(false);
    }
  };

  const descLength = formData.description.trim().length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={handleAttemptClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-navy-800 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-700 overflow-hidden transform transition-all z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-navy-900/60 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-ocean-950 dark:text-white font-heading">
              {isEdit ? 'Edit Attraction' : 'Add New Attraction'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEdit ? 'Update details, category, or publishing state' : 'Register a new ride or aquatic zone into the park catalog'}
            </p>
          </div>
          <button
            onClick={handleAttemptClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-700 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* 1. Name */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1 font-heading">
              Attraction Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Typhoon Whirlpool"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 font-sans transition-colors ${
                errors.name
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-aqua-400'
              }`}
              maxLength={80}
            />
            {errors.name && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* 2. Category & Active Switch Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1 font-heading">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-sm bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-aqua-400 font-heading cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Status Switch */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1 font-heading">
                Publishing Status
              </label>
              <button
                type="button"
                onClick={() => handleChange('isActive', !formData.isActive)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold font-heading transition-colors cursor-pointer ${
                  formData.isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-navy-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      formData.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                    }`}
                  />
                  <span>{formData.isActive ? 'Published (Active)' : 'Draft (Hidden)'}</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Toggle</span>
              </button>
            </div>
          </div>

          {/* 3. Image URL & Live Preview */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1 font-heading">
              Photo URL <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/photo-..."
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 font-sans transition-colors ${
                errors.image
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-aqua-400'
              }`}
            />
            {errors.image && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.image}</span>
              </p>
            )}

            {/* Live Image Preview with Fallback */}
            <div className="mt-2.5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-32 bg-slate-100 dark:bg-navy-900 relative flex items-center justify-center">
              {formData.image && !imgError ? (
                <>
                  <img
                    src={formData.image}
                    alt="Preview"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-heading font-medium">
                    Live Photo Preview
                  </span>
                </>
              ) : (
                <div className="text-center text-slate-400 dark:text-slate-500 p-4">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-60" />
                  <span className="text-xs">
                    {imgError ? 'Image failed to load. Please verify the URL.' : 'Enter a valid image URL above to preview'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 4. Description with Live Character Counter */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-heading">
                Description <span className="text-rose-500">*</span>
              </label>
              <span
                className={`text-[11px] font-mono font-medium ${
                  descLength < 10 || descLength > 500
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {descLength} / 500 characters
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="Describe slide height, thrilling features, splashdown pool, and visitor experience..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 font-sans transition-colors resize-none ${
                errors.description
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-aqua-400'
              }`}
              maxLength={500}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.description}</span>
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700 flex-shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAttemptClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saving}
              disabled={saving}
              className="shadow-coral cursor-pointer"
            >
              {isEdit ? 'Save Changes' : 'Create Attraction'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
