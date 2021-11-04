import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface to define the properties that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface to define the properties of a User Document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// An interface to define the properties of a User Model
interface UserModel extends mongoose.Model<UserDoc> {
  build(userAttrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
      versionKey: false,
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashedPassword = await Password.toHash(this.get('password'));
    this.set('password', hashedPassword);
  }
  done();
});

userSchema.statics.build = (userAttrs: UserAttrs) => {
  return new User(userAttrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
