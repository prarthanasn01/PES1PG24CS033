// // import React, { useRef, useEffect, useState } from 'react';
// // import Webcam from 'react-webcam';
// // import * as THREE from 'three';
// // import * as tf from '@tensorflow/tfjs-core';
// // import '@tensorflow/tfjs-converter';
// // import '@tensorflow/tfjs-backend-webgl';
// // import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

// // const VirtualTryOn = (props) => {
// //   const glassesSrc = props.uri;
// //   const webcamRef = useRef(null);
// //   const canvasRef = useRef(null);
// //   const [model, setModel] = useState(null);
// //   const [glassesMesh, setGlassesMesh] = useState(null);
// //   const [isLoading, setIsLoading] = useState(true);

// //   useEffect(() => {
// //     const loadResources = async () => {
// //       try {
// //         // Camera Access
// //         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
// //         if (webcamRef.current) {
// //           webcamRef.current.srcObject = stream;
// //         }

// //         // TensorFlow Model
// //         await tf.setBackend('webgl');
// //         const loadedModel = await faceLandmarksDetection.load(
// //           faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
// //           { shouldLoadIrisModel: true,
// //             maxFaces: 1,
// //             // returnTensors: false,
// //             // predictIrises: false 
// //         }
// //         );
// //         setModel(loadedModel);

// //         // Three.js Setup
// //         const width = canvasRef.current.clientWidth;
// //         const height = canvasRef.current.clientHeight;
// //         const scene = new THREE.Scene();
// //         const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
// //         camera.position.z = 5;
// //         const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
// //         renderer.setSize(width, height);
// //         renderer.setAnimationLoop(() => renderer.render(scene, camera));

// //         // Glasses Mesh
// //         const textureLoader = new THREE.TextureLoader();
// //         textureLoader.load(glassesSrc, (texture) => {
// //           texture.colorSpace = THREE.SRGBColorSpace;
// //           const geometry = new THREE.PlaneGeometry(2, 1);
// //           const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
// //           const glasses = new THREE.Mesh(geometry, material);
// //           scene.add(glasses);
// //           setGlassesMesh(glasses);
// //         });
// //       } catch (error) {
// //         console.error("Initialization error:", error);
// //         setIsLoading(false);
// //       }
// //     };

// //     loadResources();
// //   }, []);

// //   useEffect(() => {
// //     const detectAndPositionGlasses = async () => {
// //       if (!webcamRef.current || !model || !glassesMesh) return;
// //       const video = webcamRef.current.video;
// //       if (video.readyState !== 4) return;

// //       const faceEstimates = await model.estimateFaces({input: video});
// //       if (faceEstimates.length > 0) {
// //         setIsLoading(false);
// //         // Face mesh keypoints
// //         const keypoints = faceEstimates[0].scaledMesh;
// //         const leftEye = keypoints[130];
// //         const rightEye = keypoints[359];
// //         const eyeCenter = keypoints[168];

// //         // Eye distance for glasses scaling
// //         const eyeDistance = Math.sqrt(Math.pow(rightEye[0] - leftEye[0], 2) + Math.pow(rightEye[1] - leftEye[1], 2));
// //         const scaleMultiplier = eyeDistance / 140;

// //         // Glasses scaling and offset values
// //         const scaleX = -0.01;
// //         const scaleY = -0.01;
// //         const offsetX = 0.00;
// //         const offsetY = -0.01;

// //         // Glasses positioning
// //         glassesMesh.position.x = (eyeCenter[0] - video.videoWidth / 2) * scaleX + offsetX;
// //         glassesMesh.position.y = (eyeCenter[1] - video.videoHeight / 2) * scaleY + offsetY;
// //         glassesMesh.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);
// //         glassesMesh.position.z = 1;

// //         // Rotate glasses to align with eyes - rotation depth
// //         const eyeLine = new THREE.Vector2(rightEye[0] - leftEye[0], rightEye[1] - leftEye[1]);
// //         const rotationZ = Math.atan2(eyeLine.y, eyeLine.x);
// //         glassesMesh.rotation.z = rotationZ;
// //       }
// //     };

// //     // Run detection and positioning every 120ms
// //     const intervalId = setInterval(() => {
// //       detectAndPositionGlasses();
// //     }, 120);

// //     return () => clearInterval(intervalId);
// //   }, [model, glassesMesh]);

// //   return (
// //     <>
// //     <div style={{ position: 'relative', margin:'0 auto', width: '500px', height: '500px' }}>
// //         {isLoading && (
// //           <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
// //             <h3>Loading...</h3>
// //           </div>
// //         )}
// //       <Webcam ref={webcamRef} autoPlay playsInline style={{ width: '500px', height: '500px' }} mirrored={true} />
// //       <canvas ref={canvasRef} style={{ width: '500px', height: '500px', position: 'absolute', top: 0, left: 0 }} />
// //     </div>
// //     </>
// //   );
// // };

