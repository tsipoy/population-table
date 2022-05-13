import React, { useState } from "react";
import 'antd/dist/antd.css';
import './index.css';
import { Table, Button, Input, Form, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { selectPopulationTableData, euCountries, euCandidateCountries, selectEUTotalPopulation, deleteRecord, editRecord } from "./redux/populationSlice"
import { useSelector, useDispatch } from 'react-redux';

export default function PopulationTable() {
    const dispatch = useDispatch();
    const populationTableData = useSelector(selectPopulationTableData);
    const totalPopulation = useSelector(selectEUTotalPopulation)
    const [showOnlyCountry, setShowOnlyContry] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [recordToEdit, setRecordToEdit] = useState({ countryName: "", capitalName: "", countryPopulation: 0, capitalPopulation: 0 })

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = (id) => {
        const editPopulation = populationTableData.find((record) => id === record.countryName)
        setRecordToEdit({
            countryName: editPopulation.countryName,
            capitalName: editPopulation.capitalName,
            countryPopulation: editPopulation.countryPopulation,
            capitalPopulation: editPopulation.capitalPopulation,

        })
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        dispatch(editRecord(recordToEdit))
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const getColumns = (showOnlyContryInformation) => {

        const commonColumns = [
            {
                title: 'Capital population percentage',
                dataIndex: 'capitalToCountryPopulationPercentange',
                render: (text) => `${text}%`,
                sorter: (a, b) => a.capitalToCountryPopulationPercentange - b.capitalToCountryPopulationPercentange,
            },
            {
                title: "Actions",
                dataIndex: 'countryName',
                render: (id) => <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly"
                }}>
                    <Button type="primary" onClick={() => handleDelete(id)} icon={<DeleteOutlined />} />
                    <Button type="primary" icon={<EditOutlined />} onClick={() => showModal(id)} />
                </div>
            }
        ]

        const countryColums = [
            {
                title: 'Country name',
                dataIndex: 'countryName',
                sorter: (a, b) => a.countryName.localeCompare(b.countryName),

            },
            {
                title: "Country population",
                dataIndex: 'countryPopulation',
                sorter: (a, b) => a.countryPopulation - b.countryPopulation,
            },
        ]

        const capitalColums = [
            {
                title: 'Capital name',
                dataIndex: 'capitalName',
                sorter: (a, b) => a.capitalName.localeCompare(b.capitalName),

            },
            {
                title: 'Capital population',
                dataIndex: 'capitalPopulation',
                sorter: (a, b) => a.capitalPopulation - b.capitalPopulation,

            },
        ];

        if (showOnlyContryInformation) {
            return [...countryColums, ...commonColumns]
        } else {
            return [...countryColums, ...capitalColums, ...commonColumns]
        }
    }

    const columsFilter = getColumns(showOnlyCountry)

    function handleVisibilityChange() {
        setShowOnlyContry(!showOnlyCountry)
    }

    const filteredData = populationTableData.filter((countryData) => {

        const countryName = countryData.countryName.toLowerCase()
        const countryNameIncludes = countryName.toLowerCase().includes(inputValue.toLowerCase())
        return !showOnlyCountry ? countryNameIncludes || countryData.capitalName.toLowerCase()
            .includes(inputValue.toLowerCase()) : countryNameIncludes
    })

    const handleDelete = (id) => {
        dispatch(deleteRecord(id))
    }

    return (
        <div>
            <div>
                <p><b>Total population of EU combined:</b> {totalPopulation}</p>
                <p><b>EU canditates:</b> {euCandidateCountries.join(", ")}</p>
                <p><b>EU countries:</b> {euCountries.join(", ")}</p>
            </div>
            <div style={{ marginBlockEnd: 13 }}>
                <Button onClick={handleVisibilityChange}>
                    {showOnlyCountry ? "Show country and capital data" : "Show only capital data"}
                </Button>
            </div>
            <Form layout="vertical" autoComplete="off">
                <Form.Item name="name" label="Query by county or capital name:">
                    <Input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                </Form.Item>
            </Form>
            <Table columns={columsFilter} dataSource={filteredData} />
            <Modal title="Edit record" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <label>{`${recordToEdit.countryName} population`}
                    <Input value={recordToEdit.countryPopulation} onChange={(e) => setRecordToEdit({ ...recordToEdit, countryPopulation: e.target.value })} />
                </label>

                <label>{`${recordToEdit.capitalName} population`}
                    <Input value={`${recordToEdit.capitalPopulation}`} onChange={(e) => setRecordToEdit({ ...recordToEdit, capitalPopulation: e.target.value })} />
                </label>
            </Modal>
        </div>
    )
}