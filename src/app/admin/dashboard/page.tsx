'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  subscription: {
    isActive: boolean;
    plan: string;
    startDate: string | null;
    endDate: string | null;
    paymentMethod: string | null;
    amount: number;
    currency: string;
  };
  usage: {
    dailyAttempts: number;
    lastAttemptDate: string;
    totalAttempts: number;
  };
  status: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [backfillStatus, setBackfillStatus] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Check admin authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
      return;
    }

    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const token = localStorage.getItem('adminToken');
      console.log('Admin token:', token ? 'Present' : 'Missing');
      
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        console.log('Setting users:', data.users);
        setUsers(data.users);
      } else {
        console.error('API error:', data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  const toggleSubscription = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/admin/users/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({
          userId,
          isActive: !currentStatus,
        }),
      });

      if (response.ok) {
        fetchUsers(); // Refresh the user list
      }
    } catch (error) {
      console.error('Failed to toggle subscription:', error);
    }
  };

  const updateUser = async (updatedUser: User) => {
    try {
      const response = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        fetchUsers();
        setIsEditDialogOpen(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const backfillUsers = async () => {
    try {
      setBackfillStatus('Running backfill...');
      const response = await fetch('/api/admin/backfill', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setBackfillStatus(`Backfill complete: created ${data.created}, existing ${data.existing}`);
        await fetchUsers();
      } else {
        setBackfillStatus(`Backfill failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to backfill users:', error);
      setBackfillStatus('Backfill failed. Check console.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users and subscriptions</p>
            {backfillStatus && (
              <p className="text-sm text-gray-500 mt-2">{backfillStatus}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={backfillUsers} variant="secondary">Backfill Users</Button>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {users.filter(u => u.subscription.isActive).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Free Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {users.filter(u => !u.subscription.isActive).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              View and manage all user accounts and their subscription status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Daily Attempts</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.subscription.isActive ? "default" : "secondary"}
                      >
                        {user.subscription.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {user.subscription.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.usage.dailyAttempts}/3
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleSubscription(user.id, user.subscription.isActive)}
                        >
                          {user.subscription.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedUser(user)}
                            >
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit User</DialogTitle>
                              <DialogDescription>
                                Update user information and subscription details
                              </DialogDescription>
                            </DialogHeader>
                            {selectedUser && (
                              <UserEditForm 
                                user={selectedUser} 
                                onSave={updateUser}
                                onCancel={() => {
                                  setIsEditDialogOpen(false);
                                  setSelectedUser(null);
                                }}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UserEditForm({ 
  user, 
  onSave, 
  onCancel 
}: { 
  user: User; 
  onSave: (user: User) => void;
  onCancel: () => void;
}) {
  const [editedUser, setEditedUser] = useState<User>(user);

  const handleSave = () => {
    onSave(editedUser);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={editedUser.firstName}
            onChange={(e) => setEditedUser({
              ...editedUser,
              firstName: e.target.value
            })}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={editedUser.lastName}
            onChange={(e) => setEditedUser({
              ...editedUser,
              lastName: e.target.value
            })}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={editedUser.email}
          onChange={(e) => setEditedUser({
            ...editedUser,
            email: e.target.value
          })}
        />
      </div>

      <div>
        <Label htmlFor="dailyAttempts">Daily Attempts</Label>
        <Input
          id="dailyAttempts"
          type="number"
          min="0"
          max="3"
          value={editedUser.usage.dailyAttempts}
          onChange={(e) => setEditedUser({
            ...editedUser,
            usage: {
              ...editedUser.usage,
              dailyAttempts: parseInt(e.target.value) || 0
            }
          })}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}