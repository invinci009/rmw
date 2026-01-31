import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// User interface
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email?: string;
    phone: string;
    password?: string;
    role: 'admin' | 'customer';
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        password: {
            type: String,
            select: false, // Don't include password by default
        },
        role: {
            type: String,
            enum: ['admin', 'customer'],
            default: 'customer',
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
userSchema.index({ phone: 1 });
userSchema.index({ email: 1 }, { sparse: true });

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

// Prevent model recompilation in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
