export interface IUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  targetScore?: number;
  currentLevel?: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  profilePicture?: string;
}

export class User implements IUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  targetScore?: number;
  currentLevel?: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  profilePicture?: string;

  constructor(data: Partial<IUser>) {
    this.id = data.id || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.dateOfBirth = data.dateOfBirth;
    this.targetScore = data.targetScore;
    this.currentLevel = data.currentLevel;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.isVerified = data.isVerified || false;
    this.profilePicture = data.profilePicture;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  updateProfile(updates: Partial<IUser>): void {
    Object.assign(this, updates);
    this.updatedAt = new Date();
  }

  setVerified(): void {
    this.isVerified = true;
    this.updatedAt = new Date();
  }

  toJSON(): IUser {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      dateOfBirth: this.dateOfBirth,
      targetScore: this.targetScore,
      currentLevel: this.currentLevel,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isVerified: this.isVerified,
      profilePicture: this.profilePicture
    };
  }
}