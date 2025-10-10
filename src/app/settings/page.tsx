/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/settings/page.tsx
'use client';

import { Button } from '@/Components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { useAddAddress, useAddresses, useChangePassword, useDeleteAddress, useUpdateAddress, useUpdateProfile } from '@/hooks';
import { useAuth } from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Key, Loader2, MapPin, Trash2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Nigerian states and their major cities
const NIGERIAN_STATES = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
    'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
    'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const STATE_CITIES: Record<string, string[]> = {
    'Lagos': ['Lagos Island', 'Ikeja', 'Surulere', 'Yaba', 'Lekki', 'Victoria Island', 'Ajah', 'Ikorodu', 'Agege', 'Mushin'],
    'Abuja': ['Wuse', 'Maitama', 'Asokoro', 'Garki', 'Jabi', 'Utako', 'Wuye', 'Gwarinpa', 'Kubwa', 'Nyanya'],
    'Kano': ['Kano City', 'Nassarawa', 'Fagge', 'Gwale', 'Dala', 'Tarauni', 'Kumbotso', 'Ungogo', 'Dawakin Tofa'],
    'Rivers': ['Port Harcourt', 'Obio-Akpor', 'Eleme', 'Oyigbo', 'Okrika', 'Ogu–Bolo', 'Tai', 'Khana', 'Gokana'],
    'Oyo': ['Ibadan', 'Ogbomosho', 'Iseyin', 'Oyo', 'Eruwa', 'Saki', 'Igboho', 'Kishi', 'Shaki'],
    'Ogun': ['Abeokuta', 'Ijebu-Ode', 'Sagamu', 'Ota', 'Ifo', 'Sango Ota', 'Ilaro', 'Itori', 'Owode'],
    'Ondo': ['Akure', 'Ondo', 'Owo', 'Ikare', 'Okitipupa', 'Idanre', 'Ifon', 'Igbotako', 'Ore'],
    'Osun': ['Osogbo', 'Ile-Ife', 'Ilesa', 'Iwo', 'Ede', 'Ejigbo', 'Ikirun', 'Ila Orangun', 'Gbongan'],
    'Ekiti': ['Ado-Ekiti', 'Ikere-Ekiti', 'Aramoko-Ekiti', 'Efon-Alaaye', 'Ijero-Ekiti', 'Oye-Ekiti', 'Ikole-Ekiti'],
    'Kwara': ['Ilorin', 'Offa', 'Omu-Aran', 'Patigi', 'Kaiama', 'Jebba', 'Lafiagi', 'Irepodun'],
    'Kogi': ['Lokoja', 'Okene', 'Idah', 'Anyigba', 'Dekina', 'Kabba', 'Egbe', 'Isanlu'],
    'Benue': ['Makurdi', 'Gboko', 'Otukpo', 'Katsina-Ala', 'Zaki Biam', 'Vandeikya', 'Ukum'],
    'Nassarawa': ['Lafia', 'Keffi', 'Akwanga', 'Nasarawa', 'Wamba', 'Toto', 'Karshi'],
    'Plateau': ['Jos', 'Bukuru', 'Barkin Ladi', 'Pankshin', 'Shendam', 'Langtang', 'Mangu'],
    'Kaduna': ['Kaduna', 'Zaria', 'Kafanchan', 'Kagoro', 'Kachia', 'Jema\'a', 'Soba'],
    'Katsina': ['Katsina', 'Daura', 'Funtua', 'Malumfashi', 'Mani', 'Bakori', 'Dutsin-Ma'],
    'Kebbi': ['Birnin Kebbi', 'Argungu', 'Yauri', 'Shanga', 'Bagudo', 'Bunza', 'Gwandu'],
    'Sokoto': ['Sokoto', 'Wurno', 'Rabah', 'Goronyo', 'Illela', 'Tambuwal', 'Kware'],
    'Zamfara': ['Gusau', 'Kaura Namoda', 'Talata Mafara', 'Zurmi', 'Maradun', 'Shinkafi', 'Bungudu'],
    'Jigawa': ['Dutse', 'Hadejia', 'Kazaure', 'Gumel', 'Birnin Kudu', 'Ringim', 'Gwaram'],
    'Yobe': ['Damaturu', 'Potiskum', 'Gashua', 'Nguru', 'Geidam', 'Bade', 'Jakusko'],
    'Borno': ['Maiduguri', 'Bama', 'Konduga', 'Mafa', 'Dikwa', 'Gwoza', 'Chibok'],
    'Taraba': ['Jalingo', 'Wukari', 'Bali', 'Takum', 'Serti', 'Ibi', 'Gassol'],
    'Adamawa': ['Yola', 'Mubi', 'Numan', 'Jimeta', 'Ganye', 'Song', 'Toungo'],
    'Bauchi': ['Bauchi', 'Azare', 'Misau', 'Jama\'are', 'Katagum', 'Alkaleri', 'Darazo'],
    'Gombe': ['Gombe', 'Kaltungo', 'Billiri', 'Dukku', 'Funakaye', 'Pindiga', 'Yamaltu/Deba'],
    'Anambra': ['Awka', 'Onitsha', 'Nnewi', 'Ekwulobia', 'Agulu', 'Ozubulu', 'Ukpo'],
    'Enugu': ['Enugu', 'Nsukka', 'Awgu', 'Udi', 'Oji River', 'Ezeagu', 'Igbo-Eze'],
    'Ebonyi': ['Abakaliki', 'Afikpo', 'Onueke', 'Ezza', 'Ishielu', 'Ivo', 'Ohaozara'],
    'Imo': ['Owerri', 'Orlu', 'Okigwe', 'Oguta', 'Mbaise', 'Nkwerre', 'Njaba'],
    'Abia': ['Umuahia', 'Aba', 'Ohafia', 'Isiala Ngwa', 'Ukwa', 'Ikwuano', 'Bende'],
    'Delta': ['Asaba', 'Warri', 'Sapele', 'Agbor', 'Ughelli', 'Ozoro', 'Oleh'],
    'Edo': ['Benin City', 'Auchi', 'Ekpoma', 'Igarra', 'Uromi', 'Irrua', 'Sabongida Ora'],
    'Cross River': ['Calabar', 'Ikom', 'Ogoja', 'Ugep', 'Obudu', 'Akamkpa', 'Biase'],
    'Akwa Ibom': ['Uyo', 'Eket', 'Ikot Ekpene', 'Oron', 'Abak', 'Ikot Abasi', 'Etinan'],
    'Bayelsa': ['Yenagoa', 'Brass', 'Ogbia', 'Sagbama', 'Ekeremor', 'Kolokuma/Opokuma'],
    'FCT': ['Abuja', 'Gwagwalada', 'Kuje', 'Bwari', 'Abaji'],
    'Niger': ['Minna', 'Suleja', 'Kontagora', 'Bida', 'Lapai', 'Mokwa', 'Agaie']
};

