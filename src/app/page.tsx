"use client";
import Image from "next/image";
import { useState } from "react";
import { useEffect, useRef } from "react";
import DotGrid from '../blocks/Backgrounds/DotGrid/DotGrid';
import { FaGlobe, FaFacebookF, FaInstagram, FaEnvelope } from "react-icons/fa";


function BlobsQRCode({ value, qrCodeRef, width = 206, height = 206, dotsColor = "#000", bgColor = "#fff", cornersColor = "#000" }: { value: string, qrCodeRef: React.MutableRefObject<any> | { current: null }, width?: number, height?: number, dotsColor?: string, bgColor?: string, cornersColor?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value || !ref.current) {
      if (ref.current) ref.current.innerHTML = "";
      return;
    }

    import("qr-code-styling").then(({ default: QRCodeStyling }) => {
      const qrCode = new QRCodeStyling({
        width,
        height,
        type: "canvas",
        data: value,
        dotsOptions: {
          type: "rounded",
          color: dotsColor,
        },
        backgroundOptions: {
          color: bgColor,
        },
        cornersSquareOptions: {
          type: "extra-rounded",
          color: cornersColor,
        },
        cornersDotOptions: {
          type: "dot",
          color: cornersColor,
        },
      });
      if (ref.current) {
        ref.current.innerHTML = "";
        qrCode.append(ref.current);
        // Always assign to qrCodeRef.current so the download button is enabled after style changes
        if (
          qrCodeRef &&
          typeof qrCodeRef === "object" &&
          Object.prototype.hasOwnProperty.call(qrCodeRef, "current")
        ) {
          qrCodeRef.current = qrCode; // Store instance for download
        }
      }
    });
  }, [value, dotsColor, bgColor, cornersColor, qrCodeRef, width, height]);

  return <div ref={ref} style={{ width, height }} />;
}

