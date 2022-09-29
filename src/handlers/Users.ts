import express, { Request, Response } from "express";
import { userStore } from '../models/Users';
import jwt, { JwtPayload } from 'jsonwebtoken';



const usersRoutes = (app: express.Application) => {
    app.get('/users/', getUsers);
    app.get('/users/:id', getUserById);
    app.post('/login/', authenticate);
    app.post('/signup/', createUser);
    app.post('/verify/', verifyAuthToken);
    app.put('/updateuser/', verifyAuthToken, updateUser);
    app.delete('/deleteuser/', verifyAuthToken, deleteUser);
}

const UserStore = new userStore();

const getUsers = async (req: Request, res: Response) => {
    try {
        const results = await UserStore.getUsers();
        res.json(results);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const getUserById = async (req: Request, res: Response) => {
    try {
        const results = await UserStore.getUserById(Number(req.params.id));
        res.json(results);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const createUser = async (req: Request, res: Response) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    try {
        const results = await UserStore.createUser(user);
        const token = jwt.sign({ user: results }, process.env.JWT_KEY as string);
        res.json(results);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const authenticate = async (req: Request, res: Response) => {
    const user = {
        name: req.body.name,
        password: req.body.password
    };
    try {
        const results = await UserStore.authenticate(user);
        const token = jwt.sign({ user: results }, process.env.JWT_KEY as string);
        res.status(200);
        res.send(token);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const verifyAuthToken = async (
    req: Request,
    res: Response
) => {
    const password = req.body.password;
    try {
        const authorizationHeader: string = req.headers.authorization as string;
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY as string) as JwtPayload;
        if (decoded.password !== password) {
            res.status(400);
            res.send('wrong token');
        }
        return "token match" as any
    } catch (err) {
        return err as any
    }
};

const updateUser = async (req: Request, res: Response) => {
    const user = {
        name: req.body.name,
        password: req.body.password,
        newName: req.body.newName,
        newPassword: req.body.newPassword
    };
    try {
        const results = await UserStore.updateUser(user);
        res.json(results);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const deleteUser = async (req: Request, res: Response) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    };
    try {
        const results = await UserStore.deleteUser(user);
        res.json(results);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

export default usersRoutes;

