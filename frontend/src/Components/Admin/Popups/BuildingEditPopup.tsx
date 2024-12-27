import React, {useEffect, useState} from 'react';
import './popup.css';
import apiService from "../../../../services/apiService.tsx";

const BuildingEditPopup: React.FC<{ onClose: () => void, tableColumns : any, tableData, object_id : string, isCreate : boolean}> = ({ onClose, tableColumns, tableData, object_id,  isCreate}, ) => {
    const [data, setData] = useState({});
    const [availableRooms, setAvailableRooms] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [roomsForDeletion, setRoomsForDeletion] = useState([]);
    const [showSearchPopup, setShowSearchPopup] = useState(false);

    useEffect(() => {
        if(isCreate)
        {
            fetch_rooms();
            const obj = {};
            obj.rooms = [];
            setData(obj);
        }
        else {
            const obj = {};
            const selectedObject = tableData.filter((row) => row._id === object_id)[0];
            fetch_rooms();
            if (!selectedObject.rooms) selectedObject.rooms = [];
            selectedObject.rooms.forEach((room) => {
                selectedRooms.push(room);
            })
            setData(selectedObject);
        }
    }, []);

    async function fetch_rooms() {
        let rooms = await apiService.getRooms();
        // remove selected rooms from available rooms
        const selectedRoomsIds = selectedRooms.map((room) => room._id);
        rooms = rooms.filter((room) => !selectedRoomsIds.includes(room._id));
        setAvailableRooms(rooms);
    }

    const filteredRooms = availableRooms.filter((room) => {
        const num = room.number || room.numberSecondary;
        return num.toLowerCase().includes(searchTerm.toLowerCase());
    })

    const handleRoomAdd = (room: any) => {
        if (!selectedRooms.includes(room)) {
            setSelectedRooms([...selectedRooms, room]);
        }
        setAvailableRooms(availableRooms.filter((r) => r._id !== room._id));
    };

    const handleRoomRemove = (room: any, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const index = selectedRooms.indexOf(room);
        const index2 = roomsForDeletion.findIndex((r) => r._id === room._id);
        if (index2 > -1) {
            setRoomsForDeletion(roomsForDeletion.filter((r) => r._id !== room._id));
            return;
        }
        if (index > -1) {
            setRoomsForDeletion([...roomsForDeletion, room]);
            return;
        }
    };

    const submit = async () => {
        if(isCreate)
        {
            let rooms = selectedRooms;
            rooms = rooms.filter((room) => !roomsForDeletion.includes(room));
            setSelectedRooms(rooms);
            setRoomsForDeletion([]);
            const obj = data;

            rooms = rooms.map((room) => room._id);

            obj.rooms = rooms;

            apiService.addBuildingAdmin(obj);
            return;
        }
        let rooms = selectedRooms;
        rooms = rooms.filter((room) => !roomsForDeletion.includes(room));
        setSelectedRooms(rooms);
        setRoomsForDeletion([]);
        const obj = data;

        rooms = rooms.map((room) => room._id);

        obj.rooms = rooms;

        apiService.editBuildingAdmin(obj);

        console.log(obj)
    }

    return (
        <div className="background" onClick={onClose}>
            <div className="main_window" onClick={(e) => e.stopPropagation()}>
                <h2>Edytuj budynek</h2>
                <form>
                    {tableColumns.map((column, index) => (
                        <div key={index} className="form-group">
                            <label>{column}</label>
                            {column === 'rooms' ? (
                                <div>
                                    <input
                                        type="text"
                                        className="form-control rounded-bottom-0"
                                        placeholder="Search rooms"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={() => setShowSearchPopup(true)}
                                    />
                                    {showSearchPopup && (
                                        <div className="search_popup">
                                            {filteredRooms.map((room) => (
                                                <div
                                                    key={room._id}
                                                    className="search_popup_item"
                                                    onClick={() => {handleRoomAdd(room); setShowSearchPopup(false)}}
                                                >
                                                    {room.number || room.numberSecondary}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="list_container">
                                        {selectedRooms.map((room) => (
                                            roomsForDeletion.includes(room) ?
                                                (
                                                    <div className="list_element_for_deletion">
                                                        <text>
                                                            {room.number || room.numberSecondary}
                                                        </text>
                                                        <button className="list_element_button" onClick={(e) => handleRoomRemove(room, e)}>X</button>
                                                    </div>
                                                ) : (
                                                    <div className="list_element">
                                                        <text>
                                                            {room.number || room.numberSecondary}
                                                        </text>
                                                        <button  className="list_element_button" onClick={(e) => handleRoomRemove(room, e)}>X</button>
                                                    </div>
                                                )

                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data[column] || ''}
                                    onChange={(e) => setData({...data, [column]: e.target.value})}
                                    disabled={column === '_id'}
                                />
                            )}
                        </div>
                    ))}
                    <div className="p-2 d-flex justify-content-between">
                        <button type="button" className="btn btn-primary" onClick={() => submit()}>
                            Zapisz
                        </button>
                        <button type="button" className="btn btn-danger" onClick={onClose}>Zamknij</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BuildingEditPopup;