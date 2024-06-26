"use client";

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { register } from '@/services/auth';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';


const formSchema = z.object({
    tenantName: z.string().nonempty({ message: 'Tenant Name is required' }),
    userName: z.string().nonempty({ message: 'User Name is required' }),
    email: z.string().email({ message: 'Enter a valid email address' }),
    firstName: z.string().nonempty({ message: 'First Name is required' }),
    lastName: z.string().nonempty({ message: 'Last Name is required' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().min(6, { message: 'Confirm Password must be at least 6 characters' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserRegistrationForm() {
    const [loading, setLoading] = useState(false);
    const { setUserData } = useAuth();
    const { toast } = useToast();
    const router = useRouter()

    const defaultValues = {
        tenantName: '',
        userName: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: ''
    };

    const form = useForm<UserFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const onSubmit = async (data: UserFormValue) => {
        setLoading(true);
        try {
            await register({
                userName: data.userName,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                password: data.password,
                confirmPassword: data.confirmPassword,
                phoneNumber: '+23057901383'
            }, data.tenantName);
            toast({
                title: "Registration Successful",
                description: "Your account has been created successfully."
            });
            router.push('/auth/signin');
        } catch (error) {
            console.error('Registration failed', error);
            toast({
                title: "Registration Failed",
                description: "An error occurred during registration.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-2"
            >
                <FormField
                    control={form.control}
                    name="tenantName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tenant Name</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>User Name</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter your user name..."
                                    disabled={loading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Enter your email..."
                                    disabled={loading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter your first name..."
                                    disabled={loading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter your last name..."
                                    disabled={loading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Enter your password..."
                                    disabled={loading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Confirm your password..."
                                    disabled={loading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button disabled={loading} className="ml-auto w-full" type="submit">
                    Register
                </Button>
            </form>
        </Form>
    );
}