// Zod schemas for validation
const profileSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'Name too long').optional(),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Name too long').optional(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmNewPassword: z.string().min(6, 'Confirm new password is required'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
});

const addressSchema = z.object({
    type: z.string().optional(),
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().optional(),
    country: z.string().min(2, 'Country is required'),
});


export default function SettingsPage() {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();

    const updateProfileMutation = useUpdateProfile();
    const changePasswordMutation = useChangePassword();
    const { data: addressesData, isLoading: addressesLoading } = useAddresses();
    const addAddressMutation = useAddAddress();
    const updateAddressMutation = useUpdateAddress();
    const deleteAddressMutation = useDeleteAddress();

    // Forms for different sections
    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
        },
    });

    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    });

    const addressForm = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            type: 'home',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Nigeria',
        },
    });

    const [editingAddress, setEditingAddress] = useState<any>(null);
    const [availableCities, setAvailableCities] = useState<string[]>([]);


    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/settings');
        }
        if (user) {
            profileForm.reset({ firstName: user.firstName || '', lastName: user.lastName || '' });
        }
    }, [user, authLoading, router, profileForm]);

    // Update available cities when state changes
    useEffect(() => {
        const stateValue = addressForm.watch('state');
        if (stateValue && STATE_CITIES[stateValue]) {
            setAvailableCities(STATE_CITIES[stateValue]);
            // Reset city if current city is not in the new state's cities
            const currentCity = addressForm.getValues('city');
            if (currentCity && !STATE_CITIES[stateValue].includes(currentCity)) {
                addressForm.setValue('city', '');
            }
        } else {
            setAvailableCities([]);
            addressForm.setValue('city', '');
        }
    }, [addressForm.watch('state'), addressForm]);


    const handleProfileUpdate = async (values: z.infer<typeof profileSchema>) => {
        if (!user) return;
        updateProfileMutation.mutate(values, {
            onSuccess: () => {
                toast.success("Profile updated successfully!");
            },
            onError: (error: any) => {
                console.error("Error updating profile:", error);
                toast.error(`Failed to update profile: ${error.message}`);
            },
        });
    };

    const handlePasswordChange = async (values: z.infer<typeof passwordSchema>) => {
        if (!user) return;

        changePasswordMutation.mutate({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
        }, {
            onSuccess: () => {
                toast.success("Password updated successfully!");
                passwordForm.reset();
            },
            onError: (error: any) => {
                console.error("Error updating password:", error);
                toast.error(`Failed to update password: ${error.message}`);
            },
        });
    };

    const handleAddAddress = async (values: z.infer<typeof addressSchema>) => {
        addAddressMutation.mutate(values, {
            onSuccess: () => {
                toast.success("Address added successfully!");
                addressForm.reset();
            },
            onError: (error: any) => {
                console.error("Error adding address:", error);
                toast.error(`Failed to add address: ${error.message}`);
            },
        });
    };

    const handleUpdateAddress = async (values: z.infer<typeof addressSchema>) => {
        if (!editingAddress) return;
        updateAddressMutation.mutate({ id: editingAddress.id, data: values }, {
            onSuccess: () => {
                toast.success("Address updated successfully!");
                setEditingAddress(null);
                addressForm.reset();
            },
            onError: (error: any) => {
                console.error("Error updating address:", error);
                toast.error(`Failed to update address: ${error.message}`);
            },
        });
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (confirm('Are you sure you want to delete this address?')) {
            deleteAddressMutation.mutate(addressId, {
                onSuccess: () => {
                    toast.success("Address deleted successfully!");
                },
                onError: (error: any) => {
                    console.error("Error deleting address:", error);
                    toast.error(`Failed to delete address: ${error.message}`);
                },
            });
        }
    };

    const startEditingAddress = (address: any) => {
        setEditingAddress(address);
        addressForm.reset({
            type: address.type || 'home',
            street: address.street || '',
            city: address.city || '',
            state: address.state || '',
            zipCode: address.zipCode || '',
            country: address.country || 'Nigeria',
        });
    };



    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="ml-3 text-lg text-gray-700">Loading settings...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                <p className="text-lg text-gray-700 text-center">Please log in to manage your account settings.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                        Account Settings
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Manage your personal information, security settings, and account preferences
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Profile Information Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-8 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <User className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                                    <p className="text-gray-600">Update your personal details</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <Form {...profileForm}>
                                <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
                                    <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Email Address</h3>
                                        <Input
                                            value={user.email || 'N/A'}
                                            disabled
                                            className="bg-white border-gray-200 cursor-not-allowed rounded-xl"
                                        />
                                        <p className="text-sm text-gray-500 mt-2">Email cannot be changed here for security reasons.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={profileForm.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium text-lg">First Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter your first name"
                                                            className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-12"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={profileForm.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium text-lg">Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter your last name"
                                                            className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-12"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={profileForm.formState.isSubmitting}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-colors text-lg"
                                    >
                                        {profileForm.formState.isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Updating Profile...
                                            </>
                                        ) : (
                                            'Update Profile'
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>

                    {/* Change Password Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-8 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <Key className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                                    <p className="text-gray-600">Change your password to keep your account secure</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-6">
                                    <FormField
                                        control={passwordForm.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium text-lg">Current Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Enter your current password"
                                                        className="rounded-xl border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 h-12"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={passwordForm.control}
                                            name="newPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium text-lg">New Password</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Enter new password"
                                                            className="rounded-xl border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 h-12"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={passwordForm.control}
                                            name="confirmNewPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium text-lg">Confirm New Password</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Confirm new password"
                                                            className="rounded-xl border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 h-12"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-1 bg-yellow-100 rounded-lg">
                                                <Key className="h-4 w-4 text-yellow-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-yellow-800">Password Requirements</h4>
                                                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                                                    <li>• At least 6 characters long</li>
                                                    <li>• Use a mix of letters and numbers</li>
                                                    <li>• Avoid common passwords</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={passwordForm.formState.isSubmitting}
                                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-colors text-lg"
                                    >
                                        {passwordForm.formState.isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Changing Password...
                                            </>
                                        ) : (
                                            'Change Password'
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>

                    {/* Addresses Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-8 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <MapPin className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Delivery Addresses</h2>
                                    <p className="text-gray-600">Manage your shipping addresses</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Existing Addresses */}
                            {addressesData?.addresses?.length > 0 && (
                                <div className="space-y-4 mb-8">
                                    <h3 className="text-lg font-semibold text-gray-800">Your Addresses</h3>
                                    {addressesData.addresses.map((address: any) => (
                                        <div key={address.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-gray-800">{address.street}</p>
                                                    <p className="text-gray-600">{address.city}, {address.state}, {address.country}</p>
                                                    {address.zipCode && <p className="text-gray-600">ZIP: {address.zipCode}</p>}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => startEditingAddress(address)}
                                                        className="rounded-lg"
                                                    >
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteAddress(address.id)}
                                                        className="text-red-600 border-red-300 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add/Edit Address Form */}
                            <Form {...addressForm}>
                                <form onSubmit={addressForm.handleSubmit(editingAddress ? handleUpdateAddress : handleAddAddress)} className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={addressForm.control}
                                            name="street"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium">Street Address</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter street address"
                                                            className="rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 h-12"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={addressForm.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium">City</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter city"
                                                            className="rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 h-12"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={addressForm.control}
                                            name="state"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium">State</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter state"
                                                            className="rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 h-12"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={addressForm.control}
                                            name="country"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium">Country</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter country"
                                                            className="rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 h-12"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <Button
                                            type="submit"
                                            disabled={addressForm.formState.isSubmitting || addAddressMutation.isPending || updateAddressMutation.isPending}
                                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-colors"
                                        >
                                            {addressForm.formState.isSubmitting || addAddressMutation.isPending || updateAddressMutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    {editingAddress ? 'Updating...' : 'Adding...'}
                                                </>
                                            ) : (
                                                editingAddress ? 'Update Address' : 'Add Address'
                                            )}
                                        </Button>

                                        {editingAddress && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setEditingAddress(null);
                                                    addressForm.reset();
                                                }}
                                                className="rounded-lg"
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>

                    {/* Account Actions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Actions</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                <div>
                                    <h3 className="font-medium text-gray-800">Export Account Data</h3>
                                    <p className="text-sm text-gray-600">Download a copy of your account data</p>
                                </div>
                                <Button variant="outline" className="rounded-xl">
                                    Export Data
                                </Button>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-xl">
                                <div>
                                    <h3 className="font-medium text-red-800">Delete Account</h3>
                                    <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                                </div>
                                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 rounded-xl">
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
