import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Eye,
  X,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { bannersApi, uploadToCloudinary } from "../../lib/api";

const AdminLanding: React.FC = () => {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const { data: banners, isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: () => bannersApi.list(undefined, false),
  });

  const createMutation = useMutation({
    mutationFn: bannersApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["banners"] });
      setShowModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      bannersApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["banners"] });
      setShowModal(false);
      setEditingBanner(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: bannersApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["banners"] }),
  });

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    link_url: "",
    location: "hero",
    display_order: 0,
    is_active: true,
  });

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      image_url: banner.image_url,
      link_url: banner.link_url || "",
      location: banner.location,
      display_order: banner.display_order,
      is_active: banner.is_active,
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingBanner(null);
    setForm({
      title: "",
      subtitle: "",
      image_url: "",
      link_url: "",
      location: "hero",
      display_order: banners ? banners.length : 0,
      is_active: true,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, image_url: url }));
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const moveBanner = (id: number, direction: "up" | "down") => {
    const index = banners?.findIndex((b: any) => b.id === id);
    if (!banners) return; // Add null check for banners
    if (index === undefined || index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= (banners?.length || 0)) return;

    const otherBanner = banners[newIndex];
    if (!banners[index]) return; // Add null check for banners[index]
    
    // Swap display orders
    updateMutation.mutate({ 
      id: id, 
      data: { display_order: otherBanner.display_order } 
    });
    updateMutation.mutate({ 
      id: otherBanner.id, 
      data: { display_order: banners[index].display_order } 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0a1628]">Homepage Banners</h1>
          <p className="text-sm text-[#6b7a9e] mt-0.5">
            Manage the images and text shown on your landing page.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 border border-[#dde3f0] text-[#3d4663] text-sm font-semibold rounded-xl hover:bg-[#f0f3f9] transition-colors"
          >
            <Eye size={15} />
            View Site
          </Link>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2952a3] text-white text-sm font-semibold rounded-xl hover:bg-[#1e3d7a] transition-colors shadow-md"
          >
            <Plus size={15} />
            Add New Banner
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-[#6b7a9e]">Loading banners...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {banners?.map((banner: any, index: number) => (
            <div
              key={banner.id}
              className={`bg-white rounded-2xl border ${
                banner.is_active ? "border-[#dde3f0]" : "border-dashed border-[#dde3f0] opacity-70"
              } overflow-hidden flex flex-col md:flex-row`}
            >
              <div className="w-full md:w-72 h-48 shrink-0 relative">
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                  {banner.location}
                </div>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-[#0a1628]">
                      {banner.title || "Untitled Banner"}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        banner.is_active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                      }`}>
                        {banner.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-[#6b7a9e] mb-4 line-clamp-2">
                    {banner.subtitle || "No subtitle provided."}
                  </p>
                  {banner.link_url && (
                    <div className="flex items-center gap-1.5 text-xs text-[#2952a3] font-medium">
                      <ExternalLink size={12} />
                      {banner.link_url}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f0f3f9]">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveBanner(banner.id, "up")}
                      disabled={index === 0}
                      className="p-2 rounded-lg text-[#6b7a9e] hover:bg-[#f0f3f9] disabled:opacity-30"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => moveBanner(banner.id, "down")}
                      disabled={index === (banners?.length || 0) - 1}
                      className="p-2 rounded-lg text-[#6b7a9e] hover:bg-[#f0f3f9] disabled:opacity-30"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="px-4 py-2 text-sm font-semibold text-[#2952a3] hover:bg-[#f0f3f9] rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(banner.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {banners?.length === 0 && (
            <div className="bg-white rounded-2xl border-2 border-dashed border-[#dde3f0] p-12 text-center">
              <ImageIcon size={48} className="mx-auto text-[#dde3f0] mb-4" />
              <h3 className="text-lg font-bold text-[#0a1628] mb-1">No banners yet</h3>
              <p className="text-sm text-[#6b7a9e] mb-6">
                Start by adding your first iron sheet showcase banner.
              </p>
              <button
                onClick={handleAddNew}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2952a3] text-white text-sm font-semibold rounded-xl hover:bg-[#1e3d7a] transition-colors"
              >
                <Plus size={16} />
                Add New Banner
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-[#dde3f0] flex items-center justify-between">
              <h2 className="font-bold text-[#0a1628]">
                {editingBanner ? "Edit Banner" : "Add New Banner"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#6b7a9e] hover:text-[#0a1628]">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <select
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3 py-2 border border-[#dde3f0] rounded-lg text-sm focus:outline-none focus:border-[#2952a3]"
                  >
                    <option value="hero">Hero Background</option>
                    <option value="featured">Featured Section</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1">
                    Banner Image
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="url"
                        placeholder="Image URL"
                        value={form.image_url}
                        onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                        className="w-full px-3 py-2 border border-[#dde3f0] rounded-lg text-sm focus:outline-none focus:border-[#2952a3]"
                        required
                      />
                    </div>
                    <label className="px-4 py-2 bg-[#f0f3f9] text-[#2952a3] text-sm font-semibold rounded-lg cursor-pointer hover:bg-[#e2e8f3] transition-colors">
                      {uploading ? "..." : <Upload size={16} />}
                      <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                    </label>
                  </div>
                  {form.image_url && (
                    <div className="mt-2 h-24 rounded-lg overflow-hidden border border-[#dde3f0]">
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1">
                    Headline / Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 border border-[#dde3f0] rounded-lg text-sm focus:outline-none focus:border-[#2952a3]"
                    placeholder="e.g. Premium Box Profile"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1">
                    Subtext / Description
                  </label>
                  <textarea
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-[#dde3f0] rounded-lg text-sm focus:outline-none focus:border-[#2952a3]"
                    placeholder="e.g. Durable and stylish roofing solutions..."
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider mb-1">
                    Link URL
                  </label>
                  <input
                    type="text"
                    value={form.link_url}
                    onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                    className="w-full px-3 py-2 border border-[#dde3f0] rounded-lg text-sm focus:outline-none focus:border-[#2952a3]"
                    placeholder="/products/box-profile"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      className="w-4 h-4 rounded border-[#dde3f0] text-[#2952a3] focus:ring-[#2952a3]"
                    />
                    <span className="text-sm font-medium text-[#0a1628]">Active</span>
                  </label>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-[#dde3f0] text-[#3d4663] text-sm font-semibold rounded-xl hover:bg-[#f0f3f9] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-[#2952a3] text-white text-sm font-semibold rounded-xl hover:bg-[#1e3d7a] transition-colors shadow-md disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLanding;