// // export default VirtualTryOn;


// import React, { useRef, useEffect, useState } from 'react';
// import Webcam from 'react-webcam';
// import * as THREE from 'three';
// import * as tf from '@tensorflow/tfjs-core';
// import '@tensorflow/tfjs-converter';
// import '@tensorflow/tfjs-backend-webgl';
// import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

// const VirtualTryOn = ({ uri: glassesSrc, tintColor }) => {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [model, setModel] = useState(null);
//   const [glassesMesh, setGlassesMesh] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const sceneRef = useRef(null);

//   useEffect(() => {
//     const initialize = async () => {
//       try {
//         // Start camera
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (webcamRef.current) {
//           webcamRef.current.srcObject = stream;
//         }

//         // Load model
//         await tf.setBackend('webgl');
//         const loadedModel = await faceLandmarksDetection.load(
//           faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
//           { shouldLoadIrisModel: true, maxFaces: 1 }
//         );
//         setModel(loadedModel);

//         // Setup Three.js scene
//         const width = canvasRef.current.clientWidth;
//         const height = canvasRef.current.clientHeight;
//         const scene = new THREE.Scene();
//         sceneRef.current = scene;

//         const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
//         camera.position.z = 5;

//         const renderer = new THREE.WebGLRenderer({
//           canvas: canvasRef.current,
//           alpha: true,
//         });
//         renderer.setSize(width, height);
//         renderer.setAnimationLoop(() => renderer.render(scene, camera));

//         // Load and add glasses
//         const textureLoader = new THREE.TextureLoader();
//         textureLoader.load(glassesSrc, (texture) => {
//           texture.colorSpace = THREE.SRGBColorSpace;
//           const geometry = new THREE.PlaneGeometry(2, 1);
//           const material = new THREE.MeshBasicMaterial({
//             map: texture,
//             transparent: true,
//             color: tintColor || 0xffffff,
//           });
//           const mesh = new THREE.Mesh(geometry, material);
//           scene.add(mesh);
//           setGlassesMesh(mesh);
//         });
//       } catch (err) {
//         console.error("Initialization failed:", err);
//         setIsLoading(false);
//       }
//     };

//     initialize();
//   }, [glassesSrc]);

//   // Update tintColor live
//   useEffect(() => {
//     if (glassesMesh?.material && tintColor) {
//       glassesMesh.material.color.set(tintColor);
//     }
//   }, [tintColor, glassesMesh]);

//   // Face tracking & positioning
//   useEffect(() => {
//     const updateGlasses = async () => {
//       if (!webcamRef.current || !model || !glassesMesh) return;
//       const video = webcamRef.current.video;
//       if (video.readyState !== 4) return;

//       const faces = await model.estimateFaces({ input: video });
//       if (faces.length > 0) {
//         setIsLoading(false);
//         const keypoints = faces[0].scaledMesh;
//         const leftEye = keypoints[130];
//         const rightEye = keypoints[359];
//         const eyeCenter = keypoints[168];

//         // Distance & scaling
//         const eyeDistance = Math.hypot(
//           rightEye[0] - leftEye[0],
//           rightEye[1] - leftEye[1]
//         );
//         const scale = eyeDistance / 140;

//         // Positioning
//         const scaleX = -0.01;
//         const scaleY = -0.01;
//         glassesMesh.position.x =
//           (eyeCenter[0] - video.videoWidth / 2) * scaleX;
//         glassesMesh.position.y =
//           (eyeCenter[1] - video.videoHeight / 2) * scaleY;
//         glassesMesh.position.z = 1;
//         glassesMesh.scale.set(scale, scale, scale);

//         // Rotation
//         const eyeLine = new THREE.Vector2(
//           rightEye[0] - leftEye[0],
//           rightEye[1] - leftEye[1]
//         );
//         glassesMesh.rotation.z = Math.atan2(eyeLine.y, eyeLine.x);
//       }
//     };

//     const interval = setInterval(updateGlasses, 120);
//     return () => clearInterval(interval);
//   }, [model, glassesMesh]);

//   return (
//     <div style={{ position: 'relative', width: '100%', height: '100%' }}>
//       {isLoading && (
//         <div
//           style={{
//             position: 'absolute',
//             top: 0, left: 0,
//             width: '100%', height: '100%',
//             backgroundColor: 'rgba(255,255,255,0.6)',
//             display: 'flex', justifyContent: 'center', alignItems: 'center',
//             zIndex: 2,
//           }}
//         >
//           <h3>Loading...</h3>
//         </div>
//       )}
//       <Webcam
//         ref={webcamRef}
//         autoPlay
//         playsInline
//         mirrored={true}
//         style={{ width: '100%', height: '100%' }}
//       />
//       <canvas
//         ref={canvasRef}
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           zIndex: 1,
//         }}
//       />
//     </div>
//   );
// };

// export default VirtualTryOn;

import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as THREE from 'three';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

const VirtualTryOn = ({ uri, productInfo, selectedColor, onColorChange, onGlassesClick, showInfo }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [glassesMesh, setGlassesMesh] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }

        await tf.setBackend('webgl');
        const loadedModel = await faceLandmarksDetection.load(
          faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
          { shouldLoadIrisModel: true, maxFaces: 1 }
        );
        setModel(loadedModel);

        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
        renderer.setSize(width, height);
        renderer.setAnimationLoop(() => renderer.render(scene, camera));

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(uri, (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          const geometry = new THREE.PlaneGeometry(2, 1);
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            color: new THREE.Color(selectedColor),
          });

          const glasses = new THREE.Mesh(geometry, material);
          scene.add(glasses);
          setGlassesMesh(glasses);
        });
      } catch (error) {
        console.error("Initialization error:", error);
        setIsLoading(false);
      }
    };
    loadResources();
  }, [uri]);

  useEffect(() => {
    if (glassesMesh) {
      glassesMesh.material.color.set(selectedColor);
    }
  }, [selectedColor, glassesMesh]);

  useEffect(() => {
    const detectAndPositionGlasses = async () => {
      if (!webcamRef.current || !model || !glassesMesh) return;
      const video = webcamRef.current.video;
      if (video.readyState !== 4) return;

      const faceEstimates = await model.estimateFaces({ input: video });
      if (faceEstimates.length > 0) {
        setIsLoading(false);
        const keypoints = faceEstimates[0].scaledMesh;
        const leftEye = keypoints[130];
        const rightEye = keypoints[359];
        const eyeCenter = keypoints[168];

        const eyeDistance = Math.sqrt(
          Math.pow(rightEye[0] - leftEye[0], 2) + Math.pow(rightEye[1] - leftEye[1], 2)
        );
        const scaleMultiplier = eyeDistance / 140;

        const scaleX = -0.01;
        const scaleY = -0.01;
        const offsetX = 0.0;
        const offsetY = -0.01;

        glassesMesh.position.x = (eyeCenter[0] - video.videoWidth / 2) * scaleX + offsetX;
        glassesMesh.position.y = (eyeCenter[1] - video.videoHeight / 2) * scaleY + offsetY;
        glassesMesh.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);
        glassesMesh.position.z = 1;

        const eyeLine = new THREE.Vector2(rightEye[0] - leftEye[0], rightEye[1] - leftEye[1]);
        glassesMesh.rotation.z = Math.atan2(eyeLine.y, eyeLine.x);
      }
    };

    const intervalId = setInterval(detectAndPositionGlasses, 120);
    return () => clearInterval(intervalId);
  }, [model, glassesMesh]);

  return (
    <div style={{ position: 'relative', width: '500px', height: '500px', margin: '0 auto', display: 'flex' }}>
      {/* Color Picker */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginRight: '10px', justifyContent: 'center' }}>
        {['#000000', '#ff0000', '#0000ff', '#00aa00'].map((c) => (
          <button
            key={c}
            onClick={() => onColorChange(c)}
            style={{ backgroundColor: c, width: 30, height: 30, borderRadius: '50%', border: '1px solid #999', cursor: 'pointer' }}
          />
        ))}
      </div>

      <div style={{ position: 'relative' }}>
        {isLoading && (
          <div style={{
            position: 'absolute', width: '100%', height: '100%',
            backgroundColor: '#bab3b3aa', zIndex: 2,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <h3>Loading...</h3>
          </div>
        )}
        <Webcam ref={webcamRef} autoPlay playsInline style={{ width: '500px', height: '500px' }} mirrored />
        <canvas
          ref={canvasRef}
          onClick={onGlassesClick}
          style={{ width: '500px', height: '500px', position: 'absolute', top: 0, left: 0, cursor: 'pointer' }}
        />

        {/* Info Tag */}
        {showInfo && (
          <div style={{
            position: 'absolute', top: 100, left: 320,
            backgroundColor: '#fff', padding: '2px', borderRadius: '2px',
            boxShadow: '0 1px 6px rgba(0,0,0,0.2)', zIndex: 1
          }}>
            <p><strong>Brand:</strong> {productInfo.brand}</p>
            <p><strong>Material:</strong> {productInfo.material}</p>
            <p><strong>Price:</strong> ₹{productInfo.price}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualTryOn;
