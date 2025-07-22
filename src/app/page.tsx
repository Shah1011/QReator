"use client";
import Image from "next/image";
import { useState } from "react";
import { useEffect, useRef } from "react";
import DotGrid from "../blocks/Backgrounds/DotGrid/DotGrid";

function BlobsQRCode({
  value,
  qrCodeRef,
  width = 206,
  height = 206,
  dotsColor = "#000",
  bgColor = "#fff",
  cornersColor = "#000",
  image,
  onReady,
}: {
  value: string;
  qrCodeRef: React.MutableRefObject<any> | { current: null };
  width?: number;
  height?: number;
  dotsColor?: string;
  bgColor?: string;
  cornersColor?: string;
  image?: string | undefined;
  onReady?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value || !ref.current) {
      if (ref.current) ref.current.innerHTML = "";
      return;
    }

    import("qr-code-styling").then(({ default: QRCodeStyling }) => {
      const qrCodeOptions: any = {
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
      };
      if (typeof image === "string" && image.length > 0) {
        qrCodeOptions.image = image;
        qrCodeOptions.imageOptions = {
          margin: 8,
          hideBackgroundDots: true,
          imageSize: 0.4,
        };
      }
      const qrCode = new QRCodeStyling(qrCodeOptions);
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
          if (onReady) onReady();
        }
      }
    });
  }, [
    value,
    dotsColor,
    bgColor,
    cornersColor,
    qrCodeRef,
    width,
    height,
    image,
  ]);

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
      cornersColor: "#000000",
    },
    {
      label: "SVG Preview 2",
      value: "https://svg-preview.com/2",
      image: "/qr-preview-2.svg",
      color: "#F5F5F5",
      dotsColor: "#1877f2",
      bgColor: "#ffffff",
      cornersColor: "#1877f2",
    },
    {
      label: "SVG Preview 3",
      value: "https://svg-preview.com/3",
      image: "/qr-preview-3.svg",
      color: "#F5F5F5",
      dotsColor: "#ffa000",
      bgColor: "#000000",
      cornersColor: "#ffcd4e",
    },
    {
      label: "SVG Preview 4",
      value: "https://svg-preview.com/4",
      image: "/qr-preview-4.svg",
      color: "#F5F5F5",
      dotsColor: "#7b1fa2",
      bgColor: "#ffffff",
      cornersColor: "#512da8",
    },
    {
      label: "SVG Preview 5",
      value: "https://svg-preview.com/5",
      image: "/qr-preview-5.svg",
      color: "#F5F5F5",
      dotsColor: "#ff7171",
      bgColor: "#000000",
      cornersColor: "#ff7171",
    },
  ];
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [selectedStyle, setSelectedStyle] = useState({
    dotsColor: "#000",
    bgColor: "#fff",
    cornersColor: "#000",
  });
  const qrCodeRef = useRef<any>(null); // Ref to store the qr-code-styling instance

  const [showLogo, setShowLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  // Find the selected sample index
  const selectedSampleIdx = sampleQRCodes.findIndex((s) => s.value === qrValue);
  const [qrReady, setQrReady] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Always allow scrolling with the arrows if there are more than 3 previews
  const scrollStackBy = (amount: number) => {
    const el = stackRef.current;
    if (el) {
      el.scrollBy({ top: amount, behavior: "smooth" });
    }
  };

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
      setQrReady(false);
      setQrValue(inputValue);
      setSelectedStyle({
        dotsColor: sampleQRCodes[0].dotsColor,
        bgColor: sampleQRCodes[0].bgColor,
        cornersColor: sampleQRCodes[0].cornersColor,
      });
      setError("");
    } else {
      setError("Please enter a valid URL or plain text (no code or tags).");
    }
  }

  const copyQRToClipboard = async () => {
    console.log("Copy button clicked!");
    console.log("qrCodeRef.current:", qrCodeRef.current);
    console.log("qrValue:", qrValue);

    if (!qrCodeRef.current || !qrValue) {
      console.log("Early return - no qrCodeRef or qrValue");
      return;
    }

    try {
      // Try different ways to access the canvas
      let canvas = qrCodeRef.current._canvas;
      console.log("Canvas from _canvas:", canvas);

      if (!canvas) {
        // Try to find canvas in the DOM
        const qrContainer = document.querySelector('[style*="width: 206px"]');
        canvas = qrContainer?.querySelector("canvas");
        console.log("Canvas from DOM:", canvas);
      }

      if (!canvas) {
        console.log("No canvas found, trying getRawData");
        // Alternative: try to get raw data and create our own canvas
        try {
          const dataUrl = await qrCodeRef.current.getRawData("png");
          console.log("Got raw data:", dataUrl ? "yes" : "no");

          if (dataUrl) {
            // Convert data URL to blob
            const response = await fetch(dataUrl);
            const blob = await response.blob();

            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
            setToastMessage("QR copied!");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            return;
          }
        } catch (rawDataErr) {
          console.error("getRawData failed:", rawDataErr);
        }
      }

      if (canvas) {
        console.log("Found canvas, converting to blob");
        // Convert canvas to blob
        canvas.toBlob(async (blob: Blob | null) => {
          console.log("Blob created:", blob ? "yes" : "no");
          if (blob) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
              ]);
              console.log("Successfully copied to clipboard");
              setToastMessage("QR copied!");
              setShowToast(true);
              setTimeout(() => setShowToast(false), 2000);
            } catch (err) {
              console.error("Failed to copy QR code:", err);
              setToastMessage("Copy failed!");
              setShowToast(true);
              setTimeout(() => setShowToast(false), 2000);
            }
          } else {
            console.log("No blob created");
            setToastMessage("Copy failed - no image data!");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
          }
        }, "image/png");
      } else {
        console.log("No canvas found at all");
        setToastMessage("Copy failed - no canvas!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy QR code:", err);
      setToastMessage("Copy failed!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

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
        <h1
          style={{ fontFamily: "BitcountPropSingle_SemiBold" }}
          className="text-3xl sm:text-4xl md:text-5xl mt-4 sm:mt-6 p-4 sm:p-6 md:p-8 text-center"
        >
          QReator.
        </h1>
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
          <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-sm sm:max-w-md md:max-w-lg">
            <div
              className={`flex items-center w-full transition-transform duration-500 ${
                qrValue ? "-translate-y-2" : ""
              }`}
            >
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
            {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
            {qrValue && (
              <div className="transition-all duration-500 flex flex-col items-center opacity-100 translate-y-0">
                <div className="flex flex-row items-center gap-4">
                  {/* Vertical toggle switch and logo upload */}
                  <div className="flex flex-col items-center mr-2 p-4">
                    <label
                      htmlFor="hs-basic-usage"
                      className="relative inline-block w-11 h-6 cursor-pointer"
                      style={{ transform: "rotate(90deg)" }}
                    >
                      <input
                        type="checkbox"
                        id="hs-basic-usage"
                        className="peer sr-only"
                        checked={showLogo}
                        onChange={(e) => {
                          setShowLogo(e.target.checked);
                          if (!e.target.checked) setLogoUrl(null);
                        }}
                      />
                      <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-[#e5e7eb] peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
                      <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-5 bg-[#0a0a0a] rounded-full shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full"></span>
                    </label>
                    <span className="mt-6" style={{ fontSize: 12 }}>
                      Logo
                    </span>
                  </div>
                  {/* Main QR code */}
                  <div className="flex items-center justify-center relative">
                    {/* Plus icon for logo upload - centered */}
                    {showLogo && !logoUrl && (
                      <>
                        <button
                          type="button"
                          title="Add New"
                          onClick={() =>
                            document
                              .getElementById("logo-upload-input")
                              ?.click()
                          }
                          className="group cursor-pointer outline-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:rotate-90 duration-300 z-20 bg-[#212121] rounded-full w-14 h-14 flex items-center justify-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40px"
                            height="40px"
                            viewBox="0 0 24 24"
                            className="stroke-zinc-400 fill-none group-hover:fill-zinc-800 group-active:stroke-zinc-200 group-active:fill-zinc-600 group-active:duration-0 duration-300"
                          >
                            <path
                              d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                              strokeWidth="1.5"
                            ></path>
                            <path d="M8 12H16" strokeWidth="1.5"></path>
                            <path d="M12 16V8" strokeWidth="1.5"></path>
                          </svg>
                        </button>
                        <input
                          id="logo-upload-input"
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) =>
                                setLogoUrl(ev.target?.result as string);
                              reader.readAsDataURL(file);
                            } else {
                              setLogoUrl(null);
                            }
                          }}
                        />
                      </>
                    )}
                    <div
                      className="relative group"
                      style={{
                        borderRadius: 10,
                        overflow: "hidden",
                        display: "inline-block",
                        padding: 10,
                        background: selectedStyle.bgColor,
                        border: `2px solid ${selectedStyle.bgColor}`,
                      }}
                    >
                      <BlobsQRCode
                        value={qrValue}
                        qrCodeRef={qrCodeRef}
                        dotsColor={selectedStyle.dotsColor}
                        bgColor={selectedStyle.bgColor}
                        cornersColor={selectedStyle.cornersColor}
                        image={
                          showLogo &&
                          typeof logoUrl === "string" &&
                          logoUrl.length > 0
                            ? logoUrl
                            : undefined
                        }
                        onReady={() => setQrReady(true)}
                      />

                      {/* Copy overlay - only visible on hover */}
                      <div
                        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer bg-black/50 rounded-full p-2 hover:bg-black/70"
                        onClick={copyQRToClipboard}
                      >
                        <img
                          src="/copy.svg"
                          alt="Copy QR Code"
                          className="w-5 h-5 invert"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Sample QR codes with scrollable stack and icons */}
                  <div className="flex flex-col gap-1 ml-8 items-center">
                    {/* Up arrow */}
                    <button
                      type="button"
                      className={`w-8 h-8 flex items-center justify-center cursor-pointer`}
                      style={{
                        background: "none",
                        border: "none",
                        boxShadow: "none",
                        outline: "none",
                      }}
                      onClick={() => scrollStackBy(-60)}
                      disabled={sampleQRCodes.length <= 3}
                      aria-label="Scroll up"
                    >
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "#fff",
                          lineHeight: 1,
                        }}
                      >
                        ▲
                      </span>
                    </button>
                    {/* Sample QR codes (windowed) */}
                    <div
                      ref={stackRef}
                      className="relative h-[168px] overflow-y-auto scrollbar-hide w-full flex flex-col items-center"
                    >
                      <div className="flex flex-col gap-3">
                        {sampleQRCodes.map((sample, globalIdx) => {
                          const isSelected = globalIdx === selectedSampleIdx;
                          return (
                            <button
                              key={globalIdx}
                              type="button"
                              className={`relative border rounded-lg flex flex-col items-center justify-center gap-2 p-3 transition-colors shadow-sm cursor-pointer ${
                                isSelected
                                  ? "border-green-500 ring-2 ring-green-300"
                                  : "border-gray-200"
                              } bg-white`}
                              style={{ width: 48, height: 48 }}
                              title={sample.label}
                              onClick={() => {
                                setSelectedStyle({
                                  dotsColor: sample.dotsColor,
                                  bgColor: sample.bgColor,
                                  cornersColor: sample.cornersColor,
                                });
                              }}
                            >
                              {/* Small QR code thumbnail */}
                              <div
                                style={{
                                  overflow: "hidden",
                                  display: "inline-block",
                                }}
                              >
                                <BlobsQRCode
                                  value={sample.value}
                                  qrCodeRef={{ current: null }}
                                  width={48}
                                  height={48}
                                />
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
                                  <BlobsQRCode
                                    value={sample.value}
                                    qrCodeRef={{ current: null }}
                                    width={64}
                                    height={64}
                                  />
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {/* Down arrow */}
                    <button
                      type="button"
                      className={`w-8 h-8 flex items-center justify-center cursor-pointer`}
                      style={{
                        background: "none",
                        border: "none",
                        boxShadow: "none",
                        outline: "none",
                      }}
                      onClick={() => scrollStackBy(60)}
                      disabled={sampleQRCodes.length <= 3}
                      aria-label="Scroll down"
                    >
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "#fff",
                          lineHeight: 1,
                        }}
                      >
                        ▼
                      </span>
                    </button>
                  </div>
                </div>
                {/* Place the scan text below both for symmetry */}
                <span className="mt-2 text-sm text-gray-500">
                  Scan this QR code
                </span>
              </div>
            )}
            <div className="flex gap-4 items-center flex-col sm:flex-row">
              <button
                type="button"
                className={`rounded-full border border-solid border-transparent cursor-pointer transition-colors flex items-center justify-center bg-foreground text-background gap-2 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-1/2 ${
                  !qrValue || !qrReady
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#383838] dark:hover:bg-[#ccc]"
                }`}
                onClick={() => {
                  if (qrCodeRef.current && qrValue) {
                    qrCodeRef.current.download({
                      name: "qr-code",
                      extension: "png",
                    });
                  }
                }}
                disabled={!qrValue || !qrReady}
              >
                Download
                <img
                  src="/download.svg"
                  alt="Download"
                  className="w-5 h-5 ml-1"
                />
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

        {/* Toast Notification - positioned absolutely to not affect layout */}
        <div className="relative h-0 flex justify-center">
          {showToast && (
            <div className="absolute -top-11 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-down z-50">
              {toastMessage}
            </div>
          )}
        </div>

        <footer className="w-full flex gap-[24px] flex-wrap items-center justify-center py-4 bg-transparent">
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

      {/* Hide scrollbar utility for Tailwind */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
