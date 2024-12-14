import "./admin_panel.css";
import {useEffect, useState} from "react";
import apiService from "../../services/apiService.tsx";
import BuildingEditPopup from "../Components/Admin/Popups/BuildingEditPopup.tsx";

const AdminPanel : React.FC = () => {
    const [entryCount, setEntryCount] = useState({});
    const [tableData, setTableData] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const [tablePopupData, setTablePopupData] = useState({});
    const [tableTitle, setTableTitle] = useState("Budynki");
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [selectedObjectId, setSelectedObjectId] = useState("");
    const [isCreate, setIsCreate] = useState(false);
    const [tableColumnsNoId, setTableColumnsNoId] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getEntriesCount();
            setEntryCount(data);
        };

        fetchBuildings();

        fetchData();
    }, []);

    function handleListButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
        switch (e.currentTarget.id) {
            case "buildings":
                fetchBuildings();
                setTableTitle("Budynki");
                break;
            case "rooms":
                fetchRooms();
                setTableTitle("Sale");
                break;
            case "courses":
                fetchCourses();
                setTableTitle("Kursy");
                break;
            case "users":
                fetchUsers();
                setTableTitle("Użytkownicy");
                break;
            case "classes":
                fetchClasses();
                setTableTitle("Zajęcia");
                break;
            case "classtypes":
                fetchClassTypes();
                setTableTitle("Typy Zajęć");
                break;
            case "electivesubjects":
                fetchElectiveSubjects();
                setTableTitle("Przedmioty Obieralne");
                break;
            case "faculties":
                fetchFaculties();
                setTableTitle("Wydziały");
                break;
            case "periods":
                fetchPeriods();
                setTableTitle("Okresy");
                break;
            default:
                break;
        }
    }

