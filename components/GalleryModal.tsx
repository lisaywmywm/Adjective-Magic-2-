
import React from 'react';
import type { GalleryItem } from '../types';

interface GalleryModalProps {
    gallery: GalleryItem[];
    onClose: () => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ gallery, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-gray-800">Magic Gallery</h2>
                    <button onClick={onClose} className="text-3xl text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                {gallery.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">The gallery is empty. Make some magic first!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {gallery.map((item, index) => (
                            <div key={index} className="rounded-xl overflow-hidden shadow-lg">
                                <img 
                                    src={item.src} 
                                    alt={`Comparison of ${item.name1} and ${item.name2}`} 
                                    className="w-full h-auto"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GalleryModal;
