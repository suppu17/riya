import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud } from 'lucide-react';

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (caption: string, file: File) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ isOpen, onClose, onPost }) => {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = () => {
    if (file && caption) {
      onPost(caption, file);
      handleClose();
    }
  };

  const handleClose = () => {
    setCaption('');
    setFile(null);
    setPreview(null);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X />
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">Create New Post</h2>

            <div className="space-y-4">
              <div className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center text-gray-400">
                    <UploadCloud className="mx-auto h-12 w-12" />
                    <p>Upload an image or video</p>
                  </div>
                )}
                <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>

              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
              />

              <button
                onClick={handleSubmit}
                disabled={!file || !caption}
                className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-lg disabled:bg-gray-500 hover:bg-purple-700 transition-colors"
              >
                Post
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePost;
