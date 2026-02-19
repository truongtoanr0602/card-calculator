"use client";

import React, { useState, useEffect } from 'react';
import ConfirmModal from "./ConfirmModal";

export default function Home() {
  const [mode, setMode] = useState(1); // 1: Cá nhân, 2: Nhóm
  const [showConfirm, setShowConfirm] = useState(false);

  // --- STATE CHẾ ĐỘ 1 ---
  const [rounds, setRounds] = useState(Array(50).fill(""));
  const [total, setTotal] = useState(0);

  // --- STATE CHẾ ĐỘ 2 ---
  const [step, setStep] = useState(1); // 1: Nhập số người, 2: Nhập điểm
  const [numPlayers, setNumPlayers] = useState(3);
  const [tempNum, setTempNum] = useState(3);
  const [playerNames, setPlayerNames] = useState(["Người 1", "Người 2", "Người 3"]);
  const [roundsP2, setRoundsP2] = useState(
    Array(50).fill(null).map(() => ({ scores: Array(3).fill("") }))
  );

  // --- LOGIC CHUNG & CHẾ ĐỘ 1 ---
  useEffect(() => {
    const handleBeforeUnload = (e:any) => {
      const hasData = mode === 1 ? rounds.some(v => v !== "") : roundsP2.some(r => r.scores.some(s => s !== ""));
      if (hasData) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [rounds, roundsP2, mode]);

  useEffect(() => {
    localStorage.setItem('card_data_p1', JSON.stringify(rounds));
  }, [rounds]);

  useEffect(() => {
    const saved = localStorage.getItem('card_data_p1');
    if (saved) setRounds(JSON.parse(saved));
  }, []);

  const handleInputChange = (index: any, value : any) => {
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

  // --- LOGIC CHẾ ĐỘ 2 ---
  const handleP2Change = (rIdx: any, pIdx: any, value: any) => {
    const validatedValue = value.replace(/[^0-9.-]/g, '');
    if (validatedValue.indexOf('-', 1) !== -1) return;
    const newRounds = [...roundsP2];
    newRounds[rIdx].scores[pIdx] = validatedValue;
    setRoundsP2(newRounds);
  };

  const calculateRowSum = (scores: any) => scores.reduce((acc: any, s: any) => acc + (parseFloat(s) || 0), 0);

  const getPlayerTotal = (pIdx: any) => roundsP2.reduce((acc, row) => acc + (parseFloat(row.scores[pIdx]) || 0), 0);

  return (
    <main className="min-h-screen bg-amber-50 p-4 pb-32 font-sans text-gray-900">
      {/* Menu chuyển chế độ */}
      <div className="max-w-md mx-auto mb-6 flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-amber-200 sticky top-0 z-50">
        <button onClick={() => setMode(1)} className={`flex-1 py-2 rounded-lg font-bold transition ${mode === 1 ? 'bg-red-600 text-white' : 'text-gray-500'}`}>Cá Nhân</button>
        <button onClick={() => setMode(2)} className={`flex-1 py-2 rounded-lg font-bold transition ${mode === 2 ? 'bg-red-600 text-white' : 'text-gray-500'}`}>Nhóm</button>
      </div>

      {mode === 1 ? (
        /* GIAO DIỆN CHẾ ĐỘ 1 */
        <div className="max-w-md mx-auto animate-in fade-in duration-500">
          <h1 className="text-2xl font-black text-red-700 text-center mb-4 uppercase">🧧 Cá Nhân</h1>
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
                    type="text" inputMode="decimal" value={val}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    placeholder="0"
                    className={`w-full p-3 text-center bg-transparent focus:outline-none focus:bg-white transition-all font-bold text-lg 
                      ${parseFloat(val) > 0 ? 'text-green-600' : parseFloat(val) < 0 ? 'text-red-600' : 'text-gray-800'}`}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Sticky Footer P1 */}
          <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-4 border-t border-amber-200 shadow-2xl max-w-md mx-auto rounded-t-3xl z-40">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="font-bold text-gray-500 text-lg">Tổng:</span>
              <span className={`text-3xl font-black ${total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {total > 0 ? `+${total}` : total}k
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowConfirm(true)} className="px-4 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl active:scale-95 transition">Xóa</button>
              <button onClick={calculateResult} className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg active:scale-95 transition uppercase">Xem kết quả</button>
            </div>
          </div>
        </div>
      ) : (
        /* GIAO DIỆN CHẾ ĐỘ 2 */
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
          <h1 className="text-2xl font-black text-red-700 text-center mb-4 uppercase">🧧 Tính Nhóm</h1>
          {step === 1 ? (
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-amber-200 text-center max-w-sm mx-auto">
              <label className="block text-gray-500 font-bold mb-4 uppercase text-xs">Số người tham gia</label>
              <input type="number" value={tempNum} onChange={(e) => setTempNum(parseInt(e.target.value) || 0)} className="w-full text-5xl font-black text-center text-red-600 focus:outline-none mb-6" />
              <button onClick={() => {
                if (tempNum < 2) return alert("Cần tối thiểu 2 người!");
                setNumPlayers(tempNum);
                setPlayerNames(Array(tempNum).fill("").map((_, i) => `Người ${i + 1}`));
                setRoundsP2(Array(50).fill(null).map(() => ({ scores: Array(tempNum).fill("") })));
                setStep(2);
              }} className="w-full py-4 bg-red-600 text-white font-black rounded-2xl shadow-lg active:scale-95 transition">BẮT ĐẦU</button>
            </div>
          ) : (
            <div className="space-y-4">
              <button onClick={() => setStep(1)} className="text-sm font-bold text-red-600 bg-white px-4 py-2 rounded-full border border-red-100 shadow-sm">← Đổi số người</button>
              <div className="bg-white rounded-2xl shadow-xl border border-amber-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-red-600 text-white text-[10px] uppercase">
                      <tr>
                        <th className="p-3 text-center sticky left-0 bg-red-700 z-10 w-12">Ván</th>
                        {playerNames.map((name, i) => (
                          <th key={i} className="p-3 text-center min-w-[100px] border-l border-white/10">
                            <input value={name} onChange={(e) => {
                              const n = [...playerNames]; n[i] = e.target.value; setPlayerNames(n);
                            }} className="bg-transparent text-center w-full focus:outline-none font-bold placeholder-white/50" />
                          </th>
                        ))}
                        <th className="p-3 text-center sticky right-0 bg-red-700 z-10 w-16">Lệch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roundsP2.map((row, rIdx) => {
                        const sum = calculateRowSum(row.scores);
                        const isErr = sum !== 0 && row.scores.some(s => s !== "");
                        return (
                          <tr key={rIdx} className={`${isErr ? 'bg-red-50' : 'bg-white'} border-b border-amber-50`}>
                            <td className="p-3 text-center font-bold text-gray-300 sticky left-0 bg-inherit shadow-[1px_0_0_0_#fff7ed]">{rIdx + 1}</td>
                            {row.scores.map((score, pIdx) => (
                              <td key={pIdx} className="p-0 border-l border-amber-50">
                                <input type="text" inputMode="numeric" value={score} onChange={(e) => handleP2Change(rIdx, pIdx, e.target.value)} className={`w-full p-4 text-center bg-transparent focus:outline-none font-bold ${parseFloat(score) > 0 ? 'text-green-600' : parseFloat(score) < 0 ? 'text-red-600' : 'text-gray-400'}`} placeholder="0" />
                              </td>
                            ))}
                            <td className={`p-3 text-center font-black sticky right-0 bg-inherit shadow-[-1px_0_0_0_#fff7ed] ${isErr ? 'text-red-600 animate-pulse' : 'text-green-500'}`}>
                              {isErr ? (sum > 0 ? `+${sum}` : sum) : (row.scores.some(s => s !== "") ? "✔" : "")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Footer P2 */}
              {/* Footer P2 - Tối ưu diện tích */}
<div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-3 border-t border-amber-200 shadow-2xl z-40 max-w-2xl mx-auto rounded-t-[2rem]">
  <div className="flex items-center gap-3">
    {/* Nút Xóa nhỏ gọn hơn */}
    <button 
      onClick={() => setShowConfirm(true)} 
      className="p-4 bg-gray-100 text-gray-600 font-bold rounded-2xl active:scale-95 transition flex-shrink-0"
      title="Xóa tất cả"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
    </button>

    {/* Thanh tổng kết nằm ngang, cuộn được nếu đông người */}
    <div className="flex-1 flex gap-2 overflow-x-auto py-1 scrollbar-hide no-scrollbar">
      {playerNames.map((name, i) => {
        const pt = getPlayerTotal(i);
        return (
          <div key={i} className="flex-shrink-0 flex flex-col justify-center bg-amber-50/50 px-4 py-2 rounded-xl border border-amber-100 min-w-[90px] text-center">
            <div className="text-[10px] text-gray-400 font-bold truncate max-w-[70px]">{name}</div>
            <div className={`text-sm font-black ${pt >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {pt > 0 ? `+${pt}` : pt}k
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        show={showConfirm}
        message="Toàn bộ dữ liệu các ván bài sẽ bị mất. Bạn có chắc chắn muốn làm mới không?"
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          if (mode === 1) { setRounds(Array(50).fill("")); setTotal(0); }
          else setRoundsP2(Array(50).fill(null).map(() => ({ scores: Array(numPlayers).fill("") })));
          setShowConfirm(false);
        }}
      />
    </main>
  );
}