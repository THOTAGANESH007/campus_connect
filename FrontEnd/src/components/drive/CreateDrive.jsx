import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDrive } from "../../services/driveService";
import DriveForm from "./DriveForm";

const CreateDrive = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (data) => {
        setLoading(true);
        setError(null);
        try {
            await createDrive(data);
            navigate("/drives");
        } catch (err) {
            console.error("Error creating drive:", err);
            setError(err.response?.data?.message || "Failed to create drive");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
                    {error}
                </div>
            )}
            <DriveForm title="Create New Drive" onSubmit={handleSubmit} loading={loading} />
        </div>
    );
};

export default CreateDrive;
