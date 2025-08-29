'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// TODO: Replace with your actual Stripe publishable key
const stripePromise = loadStripe('your-stripe-publishable-key-here');

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement!,
    });

    if (error) {
      setError(error.message || 'An error occurred');
      setProcessing(false);
    } else {
      // TODO: Send paymentMethod.id to your server to complete the payment
      console.log('PaymentMethod created:', paymentMethod);
      setProcessing(false);
      // Redirect or show success message
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="border p-3 rounded-md" />
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={!stripe || processing} className="w-full">
        {processing ? 'Processing...' : 'Pay $1.50'}
      </Button>
    </form>
  );
}

export default function PaymentPage() {
  

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Subscribe to Full Access</CardTitle>
          <CardDescription>Monthly subscription: $1.50</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Choose your payment method to unlock unlimited test attempts and full features.</p>
          <Tabs defaultValue="ecocash" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ecocash">EcoCash</TabsTrigger>
              <TabsTrigger value="mastercard">Mastercard</TabsTrigger>
            </TabsList>
            <TabsContent value="ecocash">
              <div className="space-y-4">
                <p>Pay to EcoCash number: 0873708963</p>
                <p>Amount: $1.50 (monthly)</p>
                <p>Instructions:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Make payment via EcoCash to 0873708963</li>
                  <li>Take a screenshot or get transaction confirmation</li>
                  <li>Send the proof via WhatsApp to 0873708963, including your account email</li>
                  <li>Our admin will review and activate your subscription within 24 hours</li>
                </ol>
              </div>
            </TabsContent>
            <TabsContent value="mastercard">
              <div className="space-y-4">
                <p>Use your Mastercard to pay securely.</p>
                <Elements stripe={stripePromise}>
                  <PaymentForm />
                </Elements>
                <p className="text-sm text-muted-foreground">Your subscription will be activated automatically upon successful payment.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">For any issues, contact support@example.com</p>
        </CardFooter>
      </Card>
    </div>
  );
}