"use client";
import { FC } from "react";
import QRCode from "qrcode.react";

const QRCodeGenerator: FC<{ value: string }> = ({ value }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col items-center mt-6">
      <QRCode value={value} size={192} />
      <span className="mt-2 text-sm text-gray-500">Scan this QR code</span>
    </div>
  );
};

export default QRCodeGenerator; 