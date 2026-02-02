import { useMemo } from 'react';

/**
 * Custom hook for calculating unread counts across all conversations
 * Provides total, direct, and group unread counts
 */
export default function useUnreadCount(conversations) {
    const counts = useMemo(() => {
        const total = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);

        const direct = conversations
            .filter(conv => conv.type === 'DIRECT')
            .reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);

        const group = conversations
            .filter(conv => conv.type === 'GROUP')
            .reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);

        return { total, direct, group };
    }, [conversations]);

    return counts;
}
