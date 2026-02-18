"use client"; // Bắt buộc phải có dòng này ở đầu file để dùng được useState
import ConfirmModal from "./ConfirmModal";

import React, { useState, useEffect } from 'react';

export default function Home() {
  
  const [mode, setMode] = useState(1); // 1: Cá nhân, 2: Nhóm
  const [rounds, setRounds] = useState(Array(50).fill(""));
  const [total, setTotal] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  

useEffect(() => {
  const handleBeforeUnload = (e) => {
    // Chỉ hiện cảnh báo nếu đã có dữ liệu nhập vào (tránh làm phiền người dùng khi trang trống)
    const hasData = rounds.some(val => val !== "");
    
    if (hasData) {
      e.preventDefault();
      e.returnValue = ''; // Đây là yêu cầu bắt buộc để trình duyệt hiện thông báo
    }
  };

  // Đăng ký sự kiện khi component được gắn vào (mount)
  window.addEventListener('beforeunload', handleBeforeUnload);

  // Hủy đăng ký khi component bị gỡ bỏ (unmount) để tránh rò rỉ bộ nhớ
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, [rounds]); // Chạy lại khi mảng 'rounds' thay đổi 

// Tự động lưu khi rounds thay đổi
useEffect(() => {
  localStorage.setItem('card_data_p1', JSON.stringify(rounds));
}, [rounds]);

// Tự động tải lại dữ liệu khi mở web
useEffect(() => {
  const saved = localStorage.getItem('card_data_p1');
  if (saved) setRounds(JSON.parse(saved));
}, []);


  const handleReset = () => {
  if (window.confirm("Bạn có chắc chắn muốn xóa tất cả dữ liệu ván bài không?")) {
    setRounds(Array(50).fill(""));
    setTotal(0);
  }
};


  const handleInputChange = (index, value) => {
    const validatedValue = value.replace(/[^0-9.-]/g, '');
    if (validatedValue.indexOf('-', 1) !== -1) return;
    const newRounds = [...rounds];
    newRounds[index] = validatedValue;
    setRounds(newRounds);
  };

  const calculateResult = () => {
    const sum = rounds.reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
    setTotal(sum);
  };

  return (
    <main className="min-h-screen bg-amber-50 p-4 pb-24 font-sans text-gray-900">
      {/* Menu chuyển chế độ */}
      <div className="max-w-md mx-auto mb-6 flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-amber-200">
        <button 
          onClick={() => setMode(1)}
          className={`flex-1 py-2 rounded-lg font-bold transition ${mode === 1 ? 'bg-red-600 text-white shadow-md' : 'text-gray-500'}`}
        >
          Cá Nhân
        </button>
        <button 
          onClick={() => setMode(2)}
          className={`flex-1 py-2 rounded-lg font-bold transition ${mode === 2 ? 'bg-red-600 text-white shadow-md' : 'text-gray-500'}`}
        >
          Nhóm (Sắp có)
        </button>
      </div>

      {mode === 1 ? (
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-black text-red-700 text-center mb-4">🧧 TÍNH TIỀN TẾT</h1>
          
          <div className="bg-white rounded-2xl shadow-xl border border-amber-200 overflow-hidden">
            <div className="grid grid-cols-2 bg-red-600 text-white font-bold p-3 text-center">
              <div>Ván số</div>
              <div>Số tiền (k)</div>
            </div>
            
            <div className="max-h-[50vh] overflow-y-auto border-b border-amber-100">
              {rounds.map((val, idx) => (
                <div key={idx} className={`grid grid-cols-2 border-b border-amber-50 ${idx % 2 === 0 ? 'bg-orange-50/20' : ''}`}>
                  <div className="p-3 text-center font-bold text-gray-400 border-r border-amber-50">#{idx + 1}</div>
                  <input
  type="text"
  inputMode="numeric"
  value={val}
  onChange={(e) => handleInputChange(idx, e.target.value)}
  placeholder="0"
  className={`w-full p-3 text-center bg-transparent focus:outline-none focus:bg-white transition-all font-bold text-lg 
    ${parseFloat(val) > 0 ? 'text-green-600' : parseFloat(val) < 0 ? 'text-red-600' : 'text-gray-800'}`}
/>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Result */}
          <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-4 border-t border-amber-200 shadow-2xl max-w-md mx-auto rounded-t-3xl">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="font-bold text-gray-500 text-lg">Tổng cộng:</span>
              <span className={`text-3xl font-black ${total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {total > 0 ? `+${total}` : total}k
              </span>
            </div>
            <div className="flex gap-2">
              <button 
  onClick={() => setShowConfirm(true)} 
  className="px-4 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl active:scale-95 transition"
>
  Xóa
</button>
              <button onClick={calculateResult} className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg shadow-red-200 active:scale-95 transition">XEM KẾT QUẢ</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto text-center py-20">
          <p className="text-gray-400 italic">Chế độ nhóm đang được phát triển ở nhánh feature/mode-2...</p>
        </div>
      )}


      {/* Modal Xác nhận đẹp mắt */}
{/* {showConfirm && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl transform animate-in zoom-in-95 duration-200">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa?</h3>
        <p className="text-gray-500 mb-6">
          Toàn bộ dữ liệu các ván bài sẽ bị mất. Bạn có chắc chắn muốn làm mới không?
        </p>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={() => setShowConfirm(false)}
          className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl active:scale-95 transition"
        >
          Hủy
        </button>
        <button
          onClick={() => {
            setRounds(Array(50).fill(""));
            setTotal(0);
            setShowConfirm(false);
          }}
          className="flex-1 py-3 bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-200 active:scale-95 transition"
        >
          Đồng ý xóa
        </button>
      </div>
    </div>
  </div>
)} */}
 <ConfirmModal
        show={showConfirm}
        message="Toàn bộ dữ liệu các ván bài sẽ bị mất. Bạn có chắc chắn muốn làm mới không?"
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setRounds(Array(50).fill(""));
          setTotal(0);
          setShowConfirm(false);
        }}
      />

    </main>
  );
}