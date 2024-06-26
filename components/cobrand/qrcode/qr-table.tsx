'use client';

import React, { useState, useEffect } from 'react';
import {
  ColumnDef,
  flexRender,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { getAllQRCodes, QRCodeData } from '@/services/qrcode';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string; // Add searchKey prop
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center py-4'>
          <Input
            placeholder='Search...'
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
            onChange={event =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className='max-w-sm'
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  );
}

interface QRCodeTableProps {
  walletId: number;
}

const QRCodeTable: React.FC<QRCodeTableProps> = ({ walletId }) => {
  const [data, setData] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewQrCode, setViewQrCode] = useState<string | null>(null); // State for viewing QR code

  useEffect(() => {
    const fetchQRCodes = async () => {
      setLoading(true);
      try {
        const response = await getAllQRCodes(walletId, false); // Adjust 'false' if needed
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch QR codes', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQRCodes();
  }, [walletId]);

  const downloadQRCode = (qrCodeBase64: string, qrCodeId: number) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${qrCodeBase64}`;
    link.download = `qr_code_${qrCodeId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnDef<QRCodeData>[] = [
    {
      accessorKey: 'qrCodeId',
      header: 'QR Code ID'
    },
    {
      accessorKey: 'currencyCode',
      header: 'Currency Code'
    },
    {
      accessorKey: 'qrType',
      header: 'QR Type'
    },
    {
      accessorKey: 'qrCode',
      header: 'QR Code'
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const qrCodeData = row.original;

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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => downloadQRCode(qrCodeData.qrCodeBase64, qrCodeData.qrCodeId)}>
                Download QR Code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewQrCode(qrCodeData.qrCodeBase64)}>
                View QR Code
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DataTable columns={columns} data={data} searchKey="currencyCode" />
      {viewQrCode && (
        <Dialog open={Boolean(viewQrCode)} onOpenChange={() => setViewQrCode(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>QR Code</DialogTitle>
              <DialogDescription>Scan the QR code below.</DialogDescription>
            </DialogHeader>
            <div className="flex justify-center">
              <img src={`${viewQrCode}`} alt="QR Code" />
            </div>
            <DialogFooter>
              <Button onClick={() => setViewQrCode(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default QRCodeTable;
