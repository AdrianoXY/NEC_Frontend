import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    container: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
        borderRadius: '1rem',
        // boxShadow: '6px 6px 10px rgba(0,0,0,0.2)',
        // border: `.5px solid ${theme.palette.border.main}`,
        padding: '.5rem',

        // height: '100%',
    },
    status: {
        backgroundColor: theme.palette.status.processing,
        border: `1px solid ${theme.palette.status.processing_dark}`,
        color: theme.palette.status.processing_dark,
        padding: '8px',
        marginRight: '.6rem',
        borderRadius: '1rem',
        '&.processing': {
            backgroundColor: theme.palette.status.yet,
            border: `1px solid ${theme.palette.status.yet_dark}`,
            color: theme.palette.status.yet_dark,
        },
    },
    statusBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        whiteSpace: 'nowrap',
    },
}))

export default useStyles
