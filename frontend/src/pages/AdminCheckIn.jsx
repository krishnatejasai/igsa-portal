import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import AdminLayout from "../components/AdminLayout";
import API_BASE_URL from "../config/api";

function AdminCheckIn() {
  const [qrCode, setQrCode] = useState("");
  const [result, setResult] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [scanningMessage, setScanningMessage] = useState("");

  const scannerRef = useRef(null);

  const markAttendance = async (code) => {
    if (!code.trim()) {
      alert("Please enter or scan a QR code.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/registrations/check-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("igsaAdminToken")}`,
        },
        body: JSON.stringify({
          qrCode: code.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Check-in failed.");
        setResult(data.registration || null);
        return;
      }

      setResult(data.registration);
      setQrCode("");
      setScanningMessage("Attendance marked successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to mark attendance.");
    }
  };

  const handleManualCheckIn = () => {
    markAttendance(qrCode);
  };

  useEffect(() => {
  if (!scannerActive) return;

  const startCamera = async () => {
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      const cameras = await Html5Qrcode.getCameras();

      if (!cameras || cameras.length === 0) {
        alert("No camera found.");
        return;
      }

      await html5QrCode.start(
        cameras[0].id,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          setScanningMessage("QR scanned. Marking attendance...");
          await markAttendance(decodedText);

          await html5QrCode.stop();
          html5QrCode.clear();
          scannerRef.current = null;
          setScannerActive(false);
        },
        () => {}
      );
    } catch (error) {
      console.error(error);
      alert("Camera permission denied or camera not available.");
      setScannerActive(false);
    }
  };

  startCamera();

  return () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current.clear();
      scannerRef.current = null;
    }
  };
}, [scannerActive]);

  const startScanner = () => {
    setResult(null);
    setScanningMessage("");
    setScannerActive(true);
  };

  const stopScanner = async () => {
  if (scannerRef.current) {
    await scannerRef.current.stop().catch(() => {});
    scannerRef.current.clear();
    scannerRef.current = null;
  }

  setScannerActive(false);
};

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-blue-950">
          QR Check-In
        </h1>

        <p className="text-slate-600 mt-2">
          Scan or enter a student's QR code to mark event attendance.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-blue-950 mb-6">
            Camera Scanner
          </h2>

          {!scannerActive ? (
            <button
              onClick={startScanner}
              className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700"
            >
              Start Camera Scanner
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="bg-red-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-600 mb-5"
            >
              Stop Scanner
            </button>
          )}

          {scannerActive && (
            <div className="mt-6">
              <div
                id="qr-reader"
                className="w-full max-w-md border border-slate-300 rounded-2xl overflow-hidden"
              ></div>
            </div>
          )}

          {scanningMessage && (
            <p className="text-sm text-green-600 font-semibold mt-4">
              {scanningMessage}
            </p>
          )}

          <div className="border-t border-slate-200 my-8"></div>

          <h2 className="text-2xl font-bold text-blue-950 mb-4">
            Manual Check-In
          </h2>

          <input
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
            placeholder="Paste QR code here"
            className="w-full border border-slate-300 p-4 rounded-xl mb-5"
          />

          <button
            onClick={handleManualCheckIn}
            className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600"
          >
            Mark Attendance
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-blue-950 mb-6">
            Check-In Result
          </h2>

          {!result ? (
            <p className="text-slate-500">
              Student details will appear here after check-in.
            </p>
          ) : (
            <div className="space-y-3">
              <p>
                <span className="font-semibold">Name:</span> {result.name}
              </p>

              <p>
                <span className="font-semibold">Email:</span> {result.email}
              </p>

              <p>
                <span className="font-semibold">Event:</span>{" "}
                {result.eventTitle}
              </p>

              <p>
                <span className="font-semibold">UFID:</span> {result.ufid}
              </p>

              <p>
                <span className="font-semibold">Program:</span>{" "}
                {result.program}
              </p>

              <p>
                <span className="font-semibold">Status:</span>{" "}
                {result.checkedIn ? (
                  <span className="text-green-600 font-bold">Checked In</span>
                ) : (
                  <span className="text-orange-600 font-bold">
                    Not Checked In
                  </span>
                )}
              </p>

              {result.checkedInAt && (
                <p>
                  <span className="font-semibold">Checked In At:</span>{" "}
                  {new Date(result.checkedInAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminCheckIn;