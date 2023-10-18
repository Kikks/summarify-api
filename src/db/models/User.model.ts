import mongoose, { Document, Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

import { OUser } from '../../api/resources/interfaces/user.intf';

const UserSchema = new Schema<OUser & Document>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose, {
  selectFields: 'firstName lastName email image role createdAt',
  usernameField: 'email',
});

const User = mongoose.model('User', UserSchema);

export default User;
