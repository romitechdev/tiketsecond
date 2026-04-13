export default function PrivacyPage() {
  return (
    <div className="max-w-[1200px] mx-auto pt-8 px-4 md:px-8 pb-32">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar */}
        <div className="lg:w-1/3 lg:max-w-xs shrink-0 flex flex-col gap-6">
          <div className="border-[3px] border-black bg-white p-8 shadow-kinetic">
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-[0.9] mb-6">Kebijakan<br/>Privasi</h1>
            <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-6 border-b-2 border-black pb-4">
              Terakhir Diperbarui: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase()}
            </p>
            
            <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest mb-8">
              <li className="hover:ml-2 transition-all cursor-pointer">01. Pengenalan</li>
              <li className="hover:ml-2 transition-all cursor-pointer">02. Pengumpulan Data</li>
              <li className="hover:ml-2 transition-all cursor-pointer">03. Protokol Penggunaan</li>
              <li className="hover:ml-2 transition-all cursor-pointer">04. Keamanan TiketSecond</li>
              <li className="hover:ml-2 transition-all cursor-pointer">05. Hak Penumpang</li>
            </ul>

            <div className="bg-[#e5e5e5] border-2 border-black p-4">
              <p className="text-[8px] font-black uppercase tracking-widest text-gray-700 leading-tight">
                Dokumen ini menjelaskan cara TiketSecond mengelola data Anda secara aman, transparan, dan sesuai hukum yang berlaku.
              </p>
            </div>
          </div>

          <div className="border-[3px] border-black bg-black text-white h-48 flex items-center justify-center shadow-kinetic relative overflow-hidden group">
            {/* Railroad image placeholder */}
            <img src="https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale filter group-hover:scale-110 transition duration-1000" />
            <div className="border-2 border-white px-6 py-2 relative z-10 bg-black">
              <span className="text-sm font-black uppercase tracking-widest">Data Flow</span>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:w-2/3 space-y-8">
          
          <div className="border-[3px] border-black bg-white p-8 md:p-10 shadow-kinetic">
             <div className="flex items-center gap-4 mb-6">
                <span className="bg-black text-white px-2 py-1 text-lg font-black tracking-tighter">01</span>
                <h2 className="text-xl font-black uppercase tracking-tighter">Pengenalan</h2>
             </div>
             <div className="text-xs font-semibold text-gray-700 leading-relaxed space-y-4">
               <p>Di <strong>TIKETSECOND</strong>, privasi pengguna adalah prioritas utama. Kami hanya mengumpulkan data yang benar-benar diperlukan agar transaksi tiket berjalan lancar dan aman.</p>
               <p>Kebijakan ini menjelaskan data apa yang kami simpan, kenapa dibutuhkan, dan bagaimana Anda tetap punya kendali atas data pribadi Anda.</p>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex-1 border-[3px] border-black bg-white p-6 shadow-kinetic">
               <div className="flex items-center gap-3 mb-6">
                  <span className="bg-black text-white px-2 py-1 text-sm font-black tracking-tighter">02.A</span>
                  <h2 className="text-sm font-black uppercase tracking-tighter">Data Identitas</h2>
               </div>
               <ul className="space-y-3 text-[9px] font-black uppercase tracking-widest text-gray-600">
                 <li><span className="mr-2">→</span> Nama Lengkap</li>
                 <li><span className="mr-2">→</span> Email dan Nomor Kontak</li>
                 <li><span className="mr-2">→</span> Data Akun Pengguna</li>
                 <li><span className="mr-2">→</span> Riwayat Aktivitas Transaksi</li>
               </ul>
            </div>
            
            <div className="flex-1 border-[3px] border-black bg-white p-6 shadow-kinetic">
               <div className="flex items-center gap-3 mb-6">
                  <span className="bg-black text-white px-2 py-1 text-sm font-black tracking-tighter">02.B</span>
                  <h2 className="text-sm font-black uppercase tracking-tighter">Data TiketSecond</h2>
               </div>
               <ul className="space-y-3 text-[9px] font-black uppercase tracking-widest text-gray-600">
                 <li><span className="mr-2">→</span> Data Pencarian Tiket</li>
                 <li><span className="mr-2">→</span> Riwayat Tiket Diunggah atau Dibeli</li>
                 <li><span className="mr-2">→</span> Informasi Perangkat Dasar</li>
                 <li><span className="mr-2">→</span> Data Keamanan Login</li>
               </ul>
            </div>
          </div>

          <div className="border-[3px] border-black bg-white p-8 md:p-10 shadow-kinetic relative">
             <div className="flex items-center gap-4 mb-8">
                <span className="bg-black text-white px-2 py-1 text-lg font-black tracking-tighter">03</span>
                <h2 className="text-xl font-black uppercase tracking-tighter">Protokol Penggunaan</h2>
             </div>
             
             <div className="space-y-8 pl-4 border-l-4 border-black">
               <div>
                 <h4 className="text-sm font-black uppercase tracking-tighter mb-2">Kemudahan Transit</h4>
                 <p className="text-[11px] font-medium text-gray-600 leading-relaxed">Data digunakan untuk mencocokkan pembeli dan penjual, menampilkan detail tiket yang relevan, serta memastikan proses transaksi berjalan lancar.</p>
               </div>
               <div>
                 <h4 className="text-sm font-black uppercase tracking-tighter mb-2">Integritas Operasional</h4>
                 <p className="text-[11px] font-medium text-gray-600 leading-relaxed">Kami menganalisis pola aktivitas untuk mendeteksi penyalahgunaan, mencegah penipuan, dan menjaga ekosistem TiketSecond tetap aman untuk semua pengguna.</p>
               </div>
               <div>
                 <h4 className="text-sm font-black uppercase tracking-tighter mb-2">Kebijakan Pemasaran Nol</h4>
                 <p className="text-[11px] font-medium text-gray-600 leading-relaxed">TIKETSECOND tidak menjual data pribadi Anda ke pihak ketiga. Data Anda hanya digunakan untuk kebutuhan layanan TiketSecond.</p>
               </div>
             </div>
          </div>

          <div className="border-[3px] border-black bg-black text-white p-8 md:p-10 shadow-kinetic">
             <div className="flex items-center gap-4 mb-6">
                <span className="bg-white text-black px-2 py-1 text-lg font-black tracking-tighter">04</span>
                <h2 className="text-xl font-black uppercase tracking-tighter">Keamanan TiketSecond</h2>
             </div>
             <p className="text-xs font-medium text-gray-300 leading-relaxed mb-8">
               Kami menerapkan enkripsi, pembatasan akses, dan pemantauan sistem secara berkala untuk melindungi data pengguna. Hanya pihak berwenang yang dapat mengakses data tertentu sesuai kebutuhan operasional.
             </p>
             <div className="flex flex-wrap gap-4">
               <span className="bg-white text-black px-3 py-1.5 text-[8px] font-black uppercase tracking-widest border border-white">AES-256 Terenkripsi</span>
               <span className="bg-white text-black px-3 py-1.5 text-[8px] font-black uppercase tracking-widest border border-white">ISO 27001 Compliant</span>
               <span className="bg-white text-black px-3 py-1.5 text-[8px] font-black uppercase tracking-widest border border-white">Arsitektur Zero-Trust</span>
             </div>
          </div>

          <div className="border-[3px] border-black bg-white p-8 md:p-10 shadow-kinetic">
             <div className="flex items-center gap-4 mb-8">
                <span className="bg-black text-white px-2 py-1 text-lg font-black tracking-tighter">05</span>
                <h2 className="text-xl font-black uppercase tracking-tighter">Hak Penumpang</h2>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div>
                 <h4 className="text-xs font-black uppercase tracking-widest mb-3">Hak Penghapusan</h4>
                 <p className="text-[10px] font-medium text-gray-600 leading-relaxed">Anda dapat meminta penghapusan data tertentu sesuai ketentuan hukum yang berlaku.</p>
               </div>
               <div>
                 <h4 className="text-xs font-black uppercase tracking-widest mb-3">Portabilitas Data</h4>
                 <p className="text-[10px] font-medium text-gray-600 leading-relaxed">Anda dapat meminta salinan data akun untuk kebutuhan arsip pribadi.</p>
               </div>
               <div>
                 <h4 className="text-xs font-black uppercase tracking-widest mb-3">Kontrol Verifikasi</h4>
                 <p className="text-[10px] font-medium text-gray-600 leading-relaxed">Anda dapat memperbarui data profil agar informasi transaksi tetap akurat.</p>
               </div>
               <div>
                 <h4 className="text-xs font-black uppercase tracking-widest mb-3">Akses Audit</h4>
                 <p className="text-[10px] font-medium text-gray-600 leading-relaxed">Anda berhak mengetahui bagaimana data Anda diproses di platform TiketSecond.</p>
               </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  )
}
