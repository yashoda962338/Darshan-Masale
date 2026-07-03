import React, { useEffect, useState } from "react";
import { X, Home, Briefcase, MapPin } from "lucide-react";

const emptyForm = {
    label: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    addressType: "HOME",
    isDefault: false,
};

const AddressFormModal = ({
    open,
    onClose,
    onSave,
    loading = false,
    editData = null,
}) => {

    const [form, setForm] = useState(emptyForm);

    useEffect(() => {

        if (!open) return;

        if (editData) {

            setForm({

                label: editData.label || "",

                phone: editData.phone || "",

                addressLine1: editData.addressLine1 || "",

                addressLine2: editData.addressLine2 || "",

                city: editData.city || "",

                state: editData.state || "",

                country: editData.country || "India",

                pincode: editData.pincode || "",

                addressType: editData.addressType || "Home",

                isDefault: editData.isDefault || false,

            });

        } else {

            setForm(emptyForm);

        }

    }, [open, editData]);

    if (!open) return null;

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!form.label.trim()) {

            alert("Home / Office / Shop Name Required");

            return;

        }

        if (!form.phone.trim()) {

            alert("Phone Required");

            return;

        }

        if (!form.addressLine1.trim()) {

            alert("Address Required");

            return;

        }

        if (!form.city.trim()) {

            alert("City Required");

            return;

        }

        if (!form.state.trim()) {

            alert("State Required");

            return;

        }

        if (!form.pincode.trim()) {

            alert("Pincode Required");

            return;

        }

        onSave(form);

    };

    return (

        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-5">

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">

                <div className="flex justify-between items-center border-b px-6 py-5">

                    <h2 className="text-2xl font-bold text-primary-maroon">

                        {editData ? "Edit Address" : "Add New Address"}

                    </h2>

                    <button onClick={onClose}>

                        <X size={22} />

                    </button>

                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    <div>

                        <label className="block mb-2 font-medium">

                            Full Name

                        </label>

                        <input

                            name="label"
                            value={form.label}

                            onChange={handleChange}

                            className="w-full border rounded-lg px-4 py-3 outline-none focus:border-primary-maroon"

                        />

                    </div>

                    <div>

                        <label className="block mb-2 font-medium">

                            Phone Number

                        </label>

                        <input

                            name="phone"

                            value={form.phone}

                            onChange={handleChange}

                            className="w-full border rounded-lg px-4 py-3 outline-none focus:border-primary-maroon"

                        />

                    </div>

                    <div>

                        <label className="block mb-2 font-medium">

                            Address Line 1

                        </label>

                        <textarea

                            rows="2"

                            name="addressLine1"

                            value={form.addressLine1}

                            onChange={handleChange}

                            className="w-full border rounded-lg px-4 py-3 outline-none focus:border-primary-maroon"

                        />

                    </div>

                    <div>

                        <label className="block mb-2 font-medium">

                            Address Line 2

                        </label>

                        <textarea

                            rows="2"

                            name="addressLine2"

                            value={form.addressLine2}

                            onChange={handleChange}

                            className="w-full border rounded-lg px-4 py-3 outline-none focus:border-primary-maroon"

                        />

                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div>

                            <label className="block mb-2 font-medium">

                                City

                            </label>

                            <input

                                name="city"

                                value={form.city}

                                onChange={handleChange}

                                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-primary-maroon"

                            />

                        </div>

                        <div>

                            <label className="block mb-2 font-medium">

                                State

                            </label>

                            <input

                                name="state"

                                value={form.state}

                                onChange={handleChange}

                                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-primary-maroon"

                            />

                        </div>

                        <div>

                            <label className="block mb-2 font-medium">

                                Country

                            </label>

                            <input

                                name="country"

                                value={form.country}

                                onChange={handleChange}

                                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-primary-maroon"

                            />

                        </div>

                        <div>

                            <label className="block mb-2 font-medium">

                                Pincode

                            </label>

                            <input

                                name="pincode"

                                value={form.pincode}

                                onChange={handleChange}

                                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-primary-maroon"

                            />

                        </div>

                    </div>

                    {/* Address Type */}

                    <div>

                        <label className="block mb-3 font-medium">

                            Address Type

                        </label>

                        <div className="grid grid-cols-3 gap-4">

                            <button
                                type="button"
                                onClick={() =>
                                    setForm({
                                        ...form,
                                        addressType:"Home",
                                    })
                                }
                                className={`border rounded-xl py-3 flex justify-center items-center gap-2 transition

${form.addressType === "Home"

                                        ? "bg-primary-maroon text-white border-primary-maroon"

                                        : "hover:border-primary-maroon"

                                    }

`}
                            >

                                <Home size={18} />

                                Home

                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setForm({
                                        ...form,
                                        addressType: "Work",
                                    })
                                }
                                className={`border rounded-xl py-3 flex justify-center items-center gap-2 transition

${form.addressType === "Work"

                                        ? "bg-primary-maroon text-white border-primary-maroon"

                                        : "hover:border-primary-maroon"

                                    }

`}
                            >

                                <Briefcase size={18} />

                                Office

                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setForm({
                                        ...form,
                                        addressType: "Other",
                                    })
                                }
                                className={`border rounded-xl py-3 flex justify-center items-center gap-2 transition

${form.addressType === "Other"

                                        ? "bg-primary-maroon text-white border-primary-maroon"

                                        : "hover:border-primary-maroon"

                                    }

`}
                            >

                                <MapPin size={18} />

                                Other

                            </button>

                        </div>

                    </div>

                    {/* Default */}

                    <div className="flex items-center gap-3">

                        <input

                            type="checkbox"

                            name="isDefault"

                            checked={form.isDefault}

                            onChange={handleChange}

                        />

                        <label>

                            Make this my default address

                        </label>

                    </div>

                    {/* Footer */}

                    <div className="flex justify-end gap-4 pt-5 border-t">

                        <button

                            type="button"

                            onClick={onClose}

                            disabled={loading}

                            className="px-6 py-3 rounded-xl border hover:bg-gray-100"

                        >

                            Cancel

                        </button>

                        <button

                            type="submit"

                            disabled={loading}

                            className="px-8 py-3 rounded-xl bg-primary-maroon text-white hover:bg-primary-maroon/90"

                        >

                            {

                                loading

                                    ?

                                    (editData ? "Updating..." : "Saving...")

                                    :

                                    (editData ? "Update Address" : "Save Address")

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default AddressFormModal;