import React, { useEffect, useRef, useState } from 'react'
import { Box, Stepper, Step, StepLabel, IconButton, Button } from '@mui/material'
import {
    ArrowBack,
    ArrowForward,
    CheckCircleOutline,
    Cancel,
    Check,
    Close,
    ArrowBackIosNewOutlined,
    ClearOutlined,
} from '@mui/icons-material'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { useTheme } from '@mui/styles'
import useStyles from './Style'

import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'uuid'
import Lottie from 'lottie-react'

import CustomDataGrid from '../../Components/CustomDataGrid/CustomDataGrid'
import CustomReportForm from '../../Components/CustomReport/CustomReportForm'
import REPORTCOLS from '../../Assets/Json/ReportCols.json'
import REPORTCOLS2 from '../../Assets/Json/ReportCols2.json'

import { createReport, resetReport } from '../../Redux/Slices/ReportForm'
import ReportDialog from '../../Components/ReportDialog/ReportDialog'
import { fetchReportByReportID } from '../../Redux/Slices/Dialog'
import { openAlert } from '../../Redux/Slices/Alert'
import { fetchSchedule, removeSchedule } from '../../Redux/Slices/Schedule'
import success from '../../Assets/Animation/success.json'
import { changeScheduleStatus } from './../../Redux/Slices/Schedule'

import PROCEDURECODE from '../../Assets/Json/ProcedureCode.json'

