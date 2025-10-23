import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { auth } from '@clerk/nextjs/server';

// Production-ready logging utility
const logger = {
  info: (message: string, data?: unknown) => {
    console.log(`[UserService] ${new Date().toISOString()} INFO: ${message}`, data ? JSON.stringify(data) : '');
  },
  error: (message: string, error?: unknown) => {
    console.error(`[UserService] ${new Date().toISOString()} ERROR: ${message}`, error);
  },
  warn: (message: string, data?: unknown) => {
    console.warn(`[UserService] ${new Date().toISOString()} WARN: ${message}`, data ? JSON.stringify(data) : '');
  }
};

// Validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateUserId = (id: string): boolean => {
  return typeof id === 'string' && id.length > 0;
};

const validateUserData = (userData: Partial<User>): string[] => {
  const errors: string[] = [];
  
  if (!userData.id || !validateUserId(userData.id)) {
    errors.push('Invalid user ID');
  }
  
  if (!userData.email || !validateEmail(userData.email)) {
    errors.push('Invalid email address');
  }
  
  if (!userData.firstName || typeof userData.firstName !== 'string' || userData.firstName.trim().length === 0) {
    errors.push('Invalid first name');
  }
  
  if (!userData.lastName || typeof userData.lastName !== 'string' || userData.lastName.trim().length === 0) {
    errors.push('Invalid last name');
  }
  
  return errors;
};

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  subscription: {
    isActive: boolean;
    plan: string;
    startDate: string | null;
    endDate: string | null;
    paymentMethod: string | null;
    amount: number;
    currency: string;
  };
  usage: {
    dailyAttempts: number;
    lastAttemptDate: string;
    totalAttempts: number;
  };
  status: string;
}

interface UserData {
  users: User[];
  metadata: {
    lastUpdated: string;
    totalUsers: number;
    activeSubscriptions: number;
    version: string;
  };
}

class UserService {
  private dataPath: string;

  constructor() {
    this.dataPath = join(process.cwd(), 'data', 'users.json');
  }

  private readUserData(): UserData {
    try {
      const fileContent = readFileSync(this.dataPath, 'utf8');
      return JSON.parse(fileContent);
    } catch {
      // If file doesn't exist or is corrupted, create new structure
      const newData: UserData = {
        users: [],
        metadata: {
          lastUpdated: new Date().toISOString(),
          totalUsers: 0,
          activeSubscriptions: 0,
          version: '1.0'
        }
      };
      this.writeUserData(newData);
      return newData;
    }
  }

