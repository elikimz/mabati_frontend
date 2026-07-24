import React from "react";
import { Users, Shield, UserCheck } from "lucide-react";
import { Badge } from "../../components/ui";
import { formatDate } from "../../lib/utils";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../lib/api";
import type { User } from "../../types";
import { PageLoader } from "../../components/ui";

const AdminUsers: React.FC = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await apiClient.get<User[]>("/admin/users");
      return data;
    },
  });

  if (isLoading) return <PageLoader />;

  const roleVariant = (role: string) => {
    if (role === "admin") return "danger";
    if (role === "staff") return "info";
    return "default";
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0a1628] mb-1">Users</h1>
        <p className="text-[#6b7a9e] text-sm">
          {users?.length || 0} registered users
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Total Users",
            value: users?.length || 0,
            icon: <Users size={20} />,
            color: "text-[#2952a3]",
            bg: "bg-blue-50",
          },
          {
            label: "Admins",
            value: users?.filter((u) => u.role === "admin").length || 0,
            icon: <Shield size={20} />,
            color: "text-red-600",
            bg: "bg-red-50",
          },
          {
            label: "Customers",
            value: users?.filter((u) => u.role === "customer").length || 0,
            icon: <UserCheck size={20} />,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-[#dde3f0] p-5 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}
            >
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <div>
              <div className="text-2xl font-black text-[#0a1628]">
                {stat.value}
              </div>
              <div className="text-sm text-[#6b7a9e]">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-[#dde3f0] overflow-hidden">
        {!users?.length ? (
          <div className="py-16 text-center text-[#6b7a9e]">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f0f3f9] bg-[#f8fafc]">
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#6b7a9e] uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f3f9]">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[#f8fafc] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#2952a3] flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#0a1628]">
                            {user.name}
                          </div>
                          <div className="text-xs text-[#6b7a9e]">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={roleVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={user.is_active ? "success" : "danger"}>
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#6b7a9e]">
                      {formatDate(user.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
