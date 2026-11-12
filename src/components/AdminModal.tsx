import { ChangeEvent, FormEvent, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Image as ImageIcon,
  Link2,
  Lock,
  LogOut,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { PlatformItem } from '../types';
import { PlatformEmblem } from './PlatformEmblem';

interface AdminModalProps {
  isOpen: boolean;
  platforms: PlatformItem[];
  onClose: () => void;
  onAddPlatform: (platform: PlatformItem, position?: number) => void;
  onUpdatePlatform: (platform: PlatformItem, position?: number) => void;
  onMovePlatform: (fromIndex: number, toIndex: number) => void;
  onDeletePlatform: (id: string) => void;
  onResetPlatforms: () => void;
}

const ADMIN_EMAIL = 'sarvottamyadav789@gmail.com';
const ADMIN_PASS = 'GBADMIN2012';

function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('Invalid image file'));
      img.onload = () => {
        const maxDim = 256;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/png', 0.9));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function AdminModal({
  isOpen,
  platforms,
  onClose,
  onAddPlatform,
  onUpdatePlatform,
  onMovePlatform,
  onDeletePlatform,
  onResetPlatforms,
}: AdminModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [positionInput, setPositionInput] = useState<string>('');
  const [iconMode, setIconMode] = useState<'url' | 'photo'>('url');
  const [iconValue, setIconValue] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL &&
      password === ADMIN_PASS
    ) {
      setIsAuthenticated(true);
      setAuthError('');
      setEmail('');
      setPassword('');
    } else {
      setAuthError('Invalid email or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setAuthError('');
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setUrl('');
    setPositionInput('');
    setIconValue('');
    setFormError('');
    setFormSuccess('');
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      setIconValue(dataUrl);
      setFormError('');
    } catch {
      setFormError('Could not process selected image');
    }
  };

  const handleSavePlatform = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();
    const trimmedIcon = iconValue.trim();
    const parsedPos = positionInput.trim()
      ? parseInt(positionInput.trim(), 10)
      : undefined;

    if (!trimmedName) {
      setFormError('Platform name is required');
      return;
    }

    if (editingId) {
      const existing = platforms.find((p) => p.id === editingId);
      if (existing) {
        onUpdatePlatform(
          {
            ...existing,
            name: trimmedName,
            sidebarName: trimmedName,
            url: trimmedUrl || undefined,
            customIcon: trimmedIcon || existing.customIcon,
          },
          parsedPos
        );
        setFormSuccess('Platform updated');
        resetForm();
        setTimeout(() => setFormSuccess(''), 2500);
      }
      return;
    }

    const newId = `custom-${Date.now()}`;
    onAddPlatform(
      {
        id: newId,
        name: trimmedName,
        sidebarName: trimmedName,
        borderColor: 'border-emerald-500/70',
        glowColor: 'rgba(16,185,129,0.18)',
        accentColor: '#10b981',
        url: trimmedUrl || undefined,
        customIcon: trimmedIcon || undefined,
        isCustom: true,
      },
      parsedPos
    );
    setFormSuccess('Platform added');
    resetForm();
    setTimeout(() => setFormSuccess(''), 2500);
  };

  const startEdit = (p: PlatformItem, idx: number) => {
    setEditingId(p.id);
    setName(p.name);
    setUrl(p.url || '');
    setPositionInput(String(idx + 1));
    setIconValue(p.customIcon || '');
    setIconMode(p.customIcon?.startsWith('data:') ? 'photo' : 'url');
    setFormError('');
    setFormSuccess('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${
              isAuthenticated ? 'max-w-2xl' : 'max-w-sm'
            } max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0d1210] border border-white/15 p-6 shadow-2xl text-white`}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-extrabold tracking-tight">
                  {isAuthenticated ? 'Admin Panel' : 'Admin Access'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Lock</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isAuthenticated ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="Enter email"
                    className="w-full rounded-xl bg-black/50 border border-white/15 focus:border-emerald-500/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    autoComplete="off"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="Enter password"
                    className="w-full rounded-xl bg-black/50 border border-white/15 focus:border-emerald-500/60 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-colors"
                  />
                </div>

                {authError && (
                  <p className="text-xs font-semibold text-red-400">
                    {authError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#060a08] font-extrabold text-sm cursor-pointer transition-colors"
                >
                  Sign In
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Add / Edit Platform Form */}
                <form
                  onSubmit={handleSavePlatform}
                  className="rounded-2xl bg-black/40 border border-white/10 p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-emerald-400">
                      {editingId ? 'Edit Platform' : 'Add New Platform'}
                    </h3>
                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-xs text-slate-400 hover:text-white cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Allen Digital"
                        className="w-full rounded-xl bg-[#0b100d] border border-white/15 focus:border-emerald-500/60 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Platform URL
                      </label>
                      <div className="flex items-center rounded-xl bg-[#0b100d] border border-white/15 focus-within:border-emerald-500/60 px-3 py-2 gap-2">
                        <Link2 className="w-4 h-4 text-slate-500 shrink-0" />
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="w-full bg-transparent text-sm text-white placeholder-slate-600 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Position Number
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={platforms.length + (editingId ? 0 : 1)}
                        value={positionInput}
                        onChange={(e) => setPositionInput(e.target.value)}
                        placeholder={`1 - ${platforms.length + (editingId ? 0 : 1)}`}
                        className="w-full rounded-xl bg-[#0b100d] border border-white/15 focus:border-emerald-500/60 px-3 py-2 text-sm text-white placeholder-slate-600 outline-none tabular-nums"
                      />
                    </div>
                  </div>

                  {/* Icon Mode Toggle: URL vs Photo Upload */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-300">
                        Platform Icon
                      </label>
                      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#0b100d] border border-white/10">
                        <button
                          type="button"
                          onClick={() => setIconMode('url')}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                            iconMode === 'url'
                              ? 'bg-emerald-500 text-[#060a08]'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>Icon URL</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIconMode('photo')}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                            iconMode === 'photo'
                              ? 'bg-emerald-500 text-[#060a08]'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload Photo</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#0b100d] border border-white/15 flex items-center justify-center overflow-hidden shrink-0">
                        {iconValue ? (
                          <img
                            src={iconValue}
                            alt="Preview"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-600" />
                        )}
                      </div>

                      {iconMode === 'url' ? (
                        <input
                          type="url"
                          value={iconValue}
                          onChange={(e) => setIconValue(e.target.value)}
                          placeholder="Paste image URL (https://...)"
                          className="flex-1 rounded-xl bg-[#0b100d] border border-white/15 focus:border-emerald-500/60 px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none"
                        />
                      ) : (
                        <label className="flex-1 rounded-xl bg-[#0b100d] border border-dashed border-emerald-500/40 hover:border-emerald-400 px-3 py-2.5 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                          <Upload className="w-4 h-4" />
                          <span>
                            {iconValue.startsWith('data:')
                              ? 'Photo Selected (Click to change)'
                              : 'Choose Photo from Device'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {formError && (
                    <p className="text-xs font-semibold text-red-400">
                      {formError}
                    </p>
                  )}
                  {formSuccess && (
                    <p className="text-xs font-semibold text-emerald-400">
                      {formSuccess}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#060a08] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{editingId ? 'Save Changes' : 'Add Platform'}</span>
                  </button>
                </form>

                {/* Platforms List with Order Controls */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      All Platforms &amp; Order ({platforms.length})
                    </h3>
                    <button
                      type="button"
                      onClick={onResetPlatforms}
                      className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Default</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {platforms.map((p, idx) => (
                      <div
                        key={p.id}
                        className="rounded-xl bg-[#0b100d] border border-white/10 px-3 py-2.5 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <select
                            aria-label={`Position for ${p.name}`}
                            value={idx}
                            onChange={(e) =>
                              onMovePlatform(idx, Number(e.target.value))
                            }
                            className="rounded-lg bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 text-xs font-extrabold px-1.5 py-1 outline-none cursor-pointer tabular-nums shrink-0"
                          >
                            {platforms.map((_, posIdx) => (
                              <option
                                key={posIdx}
                                value={posIdx}
                                className="bg-[#0b100d] text-white"
                              >
                                #{posIdx + 1}
                              </option>
                            ))}
                          </select>

                          <PlatformEmblem
                            id={p.id}
                            customIcon={p.customIcon}
                            name={p.name}
                            size="sm"
                          />

                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">
                              {p.name}
                            </p>
                            {p.url ? (
                              <p className="text-[11px] text-emerald-400 truncate flex items-center gap-1">
                                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                <span className="truncate">{p.url}</span>
                              </p>
                            ) : (
                              <p className="text-[11px] text-slate-500">
                                Built-in Batches View
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => onMovePlatform(idx, idx - 1)}
                            aria-label={`Move ${p.name} up`}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 text-slate-300 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === platforms.length - 1}
                            onClick={() => onMovePlatform(idx, idx + 1)}
                            aria-label={`Move ${p.name} down`}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 text-slate-300 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => startEdit(p, idx)}
                            aria-label={`Edit ${p.name}`}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 flex items-center justify-center cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          {p.isCustom && (
                            <button
                              type="button"
                              onClick={() => onDeletePlatform(p.id)}
                              aria-label={`Delete ${p.name}`}
                              className="w-7 h-7 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 flex items-center justify-center cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
