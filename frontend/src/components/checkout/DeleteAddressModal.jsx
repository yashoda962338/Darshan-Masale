import React from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";

const DeleteAddressModal = ({
  open,
  address,
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

        {/* Header */}

        <div className="flex items-center justify-between p-5 border-b">

          <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">

            <AlertTriangle size={22} />

            Delete Address

          </h2>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="p-6">

          <div className="flex justify-center">

            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">

              <Trash2
                size={30}
                className="text-red-600"
              />

            </div>

          </div>

          <h3 className="text-center text-xl font-semibold mt-5">

            Delete this address?

          </h3>

          <p className="text-center text-gray-500 mt-3">

            This action cannot be undone.

          </p>

          {address && (

            <div className="mt-6 bg-gray-50 rounded-xl p-4">

              <p className="font-semibold">

                {address.fullName}

              </p>

              <p className="text-sm text-gray-600 mt-1">

                {address.addressLine1}

              </p>

              {address.addressLine2 && (

                <p className="text-sm text-gray-600">

                  {address.addressLine2}

                </p>

              )}

              <p className="text-sm text-gray-600">

                {address.city},{" "}

                {address.state}

              </p>

              <p className="text-sm text-gray-600">

                {address.country}

                {" - "}

                {address.pincode}

              </p>

            </div>

          )}

        </div>

        {/* Footer */}

        <div className="flex gap-3 p-5 border-t">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition font-medium"
          >

            Cancel

          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => onConfirm(address)}
            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition font-medium flex justify-center items-center gap-2"
          >

            <Trash2 size={18} />

            {loading ? "Deleting..." : "Delete"}

          </button>

        </div>

      </div>

    </div>
  );
};

export default DeleteAddressModal;