import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router, useForm } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';
import Dropdown from '@/Components/Dropdown';
import PageTransition from '@/Components/PageTransition';
import ReactQuill from 'react-quill'; //for rich text editor
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone'; // for file drag & drop
import { UploadCloud, X, Eye, Loader2} from 'lucide-react';
import Modal from '@/Components/Modal';

export default function Announce({ committees = [] }) {
    const [type, setType] = useState('Select Priority');
    const [selectedCommittee, setSelectedCommittee] = useState('');
    const [search, setSearch] = useState('');
    const [files, setFiles] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [showCriticalConfirm, setShowCriticalConfirm] = useState(false);
    const [discardConfirm, setDiscardConfirm] = useState(false);
    const [showValidationError, setShowValidationError] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const [fieldErrors, setFieldErrors] = useState({ title: false, content: false, type: false, committee: false });
    const [processing, setProcessing] = useState(false);

    // Custom member list picker
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [activeCommittee, setActiveCommittee] = useState(null); 
    const [selectedUserIds, setSelectedUserIds] = useState([]);   
    const [draftUserIds, setDraftUserIds] = useState([]);         

    const { data, setData } = useForm({
        title: '',
        content: '',
        type: '',
        committee_id: '',
        files: []
    });

    const isFormValid = data.title.trim() && data.content.trim() && type !== 'Select Priority' && selectedCommittee !== ''
        && (selectedCommittee !== 'custom' || selectedUserIds.length > 0);

    const typeOptions = ['Low', 'High', 'Normal', 'Critical'];
    const filteredCommittees = useMemo(() => {
        return committees.filter((committee) =>
            committee.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, committees]);

    const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
        onDrop: (acceptedFiles) => {
            setFiles((prev) => [...prev, ...acceptedFiles]);
        },
        multiple: true,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt']
        },
        maxSize: 10485760, // 10MB
    })

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };
    
    const handleCancel = () => {
        const content = data.title.trim() || data.content.trim() || selectedCommittee !== '' || files.length > 0;
        if (content) {
            setDiscardConfirm(true);
        } else {
            // Navigate back to announcements page
            router.visit(route('announcements.index'));
        }
    };

    //POST request
    const handlePost = () => {
        // Collect all missing fields
        const newFieldErrors = {
            title: !data.title.trim(),
            content: !data.content.trim() || data.content === '<p><br></p>',
            type: type === 'Select Priority' || !type,
            committee: !selectedCommittee || (selectedCommittee === 'custom' && selectedUserIds.length === 0),
        };
        
        if (Object.values(newFieldErrors).some(Boolean)) {
            setFieldErrors(newFieldErrors);
            setShowValidationError(true);
            
            // Set specific validation error messages
            const errors = [];
            if (newFieldErrors.title) errors.push('Title is required');
            if (newFieldErrors.content) errors.push('Content is required');
            if (newFieldErrors.type) errors.push('Please select a priority level');
            if (newFieldErrors.committee) {
                if (!selectedCommittee) {
                    errors.push('Please select a committee');
                } else if (selectedCommittee === 'custom' && selectedUserIds.length === 0) {
                    errors.push('Please select at least one member for custom announcement');
                }
            }
            setValidationErrors(errors);
            return;
        }

        if (type === 'Critical' && !showCriticalConfirm) {
            setShowCriticalConfirm(true);
            return;
        }

        setProcessing(true);

        // Create FormData for file uploads
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('type', type);
        formData.append('committee_id', selectedCommittee);

        if (selectedCommittee === 'custom') {
            selectedUserIds.forEach((uid) => formData.append('custom_user_ids[]', uid));
        }
        
        files.forEach((file) => {
            formData.append('files[]', file);
        });

        router.post(route('announcements.store'), formData, {
            onSuccess: () => {
                setProcessing(false);
                router.visit(route('announcements.index'));
                setTimeout(() => router.reload(), 500);
            },
            onError: (errors) => {
                setProcessing(false);
                console.error('Error creating announcement:', errors);
                console.error('Validation errors:', errors);
                
                if (typeof errors === 'object') {
                    let errorMessage = 'Please fix the following errors:';
                    Object.keys(errors).forEach(key => {
                        if (Array.isArray(errors[key])) {
                            errorMessage += `\n- ${errors[key][0]}`;
                        } else {
                            errorMessage += `\n- ${errors[key]}`;
                        }
                    });
                    alert(errorMessage);
                } else {
                    alert('Error creating announcement. Please check all required fields.');
                }
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
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
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Priority Level <span className="text-red-500">*</span>:</span>

                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button
                                                name="type"
                                                type="button"
                                                className={`inline-flex items-center px-4 py-2 bg-white border rounded-full shadow-sm text-sm ${
                                                    fieldErrors.type ? 'border-red-500 text-gray-700' :
                                                    type === 'Critical' ? 'text-red-600 border-red-400 bg-red-50' :
                                                    type === 'High' ? 'text-orange-600 border-orange-400 bg-orange-50' :
                                                    type === 'Normal' ? 'text-blue-600 border-blue-400 bg-blue-50' :
                                                    type === 'Low' ? 'text-gray-600 border-gray-400 bg-blue-50' : 'text-gray-700 border-gray-300 bg-white'
                                                } `}
                                            >{type}</button>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content align="left">
                                            {typeOptions.map((level) => (
                                                <button key={level} type="button"
                                                    onClick={() => { setType(level); setFieldErrors(prev => ({ ...prev, type: false })); }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >{level}</button>
                                            ))}
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                                {fieldErrors.type && <p className="text-xs text-red-500 pl-1">Priority level is required.</p>}
                            </div>

                            {/*target committee*/}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Target Committee <span className="text-red-500">*</span>:</span>

                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button type="button" className={`inline-flex items-center px-4 py-2 bg-white border rounded-full shadow-sm text-sm text-gray-700 hover:bg-gray-50 max-w-[400px] truncate ${fieldErrors.committee ? 'border-red-500' : 'border-gray-300'}`}
                                        >{selectedCommittee === 'all'
                                            ? 'All Members'
                                            : selectedCommittee === 'custom'
                                                ? selectedUserIds.length > 0
                                                    ? `Custom (${selectedUserIds.length} member${selectedUserIds.length !== 1 ? 's' : ''})`
                                                    : 'Custom Member List'
                                                : selectedCommittee
                                                    ? committees.find(c => c.id === parseInt(selectedCommittee))?.name || 'Select Committee'
                                                    : 'Select Committee'}</button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content align="left" width="48">
                                        <div className="p-2">
                                            <input
                                                type="text"
                                                placeholder="Search committees..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                onKeyDown={(e) => e.stopPropagation()}
                                                autoFocus
                                                className="w-full mb-2 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            />

                                            <div className="max-h-40 overflow-y-auto space-y-2">
                                                {/* All Members option */}
                                                <div
                                                    key="all"
                                                    className={`px-2 py-1 hover:bg-gray-100 rounded cursor-pointer ${selectedCommittee === 'all' ? 'bg-indigo-100' : ''}`}
                                                    onClick={() => { setSelectedCommittee('all'); setSearch(''); setFieldErrors(prev => ({ ...prev, committee: false })); }}>
                                                    <span className="text-sm font-medium text-gray-700">All Members</span>
                                                </div>
                                                {/* Custom Member List option */}
                                                <div
                                                    key="custom"
                                                    className={`px-2 py-1 hover:bg-gray-100 rounded cursor-pointer ${selectedCommittee === 'custom' ? 'bg-indigo-100' : ''}`}
                                                    onClick={() => {
                                                        setSelectedCommittee('custom');
                                                        setSearch('');
                                                        setDraftUserIds([...selectedUserIds]);
                                                        setActiveCommittee(committees[0] ?? null);
                                                        setShowCustomModal(true);
                                                        setFieldErrors(prev => ({ ...prev, committee: false }));
                                                    }}>
                                                    <span className="text-sm font-medium text-indigo-700">✦ Custom Member List</span>
                                                </div>
                                                {filteredCommittees.map((committee) => (
                                                    <div key={committee.id} 
                                                         className={`px-2 py-1 hover:bg-gray-100 rounded cursor-pointer ${selectedCommittee === committee.id.toString() ? 'bg-indigo-100' : ''}`} 
                                                         onClick={() => { setSelectedCommittee(committee.id.toString()); setSearch(''); setFieldErrors(prev => ({ ...prev, committee: false })); }}>
                                                        <span className="text-sm text-gray-700">{committee.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Dropdown.Content>
                                </Dropdown>
                                </div>
                                {fieldErrors.committee && <p className="text-xs text-red-500 pl-1">Target committee is required.</p>}
                            </div>
                        </div>
                    </div>
                    <div className="max-w-4xl mt-8 mx-auto">
                        {/* Announcement title */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                            <input name="title" type="text" value={data.title}
                                onChange={(e) => { if (e.target.value.length <= 200) { setData('title', e.target.value); setFieldErrors(prev => ({ ...prev, title: false })); } }}
                                maxLength={200} placeholder="Enter announcement title..."
                                className={`w-full px-4 py-2 rounded-xl border rounded-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${fieldErrors.title ? 'border-red-500' : 'border-gray-300'}`}/>
                            {fieldErrors.title && <p className="text-xs text-red-500 mt-1">Title is required.</p>}
                            <div 
                                className={`mt-1 text-right text-sm font-medium ${data.title.length === 200 ? 'text-red-600' : 'text-gray-500'}`} >{data.title.length} / 200
                            </div>
                        </div>                        
                        
                        {/*Announcement Body */}
                        <div className="mt-8 mb-16">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Body Text <span className="text-red-500">*</span></label>
                                
                            <div className={`bg-white rounded-xl border shadow-sm overflow-hidden ${fieldErrors.content ? 'border-red-500' : 'border-gray-300'}`}>
                                <ReactQuill 
                                    name="content" 
                                    theme="snow" 
                                    value={data.content}
                                    onChange={(value) => { setData('content', value); setFieldErrors(prev => ({ ...prev, content: false })); }}
                                    className="h-64"
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, false] }],
                                            ['bold', 'italic', 'underline', 'strike'],
                                            ['blockquote', 'code-block'],
                                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                            [{ 'color': [] }, { 'background': [] }],
                                            ['clean']
                                        ]
                                    }}
                                />
                            </div>
                            {fieldErrors.content && <p className="text-xs text-red-500 mt-2">Body text is required.</p>}
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
                            <button type="button" disabled={!isFormValid || processing} onClick={handlePost} className={`flex items-center justify-center gap-2 px-8 py-4 text-white text-sm rounded-full transition-all min-w-[180px] ${
                                processing ? 'bg-[#04095D]/70 cursor-not-allowed' : 'bg-[#04095D] hover:bg-[#04095D]/90'
                            }`}>
                                {processing ? (
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
                                        <span className="text-sm font-medium text-gray-800">Committee: </span>
                                        <span className="text-gray-500 text-sm">
                                            {selectedCommittee
                                            ? selectedCommittee === 'all'
                                                ? 'All Members'
                                                : committees.find(c => c.id === parseInt(selectedCommittee))?.name || 'Not selected'
                                            : 'Not selected'}
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

                                <h3 className="text-lg font-bold text-[#04095D] mb-2 mt-8">{data.title || 'No title'}</h3>
                            </div>

                            <div>
                                <div
                                    className="prose max-w-none leading-relaxed text-sm text-gray-800"
                                    dangerouslySetInnerHTML={{ __html: data.content || '<p class="text-gray-400 italic">No content</p>' }}
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
                    <div className="p-8">
                        <h2 className="text-xl font-bold text-red-600 mb-4">Please fix the following errors</h2>
                        <ul className="space-y-2 mb-6">
                            {validationErrors.map((err, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                                    <span className="mt-0.5 text-red-500 font-bold">✕</span>
                                    {err}
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-end">
                            <button onClick={() => setShowValidationError(false)} className="px-8 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 text-sm">Got it</button>
                        </div>
                    </div>
                </Modal>

                {/* ─── Custom Member List picker ─── */}
                <Modal show={showCustomModal} onClose={() => setShowCustomModal(false)} maxWidth="3xl">
                    <div className="p-6 flex flex-col h-[80vh] max-h-[600px]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Select Members</h2>
                            <button onClick={() => setShowCustomModal(false)} className="text-gray-500 hover:text-gray-700"><X size={20}/></button>
                        </div>

                        <div className="flex flex-1 gap-4 overflow-hidden">
                            {/* Left: committee list */}
                            <div className="w-1/3 border border-gray-200 rounded-xl overflow-y-auto">
                                <p className="text-xs font-semibold uppercase text-gray-400 px-4 pt-3 pb-2 tracking-wider">Committees</p>
                                {committees.map((c) => (
                                    <button
                                        key={c.id}
                                        type="button"
                                        onClick={() => setActiveCommittee(c)}
                                        className={`w-full text-left px-4 py-3 text-sm border-b border-gray-100 last:border-0 transition-colors ${
                                            activeCommittee?.id === c.id
                                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {c.name}
                                        {/* show count of selected members from this committee */}
                                        {(() => {
                                            const n = (c.users ?? []).filter(u => draftUserIds.includes(u.id)).length;
                                            return n > 0 ? <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">{n}</span> : null;
                                        })()}
                                    </button>
                                ))}
                            </div>

                            {/* Right: member checklist */}
                            <div className="flex-1 border border-gray-200 rounded-xl overflow-y-auto">
                                {activeCommittee ? (
                                    <>
                                        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-100">
                                            <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">{activeCommittee.name} Members</p>
                                            {/* Select all for this committee */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const ids = (activeCommittee.users ?? []).map(u => u.id);
                                                    const allSelected = ids.every(id => draftUserIds.includes(id));
                                                    if (allSelected) {
                                                        setDraftUserIds(prev => prev.filter(id => !ids.includes(id)));
                                                    } else {
                                                        setDraftUserIds(prev => [...new Set([...prev, ...ids])]);
                                                    }
                                                }}
                                                className="text-xs text-indigo-600 hover:underline"
                                            >
                                                {(activeCommittee.users ?? []).every(u => draftUserIds.includes(u.id))
                                                    ? 'Deselect all'
                                                    : 'Select all'}
                                            </button>
                                        </div>
                                        {(activeCommittee.users ?? []).length === 0 && (
                                            <p className="text-sm text-gray-400 px-4 py-6">No members in this committee.</p>
                                        )}
                                        {(activeCommittee.users ?? []).map((member) => (
                                            <label key={member.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    checked={draftUserIds.includes(member.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setDraftUserIds(prev => [...prev, member.id]);
                                                        } else {
                                                            setDraftUserIds(prev => prev.filter(id => id !== member.id));
                                                        }
                                                    }}
                                                />
                                                <span className="text-sm text-gray-800">{member.full_name}</span>
                                            </label>
                                        ))}
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-400 px-4 py-6">Select a committee on the left.</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500">{draftUserIds.length} member{draftUserIds.length !== 1 ? 's' : ''} selected</p>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setShowCustomModal(false); setDraftUserIds([...selectedUserIds]); }}
                                    className="px-5 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50"
                                >Cancel</button>
                                <button
                                    type="button"
                                    disabled={draftUserIds.length === 0}
                                    onClick={() => { setSelectedUserIds([...draftUserIds]); setShowCustomModal(false); setFieldErrors(prev => ({ ...prev, committee: false })); }}
                                    className="px-5 py-2 bg-[#04095D] text-white text-sm rounded-full hover:bg-[#04095D]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                >Confirm Selection</button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </AuthenticatedLayout>
        </PageTransition>
    );
}