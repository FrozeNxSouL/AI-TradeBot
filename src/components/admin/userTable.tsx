'use client';

import { RoleAvailable, UserStatus } from '@/types/types';
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@heroui/dropdown";
import { Pagination } from "@heroui/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/table";
import { User } from '@prisma/client';
import { useEffect, useMemo, useState } from 'react';

export default function UserList({ adminid }: { adminid: string }) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const rowsPerPage = 15;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/admin/users');
                const data = await response.json();
                const filtered = data.filter((user: User) => user.user_id != adminid)
                setUsers(filtered);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const response = await fetch(`/api/admin/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: { role: newRole, id: userId } }),
            });

            if (response.ok) {
                setUsers(users.map(user =>
                    user.user_id === userId ? { ...user, user_role: newRole } : user
                ));
            } else {
                console.error('Failed to update user role');
            }
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    const statusColorMap: Record<0 | 1 | 2, "default" | "warning" | "success" | "danger" | "primary" | "secondary"> = {
        0: "success",
        1: "warning",
        2: "danger",
    };


    const pages = Math.ceil(users.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return users.slice(start, end);
    }, [page, users]);

    async function deleteUser(user_id: string) {
        try {
            const response = await fetch(`/api/admin/users`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: { id: user_id } }),
            });

            if (response.ok) {
                const filtered = users.filter((user: User) => user.user_id != user_id)
                setUsers(filtered);
            } else {
                console.error('Failed to delete');
            }
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    }

    return (
        <div
            className="w-full px-4"
        >
            <h1 className="text-2xl font-bold my-6">User Management</h1>

            <Table
                aria-label="User management table"
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                }
            >
                <TableHeader>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>EMAIL</TableColumn>
                    <TableColumn>ROLE</TableColumn>
                    <TableColumn>PROVIDER</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody
                    emptyContent={"No Users Found"}
                    isLoading={loading}
                    loadingContent={"Loading users..."}
                >
                    {items.map((user: User) => (
                        <TableRow key={user.user_id}>
                            <TableCell>{user.user_id}...</TableCell>
                            <TableCell>{user.user_email}</TableCell>
                            <TableCell>
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button
                                            variant="bordered"
                                            className="capitalize"
                                        >
                                            {user.user_role}
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        aria-label="Role Selection"
                                        onAction={(key) => handleRoleChange(user.user_id, key.toString())}
                                    >
                                        <DropdownItem className='text-foreground' key={RoleAvailable.User}>User</DropdownItem>
                                        <DropdownItem className='text-foreground' key={RoleAvailable.Admin}>Admin</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </TableCell>
                            <TableCell>{user.provider}</TableCell>
                            <TableCell>
                                {user.user_status != null && (
                                    <Chip
                                        color={statusColorMap[user.user_status as 0 | 1 | 2]}
                                        size="sm"
                                        variant="flat"
                                    >
                                        {UserStatus[user.user_status as 0 | 1 | 2]}
                                    </Chip>
                                )}

                            </TableCell>
                            <TableCell>
                                <Button
                                    size="md"
                                    color="danger"
                                    onPress={() => deleteUser(user.user_id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}