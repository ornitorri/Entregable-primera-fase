'use client';

import { useParams } from 'next/navigation';
import MessagesView from '@/components/chat/MessagesView';

export default function MensajesConUsuarioPage() {
  const params = useParams();
  const userId = parseInt(String(params.userId), 10);

  return <MessagesView initialUserId={isNaN(userId) ? undefined : userId} />;
}
