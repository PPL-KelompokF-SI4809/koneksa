import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome({ title, description, laravelVersion, phpVersion }) {
    const [count, setCount] = useState(0);

    return (
        <>
            <Head title={title || "Selamat Datang"} />
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
                <div className="max-w-2xl w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-8 shadow-2xl backdrop-blur-sm text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Inertia.js + React Setup Ready
                    </div>

                    {/* Header */}
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
                        {title || "Koneksa Platform"}
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base mb-8 max-w-lg mx-auto">
                        {description || "Fondasi Laravel + Inertia.js + React + Tailwind CSS sudah siap digunakan untuk pengembangan tim."}
                    </p>

                    {/* Interactive React State Demo */}
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 mb-8 inline-block">
                        <p className="text-xs text-slate-400 mb-2">Test React Interactivity:</p>
                        <button
                            onClick={() => setCount((c) => c + 1)}
                            className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                        >
                            Tombol Ditekan: <span className="font-bold ml-1">{count}x</span>
                        </button>
                    </div>

                    {/* Tech Stack Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                        <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700/70">
                            <span className="text-[11px] text-slate-400 block">Backend</span>
                            <span className="text-sm font-semibold text-white">Laravel {laravelVersion || '12.x'}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700/70">
                            <span className="text-[11px] text-slate-400 block">PHP Runtime</span>
                            <span className="text-sm font-semibold text-white">PHP {phpVersion || '8.5'}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700/70">
                            <span className="text-[11px] text-slate-400 block">Frontend</span>
                            <span className="text-sm font-semibold text-white">React 19 + Inertia</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700/70">
                            <span className="text-[11px] text-slate-400 block">Styling</span>
                            <span className="text-sm font-semibold text-white">Tailwind CSS v4</span>
                        </div>
                    </div>
                </div>

                <footer className="mt-8 text-xs text-slate-500">
                    Koneksa &copy; {new Date().getFullYear()} &bull; Siap didevelop oleh tim
                </footer>
            </div>
        </>
    );
}
