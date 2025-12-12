export function Footer() {
    return (
        <footer className="mt-16 mb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-slate-200 pt-6">
                    <div className="space-y-2 text-sm text-slate-500">
                        <div className="inline-flex items-center gap-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-lime-500 text-slate-900 text-xs font-semibold tracking-tight shadow-sm ring-1 ring-lime-400/80">
                                SN
                            </span>
                            <span className="font-medium text-slate-800">Smart Ngangon</span>
                        </div>
                        <p className="max-w-xs text-xs">
                            Monitoring ternak yang cerdas dan manusiawi sehingga Anda dapat
                            berinvestasi pada kambing dengan percaya diri—di mana pun Anda
                            berada.
                        </p>
                        <p className="text-[11px]">
                            © {new Date().getFullYear()} Smart Ngangon. All rights reserved.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-600">
                        <div className="space-y-2">
                            <p className="font-medium text-slate-900 text-xs">Produk</p>
                            <a href="#how-it-works" className="block hover:text-slate-900">
                                Cara Kerja
                            </a>
                            <a href="#marketplace" className="block hover:text-slate-900">
                                Marketplace
                            </a>
                            <a href="#monitoring" className="block hover:text-slate-900">
                                Dashboard Monitoring
                            </a>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium text-slate-900 text-xs">Perusahaan</p>
                            <a href="#" className="block hover:text-slate-900">
                                Tentang
                            </a>
                            <a href="#" className="block hover:text-slate-900">
                                Mitra
                            </a>
                            <a href="#" className="block hover:text-slate-900">
                                Karir
                            </a>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium text-slate-900 text-xs">Dukungan</p>
                            <a href="#" className="block hover:text-slate-900">
                                Pusat Bantuan
                            </a>
                            <a href="#" className="block hover:text-slate-900">
                                Privasi
                            </a>
                            <a href="#" className="block hover:text-slate-900">
                                Syarat & Ketentuan
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
