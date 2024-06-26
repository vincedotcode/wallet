
export default function Component() {
    return (
      <div className="flex flex-column items-center justify-center h-full w-full">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-row items-center justify-center">
            <h5 className="text-lg font-bold">Share QR Code</h5>
            <img src={"https://cdn.ttgtmedia.com/rms/misc/qr_code_barcode.jpg"} width={200} height={200} alt="QR Code" className="mb-4" />
          </div>
        </div>
      </div>
    )
  }