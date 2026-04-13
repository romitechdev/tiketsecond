export default function TermsPage() {
  return (
    <div className="max-w-[1200px] mx-auto pt-8 px-4 md:px-8 pb-32">
      <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
        
        {/* Left Sidebar */}
        <div className="lg:w-1/4 shrink-0">
          <div className="border-2 border-black bg-white p-6 shadow-sm sticky top-28">
            <h4 className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-6">Indeks Dokumen</h4>
            <ul className="space-y-4 text-[9px] font-black uppercase tracking-widest">
              <li className="cursor-pointer">00. Pengenalan</li>
              <li className="cursor-pointer">01. Penggunaan Layanan</li>
              <li className="cursor-pointer">02. Transaksi</li>
              <li className="cursor-pointer">03. Pembatalan</li>
              <li className="cursor-pointer">04. Keamanan Data</li>
              <li className="border-t-2 border-black pt-4 mt-4 cursor-pointer hover:font-bold">05. Kontak Kami</li>
            </ul>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:w-3/4 space-y-12">
          
          <div className="pt-2 border-t-[6px] border-black">
            <span className="bg-black text-white px-2 py-1 text-[8px] font-black uppercase tracking-widest mb-6 inline-block">
              Dokumen Hukum V2.4
            </span>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-4">
              Syarat &<br/>Ketentuan
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8 border-b-2 border-gray-200 pb-6">
              Terakhir Diubah: 24 Oktober 2024
            </p>
            
            <p className="text-lg font-bold text-gray-900 leading-tight mb-4 max-w-xl">
              Selamat datang di TiketSecond. Dengan menggunakan platform ini, Anda menyetujui aturan layanan yang dirancang untuk melindungi pembeli dan penjual.
            </p>
            <p className="text-xs font-semibold text-gray-500 leading-relaxed mb-6 max-w-2xl">
              Dokumen ini mengatur proses unggah, pencarian, dan pembelian tiket di marketplace TiketSecond. Kami berperan sebagai penghubung antar pengguna agar transaksi tiket berjalan aman dan transparan.
            </p>
          </div>

          <div className="border-[3px] border-black p-8 shadow-kinetic bg-white">
             <div className="flex items-center gap-4 mb-6">
                <span className="bg-black text-white px-2 py-1 text-lg font-black tracking-tighter">01</span>
                <h2 className="text-xl font-black uppercase tracking-tighter">Penggunaan Layanan</h2>
             </div>
             <div className="space-y-6">
               <div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">1.1 Kelayakan</h4>
                 <p className="text-xs font-medium text-gray-600 leading-relaxed">Pengguna harus berusia minimal 18 tahun atau mendapat izin wali yang sah. Semua informasi akun wajib akurat agar transaksi tetap valid.</p>
               </div>
               <div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">1.2 Integritas Sistem</h4>
                 <p className="text-xs font-medium text-gray-600 leading-relaxed mb-4">Pengguna dilarang menyalahgunakan platform, termasuk penggunaan bot, scraping data, percobaan akses ilegal, atau tindakan lain yang mengganggu sistem.</p>
                 <div className="bg-gray-100 border-l-4 border-black p-4 text-[10px] font-black uppercase tracking-widest">
                   Peringatan: Pelanggaran integritas sistem akan mengakibatkan pemblokiran permanen dan pelaporan ke pihak berwenang.
                 </div>
               </div>
             </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b-4 border-black pb-4">
              <span className="bg-black text-white px-2 py-1 text-lg font-black tracking-tighter">02</span>
              <h2 className="text-2xl font-black uppercase tracking-tighter">Transaksi</h2>
            </div>
            
            <div className="border-[2px] border-black p-6 bg-white shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-3">2.1 Harga dan Ketersediaan</h4>
              <p className="text-xs font-medium text-gray-600 leading-relaxed">Harga dan ketersediaan tiket ditentukan oleh pengguna yang menjual tiket. Tiket dianggap valid setelah transaksi disepakati kedua pihak dan memenuhi ketentuan platform.</p>
            </div>
            <div className="border-[2px] border-black p-6 bg-white shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-3">2.2 Metode Pembayaran</h4>
              <p className="text-xs font-medium text-gray-600 leading-relaxed">Pembayaran dilakukan melalui metode yang disepakati saat transaksi. Pastikan konfirmasi dilakukan tepat waktu untuk menghindari pembatalan otomatis atau sengketa transaksi.</p>
            </div>
          </div>

          <div className="bg-[#fff0f0] border-[4px] border-[#cc0000] p-8 shadow-[8px_8px_0_0_#aa0000]">
             <div className="flex items-center gap-4 mb-6">
                <span className="bg-black text-white px-2 py-1 text-lg font-black tracking-tighter">03</span>
                <h2 className="text-xl font-black uppercase tracking-tighter">Pembatalan</h2>
             </div>
             <p className="text-xs font-bold text-gray-900 leading-relaxed mb-4">Pembatalan dan pengembalian dana mengikuti kesepakatan transaksi serta kebijakan layanan yang berlaku di TiketSecond.</p>
             <ul className="space-y-3 text-xs font-semibold text-gray-800">
               <li className="flex gap-3 items-start"><div className="w-4 h-4 bg-[#cc0000] rounded-full text-white flex items-center justify-center text-[10px] mt-0.5 shrink-0">!</div> Biaya layanan platform dapat bersifat non-refundable sesuai ketentuan transaksi.</li>
               <li className="flex gap-3 items-start"><div className="w-4 h-4 bg-[#cc0000] rounded-full text-white flex items-center justify-center text-[10px] mt-0.5 shrink-0">!</div> Pengajuan pembatalan sebaiknya dilakukan secepat mungkin sebelum jadwal keberangkatan.</li>
             </ul>
          </div>

          <div>
             <div className="flex items-center gap-4 mb-6 border-b-2 border-black pb-4">
                <span className="bg-black text-white px-2 py-1 text-lg font-black tracking-tighter">04</span>
                <h2 className="text-xl font-black uppercase tracking-tighter">Keamanan Data</h2>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="border-[2px] border-black p-6 bg-white">
                 <div className="w-8 h-8 border-2 border-black flex items-center justify-center mb-4">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                 </div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">Enkripsi Data</h4>
                 <p className="text-[11px] font-medium text-gray-600 leading-relaxed">Data pribadi Anda dilindungi dengan enkripsi dan kontrol akses untuk menjaga keamanan informasi akun.</p>
               </div>
               <div className="border-[2px] border-black p-6 bg-white">
                 <div className="w-8 h-8 border-2 border-black flex items-center justify-center mb-4">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 </div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">Pihak Ketiga</h4>
                 <p className="text-[11px] font-medium text-gray-600 leading-relaxed">Kami hanya membagikan data yang diperlukan kepada operator kereta api untuk proses penerbitan tiket dan verifikasi perjalanan.</p>
               </div>
             </div>
          </div>

          <div className="border-t-[4px] border-black pt-12">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Butuh Bantuan?</h2>
            <p className="text-xs font-semibold text-gray-600 max-w-sm mb-8">Jika ada pertanyaan tentang syarat layanan ini, tim TiketSecond siap membantu Anda.</p>
            <button className="bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition">Hubungi Dukungan</button>
          </div>

        </div>

      </div>
    </div>
  )
}
