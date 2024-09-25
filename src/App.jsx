import { useState,useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MenuBar from "./components/MenuBar";
import Toolbox from "./components/Toolbox";
import DrawingCanvas from "./components/DrawingCanvas";
import ControlPanel from "./components/ControlPanel";
import PageLayoutPopup from "./components/PageLayoutPopup";
import ImagePreview from "./components/ImagePreview";
import SplashScreen from './components/SplashScreen';

function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading process with a timeout (e.g., 3 seconds)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, []);

  const DPI = 96;
  const PAGE_SIZES = [
    { name: "A0", width: (841 * DPI) / 25.4, height: (1189 * DPI) / 25.4 },
    { name: "A1", width: (594 * DPI) / 25.4, height: (841 * DPI) / 25.4 },
    { name: "A2", width: (420 * DPI) / 25.4, height: (594 * DPI) / 25.4 },
    { name: "A3", width: (297 * DPI) / 25.4, height: (420 * DPI) / 25.4 },
    { name: "A4", width: (210 * DPI) / 25.4, height: (297 * DPI) / 25.4 }, // Default
    { name: "A5", width: (148 * DPI) / 25.4, height: (210 * DPI) / 25.4 },
    { name: "A6", width: (105 * DPI) / 25.4, height: (148 * DPI) / 25.4 },
    { name: "A7", width: (74 * DPI) / 25.4, height: (105 * DPI) / 25.4 },
    { name: "A8", width: (52 * DPI) / 25.4, height: (74 * DPI) / 25.4 },
    { name: "A9", width: (37 * DPI) / 25.4, height: (52 * DPI) / 25.4 },
    { name: "A10", width: (26 * DPI) / 25.4, height: (37 * DPI) / 25.4 },
  ];

  const [selectedShape, setSelectedShape] = useState("line");
  const [pageSize, setPageSize] = useState(PAGE_SIZES[4]); // Default A4
  const [borderStyle, setBorderStyle] = useState("none");
  const [shapes, setShapes] = useState([]); // To store drawn shapes
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [pageLayout, setPageLayout] = useState("landscape"); // Page layout state
  const [history, setHistory] = useState([]); // History for undo/redo
  const [future, setFuture] = useState([]); // Future for redo

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
  };

  const handleBorderStyleChange = (newStyle) => {
    setBorderStyle(newStyle);
  };

  const handleAddShape = (newShape) => {
    setShapes((prevShapes) => [...prevShapes, newShape]);
    setHistory((prevHistory) => [...prevHistory, shapes]);
    setFuture([]); // Clear future history
  };

  const undo = () => {
    if (history.length > 0) {
      const lastShapes = history[history.length - 1];
      setFuture([shapes, ...future]);
      setShapes(lastShapes);
      setHistory(history.slice(0, history.length - 1));
    }
  };

  const redo = () => {
    if (future.length > 0) {
      const nextShapes = future[0];
      setShapes(nextShapes);
      setHistory([...history, shapes]);
      setFuture(future.slice(1));
    }
  };


  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const saveToImage = () => {
    const canvas = document.querySelector("canvas");
    const image = canvas.toDataURL("image/png");
    setPreviewImage(image);
    setIsPreviewOpen(true); // Open preview modal
  };

  const handleConfirmSave = () => {
    const link = document.createElement("a");
    link.href = previewImage;
    link.download = "drawing.png";
    link.click();
    setIsPreviewOpen(false); // Close preview modal
    setPreviewImage(null); // Reset preview image
  };

  const handleCancelSave = () => {
    setIsPreviewOpen(false); // Close preview modal
    setPreviewImage(null); // Reset preview image
  };
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "z") {
        undo();
      } else if (event.ctrlKey && event.shiftKey && event.key === "Z") {
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [history, future, shapes]);


  const clearPage = () => {
    setShapes([]); // Clear all shapes
    setHistory([]); // Clear history for undo
    setFuture([]); // Clear redo history
  };

  const [showRulers, setShowRulers] = useState(false);

  const toggleRulers = () => {
    setShowRulers(!showRulers);
  };

  return (
    loading ? (
      <SplashScreen />
    ) : (
      <div className="App" style={{ backgroundColor: "grey" }}>
        <MenuBar openPopup={openPopup} />
        <Toolbox
          selectedShape={selectedShape}
          onShapeSelect={setSelectedShape}
          pageLayout={pageLayout}
          onPageLayoutChange={setPageLayout}
          pageSizes={PAGE_SIZES}
          onPageSizeChange={handlePageSizeChange}
          borderStyle={borderStyle}
          onBorderStyleChange={handleBorderStyleChange}
          onUndo={undo}
          onRedo={redo}
          onSave={saveToImage}
          onClearPage={clearPage} // Pass clearPage function to Toolbox
            showRulers={showRulers}
            onRulerToggle={toggleRulers}  
        />
        <DrawingCanvas
          selectedShape={selectedShape}
          pageSize={pageSize}
          borderStyle={borderStyle}
          shapes={shapes}
          onShapeAdd={handleAddShape}
          pageLayout={pageLayout}
            showRulers={showRulers}
        />
        <ControlPanel />
        {isPopupOpen && (
          <PageLayoutPopup
            closePopup={closePopup}
            handlePageSizeChange={handlePageSizeChange}
            handleBorderStyleChange={handleBorderStyleChange}
            pageSizes={PAGE_SIZES}
          />
        )}
        {isPreviewOpen && (
          <ImagePreview
            imageSrc={previewImage}
            onConfirm={handleConfirmSave}
            onCancel={handleCancelSave}
            pageSize={pageSize} // Pass the current page size
          />
        )}
      </div>
    )
  );
  
}


export default App;
