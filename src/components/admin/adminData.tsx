'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter
} from "@heroui/card"
import { Input } from "@heroui/input"
import { Button } from "@heroui/button"

export default function AdminSettings() {
    const [adminData, setAdminData] = useState({ ad_fee: 0 });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const response = await fetch('/api/admin/web_data');
                const data = await response.json();
                setAdminData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching admin data:', error);
                setError('Failed to load admin settings');
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    const handleFeeChange = (e: { target: { value: string; }; }) => {
        setAdminData({
            ...adminData,
            ad_fee: Math.min(parseFloat(e.target.value),100) || 0
        });
    };

    const saveChanges = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/admin/web_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ad_fee: adminData.ad_fee }),
            });

            if (response.ok) {
                setSuccess(true);
                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError('Failed to update admin settings');
            }
        } catch (error) {
            console.error('Error updating admin settings:', error);
            setError('An error occurred while saving changes');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-6">Loading admin settings...</div>;
    }

    return (
        <div
            className="w-full max-w-md mx-auto p-4"
        >
            <Card className="w-full">
                <CardHeader className="flex-col items-start px-6 pt-6 pb-0">
                    <h2 className="text-xl font-bold">Admin Settings</h2>
                    <p className="text-default-500">Manage platform configuration</p>
                </CardHeader>
                <CardBody className="px-6 py-4">
                    <div className="space-y-4">
                        <Input
                            type="number"
                            label="Platform Fee (%)"
                            placeholder="Enter fee percentage"
                            value={adminData.ad_fee.toString()}
                            onChange={handleFeeChange}
                            min={0}
                            max={100}
                            step={0.01}
                            description="Fee charged on all transactions"
                            startContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-sm">%</span>
                                </div>
                            }
                        />

                        {error && (
                            <div className="text-danger text-sm mt-2">{error}</div>
                        )}

                        {success && (
                            <div className="text-success text-sm mt-2">
                                Settings updated successfully!
                            </div>
                        )}
                    </div>
                </CardBody>
                <CardFooter className="px-6 py-4">
                    <Button
                        color="primary"
                        onClick={saveChanges}
                        isLoading={saving}
                        fullWidth
                    >
                        {saving ? 'Saving Changes...' : 'Save Changes'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}