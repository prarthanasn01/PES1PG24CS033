// // // import React, { useState } from 'react';
// // // import './index.css'; 
// // // import VirtualTryOn from './VirtualTryOn';

// // // const images = require.context('./assets/images', false, /\.(png|jpe?g|svg)$/);
// // // const imageList = images.keys().map((key) => ({
// // //   name: key.replace('./', ''),
// // //   src: images(key),
// // // }));

// // // const ProductsList = () => {
// // //   const [activeIndex, setActiveIndex] = useState(null);

// // //   const toggleComponent = (index) => {
// // //     setActiveIndex(activeIndex === index ? null : index);
// // //   };

// // //   return (
// // //     <>
// // //       <div className="header">
// // //         <h1>Virtual Try-On</h1>
// // //       </div>

// // //       {activeIndex !== null && (
// // //         <div className="tryon-area">
// // //           <div className="tryon-box">
// // //             <VirtualTryOn uri={imageList[activeIndex].src} />
// // //           </div>
// // //         </div>
// // //       )}

// // //       <div className="containerAll">
// // //         {imageList.map((image, index) => (
// // //           <div className="container" key={index}>
// // //             <img
// // //               src={image.src}
// // //               alt={image.name}
// // //               className="img"
// // //               style={{
// // //                 height: '140px',
// // //                 objectFit: 'contain',
// // //                 marginBottom: '10px',
// // //               }}
// // //             />
// // //             <button
// // //               onClick={() => toggleComponent(index)}
// // //               className={`button ${activeIndex === index ? 'active' : 'inactive'}`}
// // //             >
// // //               {activeIndex === index ? 'Close' : 'Try On'}
// // //             </button>
// // //           </div>
// // //         ))}
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default ProductsList;
// import React, { useState } from 'react';
// import VirtualTryOn from './VirtualTryOn';
// import './index.css';

// const frames = [
//   {
//     name: 'Classic Black',
//     uri: require('./assets/images/g1.png'),
//     price: '₹1499',
//     availableColors: ['#000000', '#8B4513', '#00008B']
//   },
//   {
//     name: 'Trendy Red',
//     uri: require('./assets/images/g2.png'),
//     price: '₹1799',
//     availableColors: ['#8B0000', '#FF4500', '#800000']
//   },
//   {
//     name: 'Cool Blue',
//     uri: require('./assets/images/g3.png'),
//     price: '₹1599',
//     availableColors: ['#4682B4', '#1E90FF', '#5F9EA0']
//   },
//   {
//     name: ' Black',
//     uri: require('./assets/images/g4.png'),
//     price: '₹1499',
//     availableColors: ['#000000', '#8B4513', '#00008B']
//   },
//   {
//     name: ' Red',
//     uri: require('./assets/images/glasses.png'),
//     price: '₹1799',
//     availableColors: ['#8B0000', '#FF4500', '#800000']
//   },
//   {
//     name: ' Blue',
//     uri: require('./assets/images/sunglasses.png'),
//     price: '₹1599',
//     availableColors: ['#4682B4', '#1E90FF', '#5F9EA0']
//   }
// ];

// const ProductsList = () => {
//   const [selectedFrame, setSelectedFrame] = useState(null);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [showTryOn, setShowTryOn] = useState(false);

//   const handleFrameClick = (frame) => {
//     setSelectedFrame(frame);
//     setSelectedColor(null);
//     setShowTryOn(false);
//   };

//   const handleColorChange = (color) => {
//     setSelectedColor(color);
//   };

//   const handleTryOnToggle = () => {
//     setShowTryOn((prev) => !prev);
//   };

//   return (
//     <div>
//       <div className="header">
//         <h2>Virtual Glasses Try-On</h2>
//       </div>

//       {selectedFrame && (
//         <>
//           <div className="info-panel">
//             <h3>{selectedFrame.name}</h3>
//             <p><strong>Price:</strong> {selectedFrame.price}</p>

//             <div className="color-options">
//               {selectedFrame.availableColors.map((color, idx) => (
//                 <div
//                   key={idx}
//                   className="color-circle"
//                   style={{
//                     backgroundColor: color,
//                     border: selectedColor === color ? '2px solid black' : 'none'
//                   }}
//                   onClick={() => handleColorChange(color)}
//                 />
//               ))}
//             </div>

//             <button
//               className={`button ${showTryOn ? 'active' : 'inactive'}`}
//               onClick={handleTryOnToggle}
//               style={{ marginTop: '15px' }}
//             >
//               {showTryOn ? 'Close' : 'Try On'}
//             </button>
//           </div>

//           {showTryOn && (
//             <div className="tryon-area">
//               <div className="tryon-box">
//                 <VirtualTryOn uri={selectedFrame.uri} tintColor={selectedColor} />
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       <div className="containerAll">
//         {frames.map((frame, idx) => (
//           <div className="container" key={idx} onClick={() => handleFrameClick(frame)}>
//             <img src={frame.uri} alt={frame.name} className="img" />
//             <h4>{frame.name}</h4>
//             <p>{frame.price}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductsList;

import React, { useState } from 'react';
import VirtualTryOn from './VirtualTryOn';

const images = require.context('./assets/images', false, /\.(png|jpe?g|svg)$/);

const imageList = images.keys().map((key, index) => ({
  name: key.replace('./', ''),
  src: images(key),
  brand: ['Ray-Ban', 'Oakley', 'Gucci'][index % 3],
  price: [1999, 2499, 3299][index % 3],
  material: ['Titanium', 'Plastic', 'Metal'][index % 3],
}));

const ProductsList = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [showInfo, setShowInfo] = useState(false);

  const toggleComponent = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
      setShowInfo(false);
    } else {
      setActiveIndex(index);
      setSelectedColor('#ffffff');
      setShowInfo(false);
    }
  };

  const handleGlassesClick = () => {
    setShowInfo(true);
  };

  return (
    <>
      <div style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.2)' }}>
        <h1 style={{ textAlign: 'center', padding: '10px 0' }}>Virtual Try-On - Smart Specs</h1>
      </div>

      {activeIndex !== null && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          <VirtualTryOn
            uri={imageList[activeIndex].src}
            productInfo={{
              brand: imageList[activeIndex].brand,
              price: imageList[activeIndex].price,
              material: imageList[activeIndex].material,
            }}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
            onGlassesClick={handleGlassesClick}
            showInfo={showInfo}
          />
        </div>
      )}

      <div
        className="containerAll"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
          padding: '30px 0',
        }}
      >
        {imageList.map((image, index) => (
          <div
            className="container"
            key={index}
            style={{
              textAlign: 'center',
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '10px',
              width: '200px',
              boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <img
              src={image.src}
              alt={image.name}
              style={{
                width: '100%',
                height: '140px',
                objectFit: 'contain',
                marginBottom: '10px',
              }}
            />
            <button
              onClick={() => toggleComponent(index)}
              style={{
                padding: '8px 16px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: activeIndex === index ? '#f44336' : '#4CAF50',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              {activeIndex === index ? 'Close' : 'Try On'}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductsList;