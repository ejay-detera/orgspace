import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, usePage } from '@inertiajs/react';
import { Plus, CheckCircle, Download, Paperclip, Image, X, Eye } from 'lucide-react';
import PageTransition from '@/Components/PageTransition';

export default function AnnouncementIndex({ announcements = [], canCreateAnnouncement = false }) {
    const { flash } = usePage().props;
    const [previewImage, setPreviewImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    const isImage = (filename) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
        const extension = filename?.toLowerCase().split('.').pop();
        return imageExtensions.includes(extension);
    };

    const handleAttachmentClick = (e, attachment) => {
        const filename = attachment.original_filename || attachment.filename || attachment.name;
        if (isImage(filename)) {
            e.preventDefault();
            // Use placeholder image 
            const placeholderUrl = 'https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Image+Preview';
            
            setPreviewImage({
                url: placeholderUrl,
                name: filename
            });
            setImageLoading(true);
            setImageError(false);
        }
        // download for not img
    };



    return (
        <PageTransition>
            <AuthenticatedLayout header={
               <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Announcements</h2>

                    {canCreateAnnouncement && (
                        <Link href={route('announcements.create')} className="flex items-center gap-2 px-4 py-2 bg-[#04095D] text-white rounded-lg hover:-translate-y-1 transform transition duration-200 shadow-md hover:shadow-lg">
                            <Plus size={18}/> Create
                        </Link>
                    )}
               </div>
            }
            >
                <div className="py-10">
                    <div className="mx-auto max-w-5xl sm:px-6 lg:px-6 space-y-6">

                        {/* Show success banner */}
                        {flash?.success && (
                            <div className="flex items-center gap-3 px-5 py-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm font-medium shadow-sm">
                                <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                                {flash.success}
                            </div>
                        )}

                        {announcements.length === 0 && (
                            <p className="text-center text-gray-400 py-24 text-sm">No announcements yet.</p>
                        )}

                        {announcements.map((ann) => (
                            <div key={ann.id} className="bg-white rounded-2xl p-8 shadow-2xl border border-[#B3B3B3]/20 text-black min-h-[260px] flex flex-col justify-between hover:-translate-y-1 transform transition duration-200 hover:shadow-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        {/* Show full name  */}
                                        <h3 className="text-md text-[#04095D] font-bold">{ann.creator_name}</h3>
                                        <p className="text-sm text-black/70">{ann.committee?.name ?? 'All Members'}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(ann.created_at).toLocaleString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <span className={`px-4 py-1 text-xs font-semibold rounded-full border ${
                                        ann.type === 'Critical' ? 'bg-red-600 text-white border-red-400/40' :
                                        ann.type === 'High'     ? 'bg-orange-500 text-white border-orange-400/40' :
                                        ann.type === 'Normal'   ? 'bg-blue-600 text-white border-blue-400/40' :
                                                                   'bg-gray-500 text-white border-gray-400/40'
                                    }`}>
                                        {ann.type}
                                    </span>
                                </div>
                                <div className="mt-8">
                                    <h4 className="text-lg font-semibold mb-2">{ann.title}</h4>
                                    <div
                                        className="text-black/80 leading-relaxed prose max-w-none text-sm"
                                        dangerouslySetInnerHTML={{ __html: ann.content }}
                                    />
                                    
                                    {/* display uploaded files/attachments */}
                                    {ann.attachments && ann.attachments.length > 0 && (
                                        <div className="mt-6 pt-4 border-t border-gray-200">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Paperclip size={16} className="text-gray-500" />
                                                <span className="text-sm font-medium text-gray-700">Attachments ({ann.attachments.length})</span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {ann.attachments.map((attachment, index) => {
                                                    const filename = attachment.original_filename || attachment.filename || attachment.name || `File ${index + 1}`;
                                                    const isImageFile = isImage(filename);
                                                    
                                                    return (
                                                        <a key={index} 
                                                            href={attachment.file_path || attachment.url} 
                                                            download={!isImageFile}
                                                            onClick={(e) => handleAttachmentClick(e, attachment)}
                                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors group cursor-pointer"
                                                        >
                                                            <div className="flex-shrink-0">
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                                    isImageFile ? 'bg-purple-100' : 'bg-blue-100'
                                                                }`}>
                                                                    {isImageFile ? (
                                                                        <Image size={16} className="text-purple-600" />
                                                                    ) : (
                                                                        <Download size={16} className="text-blue-600" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                                    {filename}
                                                                </p>
                                                                {attachment.file_size && (
                                                                    <p className="text-xs text-gray-500">{(attachment.file_size / 1024).toFixed(1)} KB</p>
                                                                )}
                                                            </div>
                                                            {isImageFile ? (
                                                                <Eye size={16} className="text-gray-400 group-hover:text-[#04095d] flex-shrink-0" />
                                                            ) : (
                                                                <Download size={16} className="text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                                                            )}
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image Preview Modal */}
                {previewImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                         onClick={() => setPreviewImage(null)}>
                        <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="text-md font-semibold text-gray-900 truncate pr-10">{previewImage.name}</h3>
                                <div className="flex items-center gap-8">
                                    <a href={previewImage.url} download
                                       className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#04095d] text-white rounded-full hover:bg-indigo-900 transition-colors"
                                       onClick={(e) => e.stopPropagation()}>
                                        <Download size={16} />Download
                                    </a>
                                    <button onClick={() => setPreviewImage(null)}
                                            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                {imageLoading && (
                                    <div className="flex items-center justify-center h-64">
                                        <div className="text-gray-500">Loading image...</div>
                                    </div>
                                )}
                                
                                {imageError && (
                                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                        <div className="mb-2">Image preview unavailable</div>
                                    </div>
                                )}
                                
                                <img src={previewImage.url} 
                                     alt={previewImage.name}
                                     className={`max-w-full max-h-[70vh] object-contain mx-auto ${imageLoading || imageError ? 'hidden' : ''}`}
                                     onLoad={() => setImageLoading(false)}
                                     onError={() => {
                                         setImageLoading(false);
                                         setImageError(true);
                                     }}
                                     onClick={(e) => e.stopPropagation()} />
                            </div>
                        </div>
                    </div>
                )}
            </AuthenticatedLayout>
        </PageTransition>
    );
}
