"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useOrganisationsStore } from "@/stores/organisations.store";
import { usersController } from "@/controllers/users.controller";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    User,
    Mail,
    Phone,
    Shield,
    CheckCircle2,
    Clock,
    AlertCircle,
    Loader2,
    Edit,
    Save,
    ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type KYCStatus = "NOT_SUBMITTED" | "PENDING" | "VERIFIED";

export default function AccountPage() {
    const { user, setUser } = useAuthStore();
    const { organisation } = useOrganisationsStore();

    // Phone update states
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [phone, setPhone] = useState(user?.phone || "");
    const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);

    // KYC states
    const [kycFullname, setKycFullname] = useState("");
    const [kycUserPicture, setKycUserPicture] = useState<File | null>(null);
    const [kycFirstFace, setKycFirstFace] = useState<File | null>(null);
    const [kycSecondFace, setKycSecondFace] = useState<File | null>(null);
    const [isSubmittingKyc, setIsSubmittingKyc] = useState(false);

    // Determine KYC status based on user data
    const getKycStatus = (): KYCStatus => {
        if (!user) return "NOT_SUBMITTED";
        // Check kyc_status property from UserDto
        if (user.kyc_status === "VERIFIED" || user.kyc_status === "COMPLETE") return "VERIFIED";
        if (user.kyc_status === "PENDING" || user.kyc_status === "INIT") return "PENDING";
        return "NOT_SUBMITTED";
    };

    const kycStatus = getKycStatus();

    useEffect(() => {
        if (user?.phone) {
            setPhone(user.phone);
        }
        if (user?.fullname) {
            setKycFullname(user.fullname);
        }
    }, [user]);

    const handleUpdatePhone = async () => {
        if (!phone.trim()) {
            toast.error("Phone number is required");
            return;
        }

        setIsUpdatingPhone(true);
        try {
            // Call the update user API using the controller
            const updatedUser = await usersController.updateUserPhoneNumber(
                phone.trim(),
                user?.code_phone || "237"
            );

            // Update user in store
            if (updatedUser) {
                setUser(updatedUser);
            } else if (user) {
                setUser({ ...user, phone: phone.trim() });
            }

            toast.success("Phone number updated successfully");
            setIsEditingPhone(false);
        } catch (error) {
            console.error("Failed to update phone:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update phone number. Please try again."
            );
        } finally {
            setIsUpdatingPhone(false);
        }
    };

    const handleSubmitKyc = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!kycFullname.trim()) {
            toast.error("Full name is required");
            return;
        }

        setIsSubmittingKyc(true);
        try {
            const formData = new FormData();
            formData.append("fullname", kycFullname.trim());
            if (kycUserPicture) {
                formData.append("user_picture", kycUserPicture);
            }
            if (kycFirstFace) {
                formData.append("first_face", kycFirstFace);
            }
            if (kycSecondFace) {
                formData.append("second_face", kycSecondFace);
            }

            const response = await usersController.verifyIdentity(formData, user?.id);

            // Update user in auth store if response contains user data
            if (response.user) {
                setUser(response.user);
            }

            toast.success("KYC verification submitted successfully");

            // Reset form
            setKycUserPicture(null);
            setKycFirstFace(null);
            setKycSecondFace(null);

            // Reset file inputs
            const inputs = ["kyc-user-picture", "kyc-first-face", "kyc-second-face"];
            inputs.forEach(id => {
                const input = document.getElementById(id) as HTMLInputElement;
                if (input) input.value = "";
            });
        } catch (error) {
            console.error("Failed to submit KYC verification:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to submit KYC verification. Please try again."
            );
        } finally {
            setIsSubmittingKyc(false);
        }
    };

    const renderKycStatusBadge = () => {
        switch (kycStatus) {
            case "VERIFIED":
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                        Identity Verified ✓
                    </Badge>
                );
            case "PENDING":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        Verification Pending
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="text-muted-foreground">
                        <AlertCircle className="mr-1 h-3.5 w-3.5" />
                        Not Verified
                    </Badge>
                );
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 animate-fade-in">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/merchant">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">Account</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and identity verification
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* User Information Card */}
                <Card className="animate-slide-up">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            User Information
                        </CardTitle>
                        <CardDescription>
                            Your account details and contact information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Full Name
                            </Label>
                            <p className="text-sm font-medium">{user?.fullname || user?.name || "-"}</p>
                        </div>

                        <Separator />

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                <Mail className="h-3.5 w-3.5" />
                                Email Address
                            </Label>
                            <p className="text-sm font-medium">{user?.email || "-"}</p>
                        </div>

                        <Separator />

                        {/* Phone with Edit */}
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5" />
                                Phone Number
                            </Label>
                            {isEditingPhone ? (
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Enter phone number"
                                        className="flex-1"
                                    />
                                    <Button
                                        size="sm"
                                        onClick={handleUpdatePhone}
                                        disabled={isUpdatingPhone}
                                    >
                                        {isUpdatingPhone ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Save className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditingPhone(false);
                                            setPhone(user?.phone || "");
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">{user?.phone || "Not set"}</p>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setIsEditingPhone(true)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Role */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Role
                            </Label>
                            <Badge variant="secondary">{user?.role || "MERCHANT"}</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* KYC Status Card */}
                <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    KYC Verification
                                </CardTitle>
                                <CardDescription>
                                    Verify your identity to unlock all features
                                </CardDescription>
                            </div>
                            {renderKycStatusBadge()}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {kycStatus === "VERIFIED" && (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-green-800">
                                    Identity Verified ✓
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Your identity has been successfully verified. You have full access to all features.
                                </p>
                            </div>
                        )}

                        {kycStatus === "PENDING" && (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                                    <Clock className="h-8 w-8 text-yellow-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-yellow-800">
                                    Verification In Progress
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Your identity is being verified. This usually takes 1-2 business days.
                                </p>
                            </div>
                        )}

                        {kycStatus === "NOT_SUBMITTED" && (
                            <form onSubmit={handleSubmitKyc} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="kyc-fullname">Full Name *</Label>
                                    <Input
                                        id="kyc-fullname"
                                        type="text"
                                        value={kycFullname}
                                        onChange={(e) => setKycFullname(e.target.value)}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kyc-user-picture">User Picture</Label>
                                    <Input
                                        id="kyc-user-picture"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setKycUserPicture(e.target.files?.[0] || null)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Upload your profile picture
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kyc-first-face">ID Document (Front)</Label>
                                    <Input
                                        id="kyc-first-face"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setKycFirstFace(e.target.files?.[0] || null)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Upload front of your ID document
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kyc-second-face">ID Document (Back)</Label>
                                    <Input
                                        id="kyc-second-face"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setKycSecondFace(e.target.files?.[0] || null)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Upload back of your ID document
                                    </p>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isSubmittingKyc || !kycFullname.trim()}
                                    className="w-full"
                                >
                                    {isSubmittingKyc ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="mr-2 h-4 w-4" />
                                            Submit Verification
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
