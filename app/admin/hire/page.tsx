"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HireData {
    id: number;
    contactName: string;
    contactEmail: string;
    preferredDate: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    payment: boolean;
    imageName: string[];
    imageData: string[]; // This will contain base64 encoded image data
}

const HireList = () => {
    const router = useRouter();
    const [hires, setHires] = useState<HireData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImages, setSelectedImages] = useState<{names: string[], urls: string[]}>({names: [], urls: []});

    useEffect(() => {
        fetchHires();
    }, []);

    const fetchHires = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/hire');

            if (!response.ok) {
                throw new Error('Failed to fetch hire data');
            }

            const data = await response.json();
            console.log(data);

            // Process the image data for each hire
            const processedHires = data.hires?.map((hire: any) => {
                // The API should return the image data as base64 strings
                return hire;
            }) || [];

            setHires(processedHires);
        } catch (err) {
            setError('Could not load hire requests');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this hire request?')) {
            return;
        }

        try {
            const response = await fetch(`/api/hire/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete hire request');
            }

            // Remove the deleted hire from the state
            setHires(hires.filter(hire => hire.id !== id));
        } catch (err) {
            setError('Failed to delete hire request');
            console.error(err);
        }
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            const response = await fetch(`/api/hire/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });
            console.log(response);
            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            // Update the hire status in the state
            setHires(hires.map(hire =>
                hire.id === id ? { ...hire, status: newStatus } : hire
            ));
        } catch (err) {
            setError('Failed to update status');
            console.error(err);
        }
    };

    const viewImages = async (id: number) => {
        try {
            // Fetch images for the specific hire record
            const response = await fetch(`/api/hire/${id}/images`);

            if (!response.ok) {
                throw new Error('Failed to fetch images');
            }

            const data = await response.json();

            if (data.success && data.images) {
                setSelectedImages({
                    names: data.imageNames || [],
                    urls: data.images
                });
                setShowImageModal(true);
            } else {
                throw new Error('No images found');
            }
        } catch (err) {
            setError('Failed to load images');
            console.error(err);
        }
    };

    const ImageModal = () => {
        if (!showImageModal) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-screen overflow-y-auto">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-xl font-semibold">Payment Images</h3>
                        <button
                            onClick={() => setShowImageModal(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    {selectedImages.urls.length === 0 ? (
                        <p className="text-center py-8 text-gray-500">No images available.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedImages.urls.map((url, index) => (
                                <div key={index} className="border rounded-lg overflow-hidden">
                                    <div className="bg-gray-100 p-2 text-sm font-medium">
                                        {selectedImages.names[index] || `Image ${index + 1}`}
                                    </div>
                                    <img
                                        src={url}
                                        alt={selectedImages.names[index] || `Image ${index + 1}`}
                                        className="w-full object-contain max-h-80"
                                    />
                                    <div className="p-2 flex justify-end">
                                        <a
                                            href={url}
                                            download={selectedImages.names[index]}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            Download
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="text-center py-8">Loading hire requests...</div>;
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-red-100 p-4 rounded-md text-red-700 mb-4">{error}</div>
                <button
                    onClick={fetchHires}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <ImageModal />
            {(!hires || hires.length === 0) ? (
                <div className="text-center py-8 bg-gray-50 rounded-md">
                    <p className="text-gray-500">No hire requests found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b text-left">ID</th>
                            <th className="py-2 px-4 border-b text-left">Contact Name</th>
                            <th className="py-2 px-4 border-b text-left">Email</th>
                            <th className="py-2 px-4 border-b text-left">Date</th>
                            <th className="py-2 px-4 border-b text-left">Status</th>
                            <th className="py-2 px-4 border-b text-left">Payment</th>
                            <th className="py-2 px-4 border-b text-left">Payslips</th>
                            <th className="py-2 px-4 border-b text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {hires.map((hire) => (
                            <tr key={hire.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{hire.id}</td>
                                <td className="py-2 px-4 border-b">{hire.contactName}</td>
                                <td className="py-2 px-4 border-b">{hire.contactEmail}</td>
                                <td className="py-2 px-4 border-b">
                                    {new Date(hire.preferredDate).toLocaleDateString()}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <select
                                        value={hire.status}
                                        onChange={(e) => handleStatusChange(hire.id, e.target.value)}
                                        className="border rounded px-2 py-1 text-sm"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {hire.payment ? 'Paid' : 'Unpaid'}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => viewImages(hire.id)}
                                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                        disabled={!hire.imageName || hire.imageName.length === 0}
                                    >
                                        {hire.imageName && hire.imageName.length > 0
                                            ? `View (${hire.imageName.length})`
                                            : 'No files'}
                                    </button>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/hire/edit/${hire.id}`}
                                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(hire.id)}
                                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default HireList;