/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  writeBatch,
} from 'firebase/firestore';
import { AdminModal } from './components/AdminModal';
import { BatchStudyModal } from './components/BatchStudyModal';
import { CommunityModal } from './components/CommunityModal';
import { HomeView } from './components/HomeView';
import { NextToppersView } from './components/NextToppersView';
import { PhysicsWallahView } from './components/PhysicsWallahView';
import { SidebarDrawer } from './components/SidebarDrawer';
import { PLATFORMS as DEFAULT_PLATFORMS } from './data/platforms';
import { db, handleFirestoreError, OperationType } from './firebase';
import { BatchItem, PlatformId, PlatformItem } from './types';

const STORAGE_PLATFORMS_KEY = 'gb_study_platforms_v1';

export default function App() {
  const [platforms, setPlatforms] = useState<PlatformItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PLATFORMS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_PLATFORMS;
  });

  const [activePage, setActivePage] = useState<PlatformId>('home');
  const [recentPlatform, setRecentPlatform] = useState<PlatformId | null>(
    () => {
      try {
        const saved = localStorage.getItem('gb_study_recent');
        return saved ? saved : null;
      } catch {
        return null;
      }
    }
  );
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gb_study_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchItem | null>(null);

  // Real-time synchronization: Any platform added, modified, reordered or removed
  // by an admin instantly updates across all users' devices in real time.
  useEffect(() => {
    const q = query(collection(db, 'platforms'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        if (!snapshot.empty) {
          const loaded: PlatformItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as PlatformItem;
            loaded.push({
              id: docSnap.id,
              name: data.name || '',
              sidebarName: data.sidebarName || data.name || '',
              borderColor: data.borderColor || 'border-emerald-500/70',
              glowColor: data.glowColor || 'rgba(16,185,129,0.18)',
              accentColor: data.accentColor || '#10b981',
              url: data.url,
              customIcon: data.customIcon,
              isCustom: data.isCustom,
              order: typeof data.order === 'number' ? data.order : loaded.length,
              updatedAt: data.updatedAt,
            });
          });
          setPlatforms(loaded);
          try {
            localStorage.setItem(STORAGE_PLATFORMS_KEY, JSON.stringify(loaded));
          } catch {
            // ignore storage errors
          }
        } else {
          // If Firestore is empty on initial boot, seed default platforms into Firestore
          try {
            const batch = writeBatch(db);
            DEFAULT_PLATFORMS.forEach((p, idx) => {
              const ref = doc(db, 'platforms', p.id);
              batch.set(ref, {
                id: p.id,
                name: p.name,
                sidebarName: p.sidebarName,
                borderColor: p.borderColor,
                glowColor: p.glowColor,
                accentColor: p.accentColor,
                order: idx,
                isCustom: false,
                updatedAt: new Date().toISOString(),
              });
            });
            await batch.commit();
          } catch (err) {
            console.error('Failed to seed default platforms into Firestore:', err);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'platforms');
      }
    );

    return () => unsubscribe();
  }, []);

  // 25 consecutive taps on GB STUDY icon to open Admin Panel
  const tapCountRef = useRef(0);
  const tapResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoTap = () => {
    if (tapResetTimerRef.current) {
      clearTimeout(tapResetTimerRef.current);
    }
    tapCountRef.current += 1;
    if (tapCountRef.current >= 25) {
      tapCountRef.current = 0;
      setIsDrawerOpen(false);
      setIsAdminModalOpen(true);
      return;
    }
    tapResetTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 3000);
  };

  // Show Join Community popup shortly after first load, matching the video
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCommunityModalOpen(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const persistPlatforms = (next: PlatformItem[]) => {
    setPlatforms(next);
    try {
      localStorage.setItem(STORAGE_PLATFORMS_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  };

  const handleAddPlatform = async (platform: PlatformItem, position?: number) => {
    const next = [...platforms];
    const targetIdx =
      position && position >= 1 && position <= next.length + 1
        ? position - 1
        : next.length;
    next.splice(targetIdx, 0, platform);

    persistPlatforms(next);

    try {
      const batch = writeBatch(db);
      next.forEach((p, idx) => {
        const ref = doc(db, 'platforms', p.id);
        const dataToSave: Record<string, unknown> = {
          id: p.id,
          name: p.name,
          sidebarName: p.sidebarName || p.name,
          borderColor: p.borderColor || 'border-emerald-500/70',
          glowColor: p.glowColor || 'rgba(16,185,129,0.18)',
          accentColor: p.accentColor || '#10b981',
          order: idx,
          isCustom: !!p.isCustom,
          updatedAt: new Date().toISOString(),
        };
        if (p.url) dataToSave.url = p.url;
        if (p.customIcon) dataToSave.customIcon = p.customIcon;
        batch.set(ref, dataToSave, { merge: true });
      });
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'platforms');
    }
  };

  const handleUpdatePlatform = async (updated: PlatformItem, position?: number) => {
    const currentIdx = platforms.findIndex((p) => p.id === updated.id);
    if (currentIdx === -1) return;
    const next = platforms.map((p) => (p.id === updated.id ? updated : p));
    if (position && position >= 1 && position <= next.length) {
      const targetIdx = position - 1;
      if (targetIdx !== currentIdx) {
        const [item] = next.splice(currentIdx, 1);
        next.splice(targetIdx, 0, item);
      }
    }
    persistPlatforms(next);

    try {
      const batch = writeBatch(db);
      next.forEach((p, idx) => {
        const ref = doc(db, 'platforms', p.id);
        const dataToSave: Record<string, unknown> = {
          id: p.id,
          name: p.name,
          sidebarName: p.sidebarName || p.name,
          borderColor: p.borderColor || 'border-emerald-500/70',
          glowColor: p.glowColor || 'rgba(16,185,129,0.18)',
          accentColor: p.accentColor || '#10b981',
          order: idx,
          isCustom: !!p.isCustom,
          updatedAt: new Date().toISOString(),
        };
        if (p.url) dataToSave.url = p.url;
        if (p.customIcon) dataToSave.customIcon = p.customIcon;
        batch.set(ref, dataToSave, { merge: true });
      });
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'platforms');
    }
  };

  const handleMovePlatform = async (fromIndex: number, toIndex: number) => {
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= platforms.length ||
      toIndex >= platforms.length ||
      fromIndex === toIndex
    ) {
      return;
    }
    const next = [...platforms];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    persistPlatforms(next);

    try {
      const batch = writeBatch(db);
      next.forEach((p, idx) => {
        const ref = doc(db, 'platforms', p.id);
        batch.set(
          ref,
          { order: idx, updatedAt: new Date().toISOString() },
          { merge: true }
        );
      });
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'platforms');
    }
  };

  const handleDeletePlatform = async (id: string) => {
    const next = platforms.filter((p) => p.id !== id);
    persistPlatforms(next);
    if (activePage === id) {
      setActivePage('home');
    }

    try {
      await deleteDoc(doc(db, 'platforms', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `platforms/${id}`);
    }
  };

  const handleResetPlatforms = async () => {
    persistPlatforms(DEFAULT_PLATFORMS);

    try {
      const batch = writeBatch(db);
      platforms.forEach((p) => {
        if (!DEFAULT_PLATFORMS.some((def) => def.id === p.id)) {
          batch.delete(doc(db, 'platforms', p.id));
        }
      });
      DEFAULT_PLATFORMS.forEach((p, idx) => {
        const ref = doc(db, 'platforms', p.id);
        batch.set(ref, {
          id: p.id,
          name: p.name,
          sidebarName: p.sidebarName,
          borderColor: p.borderColor,
          glowColor: p.glowColor,
          accentColor: p.accentColor,
          order: idx,
          isCustom: false,
          updatedAt: new Date().toISOString(),
        });
      });
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'platforms');
    }
  };

  const handleSelectPage = (id: PlatformId) => {
    setActivePage(id);
    if (id !== 'home') {
      setRecentPlatform(id);
      try {
        localStorage.setItem('gb_study_recent', id);
      } catch {
        // ignore storage errors
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPlatform = (platform: PlatformItem) => {
    setRecentPlatform(platform.id);
    try {
      localStorage.setItem('gb_study_recent', platform.id);
    } catch {
      // ignore storage errors
    }
    if (!platform.url) {
      setActivePage(platform.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleWishlist = (batchId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(batchId)
        ? prev.filter((id) => id !== batchId)
        : [...prev, batchId];
      try {
        localStorage.setItem('gb_study_wishlist', JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#060a08]">
      {activePage === 'home' && (
        <HomeView
          platforms={platforms}
          recentPlatform={recentPlatform}
          onOpenMenu={() => setIsDrawerOpen(true)}
          onSelectPlatform={handleSelectPlatform}
          onLogoTap={handleLogoTap}
        />
      )}

      {activePage === 'pw' && (
        <PhysicsWallahView
          onOpenMenu={() => setIsDrawerOpen(true)}
          onBack={() => handleSelectPage('home')}
          onSelectBatch={(batch) => setSelectedBatch(batch)}
        />
      )}

      {activePage !== 'home' && activePage !== 'pw' && (
        <NextToppersView
          platformId={activePage}
          platforms={platforms}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onOpenMenu={() => setIsDrawerOpen(true)}
          onBack={() => handleSelectPage('home')}
          onSelectBatch={(batch) => setSelectedBatch(batch)}
        />
      )}

      <SidebarDrawer
        isOpen={isDrawerOpen}
        activePage={activePage}
        platforms={platforms}
        onClose={() => setIsDrawerOpen(false)}
        onSelectPage={handleSelectPage}
        onSelectPlatform={handleSelectPlatform}
        onLogoTap={handleLogoTap}
      />

      <CommunityModal
        isOpen={isCommunityModalOpen}
        onClose={() => setIsCommunityModalOpen(false)}
      />

      <BatchStudyModal
        batch={selectedBatch}
        onClose={() => setSelectedBatch(null)}
      />

      <AdminModal
        isOpen={isAdminModalOpen}
        platforms={platforms}
        onClose={() => setIsAdminModalOpen(false)}
        onAddPlatform={handleAddPlatform}
        onUpdatePlatform={handleUpdatePlatform}
        onMovePlatform={handleMovePlatform}
        onDeletePlatform={handleDeletePlatform}
        onResetPlatforms={handleResetPlatforms}
      />
    </div>
  );
}
