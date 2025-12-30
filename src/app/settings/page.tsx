'use client';

import { MainLayout } from '@/components/layout';
import { Settings, User, Bell, Palette, Shield } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="p-4 lg:p-6 xl:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                <Settings className="h-8 w-8 text-zinc-400" />
                Cài Đặt
              </h1>
              <p className="text-sm text-zinc-400 mt-2">
                Quản lý tài khoản và tùy chỉnh ứng dụng.
              </p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
                <div className="flex items-center gap-3 mb-4">
                  <User className="h-5 w-5 text-purple-400" />
                  <h2 className="text-lg font-semibold text-white">Hồ sơ</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                    <span className="text-zinc-400">Email</span>
                    <span className="text-white">{user?.primaryEmailAddress?.emailAddress || 'Chưa cập nhật'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                    <span className="text-zinc-400">Tên</span>
                    <span className="text-white">{user?.fullName || 'Chưa cập nhật'}</span>
                  </div>
                </div>
              </div>

              {/* Notifications Section */}
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="h-5 w-5 text-yellow-400" />
                  <h2 className="text-lg font-semibold text-white">Thông báo</h2>
                </div>
                <p className="text-zinc-500 text-sm">Sắp ra mắt...</p>
              </div>

              {/* Appearance Section */}
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
                <div className="flex items-center gap-3 mb-4">
                  <Palette className="h-5 w-5 text-pink-400" />
                  <h2 className="text-lg font-semibold text-white">Giao diện</h2>
                </div>
                <p className="text-zinc-500 text-sm">Sắp ra mắt...</p>
              </div>

              {/* Privacy Section */}
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-5 w-5 text-green-400" />
                  <h2 className="text-lg font-semibold text-white">Bảo mật</h2>
                </div>
                <p className="text-zinc-500 text-sm">Sắp ra mắt...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