  private writeUserData(data: UserData): void {
    // Update metadata before writing
    data.metadata.lastUpdated = new Date().toISOString();
    data.metadata.totalUsers = data.users.length;
    data.metadata.activeSubscriptions = data.users.filter(u => u.subscription.isActive).length;
    
    writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { userId } = await auth();
      
      if (!userId) {
        logger.warn('No authenticated user found');
        return null;
      }

      return this.getUserById(userId);
    } catch (error) {
      logger.error('Failed to get current user', error);
      return null;
    }
  }

  getUserById(clerkId: string): User | null {
    const data = this.readUserData();
    return data.users.find(user => user.id === clerkId) || null;
  }

  getUserByEmail(email: string): User | null {
    const data = this.readUserData();
    return data.users.find(user => user.email === email) || null;
  }

  async createUser(clerkId: string, email: string, firstName?: string, lastName?: string): Promise<User> {
    try {
      // Validate input data
      const userData = {
        id: clerkId,
        email: email,
        firstName: firstName || '',
        lastName: lastName || ''
      };
      
      const validationErrors = validateUserData(userData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      const data = this.readUserData();
      
      // Check if user already exists
      const existingUserById = data.users.find(user => user.id === clerkId);
      if (existingUserById) {
        logger.warn(`User with ID ${clerkId} already exists`);
        return existingUserById;
      }

      const existingUserByEmail = data.users.find(user => user.email.toLowerCase() === email.toLowerCase());
      if (existingUserByEmail) {
        logger.warn(`User with email ${email} already exists`);
        return existingUserByEmail;
      }

      const newUser: User = {
        id: clerkId.trim(),
        email: email.toLowerCase().trim(),
        firstName: (firstName || '').trim(),
        lastName: (lastName || '').trim(),
        createdAt: new Date().toISOString(),
        subscription: {
          isActive: false,
          plan: 'free',
          startDate: null,
          endDate: null,
          paymentMethod: null,
          amount: 0,
          currency: 'USD'
        },
        usage: {
          dailyAttempts: 0,
          lastAttemptDate: new Date().toISOString().split('T')[0],
          totalAttempts: 0
        },
        status: 'active'
      };

      data.users.push(newUser);
      this.writeUserData(data);
      
      logger.info(`Successfully created new user: ${email}`);
      return newUser;
    } catch (error) {
      logger.error(`Failed to create user: ${email}`, error);
      throw error;
    }
  }

  updateUser(userId: string, updates: Partial<User>): User | null {
    const data = this.readUserData();
    const userIndex = data.users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return null;
    }

    // Merge updates with existing user data
    data.users[userIndex] = { ...data.users[userIndex], ...updates };
    this.writeUserData(data);
    
    return data.users[userIndex];
  }

  canUserStartTest(userId: string): { canStart: boolean; remainingTests: number; subscriptionType: string } {
    const user = this.getUserById(userId);
    
    if (!user) {
      return { canStart: false, remainingTests: 0, subscriptionType: 'none' };
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Reset daily attempts if it's a new day
    if (user.usage.lastAttemptDate !== today) {
      user.usage.dailyAttempts = 0;
      user.usage.lastAttemptDate = today;
      this.updateUser(userId, { usage: user.usage });
    }

    // Premium users have unlimited tests
    if (user.subscription.isActive && user.subscription.plan === 'premium') {
      return { canStart: true, remainingTests: -1, subscriptionType: 'premium' };
    }

    // Free users have 3 tests per day
    const remainingTests = Math.max(0, 3 - user.usage.dailyAttempts);
    return { 
      canStart: remainingTests > 0, 
      remainingTests, 
      subscriptionType: 'free' 
    };
  }

  incrementUserAttempts(userId: string): boolean {
    const user = this.getUserById(userId);
    
    if (!user) {
      return false;
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Reset daily attempts if it's a new day
    if (user.usage.lastAttemptDate !== today) {
      user.usage.dailyAttempts = 0;
      user.usage.lastAttemptDate = today;
    }

    // Check if user can start test
    const { canStart } = this.canUserStartTest(userId);
    if (!canStart) {
      return false;
    }

    // Increment attempts
    user.usage.dailyAttempts += 1;
    user.usage.totalAttempts += 1;
    user.usage.lastAttemptDate = today;

    this.updateUser(userId, { usage: user.usage });
    return true;
  }

  activateSubscription(userId: string, paymentMethod: string = 'admin_activated'): boolean {
    const user = this.getUserById(userId);
    
    if (!user) {
      return false;
    }

    const currentDate = new Date().toISOString();
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now

    const updates: Partial<User> = {
      subscription: {
        ...user.subscription,
        isActive: true,
        plan: 'premium',
        startDate: currentDate,
        endDate: endDate,
        paymentMethod: paymentMethod,
        amount: 2,
        currency: 'USD'
      },
      status: 'active'
    };

    return this.updateUser(userId, updates) !== null;
  }

  deactivateSubscription(userId: string): boolean {
    const user = this.getUserById(userId);
    
    if (!user) {
      return false;
    }

    const currentDate = new Date().toISOString();

    const updates: Partial<User> = {
      subscription: {
        ...user.subscription,
        isActive: false,
        plan: 'free',
        endDate: currentDate,
        paymentMethod: null
      }
    };

    return this.updateUser(userId, updates) !== null;
  }

  getAllUsers(): User[] {
    const data = this.readUserData();
    return data.users;
  }

  getUserStats(): { totalUsers: number; activeSubscriptions: number; freeUsers: number } {
    const data = this.readUserData();
    return {
      totalUsers: data.users.length,
      activeSubscriptions: data.users.filter(u => u.subscription.isActive).length,
      freeUsers: data.users.filter(u => !u.subscription.isActive).length
    };
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;