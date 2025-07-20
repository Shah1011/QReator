"use client";
import Image from "next/image";
import { useState } from "react";
import { useEffect, useRef } from "react";
import DotGrid from '../blocks/Backgrounds/DotGrid/DotGrid';


function BlobsQRCode({ value, qrCodeRef }: { value: string, qrCodeRef: React.MutableRefObject<any> }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value || !ref.current) {
      if (ref.current) ref.current.innerHTML = "";
      return;
    }

    // Dynamically import qr-code-styling on the client
    import("qr-code-styling").then(({ default: QRCodeStyling }) => {
      const qrCode = new QRCodeStyling({
        width: 192,
        height: 192,
        type: "canvas",
        data: value,
        dotsOptions: {
          type: "rounded",
          color: "#000",
        },
        backgroundOptions: {
          color: "#fff",
        },
        cornersSquareOptions: {
          type: "extra-rounded",
          color: "#000",
        },
        cornersDotOptions: {
          type: "dot",
          color: "#000",
        },
      });
      if (ref.current) {
        ref.current.innerHTML = "";
        qrCode.append(ref.current);
        qrCodeRef.current = qrCode; // Store instance for download
      }
    });
  }, [value, qrCodeRef]);

  return <div ref={ref} />;
}

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [qrValue, setQrValue] = useState("");
  const qrCodeRef = useRef<any>(null); // Ref to store the qr-code-styling instance

  function isValidInput(value: string) {
    // Allow plain text (letters, numbers, spaces, punctuation) or valid URLs
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/i;
    // Accept if it's a valid URL or just plain text (no script tags, no angle brackets)
    const plainTextPattern = /^[^<>]+$/;
    return urlPattern.test(value) || plainTextPattern.test(value);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value === "" || isValidInput(value)) {
      setInputValue(value);
      setError("");
    } else {
      setError("Please enter a valid URL or plain text (no code or tags).");
    }
  }

  function handleGenerateQR() {
    if (inputValue && isValidInput(inputValue)) {
      setQrValue(inputValue);
      setError("");
    } else {
      setError("Please enter a valid URL or plain text (no code or tags).");
    }
  }

  function QRCodeGenerator({ value }: { value: string }) {
    if (!value) return null;
    return (
      <div className="flex flex-col items-justify-center justify-center mt-6 animate-fade-in-down">
        <BlobsQRCode value={value} qrCodeRef={qrCodeRef} />
        <span className="mt-2 text-sm text-gray-500">Scan this QR code</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <DotGrid
          dotSize={10}
          gap={15}
          baseColor="#0f0f0f"
          activeColor="#b8b2b2"
          proximity={60}
          shockRadius={290}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>
      <div className="relative z-10 font-sans min-h-screen flex flex-col">
        <h1 style={{ fontFamily: 'BitcountPropSingle_SemiBold' }} className="text-5xl mt-6 p-8 text-center">
          The QR Code Generator.
        </h1>
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-6 w-full max-w-md">
            <div className={`flex items-center w-full transition-transform duration-500 ${qrValue ? "-translate-y-2" : ""}`}>
              <input
                type="text"
                placeholder="Enter link or text to generate QR code"
                className="px-4 py-2 flex-1 rounded-l-lg bg-[#0a0a0a] border border-gray-300 focus:outline-none text-lg"
                value={inputValue}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="bg-white border border-gray-300 rounded-r-lg px-4 py-2 text-lg shadow-sm hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Submit"
                onClick={handleGenerateQR}
              >
                <span className="text-xl text-black">↑</span>
              </button>
            </div>
            {error && (
              <div className="text-red-500 mt-2 text-sm">{error}</div>
            )}
            <div className={`transition-all duration-500 flex flex-col items-center ${qrValue ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}>
              <BlobsQRCode value={qrValue} qrCodeRef={qrCodeRef} />
              <span className="mt-2 text-sm text-gray-500">Scan this QR code</span>
            </div>
            <div className="flex gap-4 items-center flex-col sm:flex-row">
              <button
                type="button"
                className={`rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto ${!qrValue ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#383838] dark:hover:bg-[#ccc]'}`}
                onClick={() => {
                  if (qrCodeRef.current && qrValue) {
                    qrCodeRef.current.download({ name: "qr-code", extension: "png" });
                  }
                }}
                disabled={!qrValue}
              >
                Download as PNG
              </button>
              <button
                type="button"
                className="rounded-full bg-[#0a0a0a] border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
                onClick={() => {
                  setInputValue("");
                  setQrValue("");
                  setError("");
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </main>
        <footer className="w-full flex gap-[24px] flex-wrap items-center justify-center py-4 mt-auto bg-transparent">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://iamshah.blog"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            iamshah.blog
          </a>
        </footer>
      </div>
    </div>
  );
}
