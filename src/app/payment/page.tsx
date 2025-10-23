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
        {processing ? 'Processing...' : 'Pay $2 USD'}
      </Button>
    </form>
  );
}

export default function PaymentPage() {
  const ecocashNumber = '0778091294';
  const supportEmail = 'tashaverahgumbo@gmail.com';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Subscribe to Full Access</CardTitle>
          <CardDescription>Monthly subscription: $2 USD</CardDescription>
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
                <div className="flex items-center gap-2">
                  <p>Pay to EcoCash number:</p>
                  <button
                    onClick={() => copyToClipboard(ecocashNumber)}
                    className="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded font-mono text-blue-800 cursor-pointer transition-colors"
                    title="Click to copy"
                  >
                    {ecocashNumber}
                  </button>
                </div>
                <p>Amount: <strong>$2 USD</strong></p>
                <p>Instructions:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Make payment via EcoCash to <span className="font-mono font-semibold">{ecocashNumber}</span></li>
                  <li>Take a screenshot or get transaction confirmation</li>
                  <li>
                    Send the payment confirmation via WhatsApp to{' '}
                    <button
                      onClick={() => copyToClipboard(ecocashNumber)}
                      className="bg-green-100 hover:bg-green-200 px-2 py-1 rounded font-mono text-green-800 cursor-pointer transition-colors"
                      title="Click to copy WhatsApp number"
                    >
                      {ecocashNumber}
                    </button>
                    , including your account email
                  </li>
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
          <p className="text-sm text-muted-foreground">For any issues, contact {supportEmail}</p>
        </CardFooter>
      </Card>
    </div>
  );
}