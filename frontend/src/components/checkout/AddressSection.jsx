import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AddressCard from "./AddressCard";
import AddressFormModal from "./AddressFormModal";
import DeleteAddressModal from "./DeleteAddressModal";

import { Plus, MapPin } from "lucide-react";

import api from "../../services/api";

const AddressSection = ({
    selectedAddress,
    setSelectedAddress
}) => {

    const [addresses, setAddresses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [editAddress, setEditAddress] = useState(null);

    const [showDelete, setShowDelete] = useState(false);

    const [deleteAddress, setDeleteAddress] = useState(null);

    //--------------------------------------------------

    const loadAddresses = async () => {

        try {

            setLoading(true);

            const res = await api.get("/users/addresses");

            const list = res.data.data || [];

            setAddresses(list);

            const defaultAddress = list.find(

                item => item.isDefault

            );

            if (!selectedAddress) {

                const defaultAddress = list.find(item => item.isDefault);

                if (defaultAddress) {

                    setSelectedAddress(defaultAddress);

                }

                else if (list.length > 0) {

                    setSelectedAddress(list[0]);

                }

            }

        }

        catch (err) {

            console.log(err);

            toast.error("Unable to load addresses");

        }

        finally {

            setLoading(false);

        }

    };

    //--------------------------------------------------

    useEffect(() => {

        loadAddresses();

    }, []);

    //--------------------------------------------------

    const handleAdd = () => {

        setEditAddress(null);

        setShowForm(true);

    };

    //--------------------------------------------------

    const handleEdit = (address) => {

        setEditAddress(address);

        setShowForm(true);

    };

    //--------------------------------------------------

    const handleDelete = (address) => {

        setDeleteAddress(address);

        setShowDelete(true);

    };

    //--------------------------------------------------

    const handleSelect = (address) => {

        setSelectedAddress(address);

    };
    //--------------------------------------------------
    // SAVE ADDRESS
    //--------------------------------------------------

    const handleSave = async (formData) => {

        try {

            setSaving(true);

            if (editAddress) {

                await api.put(`/users/addresses/${editAddress._id}`, formData);

                toast.success("Address updated successfully");

            } else {

                await api.post("/users/addresses", formData);

                toast.success("Address added successfully");

            }

            setShowForm(false);

            setEditAddress(null);

            await loadAddresses();

        }

        catch (error) {

            console.log(error);

            toast.error(

                error?.response?.data?.message ||

                "Unable to save address"

            );

        }

        finally {

            setSaving(false);

        }

    };

    //--------------------------------------------------
    // DELETE ADDRESS
    //--------------------------------------------------

    const confirmDelete = async () => {

        if (!deleteAddress) return;

        try {

            setSaving(true);

            await api.delete(`/users/addresses/${deleteAddress._id}`);

            toast.success("Address deleted");

            setShowDelete(false);

            setDeleteAddress(null);

            await loadAddresses();

        }

        catch (error) {

            console.log(error);

            toast.error(

                error?.response?.data?.message ||

                "Unable to delete address"

            );

        }

        finally {

            setSaving(false);

        }

    };

    //--------------------------------------------------
    // SET DEFAULT ADDRESS
    //--------------------------------------------------

    const makeDefault = async (addressId) => {

        try {

            await api.patch(`/users/addresses/default/${addressId}`);

            toast.success("Default address updated");

            await loadAddresses();

        }

        catch (error) {

            console.log(error);

            toast.error("Unable to update default address");

        }

    };
    //--------------------------------------------------

    if (loading) {

        return (

            <div className="bg-white rounded-2xl shadow p-6">

                <div className="animate-pulse space-y-4">

                    <div className="h-6 bg-gray-200 rounded w-48"></div>

                    <div className="h-28 bg-gray-100 rounded-xl"></div>

                    <div className="h-28 bg-gray-100 rounded-xl"></div>

                </div>

            </div>

        );

    }

    //--------------------------------------------------

    return (

        <>

            <div className="bg-white rounded-2xl shadow p-6">

                <div className="flex justify-between items-center mb-6">

                    <div>

                        <h2 className="text-2xl font-bold text-primary-maroon flex items-center gap-2">

                            <MapPin size={24} />

                            Delivery Address

                        </h2>

                        <p className="text-gray-500 mt-1">

                            Select your delivery address

                        </p>

                    </div>

                    <button

                        onClick={handleAdd}

                        className="bg-primary-maroon hover:bg-primary-maroon/90 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition"

                    >

                        <Plus size={18} />

                        Add Address

                    </button>

                </div>

                {

                    addresses.length === 0 && (

                        <div className="text-center py-14 border-2 border-dashed rounded-xl">

                            <MapPin

                                size={55}

                                className="mx-auto text-gray-300"

                            />

                            <h3 className="text-xl font-semibold mt-5">

                                No Address Found

                            </h3>

                            <p className="text-gray-500 mt-2">

                                Please add your first delivery address.

                            </p>

                            <button

                                onClick={handleAdd}

                                className="mt-6 bg-primary-maroon text-white px-6 py-3 rounded-xl"

                            >

                                + Add Address

                            </button>

                        </div>

                    )

                }

                {

                    addresses.length > 0 && (

                        <div className="grid gap-5">

                            {

                                addresses.map((address) => (

                                    <div key={address._id}>

                                        <AddressCard

                                            address={address}

                                            selected={

                                                selectedAddress?._id === address._id

                                            }

                                            onSelect={handleSelect}

                                            onEdit={handleEdit}

                                            onDelete={handleDelete}

                                        />

                                        <div className="mt-3 flex justify-end">

                                            {

                                                !address.isDefault && (

                                                    <button

                                                        onClick={() =>

                                                            makeDefault(address._id)

                                                        }

                                                        className="text-sm text-primary-maroon hover:underline"

                                                    >

                                                        Make Default

                                                    </button>

                                                )

                                            }

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                    )

                }

            </div>
            {/* Add / Edit Address Modal */}

            <AddressFormModal
                open={showForm}
                editData={editAddress}
                loading={saving}
                onClose={() => {

                    setShowForm(false);

                    setEditAddress(null);

                }}
                onSave={handleSave}
            />

            {/* Delete Confirmation */}

            <DeleteAddressModal
                open={showDelete}
                address={deleteAddress}
                loading={saving}
                onClose={() => {

                    setShowDelete(false);

                    setDeleteAddress(null);

                }}
                onConfirm={confirmDelete}
            />

        </>

    );

};

export default AddressSection;