export default function Home() {
  // Sample QR code values
  const sampleQRCodes = [
    {
      label: "SVG Preview 1",
      value: "https://svg-preview.com/1",
      image: "/qr-preview-1.svg",
      color: "#F5F5F5",
      dotsColor: "#000000",
      bgColor: "#ffffff",
      cornersColor: "#000000"
    },
    {
      label: "SVG Preview 2",
      value: "https://svg-preview.com/2",
      image: "/qr-preview-2.svg",
      color: "#F5F5F5",
      dotsColor: "#1877f2",
      bgColor: "#ffffff",
      cornersColor: "#1877f2"
    },
    {
      label: "SVG Preview 3",
      value: "https://svg-preview.com/3",
      image: "/qr-preview-3.svg",
      color: "#F5F5F5",
      dotsColor: "#ffa000",
      bgColor: "#000000",
      cornersColor: "#ffcd4e"
    },
    {
      label: "SVG Preview 4",
      value: "https://svg-preview.com/4",
      image: "/qr-preview-4.svg",
      color: "#F5F5F5",
      dotsColor: "#7b1fa2",
      bgColor: "#ffffff",
      cornersColor: "#512da8"
    },
    {
      label: "SVG Preview 5",
      value: "https://svg-preview.com/5",
      image: "/qr-preview-5.svg",
      color: "#F5F5F5",
      dotsColor: "#ff7171",
      bgColor: "#000000",
      cornersColor: "#ff7171"
    }
  ];
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [selectedStyle, setSelectedStyle] = useState({ dotsColor: "#000", bgColor: "#fff", cornersColor: "#000" });
  const qrCodeRef = useRef<any>(null); // Ref to store the qr-code-styling instance
  const [sampleStart, setSampleStart] = useState(0); // For scrolling
  const visibleCount = 3;
  // Find the selected sample index
  const selectedSampleIdx = sampleQRCodes.findIndex(s => s.value === qrValue);

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
      setSelectedStyle({
        dotsColor: sampleQRCodes[0].dotsColor,
        bgColor: sampleQRCodes[0].bgColor,
        cornersColor: sampleQRCodes[0].cornersColor
      });
      setError("");
    } else {
      setError("Please enter a valid URL or plain text (no code or tags).");
    }
  }

  function QRCodeGenerator({ value }: { value: string }) {
    if (!value) return null;
    return (
      <div className="flex flex-col items-justify-center justify-center mt-6 animate-fade-in-down">
        <BlobsQRCode value={value} qrCodeRef={qrCodeRef} dotsColor={selectedStyle.dotsColor} bgColor={selectedStyle.bgColor} cornersColor={selectedStyle.cornersColor} />
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
          QR Code Generator.
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleGenerateQR();
                  }
                }}
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
            {qrValue && (
              <div className="transition-all duration-500 flex flex-col items-center opacity-100 translate-y-0">
                <div className="flex flex-row items-center gap-4">
                  {/* Main QR code */}
                  <div className="flex items-center justify-center">
                    <div style={{ borderRadius: 10, overflow: 'hidden', display: 'inline-block', padding: 10, background: selectedStyle.bgColor, border: `2px solid ${selectedStyle.bgColor}` }}>
                      <BlobsQRCode value={qrValue} qrCodeRef={qrCodeRef} dotsColor={selectedStyle.dotsColor} bgColor={selectedStyle.bgColor} cornersColor={selectedStyle.cornersColor} />
                    </div>
                  </div>
                  {/* Sample QR codes with scrollable stack and icons */}
                  <div className="flex flex-col gap-1 ml-4 items-center">
                    {/* Up arrow */}
                    <button
                      type="button"
                      className={`w-8 h-8 flex items-center justify-center transition-opacity ${sampleStart === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{ background: 'none', border: 'none', boxShadow: 'none', outline: 'none' }}
                      onClick={() => setSampleStart(s => Math.max(0, s - 1))}
                      disabled={sampleStart === 0}
                      aria-label="Scroll up"
                    >
                      <span style={{fontSize: 18, fontWeight: 'bold', color: '#fff', lineHeight: 1}}>▲</span>
                    </button>
                    {/* Sample QR codes (windowed) */}
                    <div className="flex flex-col items-center gap-3">
                      {sampleQRCodes.slice(sampleStart, sampleStart + visibleCount).map((sample, idx) => {
                        const globalIdx = sampleStart + idx;
                        const isSelected = globalIdx === selectedSampleIdx;
                        return (
                          <button
                            key={globalIdx}
                            type="button"
                            className={`relative border rounded-lg flex flex-col items-center justify-center gap-2 p-3 transition-colors shadow-sm cursor-pointer ${isSelected ? 'border-green-500 ring-2 ring-green-300' : 'border-gray-200'} bg-white`}
                            style={{ width: 48, height: 48 }}
                            title={sample.label}
                            onClick={() => {
                              setSelectedStyle({
                                dotsColor: sample.dotsColor,
                                bgColor: sample.bgColor,
                                cornersColor: sample.cornersColor
                              });
                            }}
                          >
                            {/* Small QR code thumbnail */}
                            <div style={{overflow: 'hidden', display: 'inline-block' }}>
                              <BlobsQRCode value={sample.value} qrCodeRef={{ current: null }} width={48} height={48} />
                            </div>
                            {/* Overlay icon */}
                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              {sample.image ? (
                                <img
                                  src={sample.image}
                                  alt={sample.label}
                                  className="w-10 h-10"
                                  style={{ borderRadius: 0 }}
                                />
                              ) : (
                                <BlobsQRCode value={sample.value} qrCodeRef={{ current: null }} width={64} height={64} />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {/* Down arrow */}
                    <button
                      type="button"
                      className={`w-8 h-8 flex items-center justify-center transition-opacity ${sampleStart + visibleCount >= sampleQRCodes.length ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{ background: 'none', border: 'none', boxShadow: 'none', outline: 'none' }}
                      onClick={() => setSampleStart(s => Math.min(sampleQRCodes.length - visibleCount, s + 1))}
                      disabled={sampleStart + visibleCount >= sampleQRCodes.length}
                      aria-label="Scroll down"
                    >
                      <span style={{fontSize: 18, fontWeight: 'bold', color: '#fff', lineHeight: 1}}>▼</span>
                    </button>
                  </div>
                </div>
                {/* Place the scan text below both for symmetry */}
                <span className="mt-2 text-sm text-gray-500">Scan this QR code</span>
              </div>
            )}
            <div className="flex gap-4 items-center flex-col sm:flex-row">
              <button
                type="button"
                className={`rounded-full border border-solid border-transparent cursor-pointer transition-colors flex items-center justify-center bg-foreground text-background gap-2 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto ${(!qrValue || !qrCodeRef.current) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#383838] dark:hover:bg-[#ccc]'}`}
                onClick={() => {
                  if (qrCodeRef.current && qrValue) {
                    qrCodeRef.current.download({ name: "qr-code", extension: "png" });
                  }
                }}
                disabled={!qrValue || !qrCodeRef.current}
              >
                Download as PNG
              </button>
              <button
                type="button"
                className="rounded-full bg-[#0a0a0a] cursor-pointer border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
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
