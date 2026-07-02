import React from "react";
import {
    Home,
    Briefcase,
    MapPin,
    Star,
    Pencil,
    Trash2,
    CheckCircle,
} from "lucide-react";

const AddressCard = ({
    address,
    selected,
    onSelect,
    onEdit,
    onDelete,
}) => {
    const getIcon = () => {

        switch (address.addressType) {

            case "Home":
                return <Home size={18} />;

            case "Work":
                return <Briefcase size={18} />;

            default:
                return <MapPin size={18} />;

        }

    };

    return (
        <div
            onClick={() => onSelect(address)}
            className={`cursor-pointer rounded-2xl border-2 transition-all duration-300 p-5 hover:shadow-lg

      ${selected
                    ? "border-primary-maroon bg-red-50 shadow-lg"
                    : "border-gray-200 bg-white"
                }
      `}
        >
            {/* Header */}

            <div className="flex justify-between items-start">

                <div className="flex items-center gap-3">

                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center

            ${selected
                                ? "bg-primary-maroon text-white"
                                : "bg-gray-100"
                            }
            `}
                    >
                        {getIcon()}
                    </div>

                    <div>

                        <h3 className="font-semibold text-lg flex items-center gap-2">

                            {address.addressType}

                            {address.isDefault && (
                                <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">

                                    <Star size={12} />

                                    Default

                                </span>
                            )}

                        </h3>

                        <p className="text-sm text-gray-500">

                            {address.label}

                        </p>

                    </div>

                </div>

                {selected && (
                    <CheckCircle
                        size={24}
                        className="text-green-600"
                    />
                )}

            </div>

            {/* Body */}

            <div className="mt-4 space-y-2 text-gray-700">

                <p>

                    <strong>Phone :</strong>

                    {" "}

                    {address.phone}

                </p>

                <p>

                    {address.addressLine1}

                </p>

                {address.addressLine2 && (

                    <p>

                        {address.addressLine2}

                    </p>

                )}

                <p>

                    {address.city},{" "}

                    {address.state}

                </p>

                <p>

                    {address.country}

                    {" - "}

                    {address.pincode}

                </p>

            </div>

            {/* Footer */}

            <div className="flex gap-3 mt-5">

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(address);
                    }}
                    className="flex-1 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex justify-center items-center gap-2 transition"
                >
                    <Pencil size={16} />

                    Edit

                </button>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(address);
                    }}
                    className="flex-1 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex justify-center items-center gap-2 transition"
                >
                    <Trash2 size={16} />

                    Delete

                </button>

            </div>

        </div>
    );
};

export default AddressCard;