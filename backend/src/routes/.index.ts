import AuthRoutes from './AuthRoutes';
import CourseRoutes from './courses/CourseRoutes';
import ElectiveSubjectRoutes from './courses/ElectiveSubjectRoutes';
import SemesterRoutes from './courses/SemesterRoutes';
import SubjectDetailsRoutes from './courses/SubjectDetailsRoutes';
import SubjectRoutes from './courses/SubjectRoutes';
import BuildingRoutes from './faculty/BuildingRoutes';
import FacultyRoutes from './faculty/FacultyRoutes';
import RoomRoutes from './faculty/RoomRoutes';
import ClassRoutes from './timetable/ClassRoutes';
import ClassTypeRoutes from './timetable/ClassTypeRoutes';
import PeriodRoutes from './timetable/PeriodRoutes';
import ScheduleRoutes from './timetable/ScheduleRoutes';
import TimetableRoutes from './timetable/TimetableRoutes';
import UserRoutes from './UserRoutes.js';
import AdminRoutes from "./AdminRoutes";

const routes = {
    AuthRoutes,
    UserRoutes,
    AdminRoutes,

    CourseRoutes,
    ElectiveSubjectRoutes,
    SemesterRoutes,
    SubjectDetailsRoutes,
    SubjectRoutes,

    BuildingRoutes,
    FacultyRoutes,
    RoomRoutes,

    ClassRoutes,
    ClassTypeRoutes,
    PeriodRoutes,
    ScheduleRoutes,
    TimetableRoutes,
};

export default routes;