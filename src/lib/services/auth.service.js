import dbConnect from '../mongodb';
import { Admin } from '../models/admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  static async seedAdmin() {
    await dbConnect();
    const username = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
    const password = process.env.DEFAULT_ADMIN_PASSWORD || 'adminakhirpekan';
    const name = process.env.DEFAULT_ADMIN_NAME || 'Admin Teater';

    try {
      const existingAdmin = await Admin.findOne({ username });
      const passwordHash = await bcrypt.hash(password, 10);

      if (!existingAdmin) {
        const firstAdmin = await Admin.findOne();
        if (firstAdmin) {
          firstAdmin.username = username;
          firstAdmin.passwordHash = passwordHash;
          firstAdmin.name = name;
          await firstAdmin.save();
          console.log('Updated admin credentials in DB to match .env');
        } else {
          await Admin.create({
            username,
            passwordHash,
            name,
          });
          console.log('Seeded initial admin account');
        }
      } else {
        existingAdmin.passwordHash = passwordHash;
        existingAdmin.name = name;
        await existingAdmin.save();
        console.log(`Synced credentials for admin '${username}' to match .env`);
      }
    } catch (error) {
      console.error('Failed to seed admin:', error);
    }
  }

  static async login(payload) {
    try {
      await dbConnect();
      const { username, password } = payload;
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return { success: false, error: 'Invalid credentials' };
      }

      const isMatch = await bcrypt.compare(password, admin.passwordHash);
      if (!isMatch) {
        return { success: false, error: 'Invalid credentials' };
      }

      const jwtSecret = process.env.JWT_SECRET || 'super_secret_key_for_teater_akhir_pekan_2026';
      const token = jwt.sign(
        { id: admin._id, username: admin.username, name: admin.name },
        jwtSecret,
        { expiresIn: '1d' }
      );

      return {
        success: true,
        token,
        admin: {
          id: admin._id.toString(),
          username: admin.username,
          name: admin.name,
        },
      };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  }

  static async verifyToken(token) {
    try {
      await dbConnect();
      const jwtSecret = process.env.JWT_SECRET || 'super_secret_key_for_teater_akhir_pekan_2026';
      const decoded = jwt.verify(token, jwtSecret);
      const admin = await Admin.findById(decoded.id).select('-passwordHash').lean().exec();
      if (!admin) {
        return { success: false, error: 'Admin not found' };
      }
      return {
        success: true,
        admin: {
          id: admin._id.toString(),
          username: admin.username,
          name: admin.name,
        },
      };
    } catch (error) {
      return { success: false, error: 'Token is invalid or expired' };
    }
  }
}
