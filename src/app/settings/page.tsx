/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/settings/page.tsx
'use client';

// Forces the page to be rendered dynamically on every request,
// preventing static prerendering which triggers errors in client-side components
export const dynamic = 'force-dynamic';

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
    'FCT': ['Wuse', 'Maitama', 'Asokoro', 'Garki', 'Jabi', 'Utako', 'Wuye', 'Gwarinpa', 'Kubwa', 'Nyanya', 'Gwagwalada', 'Kuje', 'Bwari', 'Abaji'], // Combined Abuja from list
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
    'Nasarawa': ['Lafia', 'Keffi', 'Akwanga', 'Nasarawa', 'Wamba', 'Toto', 'Karshi'],
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

    const defaultAddressFormValues = {
        type: 'home',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Nigeria',
    }

    const addressForm = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
        defaultValues: defaultAddressFormValues,
    });

    const [editingAddress, setEditingAddress] = useState<any>(null);
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);


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
        // Use the state name directly as the key
        const cities = STATE_CITIES[stateValue];

        if (cities) {
            setAvailableCities(cities);
            // Reset city if current city is not in the new state's cities
            const currentCity = addressForm.getValues('city');
            if (currentCity && !cities.includes(currentCity)) {
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
                const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
                toast.error(`Failed to update profile: ${errorMessage}`);
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
                const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
                toast.error(`Failed to update password: ${errorMessage}`);
            },
        });
    };

    const handleAddressSubmit = async (values: z.infer<typeof addressSchema>) => {
        if (editingAddress) {
            handleUpdateAddress(values);
        } else {
            handleAddAddress(values);
        }
    };

    const handleAddAddress = async (values: z.infer<typeof addressSchema>) => {
        addAddressMutation.mutate(values, {
            onSuccess: () => {
                // SUCCESS MESSAGE 1: ADD
                toast.success("Address added successfully!");
                addressForm.reset(defaultAddressFormValues);
                setIsFormVisible(false);
            },
            onError: (error: any) => {
                console.error("Error adding address:", error);
                const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
                toast.error(`Failed to add address: ${errorMessage}`);
            },
        });
    };

    const handleUpdateAddress = async (values: z.infer<typeof addressSchema>) => {
        if (!editingAddress) return;

        updateAddressMutation.mutate({ id: editingAddress.id, data: values }, {
            onSuccess: () => {
                // SUCCESS MESSAGE 2: UPDATE
                toast.success("Address updated successfully!");
                setEditingAddress(null);
                addressForm.reset(defaultAddressFormValues);
                setIsFormVisible(false);
            },
            onError: (error: any) => {
                console.error("Error updating address:", error);
                const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
                toast.error(`Failed to update address: ${errorMessage}`);
            },
        });
    };

    // FIX: Replace JavaScript 'confirm' with 'sonner' toast with action button
    const handleDeleteAddress = async (addressId: string) => {
        toast('Are you sure you want to delete this address?', {
            description: 'This action is irreversible.',
            duration: 5000, // Duration for the user to confirm
            action: {
                label: 'Confirm Delete',
                onClick: () => {
                    // Execute mutation only upon user confirmation via toast action
                    deleteAddressMutation.mutate(addressId, {
                        onSuccess: () => {
                            toast.success("Address deleted successfully!");
                            if (editingAddress?.id === addressId) {
                                setEditingAddress(null);
                                addressForm.reset(defaultAddressFormValues);
                                setIsFormVisible(false);
                            }
                        },
                        onError: (error: any) => {
                            console.error("Error deleting address:", error);
                            const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
                            toast.error(`Failed to delete address: ${errorMessage}`);
                        },
                    });
                },
            },
        });
    };

    const startEditingAddress = (address: any) => {
        setEditingAddress(address);
        setIsFormVisible(true);

        // Pre-populate city options for the selected state
        const cities = STATE_CITIES[address.state];
        if (cities) {
            setAvailableCities(cities);
        } else {
            setAvailableCities([]);
        }

        // This part is correct for pre-populating the form
        addressForm.reset({
            type: address.type || 'home',
            street: address.street || '',
            city: address.city || '',
            state: address.state || '',
            zipCode: address.zipCode || '',
            country: address.country || 'Nigeria',
        });
    };

    const startAddingNewAddress = () => {
        setEditingAddress(null);
        setIsFormVisible(true);
        addressForm.reset(defaultAddressFormValues);
        setAvailableCities(STATE_CITIES[addressForm.getValues('state')] || []); // Ensure cities are loaded if default state is set
    }


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
        <div className="bg-gray-50 overflow-y-auto min-h-screen">
            <div className="app-content container mx-auto px-3 sm:px-4 py-6 sm:py-12">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
                        Account Settings
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-2">
                        Manage your personal information, security settings, and account preferences
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                    {/* Profile Information Card */}
                    <div className="bg-white rounded-xl sm:rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 sm:p-8 border-b border-gray-100">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Profile Information</h2>
                                    <p className="text-sm sm:text-base text-gray-600">Update your personal details</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 sm:p-8">
                            <Form {...profileForm}>
                                <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
                                    <div className="bg-gray-50/50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-100">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Email Address</h3>
                                        <Input
                                            value={user.email || 'N/A'}
                                            disabled
                                            className="bg-white border-gray-200 cursor-not-allowed rounded-lg sm:rounded-xl h-10 sm:h-12 text-sm sm:text-base"
                                        />
                                        <p className="text-xs sm:text-sm text-gray-500 mt-2">Email cannot be changed here for security reasons.</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <FormField
                                            control={profileForm.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">First Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter your first name"
                                                            className="rounded-lg sm:rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-10 sm:h-12 text-sm sm:text-base"
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
                                                    <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter your last name"
                                                            className="rounded-lg sm:rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-10 sm:h-12 text-sm sm:text-base"
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
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-lg shadow-md hover:shadow-lg transition-colors text-sm sm:text-base"
                                    >
                                        {profileForm.formState.isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin inline" />
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
                    <div className="bg-white rounded-xl sm:rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 sm:p-8 border-b border-gray-100">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg flex-shrink-0">
                                    <Key className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Security Settings</h2>
                                    <p className="text-sm sm:text-base text-gray-600">Change your password to keep your account secure</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 sm:p-8">
                            <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-6">
                                    <FormField
                                        control={passwordForm.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">Current Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Enter your current password"
                                                        className="rounded-lg sm:rounded-xl border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 h-10 sm:h-12 text-sm sm:text-base"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <FormField
                                            control={passwordForm.control}
                                            name="newPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">New Password</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Enter new password"
                                                            className="rounded-lg sm:rounded-xl border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 h-10 sm:h-12 text-sm sm:text-base"
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
                                                    <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">Confirm New Password</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Confirm new password"
                                                            className="rounded-lg sm:rounded-xl border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 h-10 sm:h-12 text-sm sm:text-base"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                        <div className="flex items-start gap-2 sm:gap-3">
                                            <div className="p-1 bg-yellow-100 rounded-lg flex-shrink-0">
                                                <Key className="h-4 w-4 text-yellow-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-medium text-yellow-800 text-sm sm:text-base">Password Requirements</h4>
                                                <ul className="text-xs sm:text-sm text-yellow-700 mt-1 space-y-1">
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
                                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2.5 sm:py-4 px-4 sm:px-6 rounded-lg shadow-md hover:shadow-lg transition-colors text-sm sm:text-base"
                                    >
                                        {passwordForm.formState.isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin inline" />
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
                    <div className="bg-white rounded-xl sm:rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Header with Add Button */}
                        <div className="p-4 sm:p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0">
                                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Delivery Addresses</h2>
                                    <p className="text-sm sm:text-base text-gray-600">Manage your shipping addresses</p>
                                </div>
                            </div>

                            <Button
                                onClick={startAddingNewAddress}
                                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 sm:py-3 px-3 sm:px-6 rounded-lg shadow-md hover:shadow-lg transition-colors text-sm sm:text-base"
                            >
                                <MapPin className="mr-2 h-4 w-4 sm:h-5 sm:w-5 inline" />
                                Add New Address
                            </Button>
                        </div>

                        <div className="p-4 sm:p-8">
                            {/* Existing Addresses Cards */}
                            {addressesLoading ? (
                                <div className="flex justify-center items-center p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl">
                                    <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-green-600" />
                                    <p className="ml-2 text-sm sm:text-base text-gray-600">Loading addresses...</p>
                                </div>
                            ) : (addressesData?.addresses?.length ?? 0) > 0 ? (
                                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Your Saved Addresses</h3>

                                    {(addressesData?.addresses || []).map((address: any, index: number) => (
                                        <div key={address.id || `address-${index}`} className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                                                <div className="min-w-0">
                                                    {/* Display Address Type */}
                                                    <span className="inline-block px-2 sm:px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 mb-2 capitalize">
                                                        {address.type || 'Home'}
                                                    </span>
                                                    <p className="font-medium text-gray-800 text-sm sm:text-base break-words">{address.street}</p>
                                                    <p className="text-gray-600 text-sm sm:text-base">{address.city}, {address.state}, {address.country}</p>
                                                    {address.zipCode && <p className="text-gray-600 text-xs sm:text-sm">ZIP: {address.zipCode}</p>}
                                                </div>
                                                <div className="flex gap-2 flex-shrink-0">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => startEditingAddress(address)}
                                                        className="rounded-lg text-xs sm:text-sm h-9 sm:h-10 px-3"
                                                    >
                                                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteAddress(address.id)}
                                                        className="rounded-lg text-xs sm:text-sm h-9 sm:h-10 px-3 text-red-600 border-red-200 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 sm:p-6 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg sm:rounded-xl mb-6 sm:mb-8">
                                    <p className="text-sm sm:text-base">You have no saved addresses. Click "Add New Address" above to get started.</p>
                                </div>
                            )}

                            {/* Add/Edit Address Form - Conditional Display */}
                            {(isFormVisible || (addressesData?.addresses?.length ?? 0) === 0) && (
                                <Form {...addressForm}>
                                    <form onSubmit={addressForm.handleSubmit(handleAddressSubmit)} className="space-y-4 sm:space-y-6 pt-4">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 border-b pb-2 mb-3 sm:mb-4">
                                            {editingAddress ? 'Edit Address' : 'Add New Address Details'}
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                            {/* Street Address */}
                                            <FormField
                                                control={addressForm.control}
                                                name="street"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">Street Address</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter street address"
                                                                className="rounded-lg sm:rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 h-10 sm:h-12 text-sm sm:text-base"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* State Selection (Dynamic Select) */}
                                            <FormField
                                                control={addressForm.control}
                                                name="state"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">State</FormLabel>
                                                        <FormControl>
                                                            {/* Using a standard HTML select with professional styling */}
                                                            <select
                                                                {...field}
                                                                className="flex h-10 sm:h-12 w-full rounded-lg sm:rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm sm:text-base ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                                value={field.value || ''}
                                                            >
                                                                <option value="" disabled>Select a State</option>
                                                                {NIGERIAN_STATES.map((state) => (
                                                                    <option key={state} value={state}>
                                                                        {state}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* City Selection (Cascading Dynamic Select) */}
                                            <FormField
                                                control={addressForm.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">City</FormLabel>
                                                        <FormControl>
                                                            <select
                                                                {...field}
                                                                disabled={!addressForm.getValues('state') || availableCities.length === 0}
                                                                className="flex h-10 sm:h-12 w-full rounded-lg sm:rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm sm:text-base ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                                value={field.value || ''}
                                                            >
                                                                <option value="" disabled>
                                                                    {availableCities.length > 0 ? 'Select a City' : 'Select a State first'}
                                                                </option>
                                                                {availableCities.map((city) => (
                                                                    <option key={city} value={city}>
                                                                        {city}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Address Type */}
                                            <FormField
                                                control={addressForm.control}
                                                name="type"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">Address Type</FormLabel>
                                                        <FormControl>
                                                            <select
                                                                {...field}
                                                                className="flex h-10 sm:h-12 w-full rounded-lg sm:rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm sm:text-base ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                                value={field.value || 'home'}
                                                            >
                                                                <option value="home">Home</option>
                                                                <option value="work">Work</option>
                                                                <option value="other">Other</option>
                                                            </select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Country (Pre-filled/Disabled for Nigeria) */}
                                            <FormField
                                                control={addressForm.control}
                                                name="country"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">Country</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter country"
                                                                className="rounded-lg sm:rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 h-10 sm:h-12 text-sm sm:text-base"
                                                                {...field}
                                                                disabled
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Zip Code */}
                                            <FormField
                                                control={addressForm.control}
                                                name="zipCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700 font-medium text-sm sm:text-base">Zip/Postal Code (Optional)</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter zip code"
                                                                className="rounded-lg sm:rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 h-10 sm:h-12 text-sm sm:text-base"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="flex gap-3 sm:gap-4 pt-4 flex-col sm:flex-row">
                                            <Button
                                                type="submit"
                                                disabled={addressForm.formState.isSubmitting || addAddressMutation.isPending || updateAddressMutation.isPending}
                                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg shadow-md hover:shadow-lg transition-colors text-sm sm:text-base w-full sm:w-auto"
                                            >
                                                {addressForm.formState.isSubmitting || addAddressMutation.isPending || updateAddressMutation.isPending ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin inline" />
                                                        {editingAddress ? 'Updating Address...' : 'Adding Address...'}
                                                    </>
                                                ) : (
                                                    editingAddress ? 'Save Changes' : 'Add Address'
                                                )}
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setEditingAddress(null);
                                                    setIsFormVisible(false);
                                                    addressForm.reset(defaultAddressFormValues);
                                                }}
                                                className="rounded-lg text-sm sm:text-base py-2.5 sm:py-3 w-full sm:w-auto"
                                            >
                                                {editingAddress ? 'Cancel Edit' : 'Cancel Add'}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            )}
                        </div>
                    </div>

                    {/* Account Actions */}
                    <div className="bg-white rounded-xl sm:rounded-lg shadow-sm border border-gray-200 p-4 sm:p-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Account Actions</h2>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-xl hover:border-gray-300 transition-colors">
                                <div className="min-w-0">
                                    <h3 className="font-medium text-gray-800 text-sm sm:text-base">Export Account Data</h3>
                                    <p className="text-xs sm:text-sm text-gray-600">Download a copy of your account data</p>
                                </div>
                                <Button variant="outline" className="rounded-lg text-xs sm:text-sm h-9 sm:h-10 w-full sm:w-auto flex-shrink-0">
                                    Export Data
                                </Button>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 border border-red-200 bg-red-50 rounded-lg sm:rounded-xl hover:border-red-300 transition-colors">
                                <div className="min-w-0">
                                    <h3 className="font-medium text-red-800 text-sm sm:text-base">Delete Account</h3>
                                    <p className="text-xs sm:text-sm text-red-600">Permanently delete your account and all data</p>
                                </div>
                                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-xs sm:text-sm h-9 sm:h-10 w-full sm:w-auto flex-shrink-0">
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