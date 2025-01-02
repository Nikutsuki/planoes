import React, { useEffect, useState, useRef } from 'react';
import './popup.css';
import apiService from '../../../../services/apiService.tsx';

const CourseEditPopup: React.FC<{ onClose: () => void, tableColumns: any, tableData: any, object_id: string, isCreate: boolean }> = ({ onClose, tableColumns, tableData, object_id, isCreate }) => {
    const [data, setData] = useState({});
    const [availableSemesters, setAvailableSemesters] = useState([]);
    const [availableElectiveSubjects, setAvailableElectiveSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSemesters, setSelectedSemesters] = useState([]);
    const [selectedElectiveSubjects, setSelectedElectiveSubjects] = useState([]);
    const [semestersForDeletion, setSemestersForDeletion] = useState([]);
    const [electiveSubjectsForDeletion, setElectiveSubjectsForDeletion] = useState([]);
    const [showSearchSemestersPopup, setShowSearchSemestersPopup] = useState(false);
    const [showSearchElectiveSubjectsPopup, setShowSearchElectiveSubjectsPopup] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const searchSemestersRef = useRef<HTMLInputElement>(null);
    const searchElectiveSubjectsRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isCreate) {
            fetch_semesters();
            fetch_elective_subjects();
            const obj = { semesters: [], electiveSubjects: [] };
            console.log(obj);
            setData(obj);
        } else {
            const selectedObject = tableData.filter((row) => row._id === object_id)[0];
            fetch_semesters();
            fetch_elective_subjects();
            if (!selectedObject.semesters) selectedObject.semesters = [];
            if (!selectedObject.electiveSubjects) selectedObject.electiveSubjects = [];
            selectedObject.semesters.forEach((semester) => {
                selectedSemesters.push(semester);
            });
            selectedObject.electiveSubjects.forEach((electiveSubject) => {
                selectedElectiveSubjects.push(electiveSubject);
            });
            setData(selectedObject);
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setShowSearchSemestersPopup(false);
                setShowSearchElectiveSubjectsPopup(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (showSearchSemestersPopup && searchSemestersRef.current) {
            const rect = searchSemestersRef.current.getBoundingClientRect();
            const popup = document.querySelector('.search_popup.semesters') as HTMLDivElement;
            if (popup) {
                popup.style.top = `${rect.bottom}px`;
                popup.style.left = `${rect.left}px`;
                popup.style.width = `${rect.width}px`;
            }
        }
        if (showSearchElectiveSubjectsPopup && searchElectiveSubjectsRef.current) {
            const rect = searchElectiveSubjectsRef.current.getBoundingClientRect();
            const popup = document.querySelector('.search_popup.electiveSubjects') as HTMLDivElement;
            if (popup) {
                popup.style.top = `${rect.bottom}px`;
                popup.style.left = `${rect.left}px`;
                popup.style.width = `${rect.width}px`;
            }
        }
    }, [showSearchSemestersPopup, showSearchElectiveSubjectsPopup]);

    async function fetch_semesters() {
        let semesters = await apiService.getSemesters();
        const selectedSemestersIds = selectedSemesters.map((semester) => semester._id);
        semesters = semesters.filter((semester) => !selectedSemestersIds.includes(semester._id));
        setAvailableSemesters(semesters);
    }

    async function fetch_elective_subjects() {
        let electiveSubjects = await apiService.getElectiveSubjects();
        const selectedElectiveSubjectsIds = selectedElectiveSubjects.map((electiveSubject) => electiveSubject._id);
        electiveSubjects = electiveSubjects.filter((electiveSubject) => !selectedElectiveSubjectsIds.includes(electiveSubject._id));
        setAvailableElectiveSubjects(electiveSubjects);
    }

    const filteredSemesters = availableSemesters.filter((semester) => {
        return semester.index.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    const filteredElectiveSubjects = availableElectiveSubjects.filter((electiveSubject) => {
        return electiveSubject.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleSemesterAdd = (semester: any) => {
        if (!selectedSemesters.includes(semester)) {
            setSelectedSemesters([...selectedSemesters, semester]);
        }
        setAvailableSemesters(availableSemesters.filter((r) => r._id !== semester._id));
    };

    const handleElectiveSubjectAdd = (electiveSubject: any) => {
        if (!selectedElectiveSubjects.includes(electiveSubject)) {
            setSelectedElectiveSubjects([...selectedElectiveSubjects, electiveSubject]);
        }
        setAvailableElectiveSubjects(availableElectiveSubjects.filter((r) => r._id !== electiveSubject._id));
    };

    const handleSemesterRemove = (semester: any, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const index = selectedSemesters.indexOf(semester);
        const index2 = semestersForDeletion.findIndex((r) => r._id === semester._id);
        if (index2 > -1) {
            setSemestersForDeletion(semestersForDeletion.filter((r) => r._id !== semester._id));
            return;
        }
        if (index > -1) {
            setSemestersForDeletion([...semestersForDeletion, semester]);
            return;
        }
    };

    const handleElectiveSubjectRemove = (electiveSubject: any, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const index = selectedElectiveSubjects.indexOf(electiveSubject);
        const index2 = electiveSubjectsForDeletion.findIndex((r) => r._id === electiveSubject._id);
        if (index2 > -1) {
            setElectiveSubjectsForDeletion(electiveSubjectsForDeletion.filter((r) => r._id !== electiveSubject._id));
            return;
        }
        if (index > -1) {
            setElectiveSubjectsForDeletion([...electiveSubjectsForDeletion, electiveSubject]);
            return;
        }
    };

    const submit = async () => {
        if (isCreate) {
            let semesters = selectedSemesters;
            semesters = semesters.filter((semester) => !semestersForDeletion.includes(semester));
            setSelectedSemesters(semesters);
            setSemestersForDeletion([]);
            let electiveSubjects = selectedElectiveSubjects;
            electiveSubjects = electiveSubjects.filter((electiveSubject) => !electiveSubjectsForDeletion.includes(electiveSubject));
            setSelectedElectiveSubjects(electiveSubjects);
            setElectiveSubjectsForDeletion([]);
            const obj = data;

            obj.semesters = semesters.map((semester) => semester._id);
            obj.electiveSubjects = electiveSubjects.map((electiveSubject) => electiveSubject._id);

            await apiService.addCourseAdmin(obj);
            return;
        }
        let semesters = selectedSemesters;
        semesters = semesters.filter((semester) => !semestersForDeletion.includes(semester));
        setSelectedSemesters(semesters);
        setSemestersForDeletion([]);
        let electiveSubjects = selectedElectiveSubjects;
        electiveSubjects = electiveSubjects.filter((electiveSubject) => !electiveSubjectsForDeletion.includes(electiveSubject));
        setSelectedElectiveSubjects(electiveSubjects);
        setElectiveSubjectsForDeletion([]);
        const obj = data;

        obj.semesters = semesters.map((semester) => semester._id);
        obj.electiveSubjects = electiveSubjects.map((electiveSubject) => electiveSubject._id);

        await apiService.editCourseAdmin(obj);

        console.log(obj);
    };

    return (
        <div className="background" onClick={onClose}>
            <div className="main_window" onClick={(e) => e.stopPropagation()}>
                <h2>Edytuj kurs</h2>
                <form>
                    {tableColumns.map((column, index) => (
                        <div key={index} className="form-group" ref={popupRef}>
                            <label>{column}</label>
                            {column === 'semesters' ? (
                                <div>
                                    <input
                                        type="text"
                                        className="form-control rounded-bottom-0"
                                        placeholder="Search semesters"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={() => setShowSearchSemestersPopup(true)}
                                        ref={searchSemestersRef}
                                    />
                                    {showSearchSemestersPopup && (
                                        <div className="search_popup semesters">
                                            {filteredSemesters.map((semester) => (
                                                <div
                                                    key={semester._id}
                                                    className="search_popup_item"
                                                    onClick={() => { handleSemesterAdd(semester); setShowSearchSemestersPopup(false); }}
                                                >
                                                    {semester.index}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="list_container">
                                        {selectedSemesters.map((semester) => (
                                            semestersForDeletion.includes(semester) ? (
                                                <div className="list_element_for_deletion">
                                                    <text>{semester.index}</text>
                                                    <button className="list_element_button" onClick={(e) => handleSemesterRemove(semester, e)}>X</button>
                                                </div>
                                            ) : (
                                                <div className="list_element">
                                                    <text>{semester.index}</text>
                                                    <button className="list_element_button" onClick={(e) => handleSemesterRemove(semester, e)}>X</button>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            ) : column === 'electiveSubjects' ? (
                                <div>
                                    <input
                                        type="text"
                                        className="form-control rounded-bottom-0"
                                        placeholder="Search elective subjects"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={() => setShowSearchElectiveSubjectsPopup(true)}
                                        ref={searchElectiveSubjectsRef}
                                    />
                                    {showSearchElectiveSubjectsPopup && (
                                        <div className="search_popup electiveSubjects">
                                            {filteredElectiveSubjects.map((electiveSubject) => (
                                                <div
                                                    key={electiveSubject._id}
                                                    className="search_popup_item"
                                                    onClick={() => { handleElectiveSubjectAdd(electiveSubject); setShowSearchElectiveSubjectsPopup(false); }}
                                                >
                                                    {electiveSubject.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="list_container">
                                        {selectedElectiveSubjects.map((electiveSubject) => (
                                            electiveSubjectsForDeletion.includes(electiveSubject) ? (
                                                <div className="list_element_for_deletion">
                                                    <text>{electiveSubject.name}</text>
                                                    <button className="list_element_button" onClick={(e) => handleElectiveSubjectRemove(electiveSubject, e)}>X</button>
                                                </div>
                                            ) : (
                                                <div className="list_element">
                                                    <text>{electiveSubject.name}</text>
                                                    <button className="list_element_button" onClick={(e) => handleElectiveSubjectRemove(electiveSubject, e)}>X</button>
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
                                    onChange={(e) => setData({ ...data, [column]: e.target.value })}
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
};

export default CourseEditPopup;