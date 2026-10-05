import { initialUsers } from "./fixtures/users.fixture";
import { initialPosts } from "./fixtures/posts.fixture";
import { initialComments } from "./fixtures/comments.fixture";
import { initialGroups } from "./fixtures/groups.fixture";
import {
  initialFriends,
  initialSuggestions,
  initialFriendRequests,
} from "./fixtures/friends.fixture";
import { initialConversations, initialMessages } from "./fixtures/chat.fixture";
import { initialNotifications } from "./fixtures/notifications.fixture";
import { initialReports, initialHobbies } from "./fixtures/admin.fixture";

const STORAGE_KEY = "connectcg_mock_db_v1";

class MockDatabase {
  constructor() {
    this.data = this.loadInitialData();
  }

  loadInitialData() {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {
        console.warn("[MockDB] Failed to parse localStorage, resetting to defaults", e);
      }
    }

    return this.getDefaultFixtures();
  }

  getDefaultFixtures() {
    return {
      currentUserId: 1, // Default user: Nguyễn Kim Quốc Khánh (Admin)
      users: [...initialUsers],
      posts: [...initialPosts],
      comments: [...initialComments],
      groups: [...initialGroups],
      friends: [...initialFriends],
      suggestions: [...initialSuggestions],
      friendRequests: [...initialFriendRequests],
      conversations: [...initialConversations],
      messages: { ...initialMessages },
      notifications: [...initialNotifications],
      reports: [...initialReports],
      hobbies: [...initialHobbies],
    };
  }

  save() {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch (e) {
        console.error("[MockDB] Error saving to localStorage", e);
      }
    }
  }

  reset() {
    this.data = this.getDefaultFixtures();
    this.save();
    console.log("[MockDB] Database reset to initial fixtures.");
  }

  getCurrentUser() {
    const user = this.data.users.find((u) => u.id === this.data.currentUserId);
    return user || this.data.users[0];
  }

  setCurrentUser(userId) {
    const user = this.data.users.find((u) => u.id === Number(userId));
    if (user) {
      this.data.currentUserId = user.id;
      this.save();
    }
    return user;
  }

  // Generic Collection Helpers
  getCollection(name) {
    return this.data[name] || [];
  }

  findById(collectionName, id) {
    const col = this.getCollection(collectionName);
    return col.find((item) => String(item.id) === String(id)) || null;
  }

  insert(collectionName, item) {
    if (!this.data[collectionName]) {
      this.data[collectionName] = [];
    }
    const newItem = {
      ...item,
      id: item.id || Date.now(),
      createdAt: item.createdAt || new Date().toISOString(),
    };
    this.data[collectionName].unshift(newItem);
    this.save();
    return newItem;
  }

  update(collectionName, id, updates) {
    const col = this.getCollection(collectionName);
    const index = col.findIndex((item) => String(item.id) === String(id));
    if (index !== -1) {
      col[index] = { ...col[index], ...updates };
      this.save();
      return col[index];
    }
    return null;
  }

  delete(collectionName, id) {
    const col = this.getCollection(collectionName);
    const initialLen = col.length;
    this.data[collectionName] = col.filter((item) => String(item.id) !== String(id));
    const removed = this.data[collectionName].length < initialLen;
    if (removed) this.save();
    return removed;
  }

  paginate(array = [], page = 0, size = 10) {
    const p = Math.max(0, parseInt(page, 10) || 0);
    const s = Math.max(1, parseInt(size, 10) || 10);
    const start = p * s;
    const content = array.slice(start, start + s);
    const totalElements = array.length;
    const totalPages = Math.ceil(totalElements / s) || 1;
    const isLast = p >= totalPages - 1;

    return {
      content,
      totalElements,
      totalPages,
      last: isLast,
      number: p,
      size: s,
      first: p === 0,
      numberOfElements: content.length,
      empty: content.length === 0,
    };
  }
}

export const mockDb = new MockDatabase();
export default mockDb;
