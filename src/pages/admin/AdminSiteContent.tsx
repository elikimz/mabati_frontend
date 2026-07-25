import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { siteContentApi } from "../../lib/api";
import type { SiteContentCreate, SiteContentOut } from "../../types";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

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

const SiteContentForm: React.FC<{
  initialData?: SiteContentOut;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ initialData, onSuccess, onCancel }) => {
  const [key, setKey] = useState(initialData?.key || "");
  const [value, setValue] = useState(JSON.stringify(initialData?.value, null, 2) || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const queryClient = useQueryClient();

  const createOrUpdateMutation = useMutation({
    mutationFn: (data: SiteContentCreate) => siteContentApi.createOrUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteContent"] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedValue = JSON.parse(value);
      createOrUpdateMutation.mutate({
        key,
        value: parsedValue,
        description,
      });
    } catch (error) {
      alert("Invalid JSON in Value field.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#0a1628] mb-1">Key</label>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-full px-3 py-2 border border-[#dde3f0] rounded-lg focus:outline-none focus:border-[#2952a3]"
          placeholder="e.g., homepage_stats"
          required
          disabled={!!initialData} // Key cannot be changed for existing content
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#0a1628] mb-1">Value (JSON)</label>
        <textarea
          rows={8}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-3 py-2 border border-[#dde3f0] rounded-lg focus:outline-none focus:border-[#2952a3] font-mono text-xs"
          placeholder={`Enter JSON data, e.g., [{ \"icon\": \"Hammer\", \"value\": \"1000+\", \"label\": \"Projects Completed\" }]`}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#0a1628] mb-1">Description (Optional)</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-[#dde3f0] rounded-lg focus:outline-none focus:border-[#2952a3]"
          placeholder="Brief description of this content"
        />
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-[#dde3f0] text-[#6b7a9e] hover:bg-[#f0f3f9]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-[#2952a3] text-white hover:bg-[#1e3d7a] disabled:opacity-50"
          disabled={createOrUpdateMutation.isPending}
        >
          <Save size={16} className="inline mr-2" />
          {initialData ? "Update Content" : "Create Content"}
        </button>
      </div>
    </form>
  );
};

export default function AdminSiteContent() {
  const queryClient = useQueryClient();
  const { data: siteContent, isLoading, isError } = useQuery<SiteContentOut[]>({ queryKey: ["siteContent"], queryFn: siteContentApi.list });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<SiteContentOut | undefined>(undefined);

  const deleteMutation = useMutation({
    mutationFn: (key: string) => siteContentApi.delete(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteContent"] });
    },
  });

  const handleEdit = (content: SiteContentOut) => {
    setEditingContent(content);
    setIsModalOpen(true);
  };

  const handleDelete = (key: string) => {
    if (window.confirm("Are you sure you want to delete this site content?")) {
      deleteMutation.mutate(key);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContent(undefined);
  };

  if (isLoading) return <div>Loading site content...</div>;
  if (isError) return <div>Error loading site content.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0a1628]">Site Content Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-[#2952a3] text-white hover:bg-[#1e3d7a]"
        >
          <Plus size={16} className="inline mr-2" />
          Add New Content
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#dde3f0]">
        <table className="min-w-full divide-y divide-[#dde3f0]">
          <thead className="bg-[#f8fafc]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7a9e] uppercase tracking-wider">Key</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7a9e] uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7a9e] uppercase tracking-wider">Value Preview</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[#6b7a9e] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dde3f0]">
            {siteContent?.map((content) => (
              <tr key={content.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0a1628]">{content.key}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3d4663]">{content.description || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-[#3d4663]">
                  <pre className="bg-[#f0f3f9] p-2 rounded-lg text-xs overflow-auto max-h-20">{JSON.stringify(content.value, null, 2)}</pre>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(content)}
                    className="text-[#2952a3] hover:text-[#1e3d7a] mr-3"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(content.key)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingContent ? "Edit Site Content" : "Add New Site Content"}
        size="xl"
      >
        <SiteContentForm
          initialData={editingContent}
          onSuccess={handleCloseModal}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
