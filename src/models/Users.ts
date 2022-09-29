import pool from '../database';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { QueryResult } from 'pg';
import dotenv from 'dotenv';
import bcrypt, { genSalt } from 'bcrypt';
import { User, NewUser , authUser} from '../types/User';

const pepper: string = process.env.BCRYPT_PASSWORD as string;

dotenv.config();

export class userStore {
    async getUsers(): Promise<Response> {
        try {
            const response: QueryResult = await
                pool.query('SELECT * FROM users ORDER BY id ASC');
            return response.rows as any;
        } catch (e) {
            return 'Internal Server error' as any;
        }
    };
    async getUserById(id: number): Promise<Response> {
        const response: QueryResult = await pool.query('SELECT * FROM users WHERE id = $1', [Number(id)]);
        return response.rows as any;
    };

    async createUser(user: User): Promise<Response> {
        try {
            //Check emptyness of the incoming data
            if ((!user.name || !user.password || !user.email) || (user.name.length <= 3 || user.password.length <= 6 || user.email.length <= 6)) {
                return 'Please enter all the details' as any;
            }
            //Check if the user already exist or not
            const userExist: QueryResult = await pool.query(`SELECT EXISTS (SELECT 1 FROM users WHERE name = '${user.name.replace(/^\s+|\s+$/gm, '')}');`);
            if (userExist.rows[0].exists === true) {
                return 'this username already exists' as any;
            }
            //Check if the email already exist or not
            const emailExist: QueryResult = await pool.query(`SELECT EXISTS (SELECT 1 FROM users WHERE email = '${user.email.replace(/\s/g, "")}');`);
            if (emailExist.rows[0].exists === true) {
                return 'this email already exists' as any;
            }
            //Bcrybt password and token
            const saltRound = process.env.SALT_ROUNDS as string;
            const salt = await bcrypt.genSalt(Number(saltRound));
            const passwordHashed = bcrypt.hashSync(user.password + pepper, parseInt(salt));
            const response = await pool.query('INSERT INTO users (name, email, password , token) VALUES ($1, $2 ,$3)', [user.name.replace(/^\s+|\s+$/gm, ''), user.email.replace(/\s/g, ""), passwordHashed]);
            return 'sign up Successfully' as any;
        } catch (err: any) {
            return err + user;
        }
    };

    async authenticate(user : authUser): Promise<Response> {
        try {
            //Check emptyness of the incoming data
            if ((!user.name || !user.password) || (user.name.length <= 3 || user.password.length <= 6)) {
                return 'Please enter all the details' as any;
            }
            //Check if the user already exist or not
            const userExist: QueryResult = await pool.query(`SELECT EXISTS (SELECT 1 FROM users WHERE name = '${user.name}');`);
            if (userExist.rows[0].exists === false) {
                return 'Wrong username' as any;
            }
            // check if password is correct
            const response: QueryResult = await pool.query(`SELECT id, name, password FROM users WHERE name = '${user.name}';`);
            const logPass = response.rows[0].password;
            const isPasswordMatched = bcrypt.compareSync(String(user.password) + pepper, logPass)
            if (!isPasswordMatched) {
                return 'Wrong password' as any;
            }
            return response.rows[0];
        } catch (error) {
            return error as any;
        }
    };

    async updateUser(user: NewUser): Promise<Response> {
        try {

            //Check emptyness of the incoming data
            if ((!user.name || !user.password) || (user.name.length <= 3 || user.password.length <= 4) || (!user.newName || !user.newPassword) || (user.newName.length <= 3 || user.newPassword.length <= 4)) {
                return 'Please enter all the new details' as any;
            }
            //Check if the user already exist or not
            const oldExist: QueryResult = await pool.query(`SELECT EXISTS (SELECT 1 FROM users WHERE name = '${user.name}');`);
            if (oldExist.rows[0].exists === false) {
                return 'this username dont\'t exists' as any;
            }
            // check if old password is correct
            const checkPass: QueryResult = await pool.query(`SELECT id, password FROM users WHERE name = '${user.name}';`);
            const oldPass = checkPass.rows[0].password;
            const isPasswordMatched = bcrypt.compareSync(String(user.password) + pepper, oldPass);
            if (!isPasswordMatched) {
                return 'old password is wrong' as any;
            }
            // check if the new name exists
            const userExist: QueryResult = await pool.query(`SELECT EXISTS (SELECT 1 FROM users WHERE name = '${user.newName}');`);
            if (user.name !== user.newName && userExist.rows[0].exists === true) {
                return 'this username already exists' as any;
            }
            //Bcrybt password and token
            const saltRound = process.env.SALT_ROUNDS as string;
            const salt = await bcrypt.genSalt(Number(saltRound));
            const passwordHashed = bcrypt.hashSync(user.newPassword + pepper, parseInt(salt));
            const token = jwt.sign({ user: user.newPassword }, process.env.JWT_KEY as string);
            // update user info
            const response = await pool.query('UPDATE users SET name = $1, password = $3 , token = $4 WHERE name = $2', [
                user.newName,
                user.name,
                passwordHashed,
                token
            ]);
            return 'User Updated Successfully' as any;
        } catch (error) {
            return error as any;
        }
    };
    
    async deleteUser(user : User): Promise<Response>  {
    try {
        //Check emptyness of the incoming data
        if ((!user.name || !user.password) || (user.name.length <= 3 || user.password.length <= 4)) {
            return  'Please enter all the new details' as any;
        }
        //Check if the user already exist or not
        const oldExist: QueryResult = await pool.query(`SELECT EXISTS (SELECT 1 FROM users WHERE name = '${user.name}');`);
        if (oldExist.rows[0].exists === false) {
            return 'this username dont\'t exists' as any;
        }
        const checkPass: QueryResult = await pool.query(`SELECT id, password FROM users WHERE name = '${user.name}';`);
        const oldPass = checkPass.rows[0].password;
        const isPasswordMatched = bcrypt.compareSync(String(user.password) + pepper, oldPass);
        if (!isPasswordMatched) {
            return 'old password is wrong'  as any;
        }
        await pool.query('DELETE FROM users where name = $1', [
            user.name
        ]);
        // reset id seq to default
        await pool.query('alter sequence users_id_seq restart with 1;');
        await pool.query('update users set id = default');
        // delete user
        return `User ${user.name} deleted Successfully` as any;
    } catch (error) {
        return error as any;
    }
    // TRUNCATE users; 
    // SELECT setval('users_id_seq', 1, false);
};

}
