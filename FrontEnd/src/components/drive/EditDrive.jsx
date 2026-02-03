import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDriveById, updateDrive } from "../../services/driveService";
import DriveForm from "./DriveForm";

const EditDrive = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // For saving
    const [fetching, setFetching] = useState(true); // For initial data
    const [initialData, setInitialData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDrive = async () => {
            try {
                const drive = await getDriveById(id);
                // Format dates for input fields (YYYY-MM-DD)
                const formattedDrive = {
                    ...drive,
                    startDate: drive.startDate ? drive.startDate.split("T")[0] : "",
                    endDate: drive.endDate ? drive.endDate.split("T")[0] : "",
                    registrationDeadline: drive.registrationDeadline
                        ? drive.registrationDeadline.split("T")[0]
                        : "",
                };
                setInitialData(formattedDrive);
            } catch (err) {
                console.error("Error fetching drive:", err);
                setError("Failed to load drive details.");
            } finally {
                setFetching(false);
            }
        };

        fetchDrive();
    }, [id]);

    const handleSubmit = async (data) => {
        setLoading(true);
        setError(null);
        try {
            await updateDrive(id, data);
            navigate("/drives");
        } catch (err) {
            console.error("Error updating drive:", err);
            setError(err.response?.data?.message || "Failed to update drive");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <DriveForm
                title="Edit Drive"
                initialData={initialData}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    );
};

export default EditDrive;
