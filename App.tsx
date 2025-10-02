import React, { useState, useEffect } from 'react';
import { ADJECTIVES } from './constants';
import type { StudentData, GalleryItem } from './types';
import { generateComparisonImage } from './services/geminiService';
import { fileToBase64, extractNameFromFilename } from './utils/fileUtils';
import StudentInput from './components/StudentInput';
import GalleryModal from './components/GalleryModal';
import Loader from './components/Loader';

const App: React.FC = () => {
    const [student1, setStudent1] = useState<StudentData>({ name: 'Player 1', imgPreview: 'https://placehold.co/150x150/F6D365/FFFFFF?text=Player+1', file: null });
    const [student2, setStudent2] = useState<StudentData>({ name: 'Player 2', imgPreview: 'https://placehold.co/150x150/84FAB0/FFFFFF?text=Player+2', file: null });
    const [currentAdjective, setCurrentAdjective] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);

    // Effect to revoke the object URL when the component unmounts or the preview source changes, to prevent memory leaks.
    useEffect(() => {
        return () => {
            if (student1.imgPreview && student1.imgPreview.startsWith('blob:')) {
                URL.revokeObjectURL(student1.imgPreview);
            }
        };
    }, [student1.imgPreview]);

    useEffect(() => {
        return () => {
            if (student2.imgPreview && student2.imgPreview.startsWith('blob:')) {
                URL.revokeObjectURL(student2.imgPreview);
            }
        };
    }, [student2.imgPreview]);

    const handleFileChange = (studentSetter: React.Dispatch<React.SetStateAction<StudentData>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const name = extractNameFromFilename(file.name);
            studentSetter({
                name,
                file,
                imgPreview: URL.createObjectURL(file),
            });
        }
    };

    const handleDrawAdjective = () => {
        const newAdjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
        setCurrentAdjective(newAdjective);
    };

    const handleMakeMagic = async () => {
        if (!student1.file || !student2.file || !currentAdjective) {
            setErrorMessage("Please make sure both students have uploaded a photo, and you have drawn an adjective!");
            return;
        }
        setErrorMessage('');
        setIsGenerating(true);
        setGeneratedImage(null);

        try {
            const [base64Img1, base64Img2] = await Promise.all([
                fileToBase64(student1.file),
                fileToBase64(student2.file),
            ]);
            
            const imageUrl = await generateComparisonImage({
                student1Name: student1.name,
                student2Name: student2.name,
                adjective: currentAdjective,
                base64ImageData1: base64Img1,
                base64ImageData2: base64Img2
            });

            setGeneratedImage(imageUrl);
            setGallery(prev => [...prev, { src: imageUrl, name1: student1.name, name2: student2.name }]);
        } catch (error) {
            console.error('Magic Error:', error);
            const message = error instanceof Error ? error.message : 'Could not create magic image.';
            setErrorMessage(message);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-yellow-300 to-orange-400 min-h-screen flex items-center justify-center p-4 sm:p-6">
            <div className="container mx-auto max-w-4xl w-full">
                <header className="text-center mb-8">
                    <h1 className="font-comic text-4xl sm:text-5xl md:text-6xl text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                        Comparative Adjective Magic!
                    </h1>
                </header>
                <main className="bg-white rounded-2xl p-8 shadow-xl">
                    <div className="flex flex-col md:flex-row justify-around items-center mb-8 space-y-8 md:space-y-0">
                        <StudentInput student={student1} onFileChange={handleFileChange(setStudent1)} />
                        <div className="text-5xl font-bold text-gray-300 self-center">VS</div>
                        <StudentInput student={student2} onFileChange={handleFileChange(setStudent2)} />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                        <button onClick={handleDrawAdjective} className="btn btn-draw text-2xl px-8 py-4 transform hover:scale-110 duration-300">Draw an adjective!</button>
                        <div className="bg-yellow-100 text-yellow-800 text-2xl font-bold px-6 py-4 rounded-full shadow-inner min-w-[150px] text-center flex items-center justify-center">
                            {currentAdjective || '?'}
                        </div>
                    </div>

                    <div className="text-center my-8">
                        <button onClick={handleMakeMagic} disabled={isGenerating} className="btn btn-magic text-2xl px-8 py-4 transform hover:scale-110 duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            ✨ Make Magic! ✨
                        </button>
                    </div>

                    <div className="text-center min-h-[300px] bg-gray-100 rounded-2xl flex items-center justify-center p-4">
                        {isGenerating && <Loader />}
                        {!isGenerating && !generatedImage && <p className="text-gray-500">Your magical image will appear here!</p>}
                        {generatedImage && !isGenerating && <img src={generatedImage} alt="Generated Comparison" className="max-w-full max-h-[400px] h-auto rounded-lg shadow-lg" />}
                    </div>

                    {errorMessage && <div className="text-center text-red-500 mt-4 font-semibold">{errorMessage}</div>}
                </main>
                <footer className="text-center mt-6">
                    <button onClick={() => setIsGalleryOpen(true)} className="btn btn-gallery">View Gallery</button>
                </footer>
            </div>
            {isGalleryOpen && <GalleryModal gallery={gallery} onClose={() => setIsGalleryOpen(false)} />}
        </div>
    );
};

export default App;