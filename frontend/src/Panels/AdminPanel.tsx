import "./admin_panel.css";
import {useEffect, useState} from "react";
import apiService from "../../services/apiService.tsx";
import BuildingEditPopup from "../Components/Admin/Popups/BuildingEditPopup.tsx";

const AdminPanel : React.FC = () => {
    const [entryCount, setEntryCount] = useState({});
    const [tableData, setTableData] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const [tableTitle, setTableTitle] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getEntriesCount();
            setEntryCount(data);
        };

        fetchData();
    }, []);

    function handleListButtonClick(e: React.MouseEventHandler<HTMLButtonElement>) {
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
            default:
                break;
        }
    }

    async function fetchBuildings() {
        const data = await apiService.getBuildingsAdmin();
        let table_columns = Object.keys(data[0]);
        let table_data = data.map((row) => {
            return Object.values(row);
        });

        table_data.forEach((row) => {
            try {
                row[4] = row[4].map((room) => room.number || room.numberSecondary).join(", ");
            } catch (err) {
                row[4] = "";
            }
        })

        setTableColumns(table_columns);
        setTableData(table_data);
    }

    async function fetchRooms() {
        const data = await apiService.getRoomsAdmin();
        let table_columns = Object.keys(data[0]);
        let table_data = data.map((row) => {
            return Object.values(row);
        });

        setTableColumns(table_columns);
        setTableData(table_data);
    }

    async function fetchCourses() {
        const data = await apiService.getCoursesAdmin();
        let table_columns = Object.keys(data[0]);
        console.log(data);
        let table_data = data.map((row) => {
            return Object.values(row);
        });

        setTableColumns(table_columns);
        setTableData(table_data);
    }

    function handleActionElementEditClick(e: React.MouseEventHandler<HTMLButtonElement>) {
        console.log(e.currentTarget.parentElement?.parentElement?.parentElement.id);
        setShowPopup(true);
    }

    return (
        <div className="container-fluid bg-dark-subtle main">
            {showPopup ? <BuildingEditPopup onClose={() => setShowPopup(false)}/> : null}
            <ul className="button_list">
                <button id="buildings" className="d-flex justify-content-between align-items-center button" onClick={handleListButtonClick}>
                    Budynki
                    <span className="badge bg-primary rounded-pill">{ entryCount["buildings"] }</span>
                </button>
                <button id="rooms" className="d-flex justify-content-between align-items-center button" onClick={handleListButtonClick}>
                    Sale
                    <span className="badge bg-primary rounded-pill">{ entryCount["rooms"] }</span>
                </button>
                <button id="courses" className="d-flex justify-content-between align-items-center button" onClick={handleListButtonClick}>
                    Kursy
                    <span className="badge bg-primary rounded-pill">{ entryCount["courses"] }</span>
                </button>
            </ul>
            <div id="table_container">
                <div>
                    <h1 className="table_title p-2 pb-0">{tableTitle}</h1>
                    <div className="p-2">
                        <button className="btn btn-primary mx-1">
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