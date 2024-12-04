import { Express, Request, Response } from 'express';
import { FilterQuery, HydratedDocumentFromSchema, Model } from 'mongoose';
import User, { UserSchema } from '../models/User';
import UserController from '../controllers/UserController';
import {CourseSchema} from "../models/courses/Course";
import CourseController from "../controllers/courses/CourseController";
import {RoomSchema} from "../models/faculty/Room";
import RoomController from "../controllers/faculty/RoomController";
import {BuildingSchema} from "../models/faculty/Building";
import BuildingController from "../controllers/faculty/BuildingController";

export default class AdminRoutes {
    private prefix = '/admin';

    route = (app: Express): void => {
        app.get(this.prefix + '/get_entries_count', async (req: Request, res: Response) => {
            const counts = new Map<string, number>();

            const model_users: Model<HydratedDocumentFromSchema<typeof UserSchema>> = new UserController().base.model;
            const filter_users: FilterQuery<HydratedDocumentFromSchema<typeof UserSchema>> = {};
            let count = await model_users.countDocuments(filter_users);
            counts.set('users', count);

            const model_course: Model<HydratedDocumentFromSchema<typeof CourseSchema>> = new CourseController().base.model;
            const filter_course: FilterQuery<HydratedDocumentFromSchema<typeof CourseSchema>> = {};
            count = await model_course.countDocuments(filter_course);
            counts.set('courses', count);

            const model_rooms: Model<HydratedDocumentFromSchema<typeof RoomSchema>> = new RoomController().base.model;
            const filter_rooms: FilterQuery<HydratedDocumentFromSchema<typeof RoomSchema>> = {};
            count = await model_rooms.countDocuments(filter_rooms);
            counts.set('rooms', count);

            const model_buildings: Model<HydratedDocumentFromSchema<typeof BuildingSchema>> = new BuildingController().base.model;
            const filter_buildings: FilterQuery<HydratedDocumentFromSchema<typeof BuildingSchema>> = {};
            count = await model_buildings.countDocuments(filter_buildings);
            counts.set('buildings', count);

            const obj = Object.fromEntries(counts);
            res.status(200).json(obj);
        });

        app.get(this.prefix + '/get_buildings', async (req: Request, res: Response) => {
            const model_buildings: Model<HydratedDocumentFromSchema<typeof BuildingSchema>> = new BuildingController().base.model;
            const filter_buildings: FilterQuery<HydratedDocumentFromSchema<typeof BuildingSchema>> = {};

            const buildings = await model_buildings.find().limit(10);
            res.status(200).json(buildings);
        });

        app.get(this.prefix + '/get_rooms', async (req: Request, res: Response) => {
            const model_rooms: Model<HydratedDocumentFromSchema<typeof RoomSchema>> = new RoomController().base.model;
            const filter_rooms: FilterQuery<HydratedDocumentFromSchema<typeof RoomSchema>> = {};

            const rooms = await model_rooms.find().limit(10);
            res.status(200).json(rooms);
        });

        app.get(this.prefix + '/get_courses', async (req: Request, res: Response) => {
            const model_courses: Model<HydratedDocumentFromSchema<typeof CourseSchema>> = new CourseController().base.model;
            const filter_courses: FilterQuery<HydratedDocumentFromSchema<typeof CourseSchema>> = {};

            const courses = await model_courses.find().limit(10);
            res.status(200).json(courses);
        });
    }
}