async function fetchBuildings() {
    const data = await apiService.getBuildingsAdmin();
    setTablePopupData(data);
    let table_columns = Object.keys(data[0]).filter(column => column);
    let table_data = data.map((row) => {
        return Object.values(row);
    });

    table_data.forEach((row) => {
        try {
            row[4] = row[4].map((room) => room.number || room.numberSecondary).join(", ");
        } catch (err) {
            row[4] = "";
        }
    });

    setTableColumns(table_columns);
    setTableData(table_data);

    let tableColumnsNoId = table_columns;
    tableColumnsNoId = tableColumnsNoId.filter((column) => column !== "_id");
    console.log(tableColumnsNoId);

    setTableColumnsNoId(tableColumnsNoId)
}

    async function fetchRooms() {
        const data = await apiService.getRoomsAdmin();
        setTablePopupData(data);
        let table_columns = Object.keys(data[0]);
        let table_data = data.map((row) => {
            return Object.values(row);
        });

        setTableColumns(table_columns);
        setTableData(table_data);
    }

    async function fetchCourses() {
        const data = await apiService.getCoursesAdmin();
        setTablePopupData(data);
        let table_columns = Object.keys(data[0]);
        let table_data = data.map((row) => {
            return Object.values(row);
        });

        table_data.forEach((row) => {
            try {
                row[7] = row[7].map((course) => course.academicYear).join(", ");
            } catch (err) {
                row[7] = "";
            }
        })

        table_data.forEach((row) => {
            try {
                console.log(row)
                row[8] = row[8].map((course) => course.name).join(", ");
            } catch (err) {
                row[8] = "";
            }
        })

        setTableColumns(table_columns);
        setTableData(table_data);
    }

    async function fetchUsers() {
        const data = await apiService.getUsersAdmin();
        setTablePopupData(data);
        let table_columns = Object.keys(data[0]);
        let table_data = data.map((row) => {
            return Object.values(row);
        });

        setTableColumns(table_columns);
        setTableData(table_data);
    }

    async function fetchClasses() {
        const data = await apiService.getClassesAdmin();
        setTablePopupData(data);
        let table_columns = Object.keys(data[0]);
        let table_data = data.map((row) => {
            return Object.values(row);
        });

        setTableColumns(table_columns);
        setTableData(table_data);
    }

    async function fetchClassTypes() {
        const data = await apiService.getClassTypesAdmin();
        setTablePopupData(data);
        let table_columns = Object.keys(data[0]);
        let table_data = data.map((row) => {
            return Object.values(row);
        });

        setTableColumns(table_columns);
        setTableData(table_data);
    }

    async function fetchElectiveSubjects() {
        const data = await apiService.getElectiveSubjectsAdmin();
        setTablePopupData(data);
        let table_columns = Object.keys(data[0]);
        let table_data = data.map((row) => {
            return Object.values(row);
        });

        setTableColumns(table_columns);
        setTableData(table_data);
    }

    async function fetchFaculties() {
        const data = await apiService.getFacultiesAdmin();
        setTablePopupData(data);
        let table_columns = Object.keys(data[0]);
        let table_data = data.map((row) => {
            return Object.values(row);
        });

        setTableColumns(table_columns);
        setTableData(table_data);
    }

    async function fetchPeriods() {
        const data = await apiService.getPeriodsAdmin();
        setTablePopupData(data);
        let table_columns = Object.keys(data[0]);
        let table_data = data.map((row) => {
            return Object.values(row);
        });

        setTableColumns(table_columns);
        setTableData(table_data);
    }
    function handleActionElementEditClick(e: React.MouseEventHandler<HTMLButtonElement>) {
        console.log(e.currentTarget.parentElement?.parentElement?.parentElement.id);
        setSelectedObjectId(e.currentTarget.parentElement?.parentElement?.parentElement.id);
        setIsCreate(false);
        setShowEditPopup(true);
    }

    function handleActionAddElementClick() {
        setIsCreate(true);
        setShowEditPopup(true);
    }

    return (
        <div className="container-fluid bg-dark-subtle main">
            {(() => {
    switch (tableTitle) {
        case "Budynki":
            if(isCreate) return showEditPopup ? <BuildingEditPopup onClose={() => setShowEditPopup(false)} tableData={tablePopupData} tableColumns={tableColumnsNoId} object_id={selectedObjectId} isCreate={isCreate}/> : null;
            return showEditPopup ? <BuildingEditPopup onClose={() => setShowEditPopup(false)} tableData={tablePopupData} tableColumns={tableColumns} object_id={selectedObjectId} isCreate={isCreate}/> : null;
        // Add other cases for different popups here
            case "Sale":
            return null;
        case "Kursy":
            return null;
        default:
            return null;
    }
})()}
            <ul className="button_list">
                <button id="buildings" className="d-flex justify-content-between align-items-center button" onClick={handleListButtonClick}>
                    Budynki
                    <span className="badge bg-primary rounded-pill">{entryCount["buildings"]}</span>
                </button>
                <button id="classes" className="d-flex justify-content-between align-items-center button" onClick={handleListButtonClick}>
                    Zajęcia
                    <span className="badge bg-primary rounded-pill">{entryCount["classes"]}</span>
                </button>
                <button id="classtypes" className="d-flex justify-content-between align-items-center button" onClick={handleListButtonClick}>
                    Typy Zajęć
                    <span className="badge bg-primary rounded-pill">{entryCount["classtypes"]}</span>
                </button>
                <button id="courses" className="d-flex justify-content-between align-items-center button" onClick={handleListButtonClick}>
                    Kursy
                    <span className="badge bg-primary rounded-pill">{entryCount["courses"]}</span>
                </button>
                <button id="electivesubjects" className="d-flex justify-content-between align-items-center button" onClick={handleListButtonClick}>
                    Przedmioty Obieralne
                    <span className="badge bg-primary rounded-pill">{entryCount["electivesubjects"]}</span>
                </button>
                <button id="faculties" className="d-flex justify-content-between align-items-center button" onClick={handleListButtonClick}>
                    Wydziały
                    <span className="badge bg-primary rounded-pill">{entryCount["faculties"]}</span>
                </button>
                <button id="periods" className="d-flex justify-content-between align-items-center button" onClick={handleListButtonClick}>
                    Okresy
                    <span className="badge bg-primary rounded-pill">{entryCount["periods"]}</span>
                </button>
                <button id="rooms" className="d-flex justify-content-between align-items-center button" onClick={handleListButtonClick}>
                    Sale
                    <span className="badge bg-primary rounded-pill">{entryCount["rooms"]}</span>
                </button>
                <button id="users" className="d-flex justify-content-between align-items-center button" onClick={handleListButtonClick}>
                    Użytkownicy
                    <span className="badge bg-primary rounded-pill">{entryCount["users"]}</span>
                </button>
            </ul>
            <div id="table_container">
                <div>
                    <h1 className="table_title p-2 pb-0">{tableTitle}</h1>
                    <div className="p-2">
                        <button className="btn btn-primary mx-1" onClick={() => handleActionAddElementClick()}>
                            Dodaj
                        </button>
                        <button className="btn btn-danger mx-1">
                            Usuń wybrane
                        </button>
                        <button className="btn btn-primary mx-1">
                            Filtry
                        </button>
                    </div>
                </div>
                <div id="table_wrapper">
                    <table className="table table-striped table-dark">
                        <thead>
                        <tr>
                            {tableColumns.map((column) => {
                                return <th key={column}>{column}</th>
                            })}
                            <th className="fixed_width">Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableData.map((row, index) => {
                            return <tr key={index} id={row.toString().split(',')[0]}>
                                {row.map((cell, index) => {
                                    return <td key={index}>{cell}</td>
                                })}
                                <td className="fixed_width">
                                    <div className="table_actions_container">
                                        <button className="btn btn-primary" onClick={handleActionElementEditClick}>Edytuj</button>
                                        <button className="btn btn-danger">Usuń</button>
                                    </div>
                                </td>
                            </tr>
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;