import React, { useState, useEffect, useCallback } from 'react';
import { FOIARequest, UfoFile, NewsArticle, FOIAStatus } from '../types.ts';
import { fetchRecentNews, analyzeFileContent } from '../services/geminiService.ts';
import DashboardCard from '../components/DashboardCard.tsx';

const NewsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-6-4h6" /></svg>;
const FoiaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const FilesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;


const NewsWidget: React.FC = () => {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getNews = async () => {
            setLoading(true);
            const articles = await fetchRecentNews();
            setNews(articles);
            setLoading(false);
        };
        getNews();
    }, []);

    return (
        <DashboardCard title="Latest UAP News" icon={<NewsIcon />}>
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
                </div>
            ) : news.length > 0 ? (
                <ul className="space-y-4">
                    {news.map((item, index) => (
                        <li key={index} className="p-3 bg-slate-800/50 rounded-md border border-slate-700 hover:bg-slate-700/50 transition-colors">
                            <a href={item.uri} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                                {item.title}
                            </a>
                            <p className="text-sm text-slate-400 mt-2">{item.summary}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-slate-400 text-center mt-4">Could not fetch recent news. Please check your API key or try again later.</p>
            )}
        </DashboardCard>
    );
}

const FOIAWidget: React.FC = () => {
    const [requests, setRequests] = useState<FOIARequest[]>([
        { id: 'FOIA-001', subject: 'Project Blue Book - Unidentified Aerial Phenomena Sightings', status: FOIAStatus.Completed, date: '2023-10-26' },
        { id: 'FOIA-002', subject: 'AATIP Program Funding and Research Data', status: FOIAStatus.InProgress, date: '2024-01-15' },
    ]);
    
    return (
        <DashboardCard title="FOIA Requests" icon={<FoiaIcon />}>
            <ul className="space-y-3">
                {requests.map(req => (
                    <li key={req.id} className="p-3 bg-slate-800/50 rounded-md border border-slate-700">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-slate-200">{req.subject}</p>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                req.status === FOIAStatus.Completed ? 'bg-green-500/20 text-green-300' :
                                req.status === FOIAStatus.InProgress ? 'bg-yellow-500/20 text-yellow-300' :
                                req.status === FOIAStatus.Denied ? 'bg-red-500/20 text-red-300' :
                                'bg-blue-500/20 text-blue-300'
                            }`}>
                                {req.status}
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{req.id} - Submitted: {req.date}</p>
                    </li>
                ))}
            </ul>
        </DashboardCard>
    );
}

const FilesWidget: React.FC = () => {
    const [files, setFiles] = useState<UfoFile[]>([
        { id: 'FILE-001', name: 'Gimbal_Incident_Report.pdf', description: 'Leaked report detailing the 2004 USS Nimitz encounter. Key entities: USS Nimitz, USS Princeton, F/A-18 Super Hornets. Connects to "Tic Tac" phenomena.', added: '2023-05-12' },
        { id: 'FILE-002', name: 'Varginha_Witness_Testimonies.txt', description: 'Collection of transcribed witness accounts from the 1996 Brazil incident. Details non-human biologic entities and military response.', added: '2023-08-22' },
    ]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        setError(null);

        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target?.result as string;
            if (!content) {
                setError("Could not read the file.");
                setIsAnalyzing(false);
                return;
            }
            
            const analysisResult = await analyzeFileContent(selectedFile.name, content);

            const newFile: UfoFile = {
                id: `FILE-${Date.now()}`,
                name: selectedFile.name,
                description: analysisResult,
                added: new Date().toISOString().split('T')[0],
            };

            setFiles(prevFiles => [newFile, ...prevFiles]);
            setSelectedFile(null);
            setIsAnalyzing(false);
        };
        reader.onerror = () => {
            setError("Failed to read file.");
            setIsAnalyzing(false);
        };
        reader.readAsText(selectedFile);
    };


    return (
        <DashboardCard title="Important Files & Analysis" icon={<FilesIcon />}>
            <div className="p-1 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept=".txt,.md,.text" disabled={isAnalyzing}/>
                    <label htmlFor="file-upload" className="flex-1 cursor-pointer truncate text-sm p-2 bg-slate-800 border border-slate-700 rounded-md text-slate-400 hover:bg-slate-700">
                        {selectedFile ? selectedFile.name : 'Choose a text file...'}
                    </label>
                    <button onClick={handleAnalyze} disabled={!selectedFile || isAnalyzing} className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                       {isAnalyzing ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                       ) : <UploadIcon /> }
                        <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
                    </button>
                </div>
                {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                <div className="h-4"></div>
            </div>
             <ul className="space-y-3 h-[calc(100%-100px)] overflow-y-auto pr-2">
                {files.map(file => (
                    <li key={file.id} className="p-3 bg-slate-800/50 rounded-md border border-slate-700">
                        <p className="font-semibold text-cyan-400">{file.name}</p>
                        <p className="text-sm text-slate-300 mt-2 whitespace-pre-wrap">{file.description}</p>
                        <p className="text-xs text-slate-500 mt-3">Added: {file.added}</p>
                    </li>
                ))}
            </ul>
        </DashboardCard>
    );
}


const Dashboard: React.FC = () => {
  return (
    <div>
        <h1 className="text-3xl font-bold text-white mb-6">Researcher Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <NewsWidget />
            <FOIAWidget />
            <FilesWidget />
        </div>
    </div>
  );
};

export default Dashboard;