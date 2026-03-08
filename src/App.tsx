import React, { useState, useEffect, useMemo } from 'react';
import { useRef } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';
import {
  Scale,
  BookOpen,
  Gavel,
  MapPin,
  MessageSquare,
  Users,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  Phone,
  Mail,
  Shield,
  LogIn,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Map as MapIcon,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix untuk ikon Leaflet default
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// Use the SVG logo from src/asset. Using new URL avoids needing extra TS declarations for svg modules.
const logoUrl = new URL('./asset/LOGO PAL.svg', import.meta.url).href;

// --- Components ---

const Logo = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-2", className)}>
    <div className="relative w-10 h-10 flex items-center justify-center rounded-full overflow-hidden">
      {/* Use the provided SVG logo file */}
      <img src={logoUrl} alt="PAL-A Logo" className="w-full h-full object-cover" />
    </div>
    <div className="flex flex-col leading-tight">
      <span className="font-bold text-xl tracking-tight text-slate-900">PAL-A</span>
      <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">Palembang Legal Access</span>
    </div>
  </div>
);

const Navbar = ({ user, logout }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/', icon: Scale },
    { name: 'Edukasi', path: '/education', icon: BookOpen },
    { name: 'Undang-Undang', path: '/laws', icon: Gavel },
    { name: 'Peta LBH', path: '/map', icon: MapPin },
    { name: 'Konsultasi', path: '/consultation', icon: MessageSquare },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  location.pathname === link.path
                    ? "text-blue-600"
                    : "text-slate-600"
                )}
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Halo, {user.name}</span>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium",
                    location.pathname === link.path
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <link.icon size={20} />
                  {link.name}
                </Link>
              ))}
              {!user ? (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-blue-600"
                >
                  <LogIn size={20} />
                  Masuk / Daftar
                </Link>
              ) : (
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="flex w-full items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-red-600"
                >
                  <LogIn size={20} className="rotate-180" />
                  Keluar
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Pages ---

const Home = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(59,130,246,0.1)_0%,transparent_100%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block mb-6 text-sm font-semibold tracking-wide text-slate-900 uppercase">
              Keadilan untuk Semua
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Akses Hukum <span className="text-blue-600">Mudah & Terpercaya</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10 leading-relaxed">
              PAL-A hadir sebagai solusi digital untuk masyarakat Palembang dan Indonesia dalam mendapatkan edukasi, informasi undang-undang, dan bantuan hukum profesional.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/consultation" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 active:scale-95">
                Konsultasi Sekarang
              </Link>
              <Link to="/map" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-lg shadow-sm hover:bg-slate-50 transition-all">
                Cari LBH Terdekat
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Edukasi Hukum', desc: 'Artikel dan video pembelajaran hukum yang mudah dipahami orang awam.', icon: BookOpen, color: 'blue' },
            { title: 'Database UU', desc: 'Akses lengkap ke seluruh undang-undang dan peraturan yang berlaku di Indonesia.', icon: Gavel, color: 'emerald' },
            { title: 'Peta Bantuan', desc: 'Temukan lokasi LBH dan POSBAKUM terdekat dengan navigasi GPS real-time.', icon: MapPin, color: 'orange' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform",
                feature.color === 'blue' ? "bg-blue-50 text-blue-600" :
                  feature.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                    "bg-orange-50 text-orange-600"
              )}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 dark:bg-blue-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Undang-Undang', value: '5,000+' },
              { label: 'LBH Terdaftar', value: '250+' },
              { label: 'Konsultasi Selesai', value: '12,000+' },
              { label: 'Pengacara Aktif', value: '150+' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400 text-sm uppercase tracking-widest font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const Education = () => {
  const categories = ['Pidana', 'Perdata', 'Keluarga', 'Bisnis', 'Ketenagakerjaan'];
  const [activeCat, setActiveCat] = useState('Semua');

  const articles = [
    { id: 1, title: 'Memahami Hak-Hak Tersangka dalam Proses Penyidikan', cat: 'Pidana', date: '20 Mei 2024', img: 'https://picsum.photos/seed/law1/800/600' },
    { id: 2, title: 'Prosedur Gugatan Cerai dan Hak Asuh Anak', cat: 'Keluarga', date: '18 Mei 2024', img: 'https://picsum.photos/seed/law2/800/600' },
    { id: 3, title: 'Pentingnya Perjanjian Kerja bagi Karyawan Swasta', cat: 'Ketenagakerjaan', date: '15 Mei 2024', img: 'https://picsum.photos/seed/law3/800/600' },
    { id: 4, title: 'Langkah Hukum Jika Terjadi Sengketa Tanah', cat: 'Perdata', date: '12 Mei 2024', img: 'https://picsum.photos/seed/law4/800/600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Edukasi Hukum</h1>
          <p className="text-slate-600">Tingkatkan pemahaman hukum Anda melalui artikel pilihan kami.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          {['Semua', ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeCat === cat
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white text-slate-600 border border-slate-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.filter(a => activeCat === 'Semua' || a.cat === activeCat).map((article) => (
          <motion.div
            layout
            key={article.id}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={article.img}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 px-2 py-0.5 bg-blue-50 rounded">
                  {article.cat}
                </span>
                <span className="text-xs text-slate-400">{article.date}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                {article.title}
              </h3>
              <button className="flex items-center gap-2 text-sm font-bold text-blue-600 group/btn">
                Baca Selengkapnya <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Laws = () => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'uu' | 'putusan' | 'kasus'>('uu');

  const laws = [
    { title: 'UU No. 1 Tahun 2024', desc: 'Perubahan Kedua atas UU No. 11 Tahun 2008 tentang ITE', year: '2024' },
    { title: 'UU No. 1 Tahun 2023', desc: 'Kitab Undang-Undang Hukum Pidana (KUHP)', year: '2023' },
    { title: 'UU No. 27 Tahun 2022', desc: 'Pelindungan Data Pribadi (PDP)', year: '2022' },
  ];

  const rulings = [
    { title: 'Putusan PN Palembang No. 123/Pid.B/2023', desc: 'Kasus Tindak Pidana Korupsi Pengadaan Barang', year: '2023' },
    { title: 'Putusan MA No. 456 K/Pdt/2022', desc: 'Sengketa Lahan Perkebunan di Sumatera Selatan', year: '2022' },
  ];

  const cases = [
    { title: 'Studi Kasus: Wanprestasi dalam Kontrak Bisnis', desc: 'Analisis hukum terhadap pembatalan sepihak kontrak kerjasama.', year: '2024' },
    { title: 'Studi Kasus: Hak Waris Anak Luar Kawin', desc: 'Tinjauan putusan MK terkait status hukum anak luar kawin.', year: '2023' },
  ];

  const activeData = tab === 'uu' ? laws : tab === 'putusan' ? rulings : cases;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Pusat Data Hukum</h1>
        <p className="text-slate-600">Akses lengkap Undang-Undang, Putusan Peradilan, dan Studi Kasus.</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-slate-100 p-1 rounded-2xl flex">
          <button onClick={() => setTab('uu')} className={cn("px-6 py-2 rounded-xl text-sm font-bold transition-all", tab === 'uu' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}>Undang-Undang</button>
          <button onClick={() => setTab('putusan')} className={cn("px-6 py-2 rounded-xl text-sm font-bold transition-all", tab === 'putusan' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}>Putusan</button>
          <button onClick={() => setTab('kasus')} className={cn("px-6 py-2 rounded-xl text-sm font-bold transition-all", tab === 'kasus' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}>Studi Kasus</button>
        </div>
      </div>

      <div className="relative mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Cari dokumen atau kata kunci..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
        />
      </div>

      <div className="space-y-4">
        {activeData.filter(l => l.title.toLowerCase().includes(search.toLowerCase()) || l.desc.toLowerCase().includes(search.toLowerCase())).map((item, i) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            key={i}
            className="p-6 bg-white rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                <Gavel size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            </div>
            <button className="p-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white transition-all">
              <ChevronRight size={20} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const MapPage = () => {
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
  const [selectedLBH, setSelectedLBH] = useState<number | null>(null);
  const [showUserMarker, setShowUserMarker] = useState(false);
  const mapRef = useRef<any>(null);

  // Actual LBH locations in Palembang
  const lbhLocations = [
    { id: 1, name: "LBH Palembang", lat: -2.9761, lng: 104.7754, address: "Jl. Merdeka No. 10, Kel. Talang Semut, Kec. Bukit Kecil, Palembang", phone: "0711-352243" },
    { id: 2, name: "Posbakum PN Palembang Kelas IA Khusus", lat: -2.9901, lng: 104.7567, address: "Jl. Kapten A. Rivai No. 1, Palembang", phone: "0711-352243" },
    { id: 3, name: "LBH Ampera Palembang", lat: -2.9833, lng: 104.7667, address: "Jl. Jend. Sudirman No. 123, Palembang", phone: "0812-7123-4567" },
    { id: 4, name: "LBH Sumsel", lat: -2.9722, lng: 104.7411, address: "Jl. POM IX, Kampus, Palembang", phone: "0711-311311" },
    { id: 5, name: "LBH Universitas Muhammadiyah Palembang", lat: -2.9944, lng: 104.7889, address: "Jl. Jend. Ahmad Yani 13 Ulu, Palembang", phone: "0711-513022" },
    { id: 6, name: "LBH APIK Sumatera Selatan", lat: -2.9667, lng: 104.7500, address: "Jl. Srijaya Negara, Palembang", phone: "0813-6767-1234" },
  ];

  // Default Palembang center
  const defaultCenter: [number, number] = [-2.9761, 104.7754];

  // Custom icon untuk LBH marker
  const lbhIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Custom icon untuk user location
  const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Custom icon untuk LBH marker yang dipilih (highlight)
  const lbhIconSelected = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [32, 51],
    iconAnchor: [16, 51],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLoc([pos.coords.latitude, pos.coords.longitude]);
          setShowUserMarker(true);
        },
        (error) => {
          console.log('GPS access denied or error:', error);
          setUserLoc(null);
          setShowUserMarker(false);
        },
        {
          timeout: 5000,
          enableHighAccuracy: false
        }
      );
    }
  }, []);

  // Pan ke lokasi LBH ketika diklik di sidebar
  useEffect(() => {
    if (selectedLBH && mapRef.current) {
      const selected = lbhLocations.find(lbh => lbh.id === selectedLBH);
      if (selected) {
        mapRef.current.setView([selected.lat, selected.lng], 15, { animate: true });
      }
    }
  }, [selectedLBH]);

  const mapCenter: [number, number] = userLoc || defaultCenter;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-96 bg-white border-r border-slate-200 overflow-y-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Peta Bantuan Hukum</h1>
          <p className="text-sm text-slate-500">Temukan LBH dan POSBAKUM terdekat dari lokasi Anda.</p>
        </div>

        <div className="space-y-4">
          {lbhLocations.map((lbh) => (
            <div
              key={lbh.id}
              onClick={() => setSelectedLBH(lbh.id)}
              className={cn(
                "p-4 rounded-2xl border transition-all cursor-pointer group",
                selectedLBH === lbh.id
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-slate-100 hover:border-blue-500 hover:shadow-sm"
              )}
            >
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <MapPin size={16} className="text-blue-600" />
                {lbh.name}
              </h3>
              <p className="text-xs text-slate-500 mb-3">{lbh.address}</p>
              <div className="flex gap-2">
                <a
                  href={`tel:${lbh.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Phone size={14} /> Hubungi
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const selected = lbhLocations.find(l => l.id === lbh.id);
                    if (selected) {
                      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`;
                      window.open(mapsUrl, '_blank');
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-900 hover:text-white transition-all"
                >
                  <Navigation size={14} /> Rute
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 bg-slate-100 relative overflow-hidden">
        <MapContainer
          ref={mapRef}
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User Location Marker */}
          {showUserMarker && userLoc && (
            <Marker position={userLoc} icon={userIcon}>
              <Popup>
                <div className="text-sm font-semibold">📍 Lokasi Anda Saat Ini</div>
              </Popup>
            </Marker>
          )}

          {/* LBH Locations Markers */}
          {lbhLocations.map((lbh) => (
            <Marker
              key={lbh.id}
              position={[lbh.lat, lbh.lng]}
              icon={selectedLBH === lbh.id ? lbhIconSelected : lbhIcon}
              eventHandlers={{
                click: () => {
                  setSelectedLBH(lbh.id);
                },
              }}
            >
              <Popup>
                <div className="text-sm w-48">
                  <h4 className="font-bold text-slate-900 mb-2">{lbh.name}</h4>
                  <p className="text-xs text-slate-600 mb-3">{lbh.address}</p>
                  <a
                    href={`tel:${lbh.phone}`}
                    className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    📞 {lbh.phone}
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Info badge - GPS status */}
        {!showUserMarker && (
          <div className="absolute bottom-6 left-6 bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-lg text-sm text-slate-600 z-10">
            📍 GPS tidak aktif - menampilkan Peta Palembang
          </div>
        )}
      </div>
    </div>
  );
};

const Consultation = ({ user }: any) => {
  const [activeTab, setActiveTab] = useState<'free' | 'paid'>('free');
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield size={40} className="text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Akses Terbatas</h2>
        <p className="text-slate-600 mb-8">Silakan masuk atau daftar akun terlebih dahulu untuk menggunakan layanan konsultasi hukum.</p>
        <Link to="/login" className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20">
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Konsultasi Hukum Online</h1>
        <p className="text-slate-600">Dapatkan solusi hukum dari para ahli secara cepat dan aman.</p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="bg-slate-100 p-1 rounded-2xl flex">
          <button
            onClick={() => setActiveTab('free')}
            className={cn(
              "px-8 py-3 rounded-xl text-sm font-bold transition-all",
              activeTab === 'free' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
            )}
          >
            Gratis (Pro Bono)
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={cn(
              "px-8 py-3 rounded-xl text-sm font-bold transition-all",
              activeTab === 'paid' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
            )}
          >
            Berbayar (Premium)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Ajukan Pertanyaan Baru</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Subjek Masalah</label>
                <input type="text" placeholder="Contoh: Sengketa Warisan Keluarga" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Kategori Hukum</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900">
                  <option>Hukum Pidana</option>
                  <option>Hukum Perdata</option>
                  <option>Hukum Keluarga</option>
                  <option>Hukum Bisnis</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Ceritakan Masalah Anda</label>
                <textarea rows={6} placeholder="Jelaskan secara detail kronologi masalah hukum yang Anda hadapi..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"></textarea>
              </div>
              <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all">
                {activeTab === 'free' ? 'Kirim Pertanyaan Gratis' : 'Lanjut ke Pembayaran'}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Info/Lawyers */}
        <div className="space-y-8">
          <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 size={24} />
              {activeTab === 'free' ? 'Layanan Gratis' : 'Layanan Premium'}
            </h3>
            <ul className="space-y-4 text-blue-100 text-sm">
              <li className="flex items-start gap-3">
                <Clock size={18} className="shrink-0 mt-0.5" />
                <span>{activeTab === 'free' ? 'Respon dalam 24-48 jam' : 'Respon cepat dalam < 1 jam'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Users size={18} className="shrink-0 mt-0.5" />
                <span>{activeTab === 'free' ? 'Dijawab oleh asisten hukum' : 'Langsung dengan Pengacara Senior'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield size={18} className="shrink-0 mt-0.5" />
                <span>Kerahasiaan data terjamin 100%</span>
              </li>
              {activeTab === 'paid' && (
                <li className="flex items-start gap-3">
                  <CreditCard size={18} className="shrink-0 mt-0.5" />
                  <span>Biaya mulai dari Rp 150.000 / sesi</span>
                </li>
              )}
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Pengacara Tersedia</h3>
            <div className="space-y-6">
              {[
                { name: 'Budi Santoso, S.H.', specialty: 'Pidana', rating: 4.8 },
                { name: 'Siti Aminah, S.H.', specialty: 'Perdata', rating: 4.9 },
              ].map((lawyer, i) => (
                <div key={i} className="flex items-center gap-4">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-12 h-12 rounded-full object-cover" alt="" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{lawyer.name}</h4>
                    <p className="text-xs text-slate-500">{lawyer.specialty} • ⭐ {lawyer.rating}</p>
                  </div>
                  <button className="ml-auto p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <ArrowRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Auth = ({ type, setUser }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = type === 'login' ? '/api/login' : '/api/register';
    const body = type === 'login' ? { email, password } : { name, email, password };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();

    if (data.success) {
      if (type === 'login') {
        setUser(data.user);
        navigate('/');
      } else {
        navigate('/login');
      }
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-slate-100"
      >
        <div className="text-center mb-10">
          <Logo className="justify-center mb-6" />
          <h2 className="text-2xl font-bold text-slate-900">
            {type === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
          </h2>
          <p className="text-slate-500 mt-2">
            {type === 'login' ? 'Masuk untuk mengakses layanan hukum Anda.' : 'Daftar untuk mulai konsultasi hukum.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'register' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Kata Sandi</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>
          <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all active:scale-95">
            {type === 'login' ? 'Masuk' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          {type === 'login' ? (
            <p>Belum punya akun? <Link to="/register" className="text-blue-600 font-bold">Daftar di sini</Link></p>
          ) : (
            <p>Sudah punya akun? <Link to="/login" className="text-blue-600 font-bold">Masuk di sini</Link></p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<any>(null);

  const logout = () => setUser(null);

  return (
    <Router>
      <div className="min-h-screen bg-white transition-colors duration-300">
        <Navbar user={user} logout={logout} />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/education" element={<Education />} />
            <Route path="/laws" element={<Laws />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/consultation" element={<Consultation user={user} />} />
            <Route path="/login" element={<Auth type="login" setUser={setUser} />} />
            <Route path="/register" element={<Auth type="register" setUser={setUser} />} />
          </Routes>
        </main>

        <footer className="bg-slate-50 border-t border-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2">
                <Logo className="mb-6" />
                <p className="text-slate-500 max-w-sm mb-6">
                  Platform digital terintegrasi untuk mempermudah akses keadilan dan bantuan hukum bagi seluruh lapisan masyarakat.
                </p>
                <div className="flex gap-4">
                  {[Phone, Mail, MapPin].map((Icon, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
                      <Icon size={18} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-6">Layanan</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li><Link to="/consultation" className="hover:text-blue-600">Konsultasi Gratis</Link></li>
                  <li><Link to="/consultation" className="hover:text-blue-600">Konsultasi Premium</Link></li>
                  <li><Link to="/map" className="hover:text-blue-600">Cari LBH</Link></li>
                  <li><Link to="/laws" className="hover:text-blue-600">Database Hukum</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-6">Bantuan</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li><a href="#" className="hover:text-blue-600">Tentang Kami</a></li>
                  <li><a href="#" className="hover:text-blue-600">Syarat & Ketentuan</a></li>
                  <li><a href="#" className="hover:text-blue-600">Kebijakan Privasi</a></li>
                  <li><a href="#" className="hover:text-blue-600">Kontak</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-400">
              © {new Date().getFullYear()} PAL-A (Palembang Legal-Access). Seluruh Hak Cipta Dilindungi.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
