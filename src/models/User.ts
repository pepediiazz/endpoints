import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { CustomError } from '../types/Error';

interface User extends mongoose.Document {
  name: string;
  email: string;
  createdAt: Date;
  password: string;
  token: string;
}

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    password: { type: String, required: true },
    token: { type: String },
  },
  { collection: 'User' },
);

userSchema.pre<User>('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

userSchema.methods.isValidPassword = async function (
  password: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error('Error validating password.');
  }
};

const User = model<User>('User', userSchema);

export default User;
