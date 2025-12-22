// frontend/src/components/ImageCropper.jsx
import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../utils/cropImage'
import { X, Check } from 'lucide-react'

const ImageCropper = ({ imageSrc, onCancel, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [loading, setLoading] = useState(false)

  const onCropChange = (crop) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom) => {
    setZoom(zoom)
  }

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      // getCroppedImg is an async function that returns a Blob
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
      
      if (!croppedImageBlob) {
        throw new Error("Canvas is empty");
      }

      onCropComplete(croppedImageBlob) // Send blob back to dashboard
    } catch (e) {
      console.error("Crop failed:", e)
      alert('Gagal memotong gambar. Pastikan gambar valid.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 z-10">
          <h3 className="font-bold text-gray-700">Sesuaikan Posisi Foto</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-red-500 transition">
            <X size={24} />
          </button>
        </div>

        {/* FIX CRITICAL: Container Cropper MUST have relative position and explicit height 
           We use 'h-96' (24rem) for mobile and 'md:h-[500px]' for desktop to ensure it's visible.
        */}
        <div className="relative w-full h-96 md:h-[500px] bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3} // Aspect ratio default
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={onZoomChange}
            objectFit="contain" // Ensures image fits inside container
          />
        </div>

        {/* Controls */}
        <div className="p-6 bg-white space-y-4 z-10 border-t">
          <div>
            <div className="flex justify-between mb-2">
               <label className="text-sm font-bold text-gray-600">Zoom</label>
               <span className="text-sm text-gray-400">{zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              className="flex-1 py-3 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : <><Check size={20}/> Simpan Foto</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageCropper