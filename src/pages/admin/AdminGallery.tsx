import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { galleryApi, uploadToCloudinary } from "../../lib/api";
import type { GalleryOut, GalleryCreate, GalleryUpdate } from "../../types";
import { Plus, Edit2, Trash2, Save, X, Upload, Image as ImageIcon } from "lucide-react";

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "lg" | "xl" | "2xl";
}> = ({ isOpen, onClose, title, children, size = "lg" }) => {
  if (!isOpen) return null;
  const widths = { sm: "max-w-sm", lg: "max-w-lg", xl: "max-w-xl", "2xl": "max-w-2xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${widths[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#dde3f0]">
          <h2 className="font-bold text-[#0a1628]">{title}</h2>
          <button onClick={onClose} className="text-[#6b7a9e] hover:text-[#0a1628]">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const GalleryForm: React.FC<{
  initialData?: GalleryOut;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ initialData, onSuccess, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [displayOrder, setDisplayOrder] = useState(initialData?.display_order || 0);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [uploading, setUploading] = useState(false);
  
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: GalleryCreate | GalleryUpdate) => 
      initialData 
        ? galleryApi.update(initialData.id, data as GalleryUpdate)
        : galleryApi.create(data as GalleryCreate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      onSuccess();
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
    } catch (err) {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      title,
      description,
      image_url: imageUrl,
      category,
      display_order: displayOrder,
      is_active: isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#0a1628] mb-1">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-[#dde3f0] rounded-lg focus:outline-none focus:border-[#2952a3]"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#0a1628] mb-1">Category (e.g. Residential)</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-[#dde3f0] rounded-lg focus:outline-none focus:border-[#2952a3]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#0a1628] mb-1">Image *</label>
        <div className="space-y-3">
          <label className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-[#dde3f0] rounded-xl cursor-pointer hover:border-[#2952a3]/50 transition-colors text-sm text-[#6b7a9e]">
            <Upload size={16} />
            {uploading ? "Uploading..." : "Upload Image"}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-3 py-2 border border-[#dde3f0] rounded-lg focus:outline-none focus:border-[#2952a3] text-sm"
            placeholder="Or paste image URL"
            required
          />
          {imageUrl && (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-[#dde3f0]">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#0a1628] mb-1">Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-[#dde3f0] rounded-lg focus:outline-none focus:border-[#2952a3]"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#0a1628] mb-1">Display Order</label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            className="w-full px-3 py-2 border border-[#dde3f0] rounded-lg focus:outline-none focus:border-[#2952a3]"
          />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-[#2952a3]"
            />
            <span className="text-sm font-medium text-[#0a1628]">Active</span>
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-[#dde3f0] text-[#6b7a9e] hover:bg-[#f0f3f9]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-[#2952a3] text-white font-bold hover:bg-[#1e3d7a] disabled:opacity-50"
          disabled={mutation.isPending || uploading}
        >
          {mutation.isPending ? "Saving..." : initialData ? "Update Item" : "Add to Gallery"}
        </button>
      </div>
    </form>
  );
};

export default function AdminGallery() {
  const queryClient = useQueryClient();
  const { data: gallery = [], isLoading } = useQuery({ 
    queryKey: ["gallery"], 
    queryFn: () => galleryApi.list(false) 
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryOut | undefined>(undefined);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => galleryApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gallery"] }),
  });

  const handleEdit = (item: GalleryOut) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this gallery item?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(undefined);
  };

  if (isLoading) return <div className="p-8 text-center text-[#6b7a9e]">Loading gallery...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0a1628]">Inspiration Gallery</h1>
          <p className="text-[#6b7a9e] text-sm">Manage the images shown in the homepage gallery section</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#2952a3] text-white font-bold rounded-xl hover:bg-[#1e3d7a] transition-all shadow-lg shadow-[#2952a3]/20"
        >
          <Plus size={18} />
          Add Image
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <div 
            key={item.id} 
            className={`group relative bg-white rounded-2xl overflow-hidden border border-[#dde3f0] shadow-sm hover:shadow-xl transition-all ${!item.is_active ? 'opacity-60' : ''}`}
          >
            <div className="aspect-video relative overflow-hidden bg-[#f0f3f9]">
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {!item.is_active && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-gray-500 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                  Inactive
                </div>
              )}
              {item.category && (
                <div className="absolute top-3 left-3 px-2 py-1 bg-[#2952a3] text-white text-[10px] font-bold rounded uppercase tracking-wider">
                  {item.category}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-[#0a1628] truncate">{item.title}</h3>
              <p className="text-xs text-[#6b7a9e] line-clamp-1 mt-1">{item.description || "No description"}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f0f3f9]">
                <span className="text-[10px] font-bold text-[#b8c1d9] uppercase">Order: {item.display_order}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="p-2 text-[#2952a3] hover:bg-[#2952a3]/10 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {gallery.length === 0 && (
          <div className="col-span-full py-20 text-center bg-[#f8fafc] rounded-3xl border-2 border-dashed border-[#dde3f0]">
            <ImageIcon size={48} className="mx-auto text-[#dde3f0] mb-4" />
            <p className="text-[#6b7a9e] font-medium">No gallery images found. Start by adding one!</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? "Edit Gallery Item" : "Add Gallery Item"}
        size="lg"
      >
        <GalleryForm
          initialData={editingItem}
          onSuccess={handleCloseModal}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
