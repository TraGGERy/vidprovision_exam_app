import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { createOrGetUser } from '@/lib/db/queries';

// Production-ready logging
const logger = {
  info: (message: string, data?: unknown) => {
    console.log(`[ClerkWebhook] ${new Date().toISOString()} INFO: ${message}`, data ? JSON.stringify(data) : '');
  },
  error: (message: string, error?: unknown) => {
    console.error(`[ClerkWebhook] ${new Date().toISOString()} ERROR: ${message}`, error);
  },
  warn: (message: string, data?: unknown) => {
    console.warn(`[ClerkWebhook] ${new Date().toISOString()} WARN: ${message}`, data ? JSON.stringify(data) : '');
  }
};

export async function POST(req: NextRequest) {
  try {
    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // Validate required headers
    if (!svix_id || !svix_timestamp || !svix_signature) {
      logger.error('Missing required Svix headers');
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }

    // Get the body
    const payload = await req.text();

    // Get the Webhook secret from environment variables
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      logger.error('CLERK_WEBHOOK_SECRET not found in environment variables');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);

    type EmailAddress = { id: string; email_address: string };
    type ClerkEvent = { type: string; data: { id: string; email_addresses?: EmailAddress[]; primary_email_address_id?: string; first_name?: string; last_name?: string } };
    let evt: ClerkEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as ClerkEvent;
    } catch (err) {
      logger.error('Webhook verification failed', err);
      return NextResponse.json(
        { error: 'Webhook verification failed' },
        { status: 400 }
      );
    }

    // Handle the webhook
    const { id } = evt.data;
    const eventType = evt.type;

    logger.info(`Received webhook event: ${eventType}`, { userId: id });

    if (eventType === 'user.created') {
      try {
        const { id, email_addresses, first_name, last_name } = evt.data;

        // Validate required data
        if (!id) {
          logger.error('User ID missing from webhook data');
          return NextResponse.json(
            { error: 'User ID missing' },
            { status: 400 }
          );
        }

        if (!email_addresses || !Array.isArray(email_addresses) || email_addresses.length === 0) {
          logger.error('Email addresses missing from webhook data');
          return NextResponse.json(
            { error: 'Email addresses missing' },
            { status: 400 }
          );
        }

        const primaryEmail = email_addresses?.find((email: EmailAddress) => email.id === evt.data.primary_email_address_id);
        const emailAddress = primaryEmail?.email_address || email_addresses?.[0]?.email_address;

        if (!emailAddress) {
          logger.error('No valid email address found in webhook data');
          return NextResponse.json(
            { error: 'No valid email address found' },
            { status: 400 }
          );
        }

        // Create or get user in the PostgreSQL database
        const newUser = await createOrGetUser(
          id,
          emailAddress,
          `${first_name || ''} ${last_name || ''}`.trim()
        );

        logger.info(`Successfully created or fetched user in DB: ${emailAddress}`, { userId: id });

        return NextResponse.json({
          success: true,
          message: 'User created successfully',
          user: {
            id: newUser.id,
            clerkId: newUser.clerkId,
            email: newUser.email,
            name: newUser.name,
            subscriptionType: newUser.subscriptionType
          }
        });

      } catch (error) {
        logger.error('Failed to create user from webhook', error);
        
        // Return success to Clerk even if our processing failed
        // This prevents Clerk from retrying the webhook
        return NextResponse.json({
          success: false,
          message: 'User creation failed but webhook acknowledged',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // For other event types, just acknowledge
    logger.info(`Webhook event ${eventType} acknowledged but not processed`);
    return NextResponse.json({ success: true, message: 'Webhook received' });

  } catch (error) {
    logger.error('Webhook processing failed', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}