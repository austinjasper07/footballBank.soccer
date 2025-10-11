'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Card, CardContent } from '@/components/ui/card';
import { SearchBar } from '@/components/admin/SearchBar';
import { useToast } from '@/hooks/use-toast';
import { UserDialog } from '@/components/admin/dialogs/UserDialog';
import { DeleteConfirmationModal } from '@/components/admin/dialogs/DeleteConfirmationModal';
import LoadingSplash from '@/components/ui/loading-splash';
import {
  getAllUsers,
  updateUser,
  deleteUser,
  createUser,
} from '@/actions/adminActions';

const ITEMS_PER_PAGE = 5;

export default function UsersView() {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getAllUsers();
        setUsers(response);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const search = searchQuery.toLowerCase();
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesSearch =
        user.firstName.toLowerCase().includes(search) ||
        user.lastName.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search);
      return matchesRole && matchesSearch;
    });
  }, [users, searchQuery, roleFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const handleDeleteUser = async (id) => {
    console.log("Delete user clicked - ID:", id, "Type:", typeof id);
    const user = users.find(u => u.id === id);
    console.log("Found user:", user);
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    console.log("Confirming delete for user:", userToDelete);
    console.log("User ID to delete:", userToDelete.id, "Type:", typeof userToDelete.id);
    
    try {
      setIsDeleting(true);
      const result = await deleteUser(userToDelete.id);
      
      if (result && result.success) {
        toast({
          title: 'User Deleted',
          description: 'The user has been removed successfully.',
        });
        const updated = await getAllUsers();
        setUsers(updated);
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } else {
        throw new Error('Delete operation failed');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserDialogOpen(true);
  };

  const handleAddOrUpdateUser = async (data) => {
    if (!data.email || !data.firstName || !data.lastName) {
      toast({
        title: 'Error',
        description: 'Missing required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (data.id) {
        await updateUser(data.id, data);
        toast({ title: 'Success', description: 'User updated successfully' });
      } else {
        await createUser(data);
        toast({ title: 'Success', description: 'User added successfully' });
      }

      const updated = await getAllUsers();
      setUsers(updated);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save user.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <LoadingSplash message="Loading users..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex md:items-center justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search users..."
            className="w-40 md:w-80"
          />

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="player">Player</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setUserDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Subscribed</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-t border-border hover:bg-muted/40">
                    <td className="p-4">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4 capitalize">{user.role}</td>
                    <td className="p-4">
                      <Badge
                        className={
                          user.subscribed
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-gray-400'
                        }
                      >
                        {user.subscribed ? 'Yes' : 'No'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <UserDialog
        open={userDialogOpen}
        onOpenChange={(open) => {
          setUserDialogOpen(open);
          if (!open) setEditingUser(null);
        }}
        user={editingUser || undefined}
        onSave={handleAddOrUpdateUser}
      />

      <DeleteConfirmationModal
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        description="This will permanently remove the user from the system."
        itemName={userToDelete ? `${userToDelete.firstName} ${userToDelete.lastName}` : ''}
        isLoading={isDeleting}
      />
    </div>
  );
}
