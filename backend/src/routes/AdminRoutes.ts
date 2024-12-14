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
import {ClassSchema} from "../models/timetable/Class";
import ClassController from "../controllers/timetable/ClassController";
import ClassTypeController from "../controllers/timetable/ClassTypeController";
import {ClassTypeSchema} from "../models/timetable/ClassType";
import {ElectiveSubjectSchema} from "../models/courses/ElectiveSubject";
import ElectiveSubjectController from "../controllers/courses/ElectiveSubjectController";
import {FacultySchema} from "../models/faculty/Faculty";
import FacultyController from "../controllers/faculty/FacultyController";
import PeriodController from "../controllers/timetable/PeriodController";
import {PeriodSchema} from "../models/timetable/Period";
import {ClassTypeDefinition}  from "../models/timetable/ClassType";

export default class AdminRoutes {
    private prefix = '/admin';

    route = (app: Express): void => {
        app.get(this.prefix + '/get_entries_count', async (req: Request, res: Response) => {
            const counts = new Map<string, number>();
            let count = 0;

            const model_buildings: Model<HydratedDocumentFromSchema<typeof BuildingSchema>> = new BuildingController().base.model;
            const filter_buildings: FilterQuery<HydratedDocumentFromSchema<typeof BuildingSchema>> = {};
            count = await model_buildings.countDocuments(filter_buildings);
            counts.set('buildings', count);

            const model_classes: Model<HydratedDocumentFromSchema<typeof ClassSchema>> = new ClassController().base.model;
            const filter_classes: FilterQuery<HydratedDocumentFromSchema<typeof ClassSchema>> = {};
            count = await model_buildings.countDocuments(filter_classes);
            counts.set('classes', count);

            const model_classtypes: Model<HydratedDocumentFromSchema<typeof ClassTypeSchema>> = new ClassTypeController().base.model;
            const filter_classtypes: FilterQuery<HydratedDocumentFromSchema<typeof ClassTypeSchema>> = {};
            count = await model_classtypes.countDocuments(filter_classtypes);
            counts.set('classtypes', count);

            const model_course: Model<HydratedDocumentFromSchema<typeof CourseSchema>> = new CourseController().base.model;
            const filter_course: FilterQuery<HydratedDocumentFromSchema<typeof CourseSchema>> = {};
            count = await model_course.countDocuments(filter_course);
            counts.set('courses', count);

            const model_electivesubjects: Model<HydratedDocumentFromSchema<typeof ElectiveSubjectSchema>> = new ElectiveSubjectController().base.model;
            const filter_electivesubjects: FilterQuery<HydratedDocumentFromSchema<typeof ElectiveSubjectSchema>> = {};
            count = await model_electivesubjects.countDocuments(filter_electivesubjects);
            counts.set('electivesubjects', count);

            const model_faculties: Model<HydratedDocumentFromSchema<typeof FacultySchema>> = new FacultyController().base.model;
            const filter_faculties: FilterQuery<HydratedDocumentFromSchema<typeof FacultySchema>> = {};
            count = await model_faculties.countDocuments(filter_faculties);
            counts.set('faculties', count);

            const model_periods: Model<HydratedDocumentFromSchema<typeof PeriodSchema>> = new PeriodController().base.model;
            const filter_periods: FilterQuery<HydratedDocumentFromSchema<typeof PeriodSchema>> = {};
            count = await model_periods.countDocuments(filter_periods);
            counts.set('periods', count);

            const model_rooms: Model<HydratedDocumentFromSchema<typeof RoomSchema>> = new RoomController().base.model;
            const filter_rooms: FilterQuery<HydratedDocumentFromSchema<typeof RoomSchema>> = {};
            count = await model_rooms.countDocuments(filter_rooms);
            counts.set('rooms', count);

            const model_users: Model<HydratedDocumentFromSchema<typeof UserSchema>> = new UserController().base.model;
            const filter_users: FilterQuery<HydratedDocumentFromSchema<typeof UserSchema>> = {};
            count = await model_users.countDocuments(filter_users);
            counts.set('users', count);

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

            const courses = await model_courses.find().limit(10).populate("electiveSubjects")
            res.status(200).json(courses);
        });

        app.get(this.prefix + '/get_users', async (req: Request, res: Response) => {
            const model_users: Model<HydratedDocumentFromSchema<typeof UserSchema>> = new UserController().base.model;
            const filter_users: FilterQuery<HydratedDocumentFromSchema<typeof UserSchema>> = {};

            const users = await model_users.find().limit(10);
            console.log(users);
            res.status(200).json(users);
        });

        app.get(this.prefix + '/get_classes', async (req: Request, res: Response) => {
            const model_classes: Model<HydratedDocumentFromSchema<typeof ClassSchema>> = new ClassController().base.model;
            const filter_classes: FilterQuery<HydratedDocumentFromSchema<typeof ClassSchema>> = {};

            const classes = await model_classes.find().limit(10);
            res.status(200).json(classes);
        });

        app.get(this.prefix + '/get_classtypes', async (req: Request, res: Response) => {
            const model_classtypes: Model<HydratedDocumentFromSchema<typeof ClassTypeSchema>> = new ClassTypeController().base.model;
            const filter_classtypes: FilterQuery<HydratedDocumentFromSchema<typeof ClassTypeSchema>> = {};

            const classtypes = await model_classtypes.find().limit(10);
            res.status(200).json(classtypes);
        });

        app.get(this.prefix + '/get_electivesubjects', async (req: Request, res: Response) => {
            const model_electivesubjects: Model<HydratedDocumentFromSchema<typeof ElectiveSubjectSchema>> = new ElectiveSubjectController().base.model;
            const filter_electivesubjects: FilterQuery<HydratedDocumentFromSchema<typeof ElectiveSubjectSchema>> = {};

            const electivesubjects = await model_electivesubjects.find().limit(10);
            res.status(200).json(electivesubjects);
        });

        app.get(this.prefix + '/get_faculties', async (req: Request, res: Response) => {
            const model_faculties: Model<HydratedDocumentFromSchema<typeof FacultySchema>> = new FacultyController().base.model;
            const filter_faculties: FilterQuery<HydratedDocumentFromSchema<typeof FacultySchema>> = {};

            const faculties = await model_faculties.find().limit(10);
            res.status(200).json(faculties);
        });

        app.get(this.prefix + '/get_periods', async (req: Request, res: Response) => {
            const model_periods: Model<HydratedDocumentFromSchema<typeof PeriodSchema>> = new PeriodController().base.model;
            const filter_periods: FilterQuery<HydratedDocumentFromSchema<typeof PeriodSchema>> = {};

            const periods = await model_periods.find().limit(10);
            res.status(200).json(periods);
        });
    }
}