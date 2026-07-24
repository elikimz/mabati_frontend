import React, { useState } from "react";
import { Upload, Image as ImageIcon, Save, Eye } from "lucide-react";
import { uploadToCloudinary } from "../../lib/api";
import { Link } from "react-router-dom";

interface LandingSettings {
  heroImage: string;
  heroBannerText: string;
  heroSubtext: string;
  featuredBanner1: string;
  featuredBanner2: string;
  featuredBanner3: string;
  whatsappNumber: string;
}

const STORAGE_KEY = "mabati_landing_settings";

const defaultSettings: LandingSettings = {
  heroImage:
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80&auto=format&fit=crop",
  heroBannerText: "Premium Roofing Solutions Built to Last",
  heroSubtext:
    "Quality Mabati products for modern homes and commercial buildings.",
  featuredBanner1:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop",
  featuredBanner2:
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop",
  featuredBanner3:
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&auto=format&fit=crop",
  whatsappNumber: "254700000000",
};

const AdminLanding: React.FC = () => {
  const [settings, setSettings] = useState<LandingSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });
  const [uploading, setUploading] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleImageUpload = async (
    field: keyof LandingSettings,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    try {
      const url = await uploadToCloudinary(file);
      setSettings((prev) => ({ ...prev, [field]: url }));
    } catch {
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(null);
    }
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const ImageUploadField: React.FC<{
    field: keyof LandingSettings;
    label: string;
    description?: string;
  }> = ({ field, label, description }) => (
    <div>
      <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-2 block">
        {label}
      </label>
      {description && (
        <p className="text-xs text-[#6b7a9e] mb-3">{description}</p>
      )}
      <div className="flex items-start gap-4">
        <div className="w-32 h-20 rounded-xl border-2 border-dashed border-[#dde3f0] bg-[#f8fafc] overflow-hidden shrink-0">
          {settings[field] ? (
            <img
              src={settings[field] as string}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={20} className="text-[#6b7a9e]" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <label className="flex items-center gap-2 px-4 py-2.5 bg-[#f0f3f9] border border-[#dde3f0] rounded-lg text-sm font-medium text-[#3d4663] hover:bg-[#dde3f0] cursor-pointer transition-colors w-fit">
            <Upload size={14} />
            {uploading === field ? "Uploading..." : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(field, e)}
              className="hidden"
              disabled={uploading !== null}
            />
          </label>
          <input
            type="text"
            value={settings[field] as string}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, [field]: e.target.value }))
            }
            placeholder="Or paste image URL..."
            className="mt-2 w-full px-3 py-2 bg-white border border-[#dde3f0] rounded-lg text-xs text-[#6b7a9e] focus:outline-none focus:border-[#2952a3] transition-all"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0a1628] mb-1">
            Landing Page Settings
          </h1>
          <p className="text-[#6b7a9e] text-sm">
            Manage homepage visuals and content without touching code
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 border border-[#dde3f0] text-[#3d4663] text-sm font-semibold rounded-xl hover:bg-[#f0f3f9] transition-colors"
          >
            <Eye size={15} />
            Preview
          </Link>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#152b55] text-white text-sm font-semibold rounded-xl hover:bg-[#0f2040] transition-colors shadow-md"
          >
            <Save size={15} />
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl border border-[#dde3f0] p-6">
          <h2 className="text-base font-bold text-[#0a1628] mb-5 pb-3 border-b border-[#f0f3f9]">
            Hero Section
          </h2>
          <div className="space-y-5">
            <ImageUploadField
              field="heroImage"
              label="Hero Background Image"
              description="Full-screen background image for the hero section (recommended: 1920×1080)"
            />
            <div>
              <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1.5 block">
                Hero Headline
              </label>
              <input
                type="text"
                value={settings.heroBannerText}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    heroBannerText: e.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 bg-white border border-[#dde3f0] rounded-lg text-sm text-[#0a1628] focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1.5 block">
                Hero Subtext
              </label>
              <textarea
                value={settings.heroSubtext}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    heroSubtext: e.target.value,
                  }))
                }
                rows={2}
                className="w-full px-3 py-2.5 bg-white border border-[#dde3f0] rounded-lg text-sm text-[#0a1628] focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-white rounded-2xl border border-[#dde3f0] p-6">
          <h2 className="text-base font-bold text-[#0a1628] mb-5 pb-3 border-b border-[#f0f3f9]">
            Contact Settings
          </h2>
          <div>
            <label className="text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1.5 block">
              WhatsApp Number
            </label>
            <p className="text-xs text-[#6b7a9e] mb-2">
              International format without + (e.g. 254700000000)
            </p>
            <input
              type="text"
              value={settings.whatsappNumber}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  whatsappNumber: e.target.value,
                }))
              }
              placeholder="254700000000"
              className="w-full px-3 py-2.5 bg-white border border-[#dde3f0] rounded-lg text-sm text-[#0a1628] focus:outline-none focus:border-[#2952a3] focus:ring-2 focus:ring-[#2952a3]/20 transition-all"
            />
          </div>
        </div>

        {/* Featured Banners */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#dde3f0] p-6">
          <h2 className="text-base font-bold text-[#0a1628] mb-5 pb-3 border-b border-[#f0f3f9]">
            Featured Section Images
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ImageUploadField
              field="featuredBanner1"
              label="Featured Image 1"
              description="First featured product showcase image"
            />
            <ImageUploadField
              field="featuredBanner2"
              label="Featured Image 2"
              description="Second featured product showcase image"
            />
            <ImageUploadField
              field="featuredBanner3"
              label="Featured Image 3"
              description="Third featured product showcase image"
            />
          </div>
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold animate-fade-up">
          ✓ Settings saved successfully
        </div>
      )}
    </div>
  );
};

export default AdminLanding;
