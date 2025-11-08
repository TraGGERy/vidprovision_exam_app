'use client';

import { useState } from 'react';
import Link from 'next/link';
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
      <CardElement
        className="border border-gray-700 bg-gray-900 p-3 rounded-md"
        options={{
          style: {
            base: {
              color: '#ffffff',
              '::placeholder': { color: '#9CA3AF' },
              fontSize: '16px',
            },
          },
        }}
      />
      {error && <p className="text-red-400">{error}</p>}
      <Button type="submit" disabled={!stripe || processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="mb-4">
          <Link href="/">
            <Button className="bg-gray-800 hover:bg-gray-700 text-white">Back Home</Button>
          </Link>
        </div>
        <Card className="bg-gray-900 border border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-white">Subscribe to Full Access</CardTitle>
            <CardDescription className="text-gray-300">Monthly subscription: $2 USD</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-200">Choose your payment method to unlock unlimited test attempts and full features.</p>
            <Tabs defaultValue="ecocash" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800 text-white rounded-lg">
                <TabsTrigger value="ecocash" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">EcoCash</TabsTrigger>
                <TabsTrigger value="mastercard" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">Mastercard</TabsTrigger>
              </TabsList>
              <TabsContent value="ecocash">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-200">Pay to EcoCash number:</p>
                    <button
                      onClick={() => copyToClipboard(ecocashNumber)}
                      className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded font-mono text-white border border-gray-600 cursor-pointer transition-colors"
                      title="Click to copy"
                    >
                      {ecocashNumber}
                    </button>
                  </div>
                  <p className="text-gray-200">Amount: <strong className="text-white">$2 USD</strong></p>
                  <p className="text-gray-200">Instructions:</p>
                  <ol className="list-decimal pl-5 space-y-2 text-gray-300">
                    <li>Make payment via EcoCash to <span className="font-mono font-semibold text-white">{ecocashNumber}</span></li>
                    <li>Take a screenshot or get transaction confirmation</li>
                    <li>
                      Send the payment confirmation via WhatsApp to{' '}
                      <button
                        onClick={() => copyToClipboard(ecocashNumber)}
                        className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded font-mono text-green-300 border border-gray-600 cursor-pointer transition-colors"
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
                  <p className="text-gray-200">Use your Mastercard to pay securely.</p>
                  <Elements stripe={stripePromise}>
                    <PaymentForm />
                  </Elements>
                  <p className="text-sm text-gray-400">Your subscription will be activated automatically upon successful payment.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <p className="text-sm text-gray-400">For any issues, contact {supportEmail}</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}