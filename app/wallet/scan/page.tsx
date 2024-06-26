import BreadCrumb from '@/components/breadcrumb';

import { Heading } from '@/components/ui/heading';
import Scanner from '@/components/wallet/qr/scanner';
import { ScrollArea } from '@/components/ui/scroll-area';

const breadcrumbItems = [{ title: 'Scan QR', link: '/wallet/scan' }];
export default function page() {
    return (
        <>
          <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <BreadCrumb items={breadcrumbItems} />
                <div className="flex items-start justify-between">
                    <Heading title={`Scan QR`} description="Scan A QR To Make A Payments" />
                </div>
                <Scanner />
            </div>
            </ScrollArea>
        </>
    );
}
