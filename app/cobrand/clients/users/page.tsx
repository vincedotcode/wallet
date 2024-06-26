"use client";

import React, { useState, useEffect } from 'react';
import {  columns } from '@/components/cobrand/walletusers/columns';
import { DataTable } from '@/components/cobrand/walletusers/user-table';
import { getUsers, UserData} from "@/services/users";
import BreadCrumb from '@/components/breadcrumb';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
const breadcrumbItems = [{ title: 'Wallet Users', link: '/cobrand/clients/users' }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};
export default function Home() {
  const [data, setData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<UserData[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getUsers({ userType: 1 });
        setData(response || []); // Ensure data is an array
        setFilteredData(response.filter((user) => user.userType === 1));
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Wallet Users (${data.length})`}
            description="Manage Your Wallet Users"
          />

        </div>
        <Separator />

        {loading ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={filteredData} />
      )}
      </div>
   
  );
}



