import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';
import Dropdown from '@/Components/Dropdown';
import PageTransition from '@/Components/PageTransition';
import ReactQuill from 'react-quill'; //for rich text editor
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone'; // for file drag & drop
import { UploadCloud, X, Eye, Loader2} from 'lucide-react';
import Modal from '@/Components/Modal'; 

export default function Announce() {
    const [type, setType] = useState('Select Priority');
    const [audience, setAudience] = useState([]);
    const [search, setSearch] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [files, setFiles] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCriticalConfirm, setShowCriticalConfirm] = useState(false);
    const [discardConfirm, setDiscardConfirm] = useState(false);
    const [showValidationError, setShowValidationError] = useState(false);

    const isFormValid = title.trim() && body.trim() && type !== 'Select Priority' && audience.length > 0;

    const typeOptions = ['Low', 'High', 'Normal', 'Critical'];
    const audienceOptions = [
        'Test User 1',
        'Test User 2',
        'Test User 3',
        'Test User 5'
    ];

    const toggleAudience = (value) => {
        setAudience((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const filteredAudience = useMemo(() => {
        return audienceOptions.filter((item) =>
            item.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    const {getRootProps, getInputProps, isDragActive, open} = useDropzone ({
        onDrop:(acceptedFiles) => {
            setFiles((prev) => [...prev, ...acceptedFiles]);
        },
        multiple: true, 
        noClick: true,
        noKeyboard: true,
    })

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    }
    const handleCancel = () => {
        const content = title.trim() || body.trim() || audience.length > 0 || files.length > 0;
        if (content) {
            setDiscardConfirm(true)
        } else {
            console.log('Navigating back')
        }
    }
    const handlePost = () => {
        if (!isFormValid) {
            setShowValidationError(true);
            return;
        }
        if(type === 'Critical' && !showCriticalConfirm) {
            setShowCriticalConfirm(true)
            return;
        }
        setIsSubmitting(true)

        //sample submission
        setTimeout(() => {
            setIsSubmitting(false);
            setTitle('');
            setBody('');
            setType('Select Priority');
            setAudience([]);
            setFiles([]);
            setShowPreview(false);
            // navigate back to announcements page
            router.visit(route('announcements.index'));
        }, 2000)
    };
    const confirmDiscard = () =>{
        setDiscardConfirm(false);
        // navigate back to announcements page
        router.visit(route('announcements.index'));
    };
    const criticalPost = () => {
        setShowCriticalConfirm(false);
        handlePost();
    };

    return (
        <PageTransition>
            <AuthenticatedLayout
                header={
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">Create an Announcement</h2>
                    </div>
                }
            >
                <div className="p-6">

                    {/*containcer for type & audience*/}
                    <div className="w-full flex justify-center">
                        <div className="flex items-center gap-80 flex-wrap">

                            {/*priority level*/}
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Priority Level:</span>

                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className={`inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm text-sm ${
                                                type === 'Critical' ? 'text-red-600 border-red-400 bg-red-50' :
                                                type === 'High' ? 'text-orange-600 border-orange-400 bg-orange-50' :
                                                type === 'Normal' ? 'text-blue-600 border-blue-400 bg-blue-50' :
                                                type === 'Low' ? 'text-gray-600 border-gray-400 bg-blue-50' : 'text-gray-700 border-gray-300 bg-white'
                                            } `}
                                        >{type}</button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content align="left">
                                        {typeOptions.map((level) => (
                                            <button key={level} type="button" onClick={() => setType(level)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >{level}</button>
                                        ))}
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>

                            {/*target audience*/}
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Target Audience:</span>

                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button type="button" className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm text-sm text-gray-700 hover:bg-gray-50 max-w-[400px] truncate"
                                        >{audience.length > 0 ? audience.join(', ') : 'Select Audience'}</button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content align="left" width="48">
                                        <div className="p-2">
                                            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                                                className="w-full mb-2 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            />

                                            <div className="max-h-40 overflow-y-auto space-y-2">
                                                {filteredAudience.map((item) => (
                                                    <label key={item} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                                        <Checkbox checked={audience.includes(item)} onChange={() => toggleAudience(item)}/>
                                                        <span className="text-sm text-gray-700">{item}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-4xl mt-8 mx-auto">
                        {/* Announcement title */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
                            <input type="text" value={title} onChange={(e) => {if (e.target.value.length <= 200) {setTitle(e.target.value);}}} maxLength={200} placeholder="Enter announcement title..."
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 rounded-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                            <div 
                                className={`mt-1 text-right text-sm font-medium ${title.length === 200 ? 'text-red-600' : 'text-gray-500'}`} >{title.length} / 200
                            </div>
                        </div>                        
                        
                        {/*Announcement Body */}
                        <div className="mt-8 mb-16">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Body Text</label>
                                
                            <div className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden ">
                                <ReactQuill theme="snow" value={body} onChange={setBody} className="h-64"></ReactQuill>
                            </div>
                        </div>
                        
                        {/*File Attachment */}
                        <div className="mt-8">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Attach Files (Optional)</label>
                            
                            <div
                                {...getRootProps()} className={`border-2 border-dashed rounded-lg h-44 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                                    isDragActive ? 'border-indigo-500 bg-indigo-50 shadow-inner' : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30'
                                }`}
                            >
                                <input {...getInputProps()}/>
                                <UploadCloud className="h-12 w-12 text-gray-400 mb-3"/>
                                <p className="text-sm font-medium text-gray-600">{isDragActive ? 'Drop files here...' : 'Drag & drop files here or click to browse'}</p>
                            </div>

                            {/*List of selected files */}
                            {files.length > 0 && (
                                <div className="mt-5">
                                    <p className="text-sm font-medium text-gray-700 mb-3">Selected Files ({files.length})</p>
                                    <div className="space-y-3">
                                        {files.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                                                <div className="flex items-center gap-3">
                                                    <UploadCloud className="h-5 w-5 text-indigo-500 flex-shrink-0"/>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800 truncate max-w-xs">{file.name}</p>
                                                        <p className="text-xs text-gray-500">{(file.size /1024).toFixed(1)}</p>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"><X size={18}/></button>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            )}
                        </div>

                        {/*Action btns */}
                        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-200">
                            <button type="button" onClick={() => setShowPreview(true)} className="flex items-center justify-center gap-2 px-6 py-2 border border-indigo-300 rounded-full text-sm text-indigo-700 hover:bg-indigo-100 transition-colors">
                                <Eye size={18}/>Preview
                            </button>
                            <button type="button" onClick={handleCancel} className="px-6 py-2 text-sm border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                            <button type="button" disabled={!isFormValid || isSubmitting} onClick={handlePost} className={`flex items-center justify-center gap-2 px-8 py-4 text-white text-sm rounded-full transition-all min-w-[180px] ${
                                isSubmitting ? 'bg-[#04095D]/70 cursor-not-allowed' : 'bg-[#04095D] hover:bg-[#04095D]/90'
                            }`}>
                                {isSubmitting ? (
                                    <><Loader2 className="h-5 w-5 animate-spin mr-2"/>Posting...</>) : ('Post Announcement')
                                }
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview modal */}
                <Modal show={showPreview} onClose={() => setShowPreview(false)} maxWidth="2xl">
                    <div className="p-6 lg:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#04095D] to-[#000000] bg-clip-text text-transparent">Announcement Preview</h2>
                            <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
                        </div>

                        <div className="space-y-6">
                            <div className="mt-8">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                    <div>
                                        <span className="text-sm font-medium text-gray-800">Audience: </span>
                                        <span className="text-gray-500 text-sm">
                                            {audience.length > 0 ? audience.join(', ') : 'Not selected'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold hover:-translate-y-1 transform transition duration-200 shadow-md hover:shadow-lg ${
                                            type === 'Critical' ? 'bg-red-600 text-white' : type === 'High'? 'bg-orange-600 text-white' : type === 'Normal'? 'bg-blue-600 text-white' : type === 'Low' ? 'bg-gray-600 text-white' :'bg-gray-500 text-white'
                                        }`}>
                                            {type || 'Not selected'}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-[#04095D] mb-2 mt-8">{title || 'No title'}</h3>
                            </div>

                            <div>
                                <div
                                    className="prose max-w-none leading-relaxed text-sm text-gray-800"
                                    dangerouslySetInnerHTML={{ __html: body || '<p class="text-gray-400 italic">No content</p>' }}
                                />
                            </div>

                            {files.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700">Attachments ({files.length})</h3>
                                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                                        {files.map((f, i) => (<li key={i}>{f.name} ({(f.size / 1024).toFixed(1)} KB)</li>))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-4 mt-8">
                            <button onClick={() => setShowPreview(false)} className="px-6 py-3 border border-gray-300 text-black rounded-full hover:bg-gray-50">Cancel</button>
                            <button onClick={() => {setShowPreview(false); handlePost(); }} className="px-6 py-3 bg-[#04095D] text-white rounded-full hover:bg-[#04095D]/90">Post Now</button>
                        </div>
                    </div>
                </Modal>

                {/* Critical priority confirmation - using Modal */}
                <Modal show={showCriticalConfirm} onClose={() => setShowCriticalConfirm(false)} maxWidth="md">
                    <div className="p-8 text-center">
                        <h2 className="text-2xl font-bold text-red-700 mb-4">Critical Announcement</h2>
                        <p className="text-gray-700 mb-6">This will send immediate notification to all members. Continue?</p>

                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={() => setShowCriticalConfirm(false)} className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50">Cancel</button>
                            <button onClick={criticalPost} className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700">Yes, Proceed</button>
                        </div>
                    </div>
                </Modal>

                {/* Discard confirmation - using Modal */}
                <Modal show={discardConfirm} onClose={() => setDiscardConfirm(false)} maxWidth="md">
                    <div className="p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Discard Draft?</h2>
                        <p className="text-gray-700 mb-6">All changes will be lost if you leave this page. Are you sure?</p>

                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={() => setDiscardConfirm(false)} className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50">Keep Editing</button>
                            <button onClick={confirmDiscard} className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700">Discard</button>
                        </div>
                    </div>
                </Modal>

                {/* Required fields validation modal */}
                <Modal show={showValidationError} onClose={() => setShowValidationError(false)} maxWidth="md">
                    <div className="p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Missing Fields</h2>
                        <p className="text-gray-700 mb-6">Please fill in all required fields: Title, Body, Priority, and at least one Audience member.</p>
                        <button onClick={() => setShowValidationError(false)} className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700">Okay</button>
                    </div>
                </Modal>
            </AuthenticatedLayout>
        </PageTransition>
    );
}