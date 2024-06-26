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
import { login } from '@/services/auth'; 
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';


const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  tenant: z.string().nonempty({ message: 'Tenant is required' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [loading, setLoading] = useState(false);
  const { setUserData } = useAuth();
  const { toast } = useToast();
  const router = useRouter()

  const defaultValues = {
    email: '',
    password: '',
    tenant: ''
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    try {
      await login({ email: data.email, password: data.password }, data.tenant, setUserData)
      .then((response) => {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.userType === 'WalletUser' ? 'Wallet User' : 'BackOffice User'}!`
        });
        if(response.userType === 'WalletUser') {
          router.push('/wallet/dashboard')
        }
        if(response.userType === 'BackOffice') {
          router.push('/cobrand/dashboard')
        }
      });
    } catch (error) {
      console.error('Login failed', error);
      toast({
        title: "Login Failed",
        description: "Invalid credentials or an unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
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
            name="tenant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tenant</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your tenant..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Continue 
          </Button>
        </form>
      </Form>
    </>
  );
}
