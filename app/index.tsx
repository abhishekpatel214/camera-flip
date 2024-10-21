import React, { useEffect, useState } from "react";
import { Text, View, Button, Platform } from "react-native";
import { Html5Qrcode } from "html5-qrcode";

export default function Index() {
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const [isBackCamera, setIsBackCamera] = useState(true); // State for camera direction

  useEffect(() => {
    if (Platform.OS === 'web') {
      const qrCodeInstance = new Html5Qrcode("reader");
      setHtml5QrCode(qrCodeInstance);

      const qrCodeSuccessCallback = (decodedText: string, decodedResult: any) => {
        console.log(`Code scanned = ${decodedText}`, decodedResult);
        alert(`Scanned Barcode: ${decodedText}`);
      };

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      // Start the scanner with the default camera
      startScanner(qrCodeInstance, isBackCamera, qrCodeSuccessCallback, config);

      // Cleanup on component unmount
      return () => {
        qrCodeInstance.stop().catch((err) => console.error("Error stopping scanner", err));
      };
    }
  }, []);

  const startScanner = (qrCodeInstance: Html5Qrcode, useBackCamera: boolean, qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void, config: any) => {
    qrCodeInstance
      .start(
        { facingMode: useBackCamera ? "environment" : "user" }, // Use back camera or front camera
        config,
        qrCodeSuccessCallback
      )
      .catch((err) => {
        console.error("Camera initialization failed", err);
      });
  };

  const toggleCamera = () => {
    if (html5QrCode) {
      // Stop the current scanner
      html5QrCode.stop().then(() => {
        // Toggle camera direction
        setIsBackCamera((prev) => !prev);
        // Restart the scanner with the new camera direction
        startScanner(html5QrCode, !isBackCamera, (decodedText, decodedResult) => {
          console.log(`Code scanned = ${decodedText}`, decodedResult);
          alert(`Scanned Barcode: ${decodedText}`);
        }, { fps: 10, qrbox: { width: 250, height: 250 } });
      }).catch((err) => console.error("Error stopping scanner", err));
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>

      {/* Web-specific barcode scanner view */}
      {Platform.OS === 'web' && (
        <div id="reader" style={{ width: '300px', height: '300px' }}></div>
      )}

      {/* Camera flip button */}
      {Platform.OS === 'web' && (
        <Button
          title={`Switch to ${isBackCamera ? "Front" : "Back"} Camera`}
          onPress={toggleCamera}
        />
      )}

      {/* For mobile platforms, show this message */}
      {Platform.OS !== 'web' && (
        <Text>Barcode scanning is only available on web.</Text>
      )}
    </View>
  );
}
