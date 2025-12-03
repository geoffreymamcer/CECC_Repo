// src/components/DistanceMonitor.jsx
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Webcam from "react-webcam";
import { FiUserCheck, FiAlertCircle, FiLoader, FiUsers } from "react-icons/fi"; // Added FiUsers

const DistanceMonitor = forwardRef(({ onDistanceChange }, ref) => {
  const webcamRef = useRef(null);
  const [status, setStatus] = useState("Loading AI...");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useImperativeHandle(ref, () => ({
    captureSnapshot: () => {
      if (webcamRef.current) {
        // Capture low-res image to save bandwidth/DB space (320x240 is sufficient for verification)
        return webcamRef.current.getScreenshot({ width: 320, height: 240 });
      }
      return null;
    },
  }));

  const loadScript = (url) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${url}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = url;
      script.crossOrigin = "anonymous";
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    let faceDetection = null;
    let camera = null;

    const startFaceDetection = async () => {
      try {
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/face_detection.js"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
        );

        const FaceDetection = window.FaceDetection;
        const Camera = window.Camera;

        if (!FaceDetection || !Camera)
          throw new Error("MediaPipe globals not found");

        setIsScriptLoaded(true);

        faceDetection = new FaceDetection({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
        });

        faceDetection.setOptions({
          model: "short",
          minDetectionConfidence: 0.5,
        });

        faceDetection.onResults((results) => {
          // 1️⃣ START MODIFICATION: Check for Multiple Faces
          const faces = results.detections || [];

          if (faces.length === 0) {
            setStatus("NO_FACE");
            onDistanceChange(false, "NO_FACE");
            return;
          }

          if (faces.length > 1) {
            // Block test if more than 1 face is seen
            setStatus("MULTIPLE_FACES");
            onDistanceChange(false, "MULTIPLE_FACES");
            return;
          }
          // 1️⃣ END MODIFICATION

          // --- Standard Distance Logic (Single Face) ---
          const { width } = faces[0].boundingBox;

          let newStatus = "OK";
          let isCorrect = true;

          if (width > 0.35) {
            newStatus = "TOO_CLOSE";
            isCorrect = false;
          } else if (width < 0.1) {
            newStatus = "TOO_FAR";
            isCorrect = false;
          }

          setStatus(newStatus);
          onDistanceChange(isCorrect, newStatus);
        });

        if (webcamRef.current && webcamRef.current.video) {
          camera = new Camera(webcamRef.current.video, {
            onFrame: async () => {
              if (faceDetection && webcamRef.current?.video) {
                try {
                  await faceDetection.send({ image: webcamRef.current.video });
                } catch (e) {}
              }
            },
            width: 640,
            height: 480,
          });
          await camera.start();
        }
      } catch (error) {
        console.error("Camera/AI Error:", error);
        setStatus("ERROR");
      }
    };

    startFaceDetection();

    return () => {
      if (faceDetection) faceDetection.close();
      if (camera) camera.stop();
    };
  }, [onDistanceChange]);

  const getStatusUI = () => {
    switch (status) {
      case "OK":
        return (
          <span className="text-green-600 flex items-center gap-1">
            <FiUserCheck /> Distance Perfect
          </span>
        );
      case "TOO_CLOSE":
        return (
          <span className="text-red-600 flex items-center gap-1">
            <FiAlertCircle /> Move Back
          </span>
        );
      case "TOO_FAR":
        return (
          <span className="text-yellow-600 flex items-center gap-1">
            <FiAlertCircle /> Move Closer
          </span>
        );
      case "NO_FACE":
        return <span className="text-gray-500">No Face Detected</span>;
      // 2️⃣ START MODIFICATION: UI for Multiple Faces
      case "MULTIPLE_FACES":
        return (
          <span className="text-red-600 flex items-center gap-1">
            <FiUsers /> Multiple People!
          </span>
        );
      // 2️⃣ END MODIFICATION
      case "ERROR":
        return <span className="text-red-500">System Error</span>;
      default:
        return (
          <span className="text-gray-400 flex items-center gap-1">
            <FiLoader className="animate-spin" /> Calibrating...
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col items-center animate-fadeIn">
      <div className="relative w-32 h-24 bg-black rounded-lg overflow-hidden shadow-inner border border-gray-300">
        <Webcam
          ref={webcamRef}
          mirrored={true}
          screenshotFormat="image/jpeg"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          width={640}
          height={480}
        />
        {!isScriptLoaded && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <FiLoader className="text-white animate-spin w-6 h-6" />
          </div>
        )}
      </div>
      <div className="mt-2 text-xs font-bold uppercase tracking-wider bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100 whitespace-nowrap">
        {getStatusUI()}
      </div>
    </div>
  );
});

export default DistanceMonitor;
