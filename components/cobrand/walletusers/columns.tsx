"use client";

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { UserData } from '@/services/users';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {  useRouter } from 'next/navigation';

export const columns: ColumnDef<UserData>[] = [
    
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'userName',
        header: 'Username'
    },
    {
        accessorKey: 'firstName',
        header: 'First Name'
    },
    {
        accessorKey: 'lastName',
        header: 'Last Name'
    },
    {
        accessorKey: 'email',
        header: 'Email'
    },
    {
        accessorKey: 'isActive',
        header: 'Active'
    },
    {
        accessorKey: 'emailConfirmed',
        header: 'Email Confirmed'
    },
    {
        accessorKey: 'phoneNumber',
        header: 'Phone Number'
    },
    {
        accessorKey: 'kycCompleted',
        header: 'KYC Completed'
    },
    {
        accessorKey: 'kybCompleted',
        header: 'KYB Completed'
    },
    {
        accessorKey: 'userType',
        header: 'User Type',
        cell: ({ row }) => {
            return <Badge variant="default">Wallet User</Badge>;
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const user = row.original;
            const router = useRouter();

            const handleViewUser = () => {
                router.push(`/cobrand/clients/${user.id}`);
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                            <span className='sr-only'>Open menu</span>
                            <MoreHorizontal className='h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(user.id)}
                        >
                            Copy user ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleViewUser}>View User</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
