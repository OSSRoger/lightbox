import { NextResponse } from 'next/server';
import z from 'zod';

export function checkUpsertUserError(error: unknown) {
  const dbError = error as { message: string };

  if (error instanceof z.ZodError) {
    console.log('Failed to POST user with status 400.', { error });
    return NextResponse.json({ error: error.errors }, { status: 400 });
  }

  if (
    typeof dbError === 'object' &&
    dbError !== null &&
    'message' in dbError &&
    dbError.message === 'duplicate key value violates unique constraint "unique_email_idx"'
  ) {
    console.log('Failed to POST user with status 400.', { error: dbError.message });
    return new NextResponse(JSON.stringify(dbError.message), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } else {
    console.log('Failed to POST user with status 500.', { error });
    return new NextResponse(null, { status: 500 });
  }
}