const CreateReport = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const [selection, setSelection] = useState([])
    const [selectTrigger, setSelectTrigger] = useState(false)
    const [patient, setPatient] = useState({})
    const [scheduleID, setScheduleID] = useState('')
    const [reportDialogMode, setReportDialogMode] = useState('create')

    const { schedules, count } = useSelector((state) => state.schedule)
    const { user } = useSelector((state) => state.auth)
    const report = useSelector((state) => state.reportForm.create)

    const dispatch = useDispatch()
    const classes = useStyles()
    const theme = useTheme()
    const scheduleIDRef = useRef(scheduleID)

    useEffect(() => {
        if (selection.length > 0) {
            const { _id, patient, reportID, reports, procedureCode } = schedules.find((s) => s._id === selection[0])
            setPatient({ ...patient, reportID, reports, procedureCode })
            setScheduleID(_id)
            if (!selectTrigger) {
                setCurrentStep(1)
                dispatch(changeScheduleStatus({ scheduleID: _id, status: 'on-call' }))
            }
            setSelectTrigger(false)
        }
    }, [selection])

    useEffect(() => {
        if (currentStep === 0) {
            setReportDialogMode('create')
            if (scheduleID) dispatch(changeScheduleStatus({ scheduleID, status: 'wait-examination' }))
            dispatch(fetchSchedule())
            dispatch(resetReport({ mode: 'create' }))
        }
        if (currentStep === 2) {
            setReportDialogMode('edit')
            handleReportSubmit()
            if (scheduleID) {
                dispatch(changeScheduleStatus({ scheduleID, status: 'finish' }))
                setScheduleID('')
            }
        }
    }, [currentStep])

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault()
            dispatch(resetReport({ mode: 'create' }))
            if (scheduleIDRef.current)
                dispatch(changeScheduleStatus({ scheduleID: scheduleIDRef.current, status: 'wait-examination' }))
            return ''
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
            dispatch(resetReport({ mode: 'create' }))
            if (scheduleIDRef.current)
                dispatch(changeScheduleStatus({ scheduleID: scheduleIDRef.current, status: 'wait-examination' }))
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [])

    useEffect(() => {
        scheduleIDRef.current = scheduleID
    }, [scheduleID])

    const handleReportSubmit = () => {
        dispatch(
            createReport({
                patientID: patient.id,
                reportID: patient.reportID,
                scheduleID,
                data: { report: { report, id: v4() }, userID: user._id },
            })
        )
    }

    const columns = [
        {
            field: 'procedureCode',
            headerName: '醫令代碼',
            flex: 2,
            renderCell: (params) => {
                const { procedureCode } = params.row
                return (
                    <Box className={`${classes.status} ${procedureCode === '19014C' && 'yet'}`}>
                        {PROCEDURECODE[procedureCode]}
                    </Box>
                )
            },
        },
        {
            field: 'patientID',
            headerName: '身分證字號',
            flex: 2,
        },

        // {
        //     field: 'workList',
        //     headerName: '超音波開單',
        //     renderCell: (params) => {
        //         return (
        //             <IconButton
        //                 onClick={() => {
        //                     apiAddWorklist(params.row.patientID)
        //                         .then((res) =>
        //                             dispatch(
        //                                 openAlert({
        //                                     toastTitle: '開單成功',
        //                                     text: `新增workList ${res.data.name}`,
        //                                     icon: 'success',
        //                                 })
        //                             )
        //                         )
        //                         .catch((err) =>
        //                             dispatch(
        //                                 openAlert({
        //                                     toastTitle: '開單失敗',
        //                                     text: err.response.data.message,
        //                                     icon: 'error',
        //                                 })
        //                             )
        //                         )
        //                     setSelectTrigger(true)
        //                 }}
        //             >
        //                 <PhotoCameraIcon />
        //             </IconButton>
        //         )
        //     },
        // },
        {
            field: 'name',
            headerName: '姓名',
            flex: 1,
            renderCell: (params) => {
                const { name } = params.row.patient
                return <Box>{name}</Box>
            },
        },
        {
            field: 'gender',
            headerName: '性別',
            flex: 1,
            renderCell: (params) => {
                return <Box>{params.row.patient.gender === 'm' ? '男' : '女'}</Box>
            },
        },
        {
            field: 'birth',
            headerName: '生日',
            flex: 1,
            renderCell: (params) => {
                return <Box>{new Date(params.row.patient.birth).toLocaleDateString()}</Box>
            },
        },
        {
            field: 'phone',
            headerName: '電話',
            flex: 1,
            renderCell: (params) => {
                const { phone } = params.row.patient
                return <Box>{phone}</Box>
            },
        },
        {
            field: 'processing',
            headerName: '操作',
            renderCell: (params) => {
                return (
                    <Button
                        startIcon={<ClearOutlined />}
                        sx={{ color: 'red.primary' }}
                        onClick={() => {
                            const { id, name, gender } = params.row.patient
                            setSelectTrigger(true)
                            const mr = gender === 'm' ? '先生' : '小姐'
                            dispatch(
                                openAlert({
                                    alertTitle: `確定要取消 ${name} ${mr}的排程?`,
                                    toastTitle: '取消排程',
                                    text: `${name} ${mr}`,
                                    type: 'confirm',
                                    event: () => dispatch(removeSchedule(id)),
                                })
                            )
                        }}
                    >
                        取消排程
                    </Button>
                )
            },
        },
    ]

    const FinishSection = () => {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <Lottie style={{ width: '60vw', height: '50vh' }} animationData={success} loop={true} />

                <Box sx={{ fontSize: '3rem' }}>報告已成功儲存</Box>
                <Box sx={{ fontSize: '2rem' }}>檢查者:{patient.name}</Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Button
                        variant="contained"
                        sx={{
                            background: theme.palette.contrast.main,
                            '&:hover': {
                                backgroundColor: theme.palette.contrast.dark,
                            },
                        }}
                        className={classes.button}
                        onClick={() => dispatch(fetchReportByReportID(patient.reportID))}
                    >
                        預覽
                    </Button>

                    <Button variant="contained" className={classes.button} onClick={() => setCurrentStep(0)}>
                        返回
                    </Button>
                </Box>
            </Box>
        )
    }

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Box className={classes.container}>
                <Box className={classes.tableContainer}>
                    {currentStep === 0 && (
                        <CustomDataGrid
                            data={schedules}
                            columns={columns}
                            selection={selection}
                            setSelection={setSelection}
                        />
                    )}
                    {currentStep === 1 && (
                        <Box sx={{ height: '100%' }}>
                            <CustomReportForm cols1={REPORTCOLS} cols2={REPORTCOLS2} patient={patient} mode="create" />
                            <Box sx={{ width: '100%', height: '8%', display: 'flex', justifyContent: 'end' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<Check />}
                                    sx={{ borderRadius: '2rem', height: '2.5rem', marginRight: '1rem' }}
                                    onClick={() => setCurrentStep(2)}
                                >
                                    完成報告
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<Close />}
                                    sx={{ borderRadius: '2rem', height: '2.5rem' }}
                                    onClick={() => setCurrentStep(0)}
                                >
                                    取消
                                </Button>
                            </Box>
                        </Box>
                    )}
                    {currentStep === 2 && <FinishSection />}
                </Box>
            </Box>
            <ReportDialog mode={reportDialogMode} />
        </Box>
    )
}

export default CreateReport
