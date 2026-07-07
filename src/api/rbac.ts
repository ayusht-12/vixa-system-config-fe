import { apiFetch } from "../lib/apiClient";
import type {
  PermissionDTO,
  RbacUserDTO,
  RoleAssignmentResultDTO,
  RoleDTO,
} from "./types";

export function fetchRbacUsers(): Promise<RbacUserDTO[]> {
  return apiFetch<RbacUserDTO[]>("/rbac/users");
}

export function fetchRbacRoles(): Promise<RoleDTO[]> {
  return apiFetch<RoleDTO[]>("/rbac/roles");
}

export function fetchRbacPermissions(): Promise<PermissionDTO[]> {
  return apiFetch<PermissionDTO[]>("/rbac/permissions");
}

export function activateRbacUser(userId: string): Promise<RbacUserDTO> {
  return apiFetch<RbacUserDTO>(`/rbac/users/${userId}/activate`, { method: "POST" });
}

export function deactivateRbacUser(userId: string): Promise<RbacUserDTO> {
  return apiFetch<RbacUserDTO>(`/rbac/users/${userId}/deactivate`, { method: "POST" });
}

export function assignRbacRole(userId: string, roleId: string): Promise<RoleAssignmentResultDTO> {
  return apiFetch<RoleAssignmentResultDTO>(`/rbac/users/${userId}/roles/${roleId}`, {
    method: "POST",
  });
}

export function removeRbacRole(userId: string, roleId: string): Promise<RoleAssignmentResultDTO> {
  return apiFetch<RoleAssignmentResultDTO>(`/rbac/users/${userId}/roles/${roleId}`, {
    method: "DELETE",
  });
}
