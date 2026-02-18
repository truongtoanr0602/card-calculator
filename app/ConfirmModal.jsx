export default function ConfirmModal({
  show,
  message,
  onCancel,
  onConfirm,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <span className="text-3xl">⚠️</span>
          </div>

          <h3 className="text-xl font-bold mb-2">
            Xác nhận?
          </h3>

          <p className="text-gray-500 mb-6">
            {message}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 rounded-2xl"
          >
            Hủy
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-600 text-white rounded-2xl"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
}
